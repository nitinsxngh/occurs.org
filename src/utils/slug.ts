export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
}

export function generateArticleSlug(article: { headline: string; url_hash: string; id: string }): string {
  // Generate SEO-friendly slug from headline, with fallback to url_hash
  const headlineSlug = generateSlug(article.headline);
  
  // Limit slug length for better SEO (max 60 characters)
  const truncatedSlug = headlineSlug.length > 60 
    ? headlineSlug.substring(0, 60).replace(/-+$/, '') // Remove trailing hyphens
    : headlineSlug;
  
  // If headline slug is too short or empty, use url_hash as fallback
  return truncatedSlug.length > 10 ? truncatedSlug : article.url_hash;
}
