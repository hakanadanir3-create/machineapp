-- =====================================================================
-- FINANCE MODULE — Gider Takibi + Manuel Gelir Kayıtları + Üye Ödeme Takibi
-- Gym Machine Mali Yönetim Modülü v1 (MVP)
-- =====================================================================

-- ── 1. GİDER KATEGORİLERİ ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS finance_expense_categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  icon text,
  is_system boolean DEFAULT false,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

INSERT INTO finance_expense_categories (name, icon, is_system, order_index) VALUES
  ('Kira', 'home', true, 1),
  ('Elektrik', 'zap', true, 2),
  ('Su', 'droplet', true, 3),
  ('Doğalgaz', 'flame', true, 4),
  ('Personel Maaşı', 'users', true, 5),
  ('SGK Primi', 'shield', true, 6),
  ('Ekipman Bakım/Yenileme', 'wrench', true, 7),
  ('Supplement/Stok Alımı', 'package', true, 8),
  ('Pazarlama/Reklam', 'megaphone', true, 9),
  ('Muhasebeci Ücreti', 'calculator', true, 10),
  ('Sigorta', 'shield-check', true, 11),
  ('Temizlik Malzemesi', 'sparkles', true, 12),
  ('Tamir/Bakım', 'tool', true, 13),
  ('Diğer', 'more-horizontal', true, 99)
ON CONFLICT (name) DO NOTHING;

-- ── 2. GİDERLER ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS finance_expenses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id uuid REFERENCES finance_expense_categories(id) ON DELETE SET NULL,
  category_name text NOT NULL, -- snapshot (kategori silinse bile kalır)
  title text NOT NULL,
  amount numeric(12,2) NOT NULL CHECK (amount >= 0),
  vat_included boolean DEFAULT true,
  vat_rate numeric(5,2) DEFAULT 20.00,
  payment_method text DEFAULT 'havale' CHECK (payment_method IN ('nakit','kredi_karti','havale')),
  expense_date date NOT NULL DEFAULT CURRENT_DATE,
  is_recurring boolean DEFAULT false,
  recurring_period text CHECK (recurring_period IN ('aylik','ceyreklik','yillik') OR recurring_period IS NULL),
  receipt_url text,
  notes text,
  created_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_finance_expenses_date ON finance_expenses(expense_date DESC);
CREATE INDEX IF NOT EXISTS idx_finance_expenses_category ON finance_expenses(category_id);

-- ── 3. GELİR KAYITLARI (manuel + otomatik senkron için birleşik tablo) ─
CREATE TABLE IF NOT EXISTS finance_income (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  source text NOT NULL DEFAULT 'manuel' CHECK (source IN ('manuel','order_sync','membership_sync')),
  source_ref_id uuid, -- orders.id veya membership_orders.id (senkronsa)
  income_type text NOT NULL CHECK (income_type IN ('uyelik','ozel_ders','supplement','etkinlik','misafir','diger')),
  member_id uuid REFERENCES members(id) ON DELETE SET NULL,
  member_name_snapshot text,
  title text NOT NULL,
  amount numeric(12,2) NOT NULL CHECK (amount >= 0),
  payment_method text DEFAULT 'nakit' CHECK (payment_method IN ('nakit','kredi_karti','havale')),
  income_date date NOT NULL DEFAULT CURRENT_DATE,
  notes text,
  created_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (source, source_ref_id)
);

CREATE INDEX IF NOT EXISTS idx_finance_income_date ON finance_income(income_date DESC);
CREATE INDEX IF NOT EXISTS idx_finance_income_type ON finance_income(income_type);
CREATE INDEX IF NOT EXISTS idx_finance_income_member ON finance_income(member_id);

-- ── 4. ÜYE ÖDEME TAKİBİ (taksit/borç durumu) ──────────────────────────
CREATE TABLE IF NOT EXISTS member_payments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  member_name_snapshot text,
  package_name text NOT NULL,
  package_period text CHECK (package_period IN ('aylik','3_aylik','6_aylik','yillik')),
  total_amount numeric(12,2) NOT NULL CHECK (total_amount >= 0),
  paid_amount numeric(12,2) NOT NULL DEFAULT 0 CHECK (paid_amount >= 0),
  installment_count integer DEFAULT 1,
  due_date date NOT NULL,
  status text NOT NULL DEFAULT 'bekliyor' CHECK (status IN ('odendi','kismi_odendi','bekliyor','gecikti')),
  payment_method text CHECK (payment_method IN ('nakit','kredi_karti','havale') OR payment_method IS NULL),
  linked_income_id uuid REFERENCES finance_income(id) ON DELETE SET NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_member_payments_member ON member_payments(member_id);
CREATE INDEX IF NOT EXISTS idx_member_payments_due ON member_payments(due_date);
CREATE INDEX IF NOT EXISTS idx_member_payments_status ON member_payments(status);

-- Gecikmiş ödemeleri otomatik işaretlemek için basit fonksiyon (cron veya sayfa yüklemesinde çağrılabilir)
CREATE OR REPLACE FUNCTION mark_overdue_payments() RETURNS void AS $$
BEGIN
  UPDATE member_payments
  SET status = 'gecikti', updated_at = now()
  WHERE status IN ('bekliyor','kismi_odendi')
    AND due_date < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- ── 5. VERGİ AYARLARI (sabit oranlar + salon vergi rejimi) ────────────
CREATE TABLE IF NOT EXISTS finance_tax_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  vat_rate numeric(5,2) NOT NULL DEFAULT 10.00, -- spor salonu hizmet KDV oranı
  tax_regime text NOT NULL DEFAULT 'gercek_usul' CHECK (tax_regime IN ('basit_usul','gercek_usul')),
  income_tax_bracket_notes text,
  sgk_employer_rate numeric(5,2) DEFAULT 22.50,
  sgk_employee_rate numeric(5,2) DEFAULT 14.00,
  updated_at timestamptz DEFAULT now()
);

INSERT INTO finance_tax_settings (vat_rate, tax_regime)
SELECT 10.00, 'gercek_usul'
WHERE NOT EXISTS (SELECT 1 FROM finance_tax_settings);

-- ── 6. RAPORLAMA VIEW'LARI ─────────────────────────────────────────────

-- Aylık gelir-gider-kar özeti (son 24 ay)
CREATE OR REPLACE VIEW finance_monthly_summary AS
WITH months AS (
  SELECT date_trunc('month', generate_series(
    (CURRENT_DATE - interval '23 months'), CURRENT_DATE, interval '1 month'
  )) AS month
),
income_agg AS (
  SELECT date_trunc('month', income_date) AS month, SUM(amount) AS total_income
  FROM finance_income GROUP BY 1
),
expense_agg AS (
  SELECT date_trunc('month', expense_date) AS month, SUM(amount) AS total_expense
  FROM finance_expenses GROUP BY 1
)
SELECT
  m.month,
  COALESCE(i.total_income, 0) AS total_income,
  COALESCE(e.total_expense, 0) AS total_expense,
  COALESCE(i.total_income, 0) - COALESCE(e.total_expense, 0) AS net_profit
FROM months m
LEFT JOIN income_agg i ON i.month = m.month
LEFT JOIN expense_agg e ON e.month = m.month
ORDER BY m.month;

-- Gider kategori dağılımı (cari ay)
CREATE OR REPLACE VIEW finance_expense_by_category_current_month AS
SELECT category_name, SUM(amount) AS total
FROM finance_expenses
WHERE date_trunc('month', expense_date) = date_trunc('month', CURRENT_DATE)
GROUP BY category_name
ORDER BY total DESC;

-- Gelir türü dağılımı (cari ay)
CREATE OR REPLACE VIEW finance_income_by_type_current_month AS
SELECT income_type, SUM(amount) AS total
FROM finance_income
WHERE date_trunc('month', income_date) = date_trunc('month', CURRENT_DATE)
GROUP BY income_type
ORDER BY total DESC;

-- ── 7. RLS ─────────────────────────────────────────────────────────────
ALTER TABLE finance_expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_income ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_tax_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin full access categories" ON finance_expense_categories;
DROP POLICY IF EXISTS "Admin full access expenses" ON finance_expenses;
DROP POLICY IF EXISTS "Admin full access income" ON finance_income;
DROP POLICY IF EXISTS "Admin full access member_payments" ON member_payments;
DROP POLICY IF EXISTS "Admin full access tax_settings" ON finance_tax_settings;

CREATE POLICY "Admin full access categories" ON finance_expense_categories FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin full access expenses" ON finance_expenses FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin full access income" ON finance_income FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin full access member_payments" ON member_payments FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin full access tax_settings" ON finance_tax_settings FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());
