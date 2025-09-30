'use client';

import { useParams } from 'next/navigation';
import { useNews } from '@/hooks/useNews';
import { NewsItem } from '@/types/news';
import { formatDistanceToNow, format } from 'date-fns';
import { ArrowLeft, Clock, Users, MapPin, Building, Hash, Eye, Newspaper } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function ArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [article, setArticle] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { news } = useNews({ limit: 150 });

  useEffect(() => {
    if (news.length > 0) {
      // Find article by slug (try multiple formats)
      const foundArticle = news.find(item => {
        // Try URL hash first
        if (item.url_hash === slug) return true;
        // Try ID
        if (item.id === slug) return true;
        // Try headline slug
        const headlineSlug = item.headline.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        if (headlineSlug === slug) return true;
        return false;
      });
      
      if (foundArticle) {
        setArticle(foundArticle);
      } else {
        setError('Article not found');
      }
      setLoading(false);
    }
  }, [news, slug]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return 'Unknown time';
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

  const getSourceColor = (source: string) => {
    const colors: Record<string, string> = {
      'The Hindu': 'bg-orange-100 text-orange-800 border-orange-200',
      'Times of India': 'bg-amber-100 text-amber-800 border-amber-200',
      'Hindustan Times': 'bg-blue-100 text-blue-800 border-blue-200',
      'Indian Express': 'bg-green-100 text-green-800 border-green-200',
      'BBC News': 'bg-red-100 text-red-800 border-red-200',
      'CNN': 'bg-blue-100 text-blue-800 border-blue-200',
    };
    return colors[source] || 'bg-gray-100 text-gray-800 border-gray-200';
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Newspaper className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Article Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The article you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to News
          </Link>
        </div>
      </div>
    );
  }

  return (
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

            {/* Metadata */}
            <div className="border-t-2 border-black dark:border-white pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600 dark:text-gray-400">
                <div>
                  <h4 className="newspaper-caption text-black dark:text-white mb-2">ARTICLE DETAILS</h4>
                  <ul className="space-y-1 newspaper-body">
                    <li>Category: {article.category}</li>
                    <li>Published: {formatExactDate(article.created_at || article.scraped_at)}</li>
                    <li>Reading Time: {article.raw.reading_time} minutes</li>
                    <li>Word Count: {article.raw.word_count}</li>
                  </ul>
                </div>
              </div>
            </div>
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
  );
}
