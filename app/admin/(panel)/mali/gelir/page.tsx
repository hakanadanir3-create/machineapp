"use client";
import React, { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils";
import { Plus, Pencil, Trash2, X, Wallet, Filter } from "lucide-react";

interface Member {
  id: string;
  full_name: string | null;
}

interface Income {
  id: string;
  source: "manuel" | "order_sync" | "membership_sync";
  income_type: "uyelik" | "ozel_ders" | "supplement" | "etkinlik" | "misafir" | "diger";
  member_id: string | null;
  member_name_snapshot: string | null;
  title: string;
  amount: number;
  payment_method: "nakit" | "kredi_karti" | "havale";
  income_date: string;
  notes: string | null;
  created_at: string;
}

type FormState = {
  income_type: Income["income_type"];
  member_id: string | null;
  title: string;
  amount: number;
  payment_method: Income["payment_method"];
  income_date: string;
  notes: string;
};

const emptyForm: FormState = {
  income_type: "uyelik",
  member_id: null,
  title: "",
  amount: 0,
  payment_method: "nakit",
  income_date: new Date().toISOString().slice(0, 10),
  notes: "",
};

const typeLabels: Record<Income["income_type"], string> = {
  uyelik: "Üyelik",
  ozel_ders: "Özel Ders",
  supplement: "Supplement/Ürün",
  etkinlik: "Etkinlik",
  misafir: "Misafir Giriş",
  diger: "Diğer",
};

const paymentLabels: Record<string, string> = {
  nakit: "Nakit",
  kredi_karti: "Kredi Kartı",
  havale: "Havale/EFT",
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

const cardStyle: React.CSSProperties = {
  background: "#141414",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: 16,
  padding: "20px 22px",
};

export default function GelirPage() {
  const [income, setIncome] = useState<Income[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableError, setTableError] = useState(false);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Income | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [monthFilter, setMonthFilter] = useState<string>(new Date().toISOString().slice(0, 7));

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    const supabase = createClient();
    const [{ data: inc, error: incErr }, { data: mem }] = await Promise.all([
      supabase
        .from("finance_income")
        .select(
          "id,source,income_type,member_id,member_name_snapshot,title,amount,payment_method,income_date,notes,created_at"
        )
        .order("income_date", { ascending: false }),
      supabase.from("members").select("id, full_name").order("full_name"),
    ]);
    if (incErr?.code === "42P01") {
      setTableError(true);
      setLoading(false);
      return;
    }
    setIncome(inc ?? []);
    setMembers((mem as Member[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAdd = () => {
    setForm(emptyForm);
    setEditing(null);
    setModal("add");
  };

  const openEdit = (i: Income) => {
    setEditing(i);
    setForm({
      income_type: i.income_type,
      member_id: i.member_id,
      title: i.title,
      amount: i.amount,
      payment_method: i.payment_method,
      income_date: i.income_date,
      notes: i.notes ?? "",
    });
    setModal("edit");
  };

  const closeModal = () => {
    setModal(null);
    setEditing(null);
  };

  const setF = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async () => {
    if (!form.title.trim() || form.amount <= 0) return;
    setSaving(true);
    const supabase = createClient();
    const memberName = form.member_id ? members.find((m) => m.id === form.member_id)?.full_name ?? null : null;
    const payload = {
      source: "manuel" as const,
      income_type: form.income_type,
      member_id: form.member_id,
      member_name_snapshot: memberName,
      title: form.title.trim(),
      amount: Number(form.amount),
      payment_method: form.payment_method,
      income_date: form.income_date,
      notes: form.notes?.trim() || null,
    };

    if (modal === "add") {
      await supabase.from("finance_income").insert(payload);
    } else if (modal === "edit" && editing) {
      await supabase.from("finance_income").update(payload).eq("id", editing.id);
    }

    setSaving(false);
    closeModal();
    showToast(modal === "add" ? "Gelir eklendi" : "Gelir güncellendi");
    fetchData();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const supabase = createClient();
    await supabase.from("finance_income").delete().eq("id", deleteId);
    setDeleteId(null);
    showToast("Gelir kaydı silindi");
    fetchData();
  };

  const filtered = useMemo(() => {
    return income.filter((i) => {
      const matchesType = typeFilter === "all" || i.income_type === typeFilter;
      const matchesMonth = !monthFilter || i.income_date.slice(0, 7) === monthFilter;
      return matchesType && matchesMonth;
    });
  }, [income, typeFilter, monthFilter]);

  const totalFiltered = filtered.reduce((s, i) => s + Number(i.amount), 0);

  if (tableError) {
    return (
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <h1 style={{ color: "#fff", fontWeight: 800, fontSize: 26, letterSpacing: "-0.02em", marginBottom: 8 }}>
          Gelir Takibi
        </h1>
        <div style={{ background: "#141414", border: "1px solid rgba(248,113,113,0.25)", borderRadius: 16, padding: 28 }}>
          <p style={{ color: "#f87171", fontWeight: 700, fontSize: 15, marginBottom: 12 }}>
            finance_income tablosu bulunamadı
          </p>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, lineHeight: 1.7, marginBottom: 18 }}>
            Supabase SQL Editor&apos;de <code>supabase/migrations/finance_module.sql</code> dosyasını çalıştırın.
          </p>
          <button
            onClick={fetchData}
            style={{ padding: "8px 18px", background: "#7A0D2A", color: "#fff", border: "none", borderRadius: 9, cursor: "pointer", fontWeight: 600, fontSize: 13 }}
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200 }}>
      {toast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, background: "#141414", border: "1px solid rgba(74,222,128,0.3)", color: "#4ade80", padding: "10px 18px", borderRadius: 10, fontSize: 13, zIndex: 999 }}>
          {toast}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ color: "#fff", fontWeight: 800, fontSize: 26, letterSpacing: "-0.02em", margin: 0, marginBottom: 4 }}>
            Gelir Takibi
          </h1>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, margin: 0 }}>
            Üyelik, özel ders, supplement ve diğer gelir kayıtları
          </p>
        </div>
        <button
          onClick={openAdd}
          style={{ background: "#7A0D2A", border: "1px solid rgba(212,175,55,0.3)", color: "#fff", padding: "9px 18px", borderRadius: 9, cursor: "pointer", fontWeight: 600, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}
        >
          <Plus size={15} /> Gelir Ekle
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 14, marginBottom: 18, alignItems: "center" }}>
        <div style={cardStyle}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 4 }}>Filtrelenen Toplam Gelir</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#4ade80" }}>{formatCurrency(totalFiltered)}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Filter size={14} color="rgba(255,255,255,0.3)" />
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={{ ...inputStyle, width: 180 }}>
            <option value="all">Tüm Türler</option>
            {Object.entries(typeLabels).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
        <input type="month" value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} style={{ ...inputStyle, width: 160 }} />
      </div>

      <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "rgba(0,0,0,0.3)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              {["Tarih", "Başlık", "Tür", "Üye", "Tutar", "Ödeme", "Kaynak", "İşlem"].map((h) => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, color: "rgba(255,255,255,0.3)", fontWeight: 600, letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{ padding: 28, textAlign: "center", color: "rgba(255,255,255,0.25)", fontSize: 13 }}>Yükleniyor...</td></tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={8}>
                  <div style={{ padding: "3rem", textAlign: "center" }}>
                    <Wallet style={{ width: 40, height: 40, color: "rgba(255,255,255,0.1)", margin: "0 auto 12px" }} />
                    <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 14, marginBottom: 4 }}>Kayıt bulunamadı</p>
                    <p style={{ color: "rgba(255,255,255,0.18)", fontSize: 12 }}>Seçili filtrelerde gelir kaydı yok.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((i) => (
                <tr key={i.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ padding: "11px 14px", fontSize: 12.5, color: "rgba(255,255,255,0.5)" }}>
                    {new Date(i.income_date).toLocaleDateString("tr-TR", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td style={{ padding: "11px 14px", fontSize: 13, fontWeight: 600, color: "#fff" }}>{i.title}</td>
                  <td style={{ padding: "11px 14px", fontSize: 12.5, color: "#D4AF37" }}>{typeLabels[i.income_type]}</td>
                  <td style={{ padding: "11px 14px", fontSize: 12.5, color: "rgba(255,255,255,0.5)" }}>{i.member_name_snapshot || "—"}</td>
                  <td style={{ padding: "11px 14px", fontSize: 13, fontWeight: 700, color: "#4ade80" }}>{formatCurrency(Number(i.amount))}</td>
                  <td style={{ padding: "11px 14px", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{paymentLabels[i.payment_method]}</td>
                  <td style={{ padding: "11px 14px" }}>
                    {i.source === "manuel" ? (
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Manuel</span>
                    ) : (
                      <span style={{ background: "rgba(96,165,250,0.15)", color: "#60a5fa", padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600 }}>Otomatik</span>
                    )}
                  </td>
                  <td style={{ padding: "11px 14px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => openEdit(i)} style={{ background: "rgba(255,255,255,0.06)", border: "none", color: "rgba(255,255,255,0.5)", borderRadius: 6, padding: "5px 7px", cursor: "pointer" }}><Pencil size={13} /></button>
                      <button onClick={() => setDeleteId(i.id)} style={{ background: "rgba(248,113,113,0.1)", border: "none", color: "#f87171", borderRadius: 6, padding: "5px 7px", cursor: "pointer" }}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 200, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "24px 16px", overflowY: "auto" }}>
          <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, maxWidth: 560, width: "100%", marginTop: 24, padding: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
              <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 700, margin: 0 }}>
                {modal === "add" ? "Gelir Ekle" : "Gelir Düzenle"}
              </h2>
              <button onClick={closeModal} style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer" }}><X size={18} /></button>
            </div>

            <div style={{ display: "grid", gap: 14 }}>
              <div>
                <label style={labelStyle}>Başlık *</label>
                <input type="text" value={form.title} onChange={(e) => setF("title", e.target.value)} style={inputStyle} placeholder="Ocak Ayı Üyelik" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Gelir Türü *</label>
                  <select value={form.income_type} onChange={(e) => setF("income_type", e.target.value as Income["income_type"])} style={inputStyle}>
                    {Object.entries(typeLabels).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Tutar (₺) *</label>
                  <input type="number" value={form.amount} onChange={(e) => setF("amount", Number(e.target.value))} style={inputStyle} min="0" step="0.01" />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Üye (opsiyonel)</label>
                <select value={form.member_id ?? ""} onChange={(e) => setF("member_id", e.target.value || null)} style={inputStyle}>
                  <option value="">Üye seçilmedi</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>{m.full_name || "İsimsiz"}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Tarih *</label>
                  <input type="date" value={form.income_date} onChange={(e) => setF("income_date", e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Ödeme Yöntemi</label>
                  <select value={form.payment_method} onChange={(e) => setF("payment_method", e.target.value as Income["payment_method"])} style={inputStyle}>
                    <option value="nakit">Nakit</option>
                    <option value="kredi_karti">Kredi Kartı</option>
                    <option value="havale">Havale/EFT</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Not</label>
                <textarea value={form.notes} onChange={(e) => setF("notes", e.target.value)} style={{ ...inputStyle, minHeight: 60, resize: "vertical", fontFamily: "inherit" }} />
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 22 }}>
              <button onClick={closeModal} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", padding: "8px 16px", borderRadius: 9, cursor: "pointer", fontSize: 13 }}>İptal</button>
              <button
                onClick={handleSave}
                disabled={saving || !form.title.trim() || form.amount <= 0}
                style={{ background: "#7A0D2A", border: "1px solid rgba(212,175,55,0.3)", color: "#fff", padding: "8px 16px", borderRadius: 9, cursor: saving ? "not-allowed" : "pointer", fontWeight: 600, fontSize: 13, opacity: (!form.title.trim() || form.amount <= 0) ? 0.5 : 1 }}
              >
                {saving ? "Kaydediliyor..." : modal === "add" ? "Ekle" : "Güncelle"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, maxWidth: 360, width: "100%", padding: 28, textAlign: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Trash2 size={20} color="#f87171" />
            </div>
            <h3 style={{ color: "#fff", fontSize: 17, fontWeight: 700, margin: "0 0 8px" }}>Gelir Kaydını Sil</h3>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: "0 0 24px" }}>Bu gelir kaydını silmek istediğinize emin misiniz?</p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button onClick={() => setDeleteId(null)} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", padding: "8px 20px", borderRadius: 9, cursor: "pointer", fontSize: 13 }}>İptal</button>
              <button onClick={handleDelete} style={{ background: "rgba(220,38,38,0.8)", border: "none", color: "#fff", padding: "8px 20px", borderRadius: 9, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Sil</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
