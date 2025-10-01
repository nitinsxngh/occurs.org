import { Metadata } from 'next';
import { NewsItem } from '@/types/news';
import { generateSlug } from '@/utils/slug';

export function generateArticleMetadata(article: NewsItem, baseUrl: string = 'https://occurs.org'): Metadata {
  const title = article.headline;
  const description = article.processed?.website?.summary || article.headline;
  const image = article.top_image && article.top_image !== 'NA' ? article.top_image : `${baseUrl}/og-default.png`;
  
  // Generate SEO-friendly slug
  const headlineSlug = generateSlug(article.headline);
  const truncatedSlug = headlineSlug.length > 60 
    ? headlineSlug.substring(0, 60).replace(/-+$/, '')
    : headlineSlug;
  const slug = truncatedSlug.length > 10 ? truncatedSlug : article.url_hash;
  const url = `${baseUrl}/article/${slug}`;
  const publishedTime = article.processed_at || article.created_at || article.scraped_at;
  const authors = article.authors && Array.isArray(article.authors) ? article.authors : ['occurs.org Editorial Team'];
  
  return {
    title: `${title} | occurs.org`,
    description,
    keywords: article.processed?.website?.tags?.join(', ') || '',
    authors: authors.map(author => ({ name: author })),
    publisher: 'occurs.org',
    creator: article.source || 'occurs.org',
    openGraph: {
      type: 'article',
      title,
      description,
      url,
      siteName: 'occurs.org - The Digital Chronicle',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      publishedTime,
      authors,
      section: article.category,
      tags: article.processed?.website?.tags || [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@occursorg',
      site: '@occursorg',
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export function generateStructuredData(article: NewsItem, baseUrl: string = 'https://occurs.org') {
  // Generate SEO-friendly slug
  const headlineSlug = generateSlug(article.headline);
  const truncatedSlug = headlineSlug.length > 60 
    ? headlineSlug.substring(0, 60).replace(/-+$/, '')
    : headlineSlug;
  const slug = truncatedSlug.length > 10 ? truncatedSlug : article.url_hash;
  const url = `${baseUrl}/article/${slug}`;
  const image = article.top_image && article.top_image !== 'NA' ? article.top_image : `${baseUrl}/og-default.png`;
  const publishedTime = article.processed_at || article.created_at || article.scraped_at;
  const authors = article.authors && Array.isArray(article.authors) ? article.authors : ['occurs.org Editorial Team'];

  // NewsArticle Schema
  const newsArticle = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.headline,
    description: article.processed?.website?.summary || article.headline,
    image: [image],
    datePublished: publishedTime,
    dateModified: article.processed_at || publishedTime,
    author: authors.map(author => ({
      '@type': 'Person',
      name: author,
    })),
    publisher: {
      '@type': 'Organization',
      name: 'occurs.org',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    articleSection: article.category,
    keywords: article.processed?.website?.tags?.join(', ') || '',
    articleBody: article.processed?.website?.full_content || article.processed?.website?.summary,
  };

  // Organization Schema
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    name: 'occurs.org',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    sameAs: [
      'https://twitter.com/occursorg',
      'https://facebook.com/occursorg',
    ],
    description: 'Your trusted source for comprehensive news coverage and journalism',
  };

  // Breadcrumb Schema
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: article.category,
        item: `${baseUrl}?category=${encodeURIComponent(article.category)}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.headline,
        item: url,
      },
    ],
  };

  return { newsArticle, organization, breadcrumb };
}

