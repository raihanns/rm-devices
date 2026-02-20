'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product, ConditionColors } from '@/types';
import { formatRupiah, calculateDiscountedPrice, formatDiscount } from '@/lib/utils';
import { createClient } from '@/lib/supabase';

interface ProductCardProps {
  product: Product;
}

// Simple gadget icon component
function GadgetIcon({ className = "w-20 h-20" }: { className?: string }) {
  return (
    <div className={`${className} flex items-center justify-center`}>
      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {/* Smartphone/Tablet shape */}
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" strokeWidth="1.5" />
        {/* Screen */}
        <rect x="7" y="4" width="10" height="16" rx="1" strokeWidth="1" className="opacity-50" />
        {/* Home button */}
        <circle cx="12" cy="19" r="1" strokeWidth="1" />
      </svg>
    </div>
  );
}

// Get image URL (handles both storage paths and full URLs)
function getProductImageUrl(product: Product): { url: string; isLocal: boolean } | null {
  const imageUrl = product.images?.[0] || product.image_url;
  
  if (!imageUrl) return null;
  
  // Check if it's a storage path (starts with /)
  const isLocal = imageUrl.startsWith('/');
  
  if (isLocal) {
    // Convert storage path to public URL
    const supabase = createClient();
    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(imageUrl.replace(/^\//, ''));
    
    return { url: data?.publicUrl || imageUrl, isLocal: true };
  }
  
  // Return external URL as-is
  return { url: imageUrl, isLocal: false };
}

export default function ProductCard({ product }: ProductCardProps) {
  const discountValue = product.discount_value || 0;
  const discountType = product.discount_type || 'percentage';
  
  const discountedPrice = discountValue > 0
    ? calculateDiscountedPrice(product.price, discountValue, discountType)
    : product.price;

  // Only show discount if value is greater than 0
  const hasDiscount = discountValue > 0;

  // Get color based on condition
  const conditionColor = ConditionColors[product.condition as keyof typeof ConditionColors]
    || 'bg-gray-100 text-gray-800';

  // Generate consistent slug from model name
  const productSlug = product.model.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  // Get image URL
  const imageData = getProductImageUrl(product);
  const hasImage = !!imageData?.url;
  const imageUrl = imageData?.url || '';

  return (
    <Link href={`/products/${productSlug}`} className="group">
      <div className="glass-card rounded-2xl overflow-hidden glass-card-hover h-full flex flex-col">
        {/* Image/Icon Container */}
        <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          {hasImage ? (
            <Image
              src={imageUrl}
              alt={`${product.brand} ${product.model}`}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <GadgetIcon className="w-24 h-24" />
            </div>
          )}

          {/* Discount Badge - Only show if discount > 0 */}
          {hasDiscount && (
            <div className="absolute top-3 right-3 animate-scale-in">
              <span className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full shadow-lg">
                -{formatDiscount(discountValue, discountType)}
              </span>
            </div>
          )}

          {/* Condition Badge with Color */}
          <div className="absolute top-3 left-3 animate-scale-in">
            <span className={`px-3 py-1.5 backdrop-blur-md text-xs font-semibold rounded-full shadow-md ${conditionColor}`}>
              {product.condition}
            </span>
          </div>

          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4">
              <span className="inline-flex items-center px-4 py-2 glass-dark text-white text-sm font-medium rounded-lg">
                View Details
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Brand */}
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            {product.brand}
          </p>

          {/* Model */}
          <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-1">
            {product.model}
          </h3>

          {/* Specs */}
          <div className="flex items-center space-x-2 mb-4">
            <span className="px-2.5 py-1 glass-card text-gray-600 text-xs rounded-lg font-medium">
              {product.storage}
            </span>
          </div>

          {/* Price */}
          <div className="mt-auto flex items-baseline space-x-2">
            {hasDiscount ? (
              <>
                <p className="text-xl font-bold text-red-600">
                  {formatRupiah(discountedPrice)}
                </p>
                <p className="text-sm text-gray-400 line-through">
                  {formatRupiah(product.price)}
                </p>
              </>
            ) : (
              <p className="text-xl font-bold text-gray-900">
                {formatRupiah(product.price)}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
