import { MetadataRoute } from 'next';
import { generateSlug } from '@/utils/slug';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://occurs.org';

      // Static pages
      const staticPages: MetadataRoute.Sitemap = [
        {
          url: baseUrl,
          lastModified: new Date(),
          changeFrequency: 'hourly',
          priority: 1,
        },
        {
          url: `${baseUrl}/about`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.8,
        },
        {
          url: `${baseUrl}/contact`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.7,
        },
        {
          url: `${baseUrl}/privacy-policy`,
          lastModified: new Date(),
          changeFrequency: 'yearly',
          priority: 0.5,
        },
        {
          url: `${baseUrl}/terms-of-service`,
          lastModified: new Date(),
          changeFrequency: 'yearly',
          priority: 0.5,
        },
      ];

  // Fetch articles for dynamic pages
  try {
        const response = await fetch(`${baseUrl}/api/news?limit=50`, {
          next: { revalidate: 3600 }, // Revalidate every hour
        });
    
    if (response.ok) {
      const data = await response.json();
      const articles = data.news || [];
      
          const articlePages: MetadataRoute.Sitemap = articles.map((article: { headline: string; url_hash: string; processed_at?: string; created_at?: string; scraped_at?: string }) => {
        // Generate SEO-friendly slug from headline
        const headlineSlug = generateSlug(article.headline);
        const truncatedSlug = headlineSlug.length > 60 
          ? headlineSlug.substring(0, 60).replace(/-+$/, '')
          : headlineSlug;
        
        // Use SEO-friendly slug if valid, otherwise fallback to url_hash
        const slug = truncatedSlug.length > 10 ? truncatedSlug : article.url_hash;
        
        return {
          url: `${baseUrl}/article/${slug}`,
          lastModified: new Date(article.processed_at || article.created_at || article.scraped_at || new Date()),
          changeFrequency: 'daily' as const,
          priority: 0.8,
        };
      });

      return [...staticPages, ...articlePages];
    }
      } catch {
        // Error generating sitemap
      }

  return staticPages;
}

