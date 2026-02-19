'use client';

import { Brand, SortOption } from '@/types';

interface ProductFiltersProps {
  selectedBrand: Brand;
  onBrandChange: (brand: Brand) => void;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
}

export default function ProductFilters({
  selectedBrand,
  onBrandChange,
  sortOption,
  onSortChange,
}: ProductFiltersProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand Filter */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Brand
          </label>
          <div className="flex space-x-2">
            {(['All', 'Apple', 'Samsung'] as Brand[]).map((brand) => (
              <button
                key={brand}
                onClick={() => onBrandChange(brand)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedBrand === brand
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Sort By
          </label>
          <select
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 cursor-pointer"
          >
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>
    </div>
  );
}
