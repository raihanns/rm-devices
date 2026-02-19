'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';
import { createClient } from '@/lib/supabase';
import { Product } from '@/types';
import toast from 'react-hot-toast';
import { formatRupiah } from '@/lib/utils';

export default function UploadPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    message: string;
    count?: number;
  } | null>(null);
  const [previewData, setPreviewData] = useState<Product[]>([]);

  const processFile = useCallback((file: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json: Partial<Product>[] = XLSX.utils.sheet_to_json(worksheet);

        // Validate and transform data
        const products: Product[] = json.map((row: any, index) => ({
          id: `temp-${index}`,
          sku: row.SKU || `SKU-${index}`,
          brand: row.Brand || 'Unknown',
          model: row.Model || 'Unknown',
          price: Number(row.Price) || 0,
          capital_price: Number(row.Capital_Price) || 0,
          discount_percentage: Number(row.Discount_Percentage) || 0,
          storage: row.Storage || 'N/A',
          condition: row.Condition || 'Unknown',
          images: row.Images 
            ? row.Images.split(',').map((url: string) => url.trim()).filter((url: string) => url)
            : row.Image_URL 
              ? [row.Image_URL] 
              : [],
          is_active: true,
        }));

        setPreviewData(products);
        setUploadResult(null);
      } catch (error) {
        setUploadResult({
          success: false,
          message: 'Error parsing file. Please check the format.',
        });
      }
    };

    reader.onerror = () => {
      setUploadResult({
        success: false,
        message: 'Error reading file.',
      });
    };

    reader.readAsBinaryString(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (
        file &&
        (file.name.endsWith('.xlsx') ||
          file.name.endsWith('.xls') ||
          file.name.endsWith('.csv'))
      ) {
        processFile(file);
      } else {
        setUploadResult({
          success: false,
          message: 'Please upload a valid Excel (.xlsx, .xls) or CSV file.',
        });
      }
    },
    [processFile]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleUpload = async () => {
    setUploading(true);

    try {
      // Prepare data for upsert (update if SKU exists, insert if new)
      const productsToInsert = previewData.map(({ id, ...rest }) => rest);

      // Insert or update products based on SKU
      for (const product of productsToInsert) {
        // Check if SKU exists
        const { data: existing } = await supabase
          .from('products')
          .select('id')
          .eq('sku', product.sku)
          .single();

        if (existing) {
          // Update existing product
          await supabase
            .from('products')
            .update({
              ...product,
              updated_at: new Date().toISOString(),
            })
            .eq('sku', product.sku);
        } else {
          // Insert new product
          await supabase.from('products').insert([product]);
        }
      }

      toast.success(`Berhasil upload ${previewData.length} produk!`);
      setUploadResult({
        success: true,
        message: `Successfully uploaded ${previewData.length} products!`,
        count: previewData.length,
      });
      setPreviewData([]);

      // Force refresh by navigating with a timestamp query param
      router.push('/admin/products?refresh=' + Date.now());
    } catch (error: any) {
      toast.error(`Upload gagal: ${error.message}`);
      setUploadResult({
        success: false,
        message: `Upload failed: ${error.message}`,
      });
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    // Create template data with new fields
    const template = [
      {
        Brand: 'Apple',
        Model: 'iPhone 15 Pro',
        SKU: 'RM-APL-IP15P-BLK',
        Price: 15000000,
        Capital_Price: 13000000,
        Discount_Percentage: 5,
        Storage: '256GB',
        Condition: 'Brand New',
        Images: 'https://example.com/image1.jpg,https://example.com/image2.jpg,https://example.com/image3.jpg',
      },
      {
        Brand: 'Samsung',
        Model: 'Galaxy S24 Ultra',
        SKU: 'RM-SAM-S24U-BLK',
        Price: 18000000,
        Capital_Price: 16000000,
        Discount_Percentage: 0,
        Storage: '512GB',
        Condition: 'Grade A+',
        Images: 'https://example.com/s24u-1.jpg,https://example.com/s24u-2.jpg',
      },
    ];

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');

    // Download file
    XLSX.writeFile(workbook, 'RM_Devices_Upload_Template.xlsx');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bulk Upload</h1>
        <p className="text-gray-600 mt-1">
          Upload products via Excel or CSV file
        </p>
      </div>

      {/* Download Template */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <svg
            className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900">
              Need a template?
            </h3>
            <p className="text-sm text-blue-700 mt-1">
              Download our Excel template to ensure your data is formatted correctly.
            </p>
            <button
              onClick={downloadTemplate}
              className="mt-3 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Template
            </button>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
          isDragging
            ? 'border-gray-900 bg-gray-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Drop your file here
        </h3>
        <p className="text-gray-600 mb-4">
          or click to browse (Excel .xlsx, .xls, or CSV)
        </p>
        <label className="inline-flex px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium cursor-pointer">
          Select File
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileInput}
            className="hidden"
          />
        </label>
      </div>

      {/* Upload Result */}
      {uploadResult && (
        <div
          className={`rounded-xl p-4 ${
            uploadResult.success
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          <div className="flex items-start space-x-3">
            <svg
              className={`w-6 h-6 flex-shrink-0 mt-0.5 ${
                uploadResult.success ? 'text-green-600' : 'text-red-600'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {uploadResult.success ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              )}
            </svg>
            <div className="flex-1">
              <p
                className={`font-semibold ${
                  uploadResult.success ? 'text-green-900' : 'text-red-900'
                }`}
              >
                {uploadResult.message}
              </p>
              {uploadResult.count && (
                <p className="text-sm text-green-700 mt-1">
                  {uploadResult.count} products ready to be imported.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Preview */}
      {previewData.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">
              Preview ({previewData.length} products)
            </h3>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Uploading...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Upload Now
                </>
              )}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">
                    SKU
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">
                    Brand
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">
                    Model
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">
                    Price
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">
                    Condition
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {previewData.slice(0, 5).map((product, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {product.sku}
                      </code>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {product.brand}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {product.model}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {formatRupiah(product.price)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                        {product.condition}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {previewData.length > 5 && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-center text-sm text-gray-600">
                ... and {previewData.length - 5} more products
              </div>
            )}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">
          How to upload products
        </h3>
        <ol className="space-y-3">
          <li className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-semibold">
              1
            </span>
            <p className="text-gray-600 pt-0.5">
              Download the template file to ensure correct formatting
            </p>
          </li>
          <li className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-semibold">
              2
            </span>
            <p className="text-gray-600 pt-0.5">
              Fill in your product data in Excel or Google Sheets
            </p>
          </li>
          <li className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-semibold">
              3
            </span>
            <p className="text-gray-600 pt-0.5">
              Upload the file and preview the data
            </p>
          </li>
          <li className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-semibold">
              4
            </span>
            <p className="text-gray-600 pt-0.5">
              Click "Upload Now" to import all products
            </p>
          </li>
        </ol>
      </div>
    </div>
  );
}
