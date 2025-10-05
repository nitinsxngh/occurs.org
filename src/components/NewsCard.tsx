import { NewsItem } from '@/types/news';
import { formatDistanceToNow } from 'date-fns';
import { X, MapPin, Eye, AlertTriangle, TrendingUp, Star } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface NewsCardProps {
  article: NewsItem;
  onArticleClick?: () => void;
}

export default function NewsCard({ article, onArticleClick }: NewsCardProps) {
  const [showContent, setShowContent] = useState(false);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Unknown time';
      }
      
      // Use the most recent date available for display
      const dates = [
        article.processed_at,
        article.scraped_at,
        article.created_at,
        dateString
      ].filter(Boolean);
      
      const mostRecentDate = dates.reduce((latest, current) => {
        const latestDate = new Date(latest);
        const currentDate = new Date(current);
        return currentDate > latestDate ? current : latest;
      });
      
      return formatDistanceToNow(new Date(mostRecentDate), { addSuffix: true });
    } catch {
      return 'Unknown time';
    }
  };


  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'negative': return 'text-red-600 bg-red-100';
      case 'neutral': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getUrgencyColor = (urgency?: string) => {
    if (!urgency) return 'text-gray-700 bg-gray-100 border-gray-200';
    switch (urgency) {
      case 'high': return 'text-red-700 bg-red-100 border-red-200';
      case 'medium': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-green-700 bg-green-100 border-green-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getImpactScopeIcon = (scope?: string) => {
    if (!scope) return '📰';
    switch (scope) {
      case 'international': return '🌍';
      case 'national': return '🏛️';
      case 'regional': return '🏙️';
      case 'local': return '📍';
      default: return '📰';
    }
  };

  const getNewsTypeColor = (type?: string) => {
    if (!type) return 'text-gray-600 bg-gray-50 border-gray-200';
    switch (type) {
      case 'Breaking': return 'text-red-600 bg-red-50 border-red-200';
      case 'Hard': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Soft': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const isValidImageUrl = (url: string): boolean => {
    try {
      new URL(url);
      return url.startsWith('http://') || url.startsWith('https://');
    } catch {
      return false;
    }
  };


  return (
    <article className="newspaper-card overflow-hidden">
      {/* Article Image - only show if image exists and is valid */}
      {article.top_image && article.top_image !== "NA" && isValidImageUrl(article.top_image) && (
        <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
          <Image
            src={article.top_image}
            alt={article.headline}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            onError={(e) => {
              e.currentTarget.parentElement?.remove();
            }}
          />
          
          {/* Sentiment Badge */}
          <div className="absolute top-2 right-2">
            <span className={`newspaper-caption px-2 py-1 text-xs ${getSentimentColor(article.processed.website.sentiment)}`}>
              {article.processed.website.sentiment.toUpperCase()}
            </span>
          </div>
        </div>
      )}
      
      {/* Sentiment badge for articles without valid images */}
      {(!article.top_image || article.top_image === "NA" || !isValidImageUrl(article.top_image)) && (
        <div className="relative px-6 pt-4">
          <div className="mb-3 flex justify-end">
            {/* Sentiment Badge */}
            <span className={`newspaper-caption px-2 py-1 text-xs ${getSentimentColor(article.processed.website.sentiment)}`}>
              {article.processed.website.sentiment.toUpperCase()}
            </span>
          </div>
        </div>
      )}
      
      <div className="p-6">
        {/* Enhanced Category, Date, and New Badges */}
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {/* News Type Badge - only show if available */}
            {article.news_type && (
              <span className={`newspaper-caption px-2 py-1 text-xs border rounded ${getNewsTypeColor(article.news_type)}`}>
                {article.news_type}
              </span>
            )}
            
            {/* Urgency Badge - only show if available */}
            {article.urgency_level && (
              <span className={`newspaper-caption px-2 py-1 text-xs border rounded ${getUrgencyColor(article.urgency_level)}`}>
                <AlertTriangle className="w-3 h-3 inline mr-1" />
                {article.urgency_level.toUpperCase()}
              </span>
            )}
            
            {/* Impact Scope - only show if available */}
            {article.impact_scope && (
              <span className="newspaper-caption text-gray-600 dark:text-gray-400">
                {getImpactScopeIcon(article.impact_scope)} {article.impact_scope}
              </span>
            )}
          </div>
          
          <span className="newspaper-caption text-gray-500 dark:text-gray-400">
            {formatDate(article.created_at || article.scraped_at)}
          </span>
        </div>

        {/* Headline */}
        <h2 className="newspaper-headline text-xl text-black dark:text-white mb-3 line-clamp-2 hover:text-red-600 dark:hover:text-red-400 transition-colors">
          <Link 
            href={`/article/${(() => {
              // If slug exists and is different from url_hash, use slug
              if (article.slug && article.slug !== article.url_hash) {
                return article.slug;
              }
              // If slug looks like a hash (32 chars, hex), use ID instead
              if (article.slug && /^[a-f0-9]{32}$/i.test(article.slug)) {
                return article.id;
              }
              // Otherwise use the slug or fallback to ID
              return article.slug || article.id;
            })()}`}
            className="hover:underline"
            onClick={() => {
              const finalSlug = (() => {
                if (article.slug && article.slug !== article.url_hash) {
                  return article.slug;
                }
                if (article.slug && /^[a-f0-9]{32}$/i.test(article.slug)) {
                  return article.id;
                }
                return article.slug || article.id;
              })();
              
              console.log('Article clicked:', {
                headline: article.headline,
                slug: article.slug,
                url_hash: article.url_hash,
                id: article.id,
                finalSlug: finalSlug,
                hasProperSlug: !!article.slug && article.slug !== article.url_hash,
                isHashLike: article.slug && /^[a-f0-9]{32}$/i.test(article.slug)
              });
              onArticleClick?.();
            }}
          >
            {article.headline}
          </Link>
        </h2>

        {/* Article Summary */}
        <div className="mb-4">
          <p className="newspaper-body text-gray-700 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
            {article.processed.website.summary}
          </p>
        </div>


        {/* Enhanced Reading Time, Region, and Quality Metrics */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center">
              <Eye className="w-3 h-3 mr-1" />
              {article.raw?.reading_time || 5} min read
            </span>
            {article.metadata?.region && (
              <span className="flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                {article.metadata.region}
              </span>
            )}
            
            {/* Quality Score - only show if available */}
            {article.news_score && (
              <span className="flex items-center">
                <Star className="w-3 h-3 mr-1" />
                {Math.round(article.news_score * 100)}%
              </span>
            )}
            
            {/* News Category - only show if available */}
            {article.news_category && (
              <span className="flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                {article.news_category}
              </span>
            )}
          </div>
        </div>

      </div>

      {/* Content Modal */}
      {showContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {article.headline}
              </h3>
              <button
                onClick={() => setShowContent(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="prose dark:prose-invert max-w-none">
                {/* Article Image in Modal */}
                {article.top_image && article.top_image !== "NA" && isValidImageUrl(article.top_image) && (
                  <div className="mb-6">
                    <div className="relative w-full h-64 mb-2">
                      <Image
                        src={article.top_image}
                        alt={article.headline}
                        fill
                        className="object-cover rounded-lg shadow-md"
                        sizes="(max-width: 1200px) 90vw, 1200px"
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                    {/* Image Credits in Modal */}
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
                
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-semibold mb-2">Article Summary</h4>
                  <p className="text-sm">{article.processed.website.summary}</p>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-semibold mb-2">Full Content</h4>
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">
                    {article.processed.website.full_content}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Key Points</h4>
                    <ul className="text-sm space-y-1">
                      {article.processed.website.key_points.map((point, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-1 h-1 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Social Media</h4>
                    <div className="text-sm">
                      <p className="mb-2"><strong>Caption:</strong> {article.processed.social.caption}</p>
                      <div className="flex flex-wrap gap-1">
                        {article.processed.social.hashtags.map((hashtag, index) => (
                          <span key={index} className="text-blue-600">#{hashtag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowContent(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
