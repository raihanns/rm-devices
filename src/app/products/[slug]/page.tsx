'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { Product, ConditionColors } from '@/types';
import { formatRupiah, calculateDiscountedPrice, formatDiscount } from '@/lib/utils';
import ImageGallery from '@/components/catalog/ImageGallery';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const supabase = createClient();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        // Fetch all active products and find matching one
        // Note: For better performance with many products, add a 'slug' column to the database
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true);

        if (error) throw error;

        // Find matching product by slug (model name converted to slug)
        const foundProduct = data?.find(
          (p) => {
            const productSlug = p.model.toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')  // Replace non-alphanumeric with hyphen
              .replace(/^-|-$/g, '');       // Remove leading/trailing hyphens
            return productSlug === slug;
          }
        );

        setProduct(foundProduct || null);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProduct();
  }, [slug, supabase]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!product) {
    // Fetch all products to show some suggestions
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Produk Tidak Ditemukan
          </h1>
          <p className="text-gray-600 mb-6">
            Produk dengan slug "{slug}" tidak ada atau telah dihapus.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm font-semibold text-yellow-900 mb-2">Kemungkinan penyebab:</p>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Produk belum ditambahkan di database</li>
              <li>• Produk tidak aktif (is_active = false)</li>
              <li>• Nama model tidak cocok dengan URL slug</li>
            </ul>
          </div>
          <Link
            href="/catalog"
            className="inline-flex px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
          >
            Kembali ke Katalog
          </Link>
        </div>
      </div>
    );
  }

  const discountValue = product.discount_value || 0;
  const discountType = product.discount_type || 'percentage';
  
  const discountedPrice = discountValue > 0
    ? calculateDiscountedPrice(product.price, discountValue, discountType)
    : product.price;
  
  const hasDiscount = discountValue > 0;
  const conditionColor = ConditionColors[product.condition as keyof typeof ConditionColors] 
    || 'bg-gray-100 text-gray-800';

  return (
    <div className="min-h-screen bg-gradient-mesh">
      {/* Breadcrumb - Removed sticky to prevent collision with navbar */}
      <div className="bg-gradient-subtle/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700 transition-colors">
              Beranda
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/catalog" className="text-gray-500 hover:text-gray-700 transition-colors">
              Katalog
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{product.model}</span>
          </nav>
        </div>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <ImageGallery
              images={product.images?.filter(Boolean) || (product.image_url ? [product.image_url] : [])}
              productName={product.model}
            />
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-2">
                {product.brand}
              </p>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {product.model}
              </h1>
              
              {/* Price */}
              <div className="flex items-baseline space-x-3">
                {hasDiscount ? (
                  <>
                    <p className="text-3xl font-bold text-red-600">
                      {formatRupiah(discountedPrice)}
                    </p>
                    <p className="text-xl text-gray-400 line-through">
                      {formatRupiah(product.price)}
                    </p>
                  </>
                ) : (
                  <p className="text-3xl font-bold text-gray-900">
                    {formatRupiah(product.price)}
                  </p>
                )}
              </div>
            </div>

            {/* Specs */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Spesifikasi
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between py-2.5 border-b border-gray-100">
                  <span className="text-gray-600">SKU</span>
                  <span className="font-medium text-gray-900">{product.sku}</span>
                </div>
                <div className="flex justify-between py-2.5 border-b border-gray-100">
                  <span className="text-gray-600">Penyimpanan</span>
                  <span className="font-medium text-gray-900">{product.storage}</span>
                </div>
                <div className="flex justify-between py-2.5 border-b border-gray-100">
                  <span className="text-gray-600">Kondisi</span>
                  <span className="font-medium text-gray-900">{product.condition}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-gray-600">Merek</span>
                  <span className="font-medium text-gray-900">{product.brand}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={`https://wa.me/6281234567890?text=Halo%20RM%20Devices,%20saya%20tertarik%20dengan%20${encodeURIComponent(product.model)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex-1 px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-2xl font-semibold overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 ease-out text-center"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <svg className="w-6 h-6 mr-2 group-hover:rotate-12 transition-transform duration-500 ease-out" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Hubungi via WhatsApp
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out" />
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out" />
              </a>
              <Link
                href="/catalog"
                className="px-8 py-4 glass-card text-gray-900 rounded-2xl font-semibold hover:bg-white/90 transition-all duration-300 text-center"
              >
                Kembali ke Katalog
              </Link>
            </div>

            {/* Additional Info */}
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <div className="flex items-start space-x-3">
                <svg
                  className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="font-semibold text-gray-900">Kualitas Terjamin</p>
                  <p className="text-sm text-gray-600">
                    Setiap perangkat diperiksa dengan teliti sebelum dikirim.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <svg
                  className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <div>
                  <p className="font-semibold text-gray-900">Pengiriman Cepat</p>
                  <p className="text-sm text-gray-600">
                    Pengiriman cepat dan aman sampai ke depan pintu Anda.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
