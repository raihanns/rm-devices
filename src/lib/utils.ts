// Currency formatting for Indonesian Rupiah
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Calculate discounted price (supports percentage or fixed amount)
export function calculateDiscountedPrice(
  originalPrice: number, 
  discountValue: number,
  discountType: 'percentage' | 'fixed' = 'percentage'
): number {
  if (discountType === 'percentage') {
    return originalPrice * (1 - discountValue / 100);
  } else {
    // Fixed amount discount
    return Math.max(0, originalPrice - discountValue);
  }
}

// Format discount display
export function formatDiscount(discountValue: number, discountType: 'percentage' | 'fixed'): string {
  if (discountType === 'percentage') {
    return `${discountValue.toFixed(0)}%`;
  } else {
    return formatRupiah(discountValue);
  }
}

// Get discount label
export function getDiscountLabel(discountValue?: number, discountType?: 'percentage' | 'fixed'): string {
  if (!discountValue || discountValue <= 0) return '';
  return formatDiscount(discountValue, discountType || 'percentage');
}
