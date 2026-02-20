'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { t } from '@/lib/translations';
import ImageUpload from '@/components/admin/ImageUpload';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();
  const lang = t('id');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    sku: '',
    brand: 'Apple',
    model: '',
    price: '',
    capital_price: '',
    discount_value: '',
    discount_type: 'percentage' as 'percentage' | 'fixed',
    storage: '',
    condition: '',
    images: [] as string[],
    is_active: true,
  });

  useEffect(() => {
    async function fetchProduct() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;
        if (!data) {
          setError('Produk tidak ditemukan');
          return;
        }

        setFormData({
          sku: data.sku,
          brand: data.brand,
          model: data.model,
          price: data.price.toString(),
          capital_price: data.capital_price?.toString() || '0',
          discount_value: data.discount_value?.toString() || '0',
          discount_type: data.discount_type || 'percentage',
          storage: data.storage,
          condition: data.condition,
          images: data.images || [],
          is_active: data.is_active ?? true,
        });
      } catch (err: any) {
        toast.error(err.message || 'Gagal memuat produk');
        setError(err.message || 'Gagal memuat produk');
      } finally {
        setIsLoading(false);
      }
    }

    fetchProduct();
  }, [params.id, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('products')
        .update({
          sku: formData.sku,
          brand: formData.brand,
          model: formData.model,
          price: parseFloat(formData.price) || 0,
          capital_price: parseFloat(formData.capital_price) || 0,
          discount_value: parseFloat(formData.discount_value) || 0,
          discount_type: formData.discount_type,
          storage: formData.storage,
          condition: formData.condition,
          images: formData.images,
          is_active: formData.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq('id', params.id);

      if (error) throw error;

      toast.success(lang.notifications.productUpdated);
      router.push('/admin/products');
    } catch (err: any) {
      toast.error(err.message || lang.notifications.error);
      setError(err.message || 'Gagal memperbarui produk');
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Produk</h1>
          <p className="text-gray-600 mt-1">Perbarui informasi produk</p>
        </div>
        <Link
          href="/admin/products"
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Batal
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SKU */}
          <div>
            <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-2">
              SKU *
            </label>
            <input
              type="text"
              id="sku"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              required
              placeholder="RM-APL-IP15P-BLK"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Brand */}
          <div>
            <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">
              Merek *
            </label>
            <select
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
            >
              <option value="Apple">Apple</option>
              <option value="Samsung">Samsung</option>
            </select>
          </div>

          {/* Model */}
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
              Model *
            </label>
            <input
              type="text"
              id="model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              required
              placeholder="iPhone 15 Pro"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Price (Customer) */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Harga Jual (Rp) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="1"
              placeholder="15000000"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Capital Price (Admin Only) */}
          <div>
            <label htmlFor="capital_price" className="block text-sm font-medium text-gray-700 mb-2">
              Harga Modal (Rp) *
            </label>
            <input
              type="number"
              id="capital_price"
              name="capital_price"
              value={formData.capital_price}
              onChange={handleChange}
              required
              min="0"
              step="1"
              placeholder="13000000"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
            />
            <p className="text-xs text-gray-500 mt-1">Harga modal hanya terlihat oleh admin</p>
          </div>

          {/* Discount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Diskon
            </label>
            <div className="flex space-x-2 mb-2">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, discount_type: 'percentage' }))}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  formData.discount_type === 'percentage'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Persen (%)
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, discount_type: 'fixed' }))}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  formData.discount_type === 'fixed'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Nominal (Rp)
              </button>
            </div>
            <input
              type="number"
              id="discount_value"
              name="discount_value"
              value={formData.discount_value}
              onChange={handleChange}
              min="0"
              step="1"
              placeholder={formData.discount_type === 'percentage' ? '10' : '100000'}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.discount_type === 'percentage' 
                ? 'Masukkan 0 jika tidak ada diskon' 
                : 'Masukkan nominal diskon dalam Rupiah'}
            </p>
          </div>

          {/* Storage */}
          <div>
            <label htmlFor="storage" className="block text-sm font-medium text-gray-700 mb-2">
              Penyimpanan *
            </label>
            <input
              type="text"
              id="storage"
              name="storage"
              value={formData.storage}
              onChange={handleChange}
              required
              placeholder="256GB"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Condition */}
          <div>
            <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-2">
              Kondisi *
            </label>
            <select
              id="condition"
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
            >
              <option value="">Pilih kondisi</option>
              <option value="Brand New">Baru</option>
              <option value="Grade A+">Grade A+ (Mint)</option>
              <option value="Grade A">Grade A</option>
              <option value="Grade B">Grade B</option>
              <option value="Refurbished">Refurbished</option>
            </select>
          </div>

          {/* Images Upload */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gambar Produk
            </label>
            <ImageUpload
              onImagesChange={(urls) => setFormData(prev => ({ ...prev, images: urls }))}
              existingImages={formData.images}
            />
            <p className="text-xs text-gray-500 mt-2">
              Upload beberapa gambar untuk ditampilkan di halaman detail produk
            </p>
          </div>

          {/* Is Active */}
          <div className="md:col-span-2">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="w-5 h-5 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
              />
              <span className="text-sm font-medium text-gray-700">
                Aktif (terlihat di katalog)
              </span>
            </label>
            <p className="text-sm text-gray-500 mt-1 ml-8">
              Hapus centang untuk menyembunyikan produk dari katalog publik
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Link
            href="/admin/products"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
    </div>
  );
}
