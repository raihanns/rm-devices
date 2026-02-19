'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product, ConditionColors } from '@/types';
import { formatRupiah, calculateDiscountedPrice, formatDiscount } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
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
    .replace(/[^a-z0-9]+/g, '-')  // Replace non-alphanumeric with hyphen
    .replace(/^-|-$/g, '');       // Remove leading/trailing hyphens

  // Get first image or placeholder
  const imageUrl = product.images?.[0] || product.image_url || '/placeholder-product.png';

  return (
    <Link href={`/products/${productSlug}`} className="group">
      <div className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-300">
        {/* Image Container */}
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          <Image
            src={imageUrl}
            alt={`${product.brand} ${product.model}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />

          {/* Discount Badge - Only show if discount > 0 */}
          {hasDiscount && (
            <div className="absolute top-3 right-3">
              <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                -{formatDiscount(discountValue, discountType)}
              </span>
            </div>
          )}

          {/* Condition Badge with Color */}
          <div className="absolute top-3 left-3">
            <span className={`px-3 py-1 backdrop-blur-sm text-xs font-semibold rounded-full ${conditionColor}`}>
              {product.condition}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Brand */}
          <p className="text-sm text-gray-500 font-medium mb-1">{product.brand}</p>
          
          {/* Model */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
            {product.model}
          </h3>

          {/* Specs */}
          <div className="flex items-center space-x-2 mb-3">
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
              {product.storage}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              {hasDiscount ? (
                <>
                  <p className="text-sm text-gray-400 line-through">
                    {formatRupiah(product.price)}
                  </p>
                  <p className="text-xl font-bold text-red-600">
                    {formatRupiah(discountedPrice)}
                  </p>
                </>
              ) : (
                <p className="text-xl font-bold text-gray-900">
                  {formatRupiah(product.price)}
                </p>
              )}
            </div>
            <button className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors opacity-0 group-hover:opacity-100">
              Lihat Detail
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
