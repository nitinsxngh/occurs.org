export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
}

export function generateArticleSlug(article: { headline: string; url_hash: string; id: string; slug?: string }): string {
  // Check if existing slug is proper (not hash-like and not duplicate of url_hash)
  if (article.slug && 
      article.slug.length > 0 && 
      !isHashLike(article.slug) && 
      article.slug !== article.url_hash) {
    return article.slug;
  }
  
  // Generate SEO-friendly slug from headline
  let headlineSlug = generateSlug(article.headline);
  
  // Add unique suffix to prevent duplicates
  const dateStr = new Date().getFullYear().toString().slice(-2) + 
                  (new Date().getMonth() + 1).toString().padStart(2, '0') + 
                  new Date().getDate().toString().padStart(2, '0');
  const idSuffix = article.id.substring(0, 6);
  
  headlineSlug = `${headlineSlug}-${dateStr}${idSuffix}`;
  
  // Limit slug length for better SEO (max 70 characters)
  const truncatedSlug = headlineSlug.length > 70 
    ? headlineSlug.substring(0, 70).replace(/-+$/, '') // Remove trailing hyphens
    : headlineSlug;
  
  return truncatedSlug;
}

/**
 * Check if a slug looks like a hash (32 hex characters)
 */
function isHashLike(slug: string): boolean {
  return /^[a-f0-9]{32}$/i.test(slug);
}
