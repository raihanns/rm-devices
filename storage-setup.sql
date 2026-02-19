-- =====================================================
-- RM Devices - Storage Bucket Setup
-- =====================================================
-- Run this in Supabase SQL Editor AFTER creating the 
-- 'product-images' bucket manually in the Dashboard
-- =====================================================
-- MANUAL STEP REQUIRED:
-- 1. Go to Supabase Dashboard → Storage
-- 2. Click "New Bucket"
-- 3. Name: product-images
-- 4. Set to Public
-- 5. File size limit: 5242880 (5MB)
-- 6. Allowed MIME types: image/jpeg, image/png, image/webp
-- =====================================================

-- =====================================================
-- STORAGE RLS POLICIES
-- =====================================================

-- Allow public to view product images
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
CREATE POLICY "Public can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Allow authenticated users to upload product images
DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;
CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' AND 
  auth.role() = 'authenticated'
);

-- Allow authenticated users to delete product images
DROP POLICY IF EXISTS "Authenticated users can delete product images" ON storage.objects;
CREATE POLICY "Authenticated users can delete product images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images' AND 
  auth.role() = 'authenticated'
);


-- =====================================================
-- VERIFY STORAGE SETUP
-- =====================================================

-- Check if bucket exists
SELECT name, public 
FROM storage.buckets 
WHERE id = 'product-images';

-- Check policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage';


-- =====================================================
-- STORAGE SETUP COMPLETE
-- =====================================================
-- Users can now upload product images to Supabase Storage!
-- =====================================================
