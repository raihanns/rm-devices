'use client';

import { useState, useEffect, use } from 'react';
import ProductCard from '@/components/catalog/ProductCard';
import { createClient } from '@/lib/supabase';
import { Product, Brand, SortOption } from '@/types';

interface CatalogPageProps {
  searchParams: { brand?: string };
}

export default function CatalogPage({ searchParams }: CatalogPageProps) {
  const supabase = createClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<Brand>('All');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [isLoading, setIsLoading] = useState(true);

  // Read brand from URL query params
  useEffect(() => {
    const brandParam = searchParams?.brand;
    if (brandParam) {
      // Decode and set the brand filter
      const decodedBrand = decodeURIComponent(brandParam);
      if (decodedBrand === 'Apple' || decodedBrand === 'Samsung') {
        setSelectedBrand(decodedBrand as Brand);
      }
    }
  }, [searchParams?.brand]);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      let query = supabase
        .from('products')
        .select('*')
        .eq('is_active', true);

      const { data, error } = await query;

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  }

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => selectedBrand === 'All' || product.brand === selectedBrand)
    .sort((a, b) => {
      switch (sortOption) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'newest':
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gradient-mesh">
      {/* Header - Removed sticky to prevent collision with navbar */}
      <div className="bg-gradient-subtle/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Product Catalog
          </h1>
          <p className="text-gray-600 max-w-2xl text-lg">
            Browse our selection of premium mobile devices from Apple and Samsung.
            All devices come with quality guarantee.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="glass-card rounded-2xl p-5 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Brand Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2.5 block">
                Brand
              </label>
              <div className="flex space-x-2">
                {(['All', 'Apple', 'Samsung'] as Brand[]).map((brand) => (
                  <button
                    key={brand}
                    onClick={() => setSelectedBrand(brand)}
                    className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                      selectedBrand === brand
                        ? 'bg-gradient-to-r from-gray-900 to-gray-700 text-white shadow-lg transform scale-105'
                        : 'glass-input text-gray-700 hover:bg-white/80'
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2.5 block">
                Sort By
              </label>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="px-5 py-2.5 glass-input rounded-xl font-medium text-gray-700 focus:ring-2 focus:ring-gray-900/20 cursor-pointer"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredProducts.length}</span> products
          </p>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="glass-card rounded-2xl overflow-hidden"
              >
                <div className="aspect-square skeleton" />
                <div className="p-5 space-y-3">
                  <div className="h-4 skeleton rounded w-1/3" />
                  <div className="h-6 skeleton rounded w-3/4" />
                  <div className="flex space-x-2">
                    <div className="h-6 skeleton rounded w-16" />
                  </div>
                  <div className="h-8 skeleton rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 glass-card rounded-full flex items-center justify-center mx-auto mb-6">
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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters to find what you're looking for.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
