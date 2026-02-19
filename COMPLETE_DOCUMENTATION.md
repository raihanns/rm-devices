# RM Devices - Complete Feature Documentation

**Project:** RM Devices Web Platform  
**Version:** 1.0  
**Last Updated:** 2026

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Getting Started](#getting-started)
4. [Database Setup](#database-setup)
5. [Authentication](#authentication)
6. [Product Management](#product-management)
7. [Multi-Image Upload](#multi-image-upload)
8. [Flexible Discounts](#flexible-discounts)
9. [CRUD Operations](#crud-operations)
10. [Bulk Upload](#bulk-upload)
11. [Troubleshooting](#troubleshooting)

---

## Project Overview

RM Devices is a specialized dropshipping platform for high-end mobile devices, focusing on Apple iPhone and Samsung Galaxy series. The website serves as a real-time digital catalog and management hub to sync supplier data with customer-facing listings.

### Key Features

- ✅ Public product catalog with filters
- ✅ Product detail pages with image galleries
- ✅ Admin dashboard with KPIs
- ✅ Complete CRUD operations for products
- ✅ Multi-image upload with Supabase Storage
- ✅ Flexible discounts (percentage or fixed amount)
- ✅ Bulk upload via Excel/CSV
- ✅ Active/Inactive product toggle
- ✅ Indonesian language (Bahasa Indonesia)
- ✅ Indonesian Rupiah currency
- ✅ Toast notifications
- ✅ Responsive design (mobile-first)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16+ (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL) |
| Storage | Supabase Storage |
| Authentication | Supabase Auth |
| Excel Processing | SheetJS (xlsx) |
| Notifications | react-hot-toast |
| Deployment | Vercel-ready |

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Supabase project created

### Installation

```bash
# Clone or navigate to project
cd rm-devices

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials
```

### Environment Variables

Create `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Database Setup

### Step 1: Run Database Migration

**Execute in Supabase SQL Editor:**

1. Open **Supabase Dashboard** → **SQL Editor**
2. Click **New Query**
3. Copy and paste the entire content of `database-migration.sql`
4. Click **Run** (or press Ctrl+Enter / Cmd+Enter)

This single file will:
- ✅ Create the `products` table with ALL columns
- ✅ Add all indexes for performance
- ✅ Set up RLS policies for security
- ✅ Create auto-update trigger for `updated_at`
- ✅ (Optional) Insert sample products

**What gets created:**

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `sku` | TEXT | Unique product code |
| `brand` | TEXT | Apple or Samsung |
| `model` | TEXT | Product model name |
| `price` | DECIMAL | Selling price (Rp) |
| `capital_price` | DECIMAL | Cost price (admin only) |
| `discount_value` | DECIMAL | Discount amount |
| `discount_type` | TEXT | 'percentage' or 'fixed' |
| `storage` | TEXT | Storage capacity |
| `condition` | TEXT | Product condition |
| `images` | TEXT[] | Array of image URLs |
| `is_active` | BOOLEAN | Visibility toggle |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

### Step 2: Create Storage Bucket

**Manual Setup:**

1. Go to **Supabase Dashboard** → **Storage**
2. Click **"New Bucket"**
3. Bucket name: `product-images`
4. Settings:
   - ✅ **Public bucket**
   - File size limit: `5242880` (5MB)
   - Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`

**Automated RLS Policies:**

Run the file: `storage-setup.sql`

Or see Step 3 below to run manually.

### Step 3: Set Storage RLS Policies

```sql
-- Allow public to view images
CREATE POLICY "Public can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' AND 
  auth.role() = 'authenticated'
);

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete product images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images' AND 
  auth.role() = 'authenticated'
);
```

### Step 4: Add Sample Products (Optional)

```sql
-- sample-products.sql
INSERT INTO products (sku, brand, model, price, capital_price, discount_value, discount_type, storage, condition, images, is_active) VALUES
  ('RM-APL-IP15P-BLK', 'Apple', 'iPhone 15 Pro', 19000000, 16500000, 5, 'percentage', '256GB', 'Brand New', 
   ARRAY['https://images.unsplash.com/photo-1696446702022-0af1fbb4227b?w=500'], true),
  ('RM-SAM-S24U-BLK', 'Samsung', 'Galaxy S24 Ultra', 22000000, 19500000, 10, 'percentage', '512GB', 'Brand New',
   ARRAY['https://images.unsplash.com/photo-1706654096324-1e900f934d2e?w=500'], true);
```

---

## Authentication

### Supabase Auth Setup

1. **Configure Authentication:**
   - Go to Supabase Dashboard → Authentication → Providers
   - Enable Email provider
   - Set Site URL: `http://localhost:3000`
   - Add Redirect URL: `http://localhost:3000/auth/callback`

2. **Create Admin User:**
   - Go to Authentication → Users
   - Click "Add user" → Create new user
   - Enter email and password

3. **Test Login:**
   - Visit `/admin`
   - Use credentials from step 2
   - Should redirect to `/admin/dashboard`

### Protected Routes

All `/admin/*` routes are protected by middleware. Unauthenticated users are redirected to `/admin`.

---

## Product Management

### Product Schema

```typescript
interface Product {
  id: string;
  sku: string;
  brand: 'Apple' | 'Samsung';
  model: string;
  price: number;              // Selling price (Rp)
  capital_price: number;      // Cost price (Rp, admin only)
  discount_value: number;     // Discount (percentage or fixed)
  discount_type: 'percentage' | 'fixed';
  storage: string;            // e.g., '256GB'
  condition: string;          // e.g., 'Brand New'
  images: string[];           // Array of image URLs
  is_active: boolean;         // Visibility toggle
  created_at?: string;
  updated_at?: string;
}
```

### Add New Product

1. Go to `/admin/products/new`
2. Fill in required fields:
   - SKU (unique identifier)
   - Brand (Apple/Samsung)
   - Model
   - Price (selling price in Rp)
   - Capital Price (cost in Rp)
   - Storage
   - Condition
3. **Upload Images:**
   - Drag & drop or click to upload
   - Multiple images supported
   - First image is cover
   - Reorder with arrows
4. **Set Discount (optional):**
   - Choose type: Percentage (%) or Fixed (Rp)
   - Enter value
5. Toggle "Aktif" to show/hide from catalog
6. Click "Buat Produk"

### Edit Product

1. Go to `/admin/products`
2. Click edit icon on any product
3. Modify fields as needed
4. Manage images (add/remove/reorder)
5. Click "Simpan Perubahan"

### Delete Product

1. Go to `/admin/products`
2. Click trash icon
3. Confirm deletion
4. Product permanently removed

### Toggle Active/Inactive

1. Go to `/admin/products`
2. Click status badge (Active/Inactive)
3. Status toggles instantly
4. Inactive products hidden from catalog

---

## Multi-Image Upload

### Features

- Upload multiple images per product
- Drag & drop support
- Automatic upload to Supabase Storage
- Reorder images (first is cover)
- Remove individual images
- Upload progress indicator
- File validation (max 5MB, images only)

### Image Specifications

- **Format:** JPG, PNG, WEBP
- **Size:** Max 5MB per image
- **Dimensions:** Min 800x800px recommended
- **Aspect Ratio:** 1:1 (square) recommended

### Product Card Display

- Shows first image as thumbnail
- Falls back to `image_url` for old products

### Product Detail Gallery

- Large main image
- Navigation arrows (previous/next)
- Thumbnail strip
- Image counter (e.g., "2 / 5")
- Click thumbnail to view

---

## Flexible Discounts

### Discount Types

**1. Percentage Discount**
```
Original Price: Rp 15,000,000
Discount: 10%
Final Price: Rp 13,500,000
Badge: "-10%"
```

**2. Fixed Amount Discount**
```
Original Price: Rp 15,000,000
Discount: Rp 1,000,000
Final Price: Rp 14,000,000
Badge: "-Rp 1.000.000"
```

### How to Set Discount

1. In Add/Edit Product form
2. Find "Diskon" section
3. Choose type:
   - **"Persen (%)"** - Percentage
   - **"Nominal (Rp)"** - Fixed amount
4. Enter value:
   - Percentage: `10` for 10%
   - Fixed: `100000` for Rp 100,000
5. Save product

### Display Logic

- Badge only shows when `discount_value > 0`
- No more "0%" appearing on products
- Catalog shows discounted price in red
- Original price shown with strikethrough

---

## CRUD Operations

### Create
- **Location:** `/admin/products/new`
- **Form:** Complete product form with all fields
- **Images:** Multi-image upload
- **Validation:** Required fields enforced

### Read
- **Admin List:** `/admin/products` - All products (active + inactive)
- **Public Catalog:** `/catalog` - Only active products
- **Detail Page:** `/products/[slug]` - Full product details

### Update
- **Location:** `/admin/products/[id]`
- **Form:** Pre-filled with existing data
- **Images:** Add/remove/reorder supported

### Delete
- **Location:** Admin products list
- **Confirmation:** Modal before deletion
- **Result:** Permanent removal

---

## Bulk Upload

### Download Template

1. Go to `/admin/upload`
2. Click "Download Template"
3. Excel file with headers downloaded

### Template Format

```csv
Brand,Model,SKU,Price,Capital_Price,Discount_Percentage,Discount_Type,Storage,Condition,Images
Apple,iPhone 15 Pro,RM-APL-IP15P-BLK,19000000,16500000,5,percentage,256GB,Brand New,"https://.../img1.jpg,https://.../img2.jpg"
Samsung,Galaxy S24 Ultra,RM-SAM-S24U-BLK,22000000,19500000,1000000,fixed,512GB,Brand New,"https://.../img1.jpg"
```

### Upload Process

1. Fill template with product data
2. **Images column:** Comma-separated URLs
3. Go to `/admin/upload`
4. Drag & drop or click to upload
5. Preview data
6. Click "Upload Now"
7. Redirects to products list

### Upsert Logic

- **Existing SKU:** Updates product
- **New SKU:** Creates new product

---

## Troubleshooting

### "Invalid login credentials"
- Verify email/password in Supabase Dashboard → Authentication → Users
- Ensure user is confirmed (check email if confirmations enabled)

### "Missing environment variables"
- Check `.env.local` exists with correct values
- Restart dev server after changing env vars

### "Could not find column 'images'"
- Run migration: `migration-add-images.sql`
- Refresh browser

### "Field precision" error on discount
- Run migration: `migration-fix-discount-precision.sql`
- Allows discounts up to Rp 99,999,999,999.99

### Images not uploading
- Verify `product-images` bucket exists
- Check bucket is set to public
- Verify RLS policies are set

### "Hostname not configured" for images
- Check `next.config.ts` has Supabase domain configured
- Restart dev server

### Product detail shows "Tidak Ditemukan"
- Ensure product exists in database
- Check `is_active = true`
- Verify model name matches URL slug

### Build fails with type errors
- Run `npm install` to ensure all dependencies installed
- Check TypeScript version matches project requirements

---

## API Reference

### Supabase Client

```typescript
import { createClient } from '@/lib/supabase';

const supabase = createClient();

// Fetch products
const { data } = await supabase
  .from('products')
  .select('*')
  .eq('is_active', true);

// Insert product
const { data } = await supabase
  .from('products')
  .insert([{ /* product data */ }]);

// Update product
const { data } = await supabase
  .from('products')
  .update({ /* fields */ })
  .eq('id', productId);

// Delete product
const { data } = await supabase
  .from('products')
  .delete()
  .eq('id', productId);

// Upload image
const { data } = await supabase.storage
  .from('product-images')
  .upload(fileName, file);
```

### Utility Functions

```typescript
import { formatRupiah, calculateDiscountedPrice, formatDiscount } from '@/lib/utils';

// Format currency
formatRupiah(15000000);  // "Rp 15.000.000"

// Calculate discounted price
calculateDiscountedPrice(15000000, 10, 'percentage');  // 13500000
calculateDiscountedPrice(15000000, 1000000, 'fixed');  // 14000000

// Format discount display
formatDiscount(10, 'percentage');  // "10%"
formatDiscount(1000000, 'fixed');  // "Rp 1.000.000"
```

---

## Project Structure

```
rm-devices/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── dashboard/      # KPI overview
│   │   │   ├── products/
│   │   │   │   ├── [id]/       # Edit product
│   │   │   │   ├── new/        # Add product
│   │   │   │   └── page.tsx    # Product list
│   │   │   ├── upload/         # Bulk upload
│   │   │   └── page.tsx        # Login
│   │   ├── catalog/            # Public catalog
│   │   ├── products/[slug]/    # Product detail
│   │   ├── testimonials/       # Testimonials
│   │   └── page.tsx            # Home
│   ├── components/
│   │   ├── admin/
│   │   │   ├── ImageUpload.tsx
│   │   │   ├── AdminSidebar.tsx
│   │   │   └── AdminLayout.tsx
│   │   ├── catalog/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductFilters.tsx
│   │   │   └── ImageGallery.tsx
│   │   └── ui/
│   │       ├── Navbar.tsx
│   │       └── Footer.tsx
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── utils.ts
│   │   └── translations.ts
│   ├── types/
│   │   └── index.ts
│   └── middleware.ts          # Route protection
├── migrations/                 # SQL migrations
├── .env.local                  # Environment variables
└── next.config.ts              # Next.js config
```

---

## Testing Checklist

### Authentication
- [ ] Create admin user in Supabase
- [ ] Login at `/admin`
- [ ] Access protected dashboard
- [ ] Sign out works
- [ ] Navbar shows correct state

### Products - Admin
- [ ] View product list
- [ ] Search products
- [ ] Add new product
- [ ] Upload multiple images
- [ ] Edit product
- [ ] Delete product
- [ ] Toggle active/inactive
- [ ] Set percentage discount
- [ ] Set fixed discount

### Products - Catalog
- [ ] View active products only
- [ ] Filter by brand
- [ ] Sort by price
- [ ] Click product to view detail
- [ ] Image gallery works
- [ ] Discount badge shows correctly
- [ ] No badge when discount = 0

### Bulk Upload
- [ ] Download template
- [ ] Fill with data
- [ ] Upload file
- [ ] Preview shows correctly
- [ ] Upload completes
- [ ] Products appear in list

### Images
- [ ] Upload multiple images
- [ ] Reorder images
- [ ] Remove image
- [ ] View in gallery
- [ ] Navigate gallery

---

## Support

For questions or issues:
1. Check this documentation
2. Review Supabase Dashboard logs
3. Check browser console for errors
4. Verify database migrations ran successfully

---

**Last Updated:** 2026  
**Version:** 1.0  
**Build Status:** ✅ Success
