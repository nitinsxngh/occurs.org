import { NextResponse } from 'next/server';
import { generateArticleSlug } from '@/utils/slug';

// Calculate article priority based on news type, urgency, and score
function calculateArticlePriority(article: {
  news_type?: string;
  urgency_level?: string;
  news_score?: number;
}): number {
  let basePriority = 0.5; // Default priority
  
  // Priority based on news type
  if (article.news_type) {
    switch (article.news_type.toLowerCase()) {
      case 'breaking':
        basePriority = 0.9;
        break;
      case 'hard':
        basePriority = 0.8;
        break;
      case 'soft':
        basePriority = 0.6;
        break;
      case 'general':
        basePriority = 0.5;
        break;
      default:
        basePriority = 0.5;
    }
  }
  
  // Adjust based on urgency level
  if (article.urgency_level) {
    switch (article.urgency_level.toLowerCase()) {
      case 'high':
        basePriority += 0.1;
        break;
      case 'medium':
        basePriority += 0.05;
        break;
      case 'low':
        basePriority -= 0.05;
        break;
    }
  }
  
  // Adjust based on news score (0-1 scale)
  if (article.news_score && article.news_score > 0) {
    const scoreAdjustment = (article.news_score - 0.5) * 0.2; // -0.1 to +0.1
    basePriority += scoreAdjustment;
  }
  
  // Ensure priority is within valid range (0.1 to 1.0)
  return Math.max(0.1, Math.min(1.0, basePriority));
}

// Determine change frequency based on news type and urgency
function determineChangeFrequency(newsType?: string, urgencyLevel?: string): string {
  // Breaking news and high urgency articles change more frequently
  if (newsType?.toLowerCase() === 'breaking' || urgencyLevel?.toLowerCase() === 'high') {
    return 'hourly';
  }
  
  // Hard news changes daily
  if (newsType?.toLowerCase() === 'hard') {
    return 'daily';
  }
  
  // Soft news and general news change weekly
  if (newsType?.toLowerCase() === 'soft' || newsType?.toLowerCase() === 'general') {
    return 'weekly';
  }
  
  // Default to daily
  return 'daily';
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://occurs.org';

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: 'hourly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];

  // Fetch articles for dynamic pages
  let articlePages: any[] = [];
  
  try {
    // Use localhost for development, baseUrl for production
    const apiUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000/api/news' 
      : `${baseUrl}/api/news`;
      
    const response = await fetch(`${apiUrl}?limit=50&_t=${Date.now()}`, {
      cache: 'no-store', // Disable caching for sitemap generation
    });

    if (response.ok) {
      const data = await response.json();
      const articles = data.news || [];
      
      articlePages = articles.map((article: { 
        headline: string; 
        url_hash: string; 
        slug?: string; 
        id: string; 
        processed_at?: string; 
        created_at?: string; 
        scraped_at?: string;
        news_type?: string;
        urgency_level?: string;
        news_score?: number;
      }) => {
        // Generate proper SEO-friendly slug
        const slug = generateArticleSlug({
          headline: article.headline,
          slug: article.slug,
          url_hash: article.url_hash,
          id: article.id
        });
        
        // Calculate priority based on news type and urgency
        const priority = calculateArticlePriority(article);
        
        // Determine change frequency based on news type
        const changeFrequency = determineChangeFrequency(article.news_type, article.urgency_level);
        
        return {
          url: `${baseUrl}/article/${slug}`,
          lastModified: new Date(article.processed_at || article.created_at || article.scraped_at || new Date()).toISOString(),
          changeFrequency: changeFrequency,
          priority: article.news_type === 'Breaking' ? 0.9 : priority,
        };
      });
    }
  } catch (error) {
    console.error('Error fetching articles for sitemap:', error);
  }

  const allPages = [...staticPages, ...articlePages];

  // Generate XML sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastModified}</lastmod>
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new NextResponse(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
    },
  });
}
