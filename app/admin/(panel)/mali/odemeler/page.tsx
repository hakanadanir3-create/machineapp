"use client";
import React, { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils";
import { Plus, Pencil, Trash2, X, CreditCard, CheckCircle, Clock, AlertTriangle, Filter } from "lucide-react";

interface Member {
  id: string;
  full_name: string | null;
}

interface MemberPayment {
  id: string;
  member_id: string;
  member_name_snapshot: string | null;
  package_name: string;
  package_period: "aylik" | "3_aylik" | "6_aylik" | "yillik" | null;
  total_amount: number;
  paid_amount: number;
  installment_count: number;
  due_date: string;
  status: "odendi" | "kismi_odendi" | "bekliyor" | "gecikti";
  payment_method: string | null;
  notes: string | null;
  created_at: string;
}

type FormState = {
  member_id: string;
  package_name: string;
  package_period: MemberPayment["package_period"];
  total_amount: number;
  paid_amount: number;
  installment_count: number;
  due_date: string;
  status: MemberPayment["status"];
  payment_method: string;
  notes: string;
};

const emptyForm: FormState = {
  member_id: "",
  package_name: "",
  package_period: "aylik",
  total_amount: 0,
  paid_amount: 0,
  installment_count: 1,
  due_date: new Date().toISOString().slice(0, 10),
  status: "bekliyor",
  payment_method: "nakit",
  notes: "",
};

const periodLabels: Record<string, string> = {
  aylik: "Aylık",
  "3_aylik": "3 Aylık",
  "6_aylik": "6 Aylık",
  yillik: "Yıllık",
};

const statusConf: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  odendi: { label: "Ödendi", color: "#4ade80", bg: "rgba(74,222,128,0.15)", icon: <CheckCircle size={11} /> },
  kismi_odendi: { label: "Kısmi Ödendi", color: "#60a5fa", bg: "rgba(96,165,250,0.15)", icon: <Clock size={11} /> },
  bekliyor: { label: "Bekliyor", color: "#f59e0b", bg: "rgba(245,158,11,0.15)", icon: <Clock size={11} /> },
  gecikti: { label: "Gecikti", color: "#f87171", bg: "rgba(248,113,113,0.15)", icon: <AlertTriangle size={11} /> },
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

export default function OdemelerPage() {
  const [payments, setPayments] = useState<MemberPayment[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableError, setTableError] = useState(false);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<MemberPayment | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    const supabase = createClient();
    // gecikmiş ödemeleri işaretle
    await supabase.rpc("mark_overdue_payments").then(() => {});
    const [{ data: pays, error: payErr }, { data: mem }] = await Promise.all([
      supabase
        .from("member_payments")
        .select(
          "id,member_id,member_name_snapshot,package_name,package_period,total_amount,paid_amount,installment_count,due_date,status,payment_method,notes,created_at"
        )
        .order("due_date", { ascending: true }),
      supabase.from("members").select("id, full_name").order("full_name"),
    ]);
    if (payErr?.code === "42P01") {
      setTableError(true);
      setLoading(false);
      return;
    }
    setPayments(pays ?? []);
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

  const openEdit = (p: MemberPayment) => {
    setEditing(p);
    setForm({
      member_id: p.member_id,
      package_name: p.package_name,
      package_period: p.package_period,
      total_amount: p.total_amount,
      paid_amount: p.paid_amount,
      installment_count: p.installment_count,
      due_date: p.due_date,
      status: p.status,
      payment_method: p.payment_method ?? "nakit",
      notes: p.notes ?? "",
    });
    setModal("edit");
  };

  const closeModal = () => {
    setModal(null);
    setEditing(null);
  };

  const setF = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  // Ödenen tutara göre durum otomatik öner
  const suggestStatus = (paid: number, total: number, due: string): MemberPayment["status"] => {
    if (paid >= total && total > 0) return "odendi";
    if (paid > 0) return "kismi_odendi";
    if (new Date(due) < new Date(new Date().toISOString().slice(0, 10))) return "gecikti";
    return "bekliyor";
  };

  const handleSave = async () => {
    if (!form.member_id || !form.package_name.trim() || form.total_amount <= 0) return;
    setSaving(true);
    const supabase = createClient();
    const memberName = members.find((m) => m.id === form.member_id)?.full_name ?? null;
    const payload = {
      member_id: form.member_id,
      member_name_snapshot: memberName,
      package_name: form.package_name.trim(),
      package_period: form.package_period,
      total_amount: Number(form.total_amount),
      paid_amount: Number(form.paid_amount),
      installment_count: Number(form.installment_count) || 1,
      due_date: form.due_date,
      status: suggestStatus(Number(form.paid_amount), Number(form.total_amount), form.due_date),
      payment_method: form.payment_method,
      notes: form.notes?.trim() || null,
    };

    if (modal === "add") {
      await supabase.from("member_payments").insert(payload);
    } else if (modal === "edit" && editing) {
      await supabase.from("member_payments").update(payload).eq("id", editing.id);
    }

    setSaving(false);
    closeModal();
    showToast(modal === "add" ? "Ödeme kaydı eklendi" : "Ödeme kaydı güncellendi");
    fetchData();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const supabase = createClient();
    await supabase.from("member_payments").delete().eq("id", deleteId);
    setDeleteId(null);
    showToast("Ödeme kaydı silindi");
    fetchData();
  };

  const filtered = useMemo(() => {
    return payments.filter((p) => statusFilter === "all" || p.status === statusFilter);
  }, [payments, statusFilter]);

  const overdueCount = payments.filter((p) => p.status === "gecikti").length;
  const overdueTotal = payments
    .filter((p) => p.status === "gecikti")
    .reduce((s, p) => s + (Number(p.total_amount) - Number(p.paid_amount)), 0);
  const pendingCount = payments.filter((p) => p.status === "bekliyor").length;
  const paidThisMonthTotal = payments
    .filter((p) => p.status === "odendi" && p.due_date.slice(0, 7) === new Date().toISOString().slice(0, 7))
    .reduce((s, p) => s + Number(p.paid_amount), 0);

  if (tableError) {
    return (
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <h1 style={{ color: "#fff", fontWeight: 800, fontSize: 26, letterSpacing: "-0.02em", marginBottom: 8 }}>
          Üye Ödeme Takibi
        </h1>
        <div style={{ background: "#141414", border: "1px solid rgba(248,113,113,0.25)", borderRadius: 16, padding: 28 }}>
          <p style={{ color: "#f87171", fontWeight: 700, fontSize: 15, marginBottom: 12 }}>
            member_payments tablosu bulunamadı
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
            Üye Ödeme Takibi
          </h1>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, margin: 0 }}>
            Kim ödedi, kim borçlu — taksit ve vade takibi
          </p>
        </div>
        <button
          onClick={openAdd}
          style={{ background: "#7A0D2A", border: "1px solid rgba(212,175,55,0.3)", color: "#fff", padding: "9px 18px", borderRadius: 9, cursor: "pointer", fontWeight: 600, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}
        >
          <Plus size={15} /> Ödeme Planı Ekle
        </button>
      </div>

      {/* Özet kartları */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 18 }}>
        <div style={cardStyle}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 4 }}>Gecikmiş Ödemeler</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#f87171" }}>{overdueCount} üye</div>
          <div style={{ fontSize: 12, color: "rgba(248,113,113,0.7)", marginTop: 4 }}>{formatCurrency(overdueTotal)} alacak</div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 4 }}>Bekleyen Ödemeler</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#f59e0b" }}>{pendingCount} üye</div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 4 }}>Bu Ay Tahsil Edilen</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#4ade80" }}>{formatCurrency(paidThisMonthTotal)}</div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <Filter size={14} color="rgba(255,255,255,0.3)" />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ ...inputStyle, width: 200 }}>
          <option value="all">Tüm Durumlar</option>
          <option value="odendi">Ödendi</option>
          <option value="kismi_odendi">Kısmi Ödendi</option>
          <option value="bekliyor">Bekliyor</option>
          <option value="gecikti">Gecikti</option>
        </select>
      </div>

      <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "rgba(0,0,0,0.3)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              {["Üye", "Paket", "Toplam", "Ödenen", "Kalan", "Vade", "Durum", "İşlem"].map((h) => (
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
                    <CreditCard style={{ width: 40, height: 40, color: "rgba(255,255,255,0.1)", margin: "0 auto 12px" }} />
                    <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 14, marginBottom: 4 }}>Kayıt bulunamadı</p>
                    <p style={{ color: "rgba(255,255,255,0.18)", fontSize: 12 }}>Seçili filtrede ödeme planı yok.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((p) => {
                const remaining = Number(p.total_amount) - Number(p.paid_amount);
                const conf = statusConf[p.status];
                return (
                  <tr key={p.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "11px 14px", fontSize: 13, fontWeight: 600, color: "#fff" }}>{p.member_name_snapshot || "İsimsiz"}</td>
                    <td style={{ padding: "11px 14px", fontSize: 12.5, color: "#D4AF37" }}>
                      {p.package_name}
                      {p.package_period && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{periodLabels[p.package_period]}</div>}
                    </td>
                    <td style={{ padding: "11px 14px", fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{formatCurrency(Number(p.total_amount))}</td>
                    <td style={{ padding: "11px 14px", fontSize: 13, color: "#4ade80" }}>{formatCurrency(Number(p.paid_amount))}</td>
                    <td style={{ padding: "11px 14px", fontSize: 13, fontWeight: 700, color: remaining > 0 ? "#f87171" : "rgba(255,255,255,0.3)" }}>{formatCurrency(remaining)}</td>
                    <td style={{ padding: "11px 14px", fontSize: 12, color: "rgba(255,255,255,0.45)" }}>
                      {new Date(p.due_date).toLocaleDateString("tr-TR", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td style={{ padding: "11px 14px" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: conf.bg, color: conf.color, padding: "3px 9px", borderRadius: 6, fontSize: 11, fontWeight: 600 }}>
                        {conf.icon}{conf.label}
                      </span>
                    </td>
                    <td style={{ padding: "11px 14px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => openEdit(p)} style={{ background: "rgba(255,255,255,0.06)", border: "none", color: "rgba(255,255,255,0.5)", borderRadius: 6, padding: "5px 7px", cursor: "pointer" }}><Pencil size={13} /></button>
                        <button onClick={() => setDeleteId(p.id)} style={{ background: "rgba(248,113,113,0.1)", border: "none", color: "#f87171", borderRadius: 6, padding: "5px 7px", cursor: "pointer" }}><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 200, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "24px 16px", overflowY: "auto" }}>
          <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, maxWidth: 560, width: "100%", marginTop: 24, padding: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
              <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 700, margin: 0 }}>
                {modal === "add" ? "Ödeme Planı Ekle" : "Ödeme Planı Düzenle"}
              </h2>
              <button onClick={closeModal} style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer" }}><X size={18} /></button>
            </div>

            <div style={{ display: "grid", gap: 14 }}>
              <div>
                <label style={labelStyle}>Üye *</label>
                <select value={form.member_id} onChange={(e) => setF("member_id", e.target.value)} style={inputStyle}>
                  <option value="">Üye seçin</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>{m.full_name || "İsimsiz"}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Paket Adı *</label>
                  <input type="text" value={form.package_name} onChange={(e) => setF("package_name", e.target.value)} style={inputStyle} placeholder="Aylık Üyelik" />
                </div>
                <div>
                  <label style={labelStyle}>Paket Periyodu</label>
                  <select value={form.package_period ?? "aylik"} onChange={(e) => setF("package_period", e.target.value as FormState["package_period"])} style={inputStyle}>
                    <option value="aylik">Aylık</option>
                    <option value="3_aylik">3 Aylık</option>
                    <option value="6_aylik">6 Aylık</option>
                    <option value="yillik">Yıllık</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Toplam Tutar (₺) *</label>
                  <input type="number" value={form.total_amount} onChange={(e) => setF("total_amount", Number(e.target.value))} style={inputStyle} min="0" step="0.01" />
                </div>
                <div>
                  <label style={labelStyle}>Ödenen Tutar (₺)</label>
                  <input type="number" value={form.paid_amount} onChange={(e) => setF("paid_amount", Number(e.target.value))} style={inputStyle} min="0" step="0.01" />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Taksit Sayısı</label>
                  <input type="number" value={form.installment_count} onChange={(e) => setF("installment_count", Number(e.target.value))} style={inputStyle} min="1" max="12" />
                </div>
                <div>
                  <label style={labelStyle}>Vade Tarihi *</label>
                  <input type="date" value={form.due_date} onChange={(e) => setF("due_date", e.target.value)} style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Ödeme Yöntemi</label>
                <select value={form.payment_method} onChange={(e) => setF("payment_method", e.target.value)} style={inputStyle}>
                  <option value="nakit">Nakit</option>
                  <option value="kredi_karti">Kredi Kartı</option>
                  <option value="havale">Havale/EFT</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Not</label>
                <textarea value={form.notes} onChange={(e) => setF("notes", e.target.value)} style={{ ...inputStyle, minHeight: 60, resize: "vertical", fontFamily: "inherit" }} />
              </div>
              <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.3)", margin: 0 }}>
                Durum (Ödendi/Kısmi/Bekliyor/Gecikti) ödenen tutar ve vade tarihine göre otomatik hesaplanır.
              </p>
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 22 }}>
              <button onClick={closeModal} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", padding: "8px 16px", borderRadius: 9, cursor: "pointer", fontSize: 13 }}>İptal</button>
              <button
                onClick={handleSave}
                disabled={saving || !form.member_id || !form.package_name.trim() || form.total_amount <= 0}
                style={{ background: "#7A0D2A", border: "1px solid rgba(212,175,55,0.3)", color: "#fff", padding: "8px 16px", borderRadius: 9, cursor: saving ? "not-allowed" : "pointer", fontWeight: 600, fontSize: 13, opacity: (!form.member_id || !form.package_name.trim() || form.total_amount <= 0) ? 0.5 : 1 }}
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
            <h3 style={{ color: "#fff", fontSize: 17, fontWeight: 700, margin: "0 0 8px" }}>Ödeme Planını Sil</h3>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: "0 0 24px" }}>Bu ödeme planını silmek istediğinize emin misiniz?</p>
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
