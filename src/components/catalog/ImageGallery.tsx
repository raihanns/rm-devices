'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

export default function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // If no images or empty array, show placeholder
  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl flex items-center justify-center glass-card">
        <svg className="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  const selectedImage = images[selectedImageIndex];
  const hasMultipleImages = images.length > 1;

  const goToPrevious = () => {
    setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const goToNext = () => {
    setSelectedImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl overflow-hidden glass-card">
        <Image
          src={selectedImage}
          alt={`${productName} - Image ${selectedImageIndex + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />

        {/* Navigation Arrows (only if multiple images) */}
        {hasMultipleImages && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 glass-card rounded-full flex items-center justify-center hover:bg-white/90 transition-all duration-200 hover:scale-110 shadow-lg"
              aria-label="Previous image"
            >
              <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 glass-card rounded-full flex items-center justify-center hover:bg-white/90 transition-all duration-200 hover:scale-110 shadow-lg"
              aria-label="Next image"
            >
              <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Image Counter */}
        {hasMultipleImages && (
          <div className="absolute top-4 right-4 px-3 py-1.5 glass-dark text-white text-sm font-medium rounded-full">
            {selectedImageIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {hasMultipleImages && (
        <div className="flex space-x-3 overflow-x-auto py-2 px-1">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all duration-200 ${
                index === selectedImageIndex
                  ? 'ring-2 ring-gray-900 ring-offset-2 scale-105 shadow-lg'
                  : 'ring-1 ring-gray-200 hover:ring-gray-400 opacity-70 hover:opacity-100'
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
