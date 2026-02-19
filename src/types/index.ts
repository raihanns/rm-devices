export interface Product {
  id: string;
  sku: string;
  brand: string;
  model: string;
  price: number;              // Customer-facing price (selling price)
  capital_price: number;      // Cost price (for admin only)
  discount_value?: number;    // Discount value (percentage or fixed amount)
  discount_type?: 'percentage' | 'fixed';  // Type of discount
  storage: string;
  condition: string;
  image_url?: string;         // Legacy - for backward compatibility
  images?: string[];          // Array of image URLs (new)
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Testimonial {
  id: string;
  customer_name: string;
  rating: number;
  comment: string;
  date: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalBrands: number;
  lastUpdate: string | null;
}

export type Brand = 'Apple' | 'Samsung' | 'All';

export type SortOption = 'price-low' | 'price-high' | 'newest';

// Condition colors for catalog
export type ConditionType = 'Brand New' | 'Grade A+' | 'Grade A' | 'Grade B' | 'Refurbished';

export const ConditionColors: Record<ConditionType, string> = {
  'Brand New': 'bg-green-100 text-green-800',
  'Grade A+': 'bg-blue-100 text-blue-800',
  'Grade A': 'bg-purple-100 text-purple-800',
  'Grade B': 'bg-yellow-100 text-yellow-800',
  'Refurbished': 'bg-gray-100 text-gray-800',
};
