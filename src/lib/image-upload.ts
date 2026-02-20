import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Download image from URL and upload to Supabase Storage
 * Returns the storage path (e.g., '/products/images/xxx.jpg')
 */
export async function downloadAndUploadImage(
  imageUrl: string,
  supabase: SupabaseClient
): Promise<string> {
  try {
    // Generate unique filename
    const urlParts = imageUrl.split('/');
    const originalFilename = urlParts[urlParts.length - 1]?.split('?')[0] || 'image.jpg';
    const extension = originalFilename.split('.').pop() || 'jpg';
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${extension}`;
    const storagePath = `products/images/${filename}`;

    // Download image
    const response = await fetch(imageUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RM Devices Bot/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`);
    }

    // Get image as blob
    const blob = await response.blob();

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(storagePath, blob, {
        contentType: blob.type,
        upsert: false,
      });

    if (error) throw error;

    // Return relative path (not full URL)
    return `/products/images/${filename}`;
  } catch (error) {
    console.error('Error downloading/uploading image:', error);
    // Return original URL as fallback
    return imageUrl;
  }
}

/**
 * Process multiple images from URLs
 * Downloads each image and uploads to storage
 * Returns array of storage paths
 */
export async function processImageUrls(
  imageUrls: string[],
  supabase: SupabaseClient
): Promise<string[]> {
  const storagePaths: string[] = [];

  for (const url of imageUrls) {
    if (!url || url.trim() === '') continue;

    try {
      const path = await downloadAndUploadImage(url.trim(), supabase);
      storagePaths.push(path);
    } catch (error) {
      console.error('Failed to process image:', url, error);
      // Keep original URL as fallback
      storagePaths.push(url);
    }
  }

  return storagePaths;
}

/**
 * Convert storage path to public URL
 * Use this when displaying images
 */
export function getPublicImageUrl(
  supabase: SupabaseClient,
  storagePath: string
): string {
  // If it's already a full URL, return as-is
  if (storagePath.startsWith('http://') || storagePath.startsWith('https://')) {
    return storagePath;
  }

  // Convert storage path to public URL
  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(storagePath.replace(/^\//, '')); // Remove leading slash

  return data?.publicUrl || storagePath;
}
