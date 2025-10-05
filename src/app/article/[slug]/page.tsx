import { NewsItem } from '@/types/news';
import { format } from 'date-fns';
import { ArrowLeft, Clock, Users, MapPin, Building, Hash, Eye } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import StructuredData from '@/components/StructuredData';
import { generateStructuredData, generateArticleMetadata } from '@/utils/metadata';
import { notFound } from 'next/navigation';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

async function getArticle(slug: string): Promise<NewsItem | null> {
  try {
    console.log('getArticle called with slug:', slug);
    
    // Use internal API call without full URL for better performance
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://occurs.org' 
      : 'http://localhost:3000';
    
    const apiUrl = `${baseUrl}/api/article/${slug}`;
    console.log('Fetching from API URL:', apiUrl);
    
    const response = await fetch(apiUrl, {
      next: { revalidate: 1800 }, // Cache for 30 minutes
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('API response status:', response.status);
    
    if (!response.ok) {
      console.error('API response not OK:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('API error response:', errorText);
      return null;
    }
    
    const data = await response.json();
    console.log('API response data:', data);
    return data.article || null;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);
  
  if (!article) {
    return {
      title: 'Article Not Found | occurs.org',
      description: 'The article you are looking for could not be found.',
    };
  }

  return generateArticleMetadata(article);
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  const isValidImageUrl = (url: string): boolean => {
    try {
      new URL(url);
      return url.startsWith('http://') || url.startsWith('https://');
    } catch {
      return false;
    }
  };

  const formatExactDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM dd, yyyy HH:mm');
    } catch {
      return 'Invalid date';
    }
  };




  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://occurs.org';
  const structuredData = article ? generateStructuredData(article, baseUrl) : null;

  return (
    <>
      {structuredData && (
        <StructuredData data={[structuredData.newsArticle, structuredData.organization, structuredData.breadcrumb]} />
      )}
      <div className="min-h-screen bg-white dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-900 border-b-4 border-black dark:border-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors newspaper-caption"
            >
              <ArrowLeft className="w-4 h-4" />
              ← BACK TO NEWS
            </Link>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="newspaper-card">
          {/* Article Header */}
          <div className="p-8 border-b-2 border-black dark:border-white">
            <div className="mb-4">
              <span className="newspaper-caption text-red-600">FEATURED STORY</span>
              <span className="text-gray-400 mx-2">•</span>
              <span className="newspaper-caption text-gray-600 dark:text-gray-400">
                {article.source}
              </span>
            </div>
            
            <h1 className="newspaper-headline text-4xl md:text-5xl text-black dark:text-white mb-6 leading-tight">
              {article.headline}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {formatExactDate(article.created_at || article.scraped_at)}
              </span>
              <span className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                {article.raw.reading_time} min read
              </span>
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {article.metadata.region}
              </span>
            </div>

            {/* Article Summary */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 border-l-4 border-red-600 mb-6">
              <h2 className="newspaper-subheadline text-xl text-black dark:text-white mb-3">
                ARTICLE SUMMARY
              </h2>
              <p className="newspaper-body text-gray-700 dark:text-gray-300 leading-relaxed">
                {article.processed.website.summary}
              </p>
            </div>
          </div>

          {/* Article Image with Credits */}
          {article.top_image && article.top_image !== "NA" && isValidImageUrl(article.top_image) && (
            <div className="p-8 border-b-2 border-black dark:border-white">
              <div className="relative w-full h-96 mb-4">
                <Image
                  src={article.top_image}
                  alt={article.headline}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 768px"
                  priority
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                />
              </div>
              {/* Image Credits */}
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 italic">
                <span>
                  {article.source ? `Image: ${article.source}` : 'Image: occurs.org'}
                </span>
                <span>
                  {article.top_image.includes('indianexpress.com') && '© Indian Express'}
                  {article.top_image.includes('hindustantimes.com') && '© Hindustan Times'}
                  {article.top_image.includes('indiatoday.in') && '© India Today'}
                  {article.top_image.includes('timesofindia.indiatimes.com') && '© Times of India'}
                  {article.top_image.includes('thehindu.com') && '© The Hindu'}
                  {!article.top_image.includes('indianexpress.com') && 
                   !article.top_image.includes('hindustantimes.com') && 
                   !article.top_image.includes('indiatoday.in') && 
                   !article.top_image.includes('timesofindia.indiatimes.com') && 
                   !article.top_image.includes('thehindu.com') && 
                   '© Source'}
                </span>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="p-8">
            <div className="newspaper-column">
              <h2 className="newspaper-subheadline text-2xl text-black dark:text-white mb-6">FULL ARTICLE</h2>
              <div className="newspaper-body text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap mb-8">
                {article.processed.website.full_content}
              </div>
            </div>

            {/* Key Points */}
            {article.processed.website.key_points && article.processed.website.key_points.length > 0 && (
              <div className="mb-8 border-t-2 border-black dark:border-white pt-6">
                <h3 className="newspaper-subheadline text-xl text-black dark:text-white mb-4">
                  KEY POINTS
                </h3>
                <ul className="space-y-3">
                  {article.processed.website.key_points.map((point: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="newspaper-body text-gray-700 dark:text-gray-300">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Entities */}
            <div className="mb-8 border-t-2 border-black dark:border-white pt-6">
              <h3 className="newspaper-subheadline text-xl text-black dark:text-white mb-4">ENTITIES MENTIONED</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {article.processed.website.entities.people.length > 0 && (
                  <div>
                    <h4 className="newspaper-caption text-black dark:text-white mb-2 flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      PEOPLE
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {article.processed.website.entities.people.map((person: string, index: number) => (
                        <span key={index} className="newspaper-caption bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1">
                          {person}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {article.processed.website.entities.organizations.length > 0 && (
                  <div>
                    <h4 className="newspaper-caption text-black dark:text-white mb-2 flex items-center">
                      <Building className="w-4 h-4 mr-1" />
                      ORGANIZATIONS
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {article.processed.website.entities.organizations.map((org: string, index: number) => (
                        <span key={index} className="newspaper-caption bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1">
                          {org}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {article.processed.website.entities.locations.length > 0 && (
                  <div>
                    <h4 className="newspaper-caption text-black dark:text-white mb-2 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      LOCATIONS
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {article.processed.website.entities.locations.map((location: string, index: number) => (
                        <span key={index} className="newspaper-caption bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1">
                          {location}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            {article.processed.website.tags && article.processed.website.tags.length > 0 && (
              <div className="mb-8 border-t-2 border-black dark:border-white pt-6">
                <h3 className="newspaper-subheadline text-xl text-black dark:text-white mb-4 flex items-center">
                  <Hash className="w-5 h-5 mr-2" />
                  TAGS
                </h3>
                <div className="flex flex-wrap gap-2">
                  {article.processed.website.tags.map((tag: string, index: number) => (
                    <span key={index} className="newspaper-caption bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="bg-gray-100 dark:bg-gray-800 px-8 py-6 border-t-2 border-black dark:border-white">
            <div className="text-center">
              <div className="newspaper-caption text-gray-600 dark:text-gray-400">
                <p>Published • {formatExactDate(article.created_at || article.scraped_at)}</p>
              </div>
            </div>
          </div>
        </article>
      </main>
      </div>
    </>
  );
}
