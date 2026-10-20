/*
# Create enquiries table for buyer RFQ submissions

## Purpose
Stores buyer Request-for-Quote (RFQ) submissions from the public /request-quote page.
Admin users (authenticated) can view and manage enquiries from the /admin dashboard.

## New Tables
- `enquiries`
  - `id` (uuid, primary key, auto-generated)
  - `created_at` (timestamptz, default now())
  - `full_name` (text, not null) — buyer's full name
  - `company` (text) — buyer's company name
  - `country` (text, not null) — buyer's country
  - `city` (text) — buyer's city
  - `email` (text, not null) — buyer's email address
  - `phone` (text) — buyer's phone or WhatsApp number
  - `buyer_type` (text) — e.g. Importer, Wholesaler, Distributor
  - `product` (text, not null) — product name requested
  - `product_slug` (text) — product slug for internal reference
  - `variety_grade` (text) — variety or grade specification
  - `quantity` (numeric, not null) — requested quantity (must be positive)
  - `unit` (text, not null) — unit of measurement (MT, KG, etc.)
  - `packaging` (text) — packaging requirement
  - `destination` (text, not null) — destination country/city/port
  - `delivery_date` (date) — required delivery date
  - `specifications` (text) — detailed product specifications
  - `message` (text) — additional message from buyer
  - `incoterm` (text) — agreed incoterm (FOB, CIF, etc.)
  - `payment_terms` (text) — payment terms (LC, TT, etc.)
  - `status` (text, not null, default 'new') — enquiry workflow status
  - `email_status` (text, not null, default 'pending') — admin notification email status

## Security (Row Level Security)
- RLS ENABLED on `enquiries`.
- INSERT policy: TO anon, authenticated — anyone can submit an RFQ.
  WITH CHECK enforces required fields, valid email format, and positive quantity.
- SELECT policy: TO authenticated only — only logged-in admins can read enquiries.
- UPDATE policy: TO authenticated only — only logged-in admins can update enquiry status.
- DELETE policy: NONE — no one can delete enquiries via the API (data integrity).

## Important Notes
1. Public (anon) users can ONLY insert. They cannot read, update, or delete enquiries.
2. Only authenticated admin users can read and update enquiries.
3. The INSERT WITH CHECK enforces data integrity at the database level:
   - full_name must be 2-100 chars
   - email must match a basic email pattern
   - quantity must be > 0
   - product must be 1-200 chars
   - country must be 2-100 chars
   - destination must be 2-200 chars
4. status defaults to 'new', email_status defaults to 'pending'.
5. No DELETE policy exists — enquiries are never deleted through the API.
*/

CREATE TABLE IF NOT EXISTS enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  full_name text NOT NULL,
  company text,
  country text NOT NULL,
  city text,
  email text NOT NULL,
  phone text,
  buyer_type text,
  product text NOT NULL,
  product_slug text,
  variety_grade text,
  quantity numeric NOT NULL,
  unit text NOT NULL,
  packaging text,
  destination text NOT NULL,
  delivery_date date,
  specifications text,
  message text,
  incoterm text,
  payment_terms text,
  status text NOT NULL DEFAULT 'new',
  email_status text NOT NULL DEFAULT 'pending'
);

-- Indexes for admin dashboard filtering and sorting
CREATE INDEX IF NOT EXISTS enquiries_created_at_idx ON enquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS enquiries_status_idx ON enquiries (status);
CREATE INDEX IF NOT EXISTS enquiries_product_idx ON enquiries (product);
CREATE INDEX IF NOT EXISTS enquiries_country_idx ON enquiries (country);
CREATE INDEX IF NOT EXISTS enquiries_email_idx ON enquiries (email);

-- Enable Row Level Security
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- INSERT: Public (anon) can submit RFQs with data validation
DROP POLICY IF EXISTS "public_insert_enquiry" ON enquiries;
CREATE POLICY "public_insert_enquiry"
  ON enquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    full_name IS NOT NULL
    AND length(full_name) >= 2
    AND length(full_name) <= 100
    AND email IS NOT NULL
    AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    AND product IS NOT NULL
    AND length(product) >= 1
    AND length(product) <= 200
    AND country IS NOT NULL
    AND length(country) >= 2
    AND length(country) <= 100
    AND destination IS NOT NULL
    AND length(destination) >= 2
    AND length(destination) <= 200
    AND quantity IS NOT NULL
    AND quantity > 0
    AND unit IS NOT NULL
    AND length(unit) >= 1
    AND length(unit) <= 20
    AND (company IS NULL OR length(company) <= 200)
    AND (city IS NULL OR length(city) <= 100)
    AND (phone IS NULL OR length(phone) <= 50)
    AND (buyer_type IS NULL OR length(buyer_type) <= 100)
    AND (product_slug IS NULL OR length(product_slug) <= 100)
    AND (variety_grade IS NULL OR length(variety_grade) <= 200)
    AND (packaging IS NULL OR length(packaging) <= 200)
    AND (specifications IS NULL OR length(specifications) <= 5000)
    AND (message IS NULL OR length(message) <= 5000)
    AND (incoterm IS NULL OR length(incoterm) <= 50)
    AND (payment_terms IS NULL OR length(payment_terms) <= 200)
    AND (status = 'new')
  );

-- SELECT: Only authenticated admins can read enquiries
DROP POLICY IF EXISTS "admin_select_enquiries" ON enquiries;
CREATE POLICY "admin_select_enquiries"
  ON enquiries FOR SELECT
  TO authenticated
  USING (true);

-- UPDATE: Only authenticated admins can update enquiry status/details
DROP POLICY IF EXISTS "admin_update_enquiries" ON enquiries;
CREATE POLICY "admin_update_enquiries"
  ON enquiries FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- No DELETE policy — enquiries cannot be deleted via the API
