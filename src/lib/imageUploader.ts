/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase, isSupabaseConfigured } from './supabase';

export interface ImageUploadResult {
  url: string;
  success: boolean;
  storage: 'supabase' | 'data-url';
  filename: string;
  error?: string;
}

/**
 * Compresses and scales an image File on the client into an optimized Data URL.
 * Preserves high visual fidelity while reducing file size for snappy web delivery.
 */
export async function optimizeImageFile(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.82
): Promise<{ dataUrl: string; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file from device.'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to decode image.'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Scale proportionally if dimensions exceed max boundaries
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback to raw data url if 2D context is unavailable
          resolve({ dataUrl: e.target?.result as string, width: img.width, height: img.height });
          return;
        }

        // High quality bicubic interpolation
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to webp if supported, otherwise jpeg
        const outputMime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(outputMime, quality);

        resolve({ dataUrl, width, height });
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Uploads an image from the user's device folder.
 * 1. Attempts direct upload to Supabase Storage ('glowhauz-products' bucket).
 * 2. If bucket is unavailable or returns an error, transparently falls back to an
 *    optimized client Data URL so that product creation never halts or errors out.
 */
export async function uploadImageFromFile(file: File): Promise<ImageUploadResult> {
  const cleanExt = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const cleanBaseName = file.name
    .replace(/\.[^/.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');
  const filePath = `products/${timestamp}-${cleanBaseName}-${randomSuffix}.${cleanExt}`;

  // Try Supabase Storage if configured
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.storage
        .from('glowhauz-products')
        .upload(filePath, file, {
          cacheControl: '31536000',
          upsert: true,
          contentType: file.type || 'image/jpeg',
        });

      if (!error && data?.path) {
        const { data: publicData } = supabase.storage
          .from('glowhauz-products')
          .getPublicUrl(data.path);

        if (publicData?.publicUrl) {
          return {
            url: publicData.publicUrl,
            success: true,
            storage: 'supabase',
            filename: file.name,
          };
        }
      }
    } catch (sbErr) {
      console.warn('Supabase storage upload note, using optimized local store:', sbErr);
    }
  }

  // Resilient fallback: Process with client-side canvas optimizer
  try {
    const optimized = await optimizeImageFile(file);
    return {
      url: optimized.dataUrl,
      success: true,
      storage: 'data-url',
      filename: file.name,
    };
  } catch (err: any) {
    return {
      url: '',
      success: false,
      storage: 'data-url',
      filename: file.name,
      error: err?.message || 'Failed to process image file.',
    };
  }
}
