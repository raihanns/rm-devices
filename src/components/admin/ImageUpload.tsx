'use client';

import { useState, useRef } from 'react';
import { createClient } from '@/lib/supabase';
import { getPublicImageUrl } from '@/lib/image-upload';

interface ImageUploadProps {
  onImagesChange: (urls: string[]) => void;
  existingImages?: string[];
}

export default function ImageUpload({ onImagesChange, existingImages = [] }: ImageUploadProps) {
  const supabase = createClient();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>(existingImages);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convert storage path to public URL for display
  const getDisplayUrl = (path: string) => {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    return getPublicImageUrl(supabase, path);
  };

  const uploadToSupabase = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err: any) {
      console.error('Upload error:', err);
      throw err;
    }
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError(null);

    const newImages: string[] = [...images];
    const totalFiles = files.length;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          setError(`File "${file.name}" is not an image`);
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setError(`File "${file.name}" exceeds 5MB limit`);
          continue;
        }

        // Upload file
        const imageUrl = await uploadToSupabase(file);
        
        if (imageUrl) {
          newImages.push(imageUrl);
          setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
        }
      }

      setImages(newImages);
      onImagesChange(newImages);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
      setUploadProgress({});
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onImagesChange(newImages);
  };

  const handleMoveImage = (index: number, direction: 'left' | 'right') => {
    const newImages = [...images];
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newImages.length) {
      [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
      setImages(newImages);
      onImagesChange(newImages);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isUploading 
            ? 'border-gray-400 bg-gray-50' 
            : 'border-gray-300 hover:border-gray-900 hover:bg-gray-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          disabled={isUploading}
        />
        
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        
        <p className="text-sm font-medium text-gray-900 mb-1">
          {isUploading ? 'Uploading...' : 'Click or drag images here'}
        </p>
        <p className="text-xs text-gray-500">
          PNG, JPG, WEBP up to 5MB each
        </p>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="space-y-2">
          {Object.entries(uploadProgress).map(([fileName, progress]) => (
            <div key={fileName} className="flex items-center space-x-2">
              <span className="text-xs text-gray-600 truncate">{fileName}</span>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gray-900 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Image Preview */}
      {images.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            {images.length} image{images.length > 1 ? 's' : ''} uploaded
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((imagePath, index) => {
              const displayUrl = getDisplayUrl(imagePath);
              return (
                <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                  <img
                    src={displayUrl}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                    }}
                  />
                
                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                  {/* Move Left */}
                  {index > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveImage(index, 'left');
                      }}
                      className="p-2 bg-white rounded-full hover:bg-gray-100"
                      title="Move left"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  )}
                  
                  {/* Move Right */}
                  {index < images.length - 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveImage(index, 'right');
                      }}
                      className="p-2 bg-white rounded-full hover:bg-gray-100"
                      title="Move right"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                  
                  {/* Remove */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(index);
                    }}
                    className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                    title="Remove image"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* First image badge */}
                {index === 0 && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-gray-900 text-white text-xs rounded">
                    Cover
                  </div>
                )}
              </div>
              );
            })}
          </div>
          <p className="text-xs text-gray-500">
            First image will be used as cover. Use arrows to reorder.
          </p>
        </div>
      )}
    </div>
  );
}
