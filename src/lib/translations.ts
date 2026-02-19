// Translation types and dictionaries
export type Language = 'id' | 'en';

export interface Translation {
  nav: {
    home: string;
    catalog: string;
    testimonials: string;
    admin: string;
    dashboard: string;
    signOut: string;
    signIn: string;
  };
  home: {
    heroTitle: string;
    heroSubtitle: string;
    browseCatalog: string;
    readTestimonials: string;
    premiumBrands: string;
    whyChooseUs: string;
    qualityGuaranteed: string;
    competitivePricing: string;
    fastUpdates: string;
  };
  catalog: {
    title: string;
    subtitle: string;
    showing: string;
    products: string;
    noProducts: string;
    adjustFilters: string;
    brand: string;
    all: string;
    sortBy: string;
    newest: string;
    priceLowHigh: string;
    priceHighLow: string;
  };
  admin: {
    dashboard: string;
    products: string;
    bulkUpload: string;
    addProduct: string;
    editProduct: string;
    deleteProduct: string;
    saveChanges: string;
    cancel: string;
    creating: string;
    saving: string;
    signOut: string;
    backToSite: string;
    totalProducts: string;
    totalBrands: string;
    lastUpdate: string;
    quickActions: string;
    manageProducts: string;
    search: string;
    sku: string;
    model: string;
    price: string;
    condition: string;
    status: string;
    actions: string;
    active: string;
    inactive: string;
  };
  product: {
    brandNew: string;
    gradeAPlus: string;
    gradeA: string;
    gradeB: string;
    refurbished: string;
  };
  auth: {
    adminLogin: string;
    email: string;
    password: string;
    signIn: string;
    signingIn: string;
    backToHome: string;
  };
  notifications: {
    productCreated: string;
    productUpdated: string;
    productDeleted: string;
    uploadSuccess: string;
    error: string;
  };
}

export const translations: Record<Language, Translation> = {
  id: {
    nav: {
      home: 'Beranda',
      catalog: 'Katalog',
      testimonials: 'Testimoni',
      admin: 'Admin',
      dashboard: 'Dasbor',
      signOut: 'Keluar',
      signIn: 'Masuk',
    },
    home: {
      heroTitle: 'Teknologi Premium,\nTerkirim.',
      heroSubtitle: 'Sumber terpercaya untuk perangkat mobile high-end dari Apple dan Samsung. Kualitas terjamin, harga kompetitif.',
      browseCatalog: 'Lihat Katalog',
      readTestimonials: 'Baca Testimoni',
      premiumBrands: 'Merek Premium',
      whyChooseUs: 'Mengapa Memilih RM Devices?',
      qualityGuaranteed: 'Kualitas Terjamin',
      competitivePricing: 'Harga Kompetitif',
      fastUpdates: 'Update Cepat',
    },
    catalog: {
      title: 'Katalog Produk',
      subtitle: 'Jelajahi pilihan perangkat mobile premium dari Apple dan Samsung. Semua perangkat datang dengan jaminan kualitas.',
      showing: 'Menampilkan',
      products: 'produk',
      noProducts: 'Tidak ada produk ditemukan',
      adjustFilters: 'Coba sesuaikan filter Anda',
      brand: 'Merek',
      all: 'Semua',
      sortBy: 'Urutkan',
      newest: 'Terbaru',
      priceLowHigh: 'Harga: Rendah ke Tinggi',
      priceHighLow: 'Harga: Tinggi ke Rendah',
    },
    admin: {
      dashboard: 'Dasbor',
      products: 'Produk',
      bulkUpload: 'Upload Massal',
      addProduct: 'Tambah Produk',
      editProduct: 'Edit Produk',
      deleteProduct: 'Hapus Produk',
      saveChanges: 'Simpan Perubahan',
      cancel: 'Batal',
      creating: 'Membuat...',
      saving: 'Menyimpan...',
      signOut: 'Keluar',
      backToSite: 'Kembali ke Situs',
      totalProducts: 'Total Produk',
      totalBrands: 'Total Merek',
      lastUpdate: 'Update Terakhir',
      quickActions: 'Aksi Cepat',
      manageProducts: 'Kelola Produk',
      search: 'Cari berdasarkan nama, SKU, atau merek...',
      sku: 'SKU',
      model: 'Model',
      price: 'Harga',
      condition: 'Kondisi',
      status: 'Status',
      actions: 'Aksi',
      active: 'Aktif',
      inactive: 'Nonaktif',
    },
    product: {
      brandNew: 'Baru',
      gradeAPlus: 'Grade A+ (Mint)',
      gradeA: 'Grade A',
      gradeB: 'Grade B',
      refurbished: 'Refurbished',
    },
    auth: {
      adminLogin: 'Login Admin',
      email: 'Alamat Email',
      password: 'Kata Sandi',
      signIn: 'Masuk',
      signingIn: 'Masuk...',
      backToHome: 'Kembali ke Beranda',
    },
    notifications: {
      productCreated: 'Produk berhasil dibuat!',
      productUpdated: 'Produk berhasil diperbarui!',
      productDeleted: 'Produk berhasil dihapus!',
      uploadSuccess: 'Upload berhasil!',
      error: 'Terjadi kesalahan. Silakan coba lagi.',
    },
  },
  en: {
    nav: {
      home: 'Home',
      catalog: 'Catalog',
      testimonials: 'Testimonials',
      admin: 'Admin',
      dashboard: 'Dashboard',
      signOut: 'Sign Out',
      signIn: 'Sign In',
    },
    home: {
      heroTitle: 'Premium Tech,\nDelivered.',
      heroSubtitle: 'Your trusted source for high-end mobile devices from Apple and Samsung. Quality guaranteed, competitive prices.',
      browseCatalog: 'Browse Catalog',
      readTestimonials: 'Read Testimonials',
      premiumBrands: 'Premium Brands',
      whyChooseUs: 'Why Choose RM Devices?',
      qualityGuaranteed: 'Quality Guaranteed',
      competitivePricing: 'Competitive Pricing',
      fastUpdates: 'Fast Updates',
    },
    catalog: {
      title: 'Product Catalog',
      subtitle: 'Browse our selection of premium mobile devices from Apple and Samsung. All devices come with quality guarantee.',
      showing: 'Showing',
      products: 'products',
      noProducts: 'No products found',
      adjustFilters: 'Try adjusting your filters',
      brand: 'Brand',
      all: 'All',
      sortBy: 'Sort By',
      newest: 'Newest',
      priceLowHigh: 'Price: Low to High',
      priceHighLow: 'Price: High to Low',
    },
    admin: {
      dashboard: 'Dashboard',
      products: 'Products',
      bulkUpload: 'Bulk Upload',
      addProduct: 'Add Product',
      editProduct: 'Edit Product',
      deleteProduct: 'Delete Product',
      saveChanges: 'Save Changes',
      cancel: 'Cancel',
      creating: 'Creating...',
      saving: 'Saving...',
      signOut: 'Sign Out',
      backToSite: 'Back to Site',
      totalProducts: 'Total Products',
      totalBrands: 'Total Brands',
      lastUpdate: 'Last Update',
      quickActions: 'Quick Actions',
      manageProducts: 'Manage Products',
      search: 'Search by name, SKU, or brand...',
      sku: 'SKU',
      model: 'Model',
      price: 'Price',
      condition: 'Condition',
      status: 'Status',
      actions: 'Actions',
      active: 'Active',
      inactive: 'Inactive',
    },
    product: {
      brandNew: 'Brand New',
      gradeAPlus: 'Grade A+ (Mint)',
      gradeA: 'Grade A',
      gradeB: 'Grade B',
      refurbished: 'Refurbished',
    },
    auth: {
      adminLogin: 'Admin Login',
      email: 'Email Address',
      password: 'Password',
      signIn: 'Sign In',
      signingIn: 'Signing in...',
      backToHome: 'Back to Home',
    },
    notifications: {
      productCreated: 'Product created successfully!',
      productUpdated: 'Product updated successfully!',
      productDeleted: 'Product deleted successfully!',
      uploadSuccess: 'Upload successful!',
      error: 'An error occurred. Please try again.',
    },
  },
};

// Default language is Indonesian
export const defaultLanguage: Language = 'id';

// Get translation helper
export function t(lang: Language = defaultLanguage): Translation {
  return translations[lang] || translations.id;
}
