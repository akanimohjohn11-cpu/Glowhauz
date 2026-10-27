/**
 * Resolves and normalizes image URLs for cross-environment compatibility
 * (local development, preview containers, and production Vercel hosting).
 */
export function resolveImageUrl(url?: string | null): string {
  if (!url) return '';
  const trimmed = url.trim();
  
  // External URLs (Unsplash, Supabase Storage, CDN) and Data URLs remain as-is
  if (
    trimmed.startsWith('data:') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  // Normalize any legacy or dev path containing /assets/images/ to standard /images/
  if (trimmed.includes('assets/images/')) {
    const filename = trimmed.split('/').pop();
    return filename ? `/images/${filename}` : trimmed;
  }

  // Ensure absolute path leading slash
  if (!trimmed.startsWith('/')) {
    return `/${trimmed}`;
  }

  return trimmed;
}
