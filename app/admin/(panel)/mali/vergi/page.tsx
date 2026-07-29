"use client";
import React, { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils";
import { Calculator, Info, AlertCircle } from "lucide-react";

interface TaxSettings {
  id: string;
  vat_rate: number;
  tax_regime: "basit_usul" | "gercek_usul";
  sgk_employer_rate: number;
  sgk_employee_rate: number;
}

const cardStyle: React.CSSProperties = {
  background: "#141414",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: 16,
  padding: "20px 22px",
};

const inputStyle: React.CSSProperties = {
  background: "#0F0F0F",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 9,
  color: "#fff",
  padding: "9px 12px",
  fontSize: 13.5,
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12.5,
  fontWeight: 500,
  color: "rgba(255,255,255,0.5)",
  marginBottom: 6,
};

// Basit 2026 gelir vergisi dilimleri (yaklaşık, gerçek usul yıllık matrah için)
const INCOME_TAX_BRACKETS = [
  { upTo: 158000, rate: 0.15 },
  { upTo: 330000, rate: 0.20 },
  { upTo: 800000, rate: 0.27 },
  { upTo: 4300000, rate: 0.35 },
  { upTo: Infinity, rate: 0.40 },
];

function calcIncomeTax(matrah: number): number {
  let remaining = matrah;
  let tax = 0;
  let lower = 0;
  for (const bracket of INCOME_TAX_BRACKETS) {
    if (remaining <= 0) break;
    const bracketSize = bracket.upTo - lower;
    const taxableInBracket = Math.min(remaining, bracketSize);
    tax += taxableInBracket * bracket.rate;
    remaining -= taxableInBracket;
    lower = bracket.upTo;
  }
  return tax;
}

export default function VergiPage() {
  const [settings, setSettings] = useState<TaxSettings | null>(null);
  const [monthIncome, setMonthIncome] = useState(0);
  const [monthExpense, setMonthExpense] = useState(0);
  const [grossSalaries, setGrossSalaries] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tableError, setTableError] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    const supabase = createClient();
    const now = new Date();
    const monthStr = now.toISOString().slice(0, 7);
    const [{ data: ts, error: tsErr }, { data: inc }, { data: exp }] = await Promise.all([
      supabase.from("finance_tax_settings").select("id,vat_rate,tax_regime,sgk_employer_rate,sgk_employee_rate").limit(1).maybeSingle(),
      supabase.from("finance_income").select("amount, income_date"),
      supabase.from("finance_expenses").select("amount, expense_date, category_name"),
    ]);
    if (tsErr?.code === "42P01") {
      setTableError(true);
      setLoading(false);
      return;
    }
    setSettings(ts ?? null);
    const incThisMonth = (inc ?? []).filter((i: { income_date: string }) => i.income_date.slice(0, 7) === monthStr)
      .reduce((s: number, i: { amount: number }) => s + Number(i.amount), 0);
    const expThisMonth = (exp ?? []).filter((e: { expense_date: string }) => e.expense_date.slice(0, 7) === monthStr)
      .reduce((s: number, e: { amount: number }) => s + Number(e.amount), 0);
    const salaryThisMonth = (exp ?? [])
      .filter((e: { expense_date: string; category_name: string }) => e.expense_date.slice(0, 7) === monthStr && e.category_name === "Personel Maaşı")
      .reduce((s: number, e: { amount: number }) => s + Number(e.amount), 0);
    setMonthIncome(incThisMonth);
    setMonthExpense(expThisMonth);
    setGrossSalaries(salaryThisMonth);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveSettings = async () => {
    if (!settings) return;
    setSaving(true);
    const supabase = createClient();
    await supabase
      .from("finance_tax_settings")
      .update({
        vat_rate: settings.vat_rate,
        tax_regime: settings.tax_regime,
        sgk_employer_rate: settings.sgk_employer_rate,
        sgk_employee_rate: settings.sgk_employee_rate,
        updated_at: new Date().toISOString(),
      })
      .eq("id", settings.id);
    setSaving(false);
  };

  const vatRate = settings?.vat_rate ?? 10;
  const vatOnIncome = useMemo(() => (monthIncome * vatRate) / (100 + vatRate), [monthIncome, vatRate]);
  const netProfit = monthIncome - monthExpense;
  const yearlyProfitEstimate = netProfit * 12;
  const estimatedIncomeTaxYearly = calcIncomeTax(Math.max(yearlyProfitEstimate, 0));
  const estimatedIncomeTaxMonthly = estimatedIncomeTaxYearly / 12;
  const sgkEmployer = (grossSalaries * (settings?.sgk_employer_rate ?? 22.5)) / 100;
  const sgkEmployee = (grossSalaries * (settings?.sgk_employee_rate ?? 14)) / 100;

  const today = new Date();
  const currentQuarter = Math.floor(today.getMonth() / 3) + 1;
  const taxCalendar = [
    { label: "KDV Beyannamesi", freq: "Aylık", due: "Her ayın 26'sı", desc: "Bir önceki aya ait KDV" },
    { label: "Muhtasar ve Prim Hizmet Beyannamesi (SGK+Stopaj)", freq: "Aylık", due: "Her ayın 26'sı", desc: "Personel SGK primi ve gelir vergisi stopajı" },
    { label: "Geçici Vergi Beyannamesi", freq: "Çeyreklik", due: `${currentQuarter}. çeyrek — takip eden ayın 17'si`, desc: "Gerçek usulde 3 aylık kâr üzerinden peşin vergi" },
    { label: "Yıllık Gelir Vergisi Beyannamesi", freq: "Yıllık", due: "Mart ayı sonu", desc: "Bir önceki yılın toplam kazancı" },
  ];

  if (tableError) {
    return (
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <h1 style={{ color: "#fff", fontWeight: 800, fontSize: 26, letterSpacing: "-0.02em", marginBottom: 8 }}>
          Vergi Hesaplama
        </h1>
        <div style={{ background: "#141414", border: "1px solid rgba(248,113,113,0.25)", borderRadius: 16, padding: 28 }}>
          <p style={{ color: "#f87171", fontWeight: 700, fontSize: 15, marginBottom: 12 }}>
            finance_tax_settings tablosu bulunamadı
          </p>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, lineHeight: 1.7, marginBottom: 18 }}>
            Supabase SQL Editor&apos;de <code>supabase/migrations/finance_module.sql</code> dosyasını çalıştırın.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ color: "#fff", fontWeight: 800, fontSize: 26, letterSpacing: "-0.02em", margin: "0 0 4px" }}>
          Vergi Hesaplama
        </h1>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, margin: 0 }}>
          KDV, gelir vergisi ve SGK tahmini — cari ay verilerine göre
        </p>
      </div>

      <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 12, padding: "12px 16px", display: "flex", gap: 10, marginBottom: 20 }}>
        <AlertCircle size={16} color="#f59e0b" style={{ flexShrink: 0, marginTop: 1 }} />
        <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.6 }}>
          Bu hesaplamalar tahminidir, resmi beyanname için muhasebecinize danışın. Gelir vergisi dilimleri yaklaşık güncel değerlerdir.
        </p>
      </div>

      {loading ? (
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>Yükleniyor...</p>
      ) : (
        <>
          {/* KDV */}
          <div style={{ ...cardStyle, marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 14 }}>KDV Hesaplama (Bu Ay)</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
              <div style={{ background: "#1A1A1A", borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Aylık Gelir (KDV Dahil)</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginTop: 4 }}>{formatCurrency(monthIncome)}</div>
              </div>
              <div style={{ background: "#1A1A1A", borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>KDV Oranı</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#D4AF37", marginTop: 4 }}>%{vatRate}</div>
              </div>
              <div style={{ background: "#1A1A1A", borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Hesaplanan KDV</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#f87171", marginTop: 4 }}>{formatCurrency(vatOnIncome)}</div>
              </div>
            </div>
          </div>

          {/* Gelir Vergisi */}
          <div style={{ ...cardStyle, marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 14 }}>Gelir Vergisi Tahmini ({settings?.tax_regime === "basit_usul" ? "Basit Usul" : "Gerçek Usul"})</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14, marginBottom: 14 }}>
              <div style={{ background: "#1A1A1A", borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Bu Ay Net Kâr</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: netProfit >= 0 ? "#4ade80" : "#f87171", marginTop: 4 }}>{formatCurrency(netProfit)}</div>
              </div>
              <div style={{ background: "#1A1A1A", borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Yıllık Matrah Tahmini (×12)</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginTop: 4 }}>{formatCurrency(Math.max(yearlyProfitEstimate, 0))}</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
              <div style={{ background: "#1A1A1A", borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Tahmini Yıllık Gelir Vergisi</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#f87171", marginTop: 4 }}>{formatCurrency(estimatedIncomeTaxYearly)}</div>
              </div>
              <div style={{ background: "#1A1A1A", borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Aylığa Bölünmüş (÷12)</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#f59e0b", marginTop: 4 }}>{formatCurrency(estimatedIncomeTaxMonthly)}</div>
              </div>
            </div>
          </div>

          {/* SGK */}
          <div style={{ ...cardStyle, marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 4 }}>SGK Prim Hesaplama</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginBottom: 14 }}>
              &quot;Personel Maaşı&quot; kategorisindeki gider kayıtları brüt maaş kabul edilir
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
              <div style={{ background: "#1A1A1A", borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Bu Ay Brüt Maaş Toplamı</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginTop: 4 }}>{formatCurrency(grossSalaries)}</div>
              </div>
              <div style={{ background: "#1A1A1A", borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>İşveren Payı (%{settings?.sgk_employer_rate ?? 22.5})</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#f87171", marginTop: 4 }}>{formatCurrency(sgkEmployer)}</div>
              </div>
              <div style={{ background: "#1A1A1A", borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Çalışan Payı (%{settings?.sgk_employee_rate ?? 14})</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#60a5fa", marginTop: 4 }}>{formatCurrency(sgkEmployee)}</div>
              </div>
            </div>
          </div>

          {/* Vergi Takvimi */}
          <div style={{ ...cardStyle, marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 14 }}>Vergi Takvimi & Hatırlatmalar</div>
            <div style={{ display: "grid", gap: 10 }}>
              {taxCalendar.map((t) => (
                <div key={t.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#1A1A1A", borderRadius: 10, padding: "12px 16px" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{t.label}</div>
                    <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{t.desc}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: "#D4AF37", fontWeight: 600 }}>{t.freq}</div>
                    <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>{t.due}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ayarlar */}
          <div style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <Calculator size={16} color="#D4AF37" />
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Vergi Ayarları</div>
            </div>
            {settings && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>KDV Oranı (%)</label>
                  <input type="number" value={settings.vat_rate} onChange={(e) => setSettings({ ...settings, vat_rate: Number(e.target.value) })} style={inputStyle} min="0" max="100" />
                </div>
                <div>
                  <label style={labelStyle}>Vergi Rejimi</label>
                  <select value={settings.tax_regime} onChange={(e) => setSettings({ ...settings, tax_regime: e.target.value as TaxSettings["tax_regime"] })} style={inputStyle}>
                    <option value="gercek_usul">Gerçek Usul</option>
                    <option value="basit_usul">Basit Usul</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>SGK İşveren Oranı (%)</label>
                  <input type="number" value={settings.sgk_employer_rate} onChange={(e) => setSettings({ ...settings, sgk_employer_rate: Number(e.target.value) })} style={inputStyle} min="0" max="100" step="0.1" />
                </div>
                <div>
                  <label style={labelStyle}>SGK Çalışan Oranı (%)</label>
                  <input type="number" value={settings.sgk_employee_rate} onChange={(e) => setSettings({ ...settings, sgk_employee_rate: Number(e.target.value) })} style={inputStyle} min="0" max="100" step="0.1" />
                </div>
              </div>
            )}
            <button
              onClick={handleSaveSettings}
              disabled={saving}
              style={{ background: "#7A0D2A", border: "1px solid rgba(212,175,55,0.3)", color: "#fff", padding: "9px 18px", borderRadius: 9, cursor: saving ? "not-allowed" : "pointer", fontWeight: 600, fontSize: 13 }}
            >
              {saving ? "Kaydediliyor..." : "Ayarları Kaydet"}
            </button>
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              <Info size={14} color="rgba(255,255,255,0.25)" style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.3)", margin: 0, lineHeight: 1.6 }}>
                Spor salonu hizmetleri için güncel KDV oranı %10&apos;dur (Kararname ile değişebilir). Değişiklik olursa buradan güncelleyin.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
