-- =====================================================
-- RM Devices - Complete Database Schema
-- =====================================================
-- Run this ENTIRE file in Supabase SQL Editor
-- This will CREATE the products table with ALL columns
-- and set up all indexes, policies, and constraints
-- =====================================================

-- =====================================================
-- 1. DROP EXISTING TABLE (if exists)
-- =====================================================
-- WARNING: This will delete all existing data!
-- Comment out this line if you want to keep existing data
-- =====================================================

DROP TABLE IF EXISTS products CASCADE;


-- =====================================================
-- 2. CREATE PRODUCTS TABLE WITH ALL COLUMNS
-- =====================================================

CREATE TABLE products (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Product Information
  sku TEXT UNIQUE NOT NULL,
  brand TEXT NOT NULL CHECK (brand IN ('Apple', 'Samsung')),
  model TEXT NOT NULL,
  
  -- Pricing
  price DECIMAL(12, 2) NOT NULL CHECK (price >= 0),              -- Selling price (Rp)
  capital_price DECIMAL(12, 2) DEFAULT 0 CHECK (capital_price >= 0),  -- Cost price (Rp, admin only)
  
  -- Discounts (flexible: percentage or fixed amount)
  discount_value DECIMAL(12, 2) DEFAULT 0 CHECK (discount_value >= 0),
  discount_type TEXT DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'fixed')),
  
  -- Product Specifications
  storage TEXT NOT NULL,
  condition TEXT NOT NULL,
  
  -- Images (multi-image support)
  image_url TEXT,                      -- Legacy column for backward compatibility
  images TEXT[] DEFAULT '{}',          -- Array of image URLs
  
  -- Visibility Control
  is_active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- =====================================================
-- 3. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Index for active products filtering (public catalog)
CREATE INDEX idx_products_is_active ON products(is_active);

-- Indexes for brand filtering
CREATE INDEX idx_products_brand ON products(brand);

-- Indexes for price fields
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_capital_price ON products(capital_price);

-- Indexes for discount fields
CREATE INDEX idx_products_discount_value ON products(discount_value);
CREATE INDEX idx_products_discount_type ON products(discount_type);

-- Index for model search
CREATE INDEX idx_products_model ON products(model);

-- Index for SKU lookup
CREATE INDEX idx_products_sku ON products(sku);

-- GIN index for images array operations
CREATE INDEX idx_products_images ON products USING GIN(images);

-- Index for sorting by creation date
CREATE INDEX idx_products_created_at ON products(created_at DESC);

-- Index for sorting by update date
CREATE INDEX idx_products_updated_at ON products(updated_at DESC);


-- =====================================================
-- 4. ADD COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE products IS 'Product catalog for RM Devices dropshipping platform';

COMMENT ON COLUMN products.id IS 'Unique product identifier (UUID)';
COMMENT ON COLUMN products.sku IS 'Stock Keeping Unit - unique product code';
COMMENT ON COLUMN products.brand IS 'Product brand (Apple or Samsung)';
COMMENT ON COLUMN products.model IS 'Product model name';
COMMENT ON COLUMN products.price IS 'Selling price in Indonesian Rupiah (IDR)';
COMMENT ON COLUMN products.capital_price IS 'Cost price in IDR (for admin internal use only)';
COMMENT ON COLUMN products.discount_value IS 'Discount value (percentage 0-100 or fixed amount in Rupiah)';
COMMENT ON COLUMN products.discount_type IS 'Type of discount: percentage or fixed';
COMMENT ON COLUMN products.storage IS 'Storage capacity (e.g., 128GB, 256GB)';
COMMENT ON COLUMN products.condition IS 'Product condition (Brand New, Grade A+, etc.)';
COMMENT ON COLUMN products.image_url IS 'Legacy column - single image URL (backward compatibility)';
COMMENT ON COLUMN products.images IS 'Array of product image URLs from Supabase Storage';
COMMENT ON COLUMN products.is_active IS 'Product visibility toggle (true = visible in catalog)';
COMMENT ON COLUMN products.created_at IS 'Record creation timestamp';
COMMENT ON COLUMN products.updated_at IS 'Last update timestamp';


-- =====================================================
-- 5. CREATE UPDATED_AT TRIGGER
-- =====================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for products table
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


-- =====================================================
-- 6. ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;


-- =====================================================
-- 7. CREATE RLS POLICIES
-- =====================================================

-- Policy: Public can view only active products
CREATE POLICY "Public can view active products"
  ON products FOR SELECT
  USING (is_active = true);

-- Policy: Authenticated users (admin) can do everything
CREATE POLICY "Admins can manage all products"
  ON products FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');


-- =====================================================
-- 8. INSERT SAMPLE DATA (OPTIONAL)
-- =====================================================
-- Uncomment to add sample products for testing
-- =====================================================

/*
INSERT INTO products (sku, brand, model, price, capital_price, discount_value, discount_type, storage, condition, images, is_active) VALUES
  -- Apple iPhones
  ('RM-APL-IP15PM-BLK', 'Apple', 'iPhone 15 Pro Max', 21000000, 18500000, 5, 'percentage', '256GB', 'Brand New', 
   ARRAY['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500'], true),
  
  ('RM-APL-IP15P-BLU', 'Apple', 'iPhone 15 Pro', 19000000, 16500000, 0, 'percentage', '256GB', 'Brand New', 
   ARRAY['https://images.unsplash.com/photo-1696446702022-0af1fbb4227b?w=500'], true),
  
  ('RM-APL-IP15-BLK', 'Apple', 'iPhone 15', 15000000, 13000000, 10, 'percentage', '128GB', 'Brand New', 
   ARRAY['https://images.unsplash.com/photo-1695048064942-89eb9cf6e14a?w=500'], true),
  
  ('RM-APL-IP14-PRP', 'Apple', 'iPhone 14', 13500000, 11500000, 0, 'percentage', '128GB', 'Grade A+', 
   ARRAY['https://images.unsplash.com/photo-1678685888221-cda180f3f048?w=500'], true),
  
  -- Samsung Galaxy
  ('RM-SAM-S24U-BLK', 'Samsung', 'Galaxy S24 Ultra', 22000000, 19500000, 10, 'percentage', '512GB', 'Brand New', 
   ARRAY['https://images.unsplash.com/photo-1706654096324-1e900f934d2e?w=500'], true),
  
  ('RM-SAM-S24P-GRY', 'Samsung', 'Galaxy S24 Plus', 17000000, 15000000, 500000, 'fixed', '256GB', 'Brand New', 
   ARRAY['https://images.unsplash.com/photo-1706654096312-3e1143805e6a?w=500'], true),
  
  ('RM-SAM-ZF5-GRY', 'Samsung', 'Galaxy Z Fold 5', 25000000, 22000000, 0, 'percentage', '256GB', 'Grade A+', 
   ARRAY['https://images.unsplash.com/photo-1690565554777-7b37b11075c7?w=500'], true);
*/


-- =====================================================
-- 9. VERIFY SETUP
-- =====================================================

-- Show table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default,
  CASE 
    WHEN column_name = 'price' OR column_name = 'capital_price' OR column_name = 'discount_value'
    THEN numeric_precision || ',' || numeric_scale
    ELSE NULL
  END as precision
FROM information_schema.columns 
WHERE table_name = 'products'
ORDER BY ordinal_position;

-- Show indexes
SELECT 
  indexname, 
  indexdef 
FROM pg_indexes 
WHERE tablename = 'products'
ORDER BY indexname;

-- Show policies
SELECT 
  policyname,
  cmd,
  roles,
  qual
FROM pg_policies 
WHERE tablename = 'products';

-- Show row count
SELECT COUNT(*) as total_products FROM products;


-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- The products table is now ready with:
-- ✅ All columns (including multi-image support)
-- ✅ Flexible discounts (percentage or fixed)
-- ✅ Capital price field
-- ✅ Active/inactive toggle
-- ✅ All indexes for performance
-- ✅ RLS policies for security
-- ✅ Auto-updating updated_at timestamp
--
-- Next step: Set up Supabase Storage bucket
-- Run: storage-setup.sql
-- =====================================================
