
/*
# Arbora E-Commerce — Initial Schema

## Summary
Creates the full database schema for the Arbora wood e-commerce platform.

## New Tables

### profiles
- Extends auth.users with first_name, last_name, phone, address fields
- role: 'customer' | 'admin' | 'super_admin'
- RLS: authenticated users can read/update their own profile; admins can read all

### products
- Wood products: Teck, Iroko, Pin, Sapin
- Fields: name, slug, description, price (in EUR cents), stock, dimensions (jsonb), images (text[]), is_active
- RLS: anyone can read active products; only admins can write

### product_reviews
- Customer reviews linked to products and users
- Fields: rating (1-5), comment, is_approved, is_rejected
- RLS: anyone can read approved reviews; authenticated users can insert their own; admins can update (moderation)

### favorites
- User wishlist
- RLS: users see and manage only their own favorites

### orders
- Order header: status, payment_method, payment_status, total_amount, shipping address
- order_number generated automatically
- RLS: users see their own orders; admins see all

### order_items
- Line items per order: product_id, quantity, unit_price, customization (jsonb)
- RLS: users see items in their own orders; admins see all

### payments
- Payment records linked to orders
- Fields: method, status, reference, amount
- RLS: users see their own payments; admins see all

### cms_content
- Key-value content blocks for the mini CMS
- RLS: public read; admin write

## Security
- RLS enabled on all tables
- Separate policies per verb
- Admin access via role check in profiles table
*/

-- PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text NOT NULL DEFAULT '',
  last_name text NOT NULL DEFAULT '',
  phone text DEFAULT '',
  address text DEFAULT '',
  city text DEFAULT '',
  country text DEFAULT 'France',
  role text NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'super_admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_delete_own" ON profiles;
CREATE POLICY "profiles_delete_own" ON profiles FOR DELETE
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_admin_select" ON profiles;
CREATE POLICY "profiles_admin_select" ON profiles FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin'))
  );

-- PRODUCTS
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  essence text NOT NULL CHECK (essence IN ('Teck', 'Iroko', 'Pin', 'Sapin')),
  description text NOT NULL DEFAULT '',
  price_eur integer NOT NULL DEFAULT 0,
  price_usd integer NOT NULL DEFAULT 0,
  price_fcfa integer NOT NULL DEFAULT 0,
  stock integer NOT NULL DEFAULT 0,
  dimensions jsonb DEFAULT '{}',
  images text[] DEFAULT '{}',
  characteristics jsonb DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "products_public_select" ON products;
CREATE POLICY "products_public_select" ON products FOR SELECT
  TO anon, authenticated USING (is_active = true);

DROP POLICY IF EXISTS "products_admin_select_all" ON products;
CREATE POLICY "products_admin_select_all" ON products FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

DROP POLICY IF EXISTS "products_admin_insert" ON products;
CREATE POLICY "products_admin_insert" ON products FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

DROP POLICY IF EXISTS "products_admin_update" ON products;
CREATE POLICY "products_admin_update" ON products FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

DROP POLICY IF EXISTS "products_admin_delete" ON products;
CREATE POLICY "products_admin_delete" ON products FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- PRODUCT REVIEWS
CREATE TABLE IF NOT EXISTS product_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text NOT NULL DEFAULT '',
  is_approved boolean NOT NULL DEFAULT false,
  is_rejected boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "reviews_select_approved" ON product_reviews;
CREATE POLICY "reviews_select_approved" ON product_reviews FOR SELECT
  TO anon, authenticated USING (is_approved = true);

DROP POLICY IF EXISTS "reviews_select_own" ON product_reviews;
CREATE POLICY "reviews_select_own" ON product_reviews FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "reviews_insert_own" ON product_reviews;
CREATE POLICY "reviews_insert_own" ON product_reviews FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "reviews_update_own" ON product_reviews;
CREATE POLICY "reviews_update_own" ON product_reviews FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "reviews_delete_own" ON product_reviews;
CREATE POLICY "reviews_delete_own" ON product_reviews FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "reviews_admin_all" ON product_reviews;
CREATE POLICY "reviews_admin_all" ON product_reviews FOR ALL
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- FAVORITES
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "favorites_select_own" ON favorites;
CREATE POLICY "favorites_select_own" ON favorites FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "favorites_insert_own" ON favorites;
CREATE POLICY "favorites_insert_own" ON favorites FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "favorites_delete_own" ON favorites;
CREATE POLICY "favorites_delete_own" ON favorites FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ORDERS
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL DEFAULT 'ARB-' || to_char(now(), 'YYYYMMDD') || '-' || substr(gen_random_uuid()::text, 1, 6),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE RESTRICT,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled')),
  payment_method text NOT NULL CHECK (payment_method IN ('card', 'bank_transfer')),
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'awaiting_transfer', 'paid', 'failed', 'refunded')),
  subtotal_eur integer NOT NULL DEFAULT 0,
  total_eur integer NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'EUR',
  shipping_address jsonb NOT NULL DEFAULT '{}',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "orders_select_own" ON orders;
CREATE POLICY "orders_select_own" ON orders FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "orders_insert_own" ON orders;
CREATE POLICY "orders_insert_own" ON orders FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "orders_update_own" ON orders;
CREATE POLICY "orders_update_own" ON orders FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "orders_admin_all" ON orders;
CREATE POLICY "orders_admin_all" ON orders FOR ALL
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- ORDER ITEMS
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity numeric NOT NULL DEFAULT 1,
  unit text NOT NULL DEFAULT 'pcs',
  unit_price_eur integer NOT NULL DEFAULT 0,
  customization jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "order_items_select_own" ON order_items;
CREATE POLICY "order_items_select_own" ON order_items FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "order_items_insert_own" ON order_items;
CREATE POLICY "order_items_insert_own" ON order_items FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "order_items_admin_all" ON order_items;
CREATE POLICY "order_items_admin_all" ON order_items FOR ALL
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- PAYMENTS
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE RESTRICT,
  method text NOT NULL CHECK (method IN ('card', 'bank_transfer')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  amount_eur integer NOT NULL DEFAULT 0,
  reference text DEFAULT '',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "payments_select_own" ON payments;
CREATE POLICY "payments_select_own" ON payments FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "payments_insert_own" ON payments;
CREATE POLICY "payments_insert_own" ON payments FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "payments_update_own" ON payments;
CREATE POLICY "payments_update_own" ON payments FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "payments_admin_all" ON payments;
CREATE POLICY "payments_admin_all" ON payments FOR ALL
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- CMS CONTENT
CREATE TABLE IF NOT EXISTS cms_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL DEFAULT '',
  type text NOT NULL DEFAULT 'text' CHECK (type IN ('text', 'html', 'json')),
  label text NOT NULL DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE cms_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cms_public_select" ON cms_content;
CREATE POLICY "cms_public_select" ON cms_content FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "cms_admin_insert" ON cms_content;
CREATE POLICY "cms_admin_insert" ON cms_content FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

DROP POLICY IF EXISTS "cms_admin_update" ON cms_content;
CREATE POLICY "cms_admin_update" ON cms_content FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

DROP POLICY IF EXISTS "cms_admin_delete" ON cms_content;
CREATE POLICY "cms_admin_delete" ON cms_content FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_essence ON products(essence);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON product_reviews(is_approved);
CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(order_id);

-- AUTO-CREATED PROFILE ON SIGNUP
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, first_name, last_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- SEED PRODUCTS
INSERT INTO products (name, slug, essence, description, price_eur, price_usd, price_fcfa, stock, dimensions, images, characteristics, is_active) VALUES
(
  'Teck Premium',
  'teck-premium',
  'Teck',
  'Bois de teck de qualité supérieure, naturellement résistant aux intempéries et aux insectes. Idéal pour les terrasses, ponts de bateaux et mobilier extérieur haut de gamme.',
  28500,
  31000,
  18600000,
  150,
  '{"length_mm": 4000, "width_mm": 100, "thickness_mm": 30, "weight_kg_m3": 650}',
  ARRAY['https://images.pexels.com/photos/129733/pexels-photo-129733.jpeg'],
  '{"class_emploi": "Classe 4", "traitement": "Naturel", "certification": "FSC", "origine": "Asie du Sud-Est", "durete_janka": "High", "resistance_humidite": "Excellente"}',
  true
),
(
  'Iroko Massif',
  'iroko-massif',
  'Iroko',
  'Essence africaine robuste et durable, excellent substitut au teck à un prix plus accessible. Parfait pour les menuiseries extérieures, les charpentes et les parquets.',
  18900,
  20500,
  12300000,
  200,
  '{"length_mm": 5000, "width_mm": 150, "thickness_mm": 40, "weight_kg_m3": 640}',
  ARRAY['https://images.pexels.com/photos/1571452/pexels-photo-1571452.jpeg'],
  '{"class_emploi": "Classe 3", "traitement": "Naturel", "certification": "PEFC", "origine": "Afrique de l''Ouest", "durete_janka": "High", "resistance_humidite": "Bonne"}',
  true
),
(
  'Pin Sylvestre',
  'pin-sylvestre',
  'Pin',
  'Bois de pin résineux, léger et facile à travailler. Très utilisé en charpente, ossature bois et menuiserie intérieure. Disponible traité pour une utilisation extérieure.',
  8500,
  9200,
  5500000,
  500,
  '{"length_mm": 4000, "width_mm": 100, "thickness_mm": 25, "weight_kg_m3": 510}',
  ARRAY['https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg'],
  '{"class_emploi": "Classe 2", "traitement": "Autoclave possible", "certification": "PEFC", "origine": "Europe du Nord", "durete_janka": "Medium", "resistance_humidite": "Moyenne"}',
  true
),
(
  'Sapin Alpin',
  'sapin-alpin',
  'Sapin',
  'Sapin blanc d''altitude, bois tendre et homogène, idéal pour la construction légère, la charpente et la fabrication de meubles. Grain fin et aspect esthétique naturel.',
  7200,
  7800,
  4700000,
  450,
  '{"length_mm": 4500, "width_mm": 120, "thickness_mm": 30, "weight_kg_m3": 450}',
  ARRAY['https://images.pexels.com/photos/1647976/pexels-photo-1647976.jpeg'],
  '{"class_emploi": "Classe 2", "traitement": "Naturel", "certification": "FSC", "origine": "Alpes Françaises", "durete_janka": "Low", "resistance_humidite": "Faible"}',
  true
)
ON CONFLICT (slug) DO NOTHING;

-- SEED CMS CONTENT
INSERT INTO cms_content (key, value, type, label) VALUES
  ('hero_title', 'Des bois de construction d''excellence', 'text', 'Titre principal hero'),
  ('hero_subtitle', 'Arbora sélectionne et livre les essences les plus résistantes pour vos projets professionnels et personnels.', 'text', 'Sous-titre hero'),
  ('about_title', 'Notre engagement qualité', 'text', 'Titre section À propos'),
  ('about_text', 'Depuis plus de 20 ans, Arbora fournit des bois de construction certifiés aux professionnels du bâtiment, menuisiers, architectes et particuliers exigeants à travers l''Europe.', 'text', 'Texte section À propos'),
  ('contact_email', 'contact@arbora.eu', 'text', 'Email de contact'),
  ('contact_phone', '+33 1 23 45 67 89', 'text', 'Téléphone de contact'),
  ('contact_address', '42 Rue du Bois, 75008 Paris, France', 'text', 'Adresse postale')
ON CONFLICT (key) DO NOTHING;
