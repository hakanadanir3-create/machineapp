"use client";
import React, { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils";
import { Plus, Pencil, Trash2, X, Receipt, Repeat, Filter } from "lucide-react";

interface ExpenseCategory {
  id: string;
  name: string;
  order_index: number;
}

interface Expense {
  id: string;
  category_id: string | null;
  category_name: string;
  title: string;
  amount: number;
  vat_included: boolean;
  vat_rate: number;
  payment_method: "nakit" | "kredi_karti" | "havale";
  expense_date: string;
  is_recurring: boolean;
  recurring_period: string | null;
  notes: string | null;
  created_at: string;
}

type FormState = Omit<Expense, "id" | "created_at">;

const emptyForm: FormState = {
  category_id: null,
  category_name: "",
  title: "",
  amount: 0,
  vat_included: true,
  vat_rate: 20,
  payment_method: "havale",
  expense_date: new Date().toISOString().slice(0, 10),
  is_recurring: false,
  recurring_period: null,
  notes: "",
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

export default function GiderPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableError, setTableError] = useState(false);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [monthFilter, setMonthFilter] = useState<string>(new Date().toISOString().slice(0, 7));

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    const supabase = createClient();
    const [{ data: cats, error: catErr }, { data: exps, error: expErr }] = await Promise.all([
      supabase.from("finance_expense_categories").select("id,name,order_index").order("order_index"),
      supabase
        .from("finance_expenses")
        .select(
          "id,category_id,category_name,title,amount,vat_included,vat_rate,payment_method,expense_date,is_recurring,recurring_period,notes,created_at"
        )
        .order("expense_date", { ascending: false }),
    ]);
    if (catErr?.code === "42P01" || expErr?.code === "42P01") {
      setTableError(true);
      setLoading(false);
      return;
    }
    setCategories(cats ?? []);
    setExpenses(exps ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAdd = () => {
    setForm({ ...emptyForm, category_id: categories[0]?.id ?? null, category_name: categories[0]?.name ?? "" });
    setEditing(null);
    setModal("add");
  };

  const openEdit = (e: Expense) => {
    setEditing(e);
    setForm({
      category_id: e.category_id,
      category_name: e.category_name,
      title: e.title,
      amount: e.amount,
      vat_included: e.vat_included,
      vat_rate: e.vat_rate,
      payment_method: e.payment_method,
      expense_date: e.expense_date,
      is_recurring: e.is_recurring,
      recurring_period: e.recurring_period,
      notes: e.notes ?? "",
    });
    setModal("edit");
  };

  const closeModal = () => {
    setModal(null);
    setEditing(null);
  };

  const setF = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleCategoryChange = (id: string) => {
    const cat = categories.find((c) => c.id === id);
    setF("category_id", id);
    setF("category_name", cat?.name ?? "");
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.category_name || form.amount <= 0) return;
    setSaving(true);
    const supabase = createClient();
    const payload = {
      category_id: form.category_id,
      category_name: form.category_name,
      title: form.title.trim(),
      amount: Number(form.amount),
      vat_included: form.vat_included,
      vat_rate: Number(form.vat_rate),
      payment_method: form.payment_method,
      expense_date: form.expense_date,
      is_recurring: form.is_recurring,
      recurring_period: form.is_recurring ? form.recurring_period : null,
      notes: form.notes?.trim() || null,
    };

    if (modal === "add") {
      await supabase.from("finance_expenses").insert(payload);
    } else if (modal === "edit" && editing) {
      await supabase.from("finance_expenses").update(payload).eq("id", editing.id);
    }

    setSaving(false);
    closeModal();
    showToast(modal === "add" ? "Gider eklendi" : "Gider güncellendi");
    fetchData();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const supabase = createClient();
    await supabase.from("finance_expenses").delete().eq("id", deleteId);
    setDeleteId(null);
    showToast("Gider silindi");
    fetchData();
  };

  const filtered = useMemo(() => {
    return expenses.filter((e) => {
      const matchesCategory = categoryFilter === "all" || e.category_name === categoryFilter;
      const matchesMonth = !monthFilter || e.expense_date.slice(0, 7) === monthFilter;
      return matchesCategory && matchesMonth;
    });
  }, [expenses, categoryFilter, monthFilter]);

  const totalFiltered = filtered.reduce((s, e) => s + Number(e.amount), 0);
  const categoryNames = useMemo(
    () => Array.from(new Set(expenses.map((e) => e.category_name))).sort(),
    [expenses]
  );

  if (tableError) {
    return (
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <h1 style={{ color: "#fff", fontWeight: 800, fontSize: 26, letterSpacing: "-0.02em", marginBottom: 8 }}>
          Gider Takibi
        </h1>
        <div style={{ background: "#141414", border: "1px solid rgba(248,113,113,0.25)", borderRadius: 16, padding: 28 }}>
          <p style={{ color: "#f87171", fontWeight: 700, fontSize: 15, marginBottom: 12 }}>
            finance_expenses tablosu bulunamadı
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
            Gider Takibi
          </h1>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, margin: 0 }}>
            Kira, personel, ekipman ve diğer işletme giderleri
          </p>
        </div>
        <button
          onClick={openAdd}
          style={{ background: "#7A0D2A", border: "1px solid rgba(212,175,55,0.3)", color: "#fff", padding: "9px 18px", borderRadius: 9, cursor: "pointer", fontWeight: 600, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}
        >
          <Plus size={15} /> Gider Ekle
        </button>
      </div>

      {/* Özet + Filtreler */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 14, marginBottom: 18, alignItems: "center" }}>
        <div style={cardStyle}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 4 }}>Filtrelenen Toplam Gider</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#f87171" }}>{formatCurrency(totalFiltered)}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Filter size={14} color="rgba(255,255,255,0.3)" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ ...inputStyle, width: 180 }}
          >
            <option value="all">Tüm Kategoriler</option>
            {categoryNames.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <input
          type="month"
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
          style={{ ...inputStyle, width: 160 }}
        />
      </div>

      <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "rgba(0,0,0,0.3)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              {["Tarih", "Başlık", "Kategori", "Tutar", "Ödeme", "Tekrar", "İşlem"].map((h) => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, color: "rgba(255,255,255,0.3)", fontWeight: 600, letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ padding: 28, textAlign: "center", color: "rgba(255,255,255,0.25)", fontSize: 13 }}>Yükleniyor...</td></tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div style={{ padding: "3rem", textAlign: "center" }}>
                    <Receipt style={{ width: 40, height: 40, color: "rgba(255,255,255,0.1)", margin: "0 auto 12px" }} />
                    <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 14, marginBottom: 4 }}>Kayıt bulunamadı</p>
                    <p style={{ color: "rgba(255,255,255,0.18)", fontSize: 12 }}>Seçili filtrelerde gider kaydı yok.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((e) => (
                <tr key={e.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ padding: "11px 14px", fontSize: 12.5, color: "rgba(255,255,255,0.5)" }}>
                    {new Date(e.expense_date).toLocaleDateString("tr-TR", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td style={{ padding: "11px 14px", fontSize: 13, fontWeight: 600, color: "#fff" }}>{e.title}</td>
                  <td style={{ padding: "11px 14px", fontSize: 12.5, color: "#D4AF37" }}>{e.category_name}</td>
                  <td style={{ padding: "11px 14px", fontSize: 13, fontWeight: 700, color: "#f87171" }}>{formatCurrency(Number(e.amount))}</td>
                  <td style={{ padding: "11px 14px", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{paymentLabels[e.payment_method]}</td>
                  <td style={{ padding: "11px 14px" }}>
                    {e.is_recurring ? (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(96,165,250,0.15)", color: "#60a5fa", padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600 }}>
                        <Repeat size={11} /> {e.recurring_period === "aylik" ? "Aylık" : e.recurring_period === "ceyreklik" ? "Çeyreklik" : "Yıllık"}
                      </span>
                    ) : (
                      <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 12 }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: "11px 14px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => openEdit(e)} style={{ background: "rgba(255,255,255,0.06)", border: "none", color: "rgba(255,255,255,0.5)", borderRadius: 6, padding: "5px 7px", cursor: "pointer" }}><Pencil size={13} /></button>
                      <button onClick={() => setDeleteId(e.id)} style={{ background: "rgba(248,113,113,0.1)", border: "none", color: "#f87171", borderRadius: 6, padding: "5px 7px", cursor: "pointer" }}><Trash2 size={13} /></button>
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
                {modal === "add" ? "Gider Ekle" : "Gider Düzenle"}
              </h2>
              <button onClick={closeModal} style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer" }}><X size={18} /></button>
            </div>

            <div style={{ display: "grid", gap: 14 }}>
              <div>
                <label style={labelStyle}>Başlık *</label>
                <input type="text" value={form.title} onChange={(e) => setF("title", e.target.value)} style={inputStyle} placeholder="Ocak Ayı Kira" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Kategori *</label>
                  <select value={form.category_id ?? ""} onChange={(e) => handleCategoryChange(e.target.value)} style={inputStyle}>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Tutar (₺) *</label>
                  <input type="number" value={form.amount} onChange={(e) => setF("amount", Number(e.target.value))} style={inputStyle} min="0" step="0.01" />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Tarih *</label>
                  <input type="date" value={form.expense_date} onChange={(e) => setF("expense_date", e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Ödeme Yöntemi</label>
                  <select value={form.payment_method} onChange={(e) => setF("payment_method", e.target.value as FormState["payment_method"])} style={inputStyle}>
                    <option value="nakit">Nakit</option>
                    <option value="kredi_karti">Kredi Kartı</option>
                    <option value="havale">Havale/EFT</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>KDV Oranı (%)</label>
                  <input type="number" value={form.vat_rate} onChange={(e) => setF("vat_rate", Number(e.target.value))} style={inputStyle} min="0" max="100" />
                </div>
                <div style={{ display: "flex", alignItems: "flex-end", paddingBottom: 9 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
                    <input type="checkbox" checked={form.vat_included} onChange={(e) => setF("vat_included", e.target.checked)} />
                    Tutara KDV dahil
                  </label>
                </div>
              </div>
              <div>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: form.is_recurring ? 10 : 0 }}>
                  <input type="checkbox" checked={form.is_recurring} onChange={(e) => setF("is_recurring", e.target.checked)} />
                  Tekrarlayan gider (sabit gider)
                </label>
                {form.is_recurring && (
                  <select value={form.recurring_period ?? "aylik"} onChange={(e) => setF("recurring_period", e.target.value)} style={inputStyle}>
                    <option value="aylik">Aylık</option>
                    <option value="ceyreklik">Çeyreklik</option>
                    <option value="yillik">Yıllık</option>
                  </select>
                )}
              </div>
              <div>
                <label style={labelStyle}>Not</label>
                <textarea value={form.notes ?? ""} onChange={(e) => setF("notes", e.target.value)} style={{ ...inputStyle, minHeight: 60, resize: "vertical", fontFamily: "inherit" }} />
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
            <h3 style={{ color: "#fff", fontSize: 17, fontWeight: 700, margin: "0 0 8px" }}>Gideri Sil</h3>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: "0 0 24px" }}>Bu gider kaydını silmek istediğinize emin misiniz?</p>
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
