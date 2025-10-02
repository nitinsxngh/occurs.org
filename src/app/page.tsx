'use client';

import { useNews } from '@/hooks/useNews';
import NewsCard from '@/components/NewsCard';
import { NewsItem } from '@/types/news';
import { generateArticleSlug } from '@/utils/slug';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Newspaper, 
  Clock, 
  RefreshCw, 
  Search, 
  Moon, 
  Sun,
  Menu,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';

export default function Home() {
  const {
    news,
    loading,
    error,
    refreshNews,
    pagination,
  } = useNews({ limit: 20 }); // Reduced initial load from 100 to 20

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [trendingTicker, setTrendingTicker] = useState('');
  const [allNews, setAllNews] = useState<NewsItem[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [savedScrollPosition, setSavedScrollPosition] = useState<number>(0);

  const handleRefresh = () => {
    refreshNews();
    setAllNews([]);
    setNextPageToken(null);
    // Clear saved state on refresh
    sessionStorage.removeItem('newsPageState');
  };

  // Function to save current state before navigation
  const saveCurrentState = () => {
    const stateToSave = {
      allNews,
      nextPageToken,
      scrollPosition: window.scrollY
    };
    sessionStorage.setItem('newsPageState', JSON.stringify(stateToSave));
  };

  // Update nextPageToken when pagination changes
  useEffect(() => {
    if (pagination?.nextPageToken) {
      setNextPageToken(pagination.nextPageToken);
    }
  }, [pagination]);

  // Restore saved state when component mounts
  useEffect(() => {
    const savedState = sessionStorage.getItem('newsPageState');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        if (state.allNews && Array.isArray(state.allNews)) {
          setAllNews(state.allNews);
        }
        if (state.nextPageToken) {
          setNextPageToken(state.nextPageToken);
        }
        if (state.scrollPosition && typeof state.scrollPosition === 'number') {
          setSavedScrollPosition(state.scrollPosition);
        }
      } catch (error) {
        console.error('Error restoring saved state:', error);
      }
    }
  }, []);

  // Save state to sessionStorage when it changes
  useEffect(() => {
    if (allNews.length > 0 || nextPageToken) {
      const stateToSave = {
        allNews,
        nextPageToken,
        scrollPosition: window.scrollY
      };
      sessionStorage.setItem('newsPageState', JSON.stringify(stateToSave));
    }
  }, [allNews, nextPageToken]);

  // Restore scroll position after content is loaded
  useEffect(() => {
    if (savedScrollPosition > 0 && (news.length > 0 || allNews.length > 0)) {
      // Small delay to ensure content is rendered
      setTimeout(() => {
        window.scrollTo(0, savedScrollPosition);
        setSavedScrollPosition(0); // Reset after scrolling
      }, 100);
    }
  }, [news, allNews, savedScrollPosition]);

  const loadMoreNews = async () => {
    if (isLoadingMore || !nextPageToken) return;
    
    setIsLoadingMore(true);
    try {
      const response = await fetch(`/api/news?limit=20&page=${nextPageToken}`);
      const data = await response.json();
      
      if (data.news && data.news.length > 0) {
        setAllNews(prev => [...prev, ...data.news]);
        setNextPageToken(data.pagination?.nextPageToken || null);
      }
    } catch (error) {
      console.error('Failed to load more news:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Combine initial news with loaded news, removing duplicates
  const combinedNews = [...news, ...allNews].filter((article, index, self) => 
    index === self.findIndex(a => a.id === article.id)
  );

  const isValidImageUrl = (url: string): boolean => {
    try {
      new URL(url);
      return url.startsWith('http://') || url.startsWith('https://');
    } catch {
      return false;
    }
  };

  const sourcesCount = new Set(combinedNews.map(article => article.source)).size;

  // Generate trending ticker from breaking news
  useEffect(() => {
    // Get breaking news and high-priority news
    const breakingNews = combinedNews.filter(article => 
      article.processed?.website?.sentiment === 'negative' || 
      article.category === 'Breaking' ||
      article.category?.toLowerCase().includes('breaking') ||
      article.category?.toLowerCase().includes('urgent') ||
      article.category?.toLowerCase().includes('alert')
    );
    
    // If no breaking news, get latest high-priority news (first 5 articles)
    const priorityNews = breakingNews.length > 0 ? breakingNews : combinedNews.slice(0, 8);
    
    if (priorityNews.length > 0) {
      const tickerText = priorityNews
        .slice(0, 6) // Show up to 6 items instead of 3
        .map(article => {
          const headline = article.headline?.trim();
          if (!headline || headline.length === 0) return null;
          
          // Add source prefix for better context
          const source = article.source?.trim();
          return source ? `${source}: ${headline}` : headline;
        })
        .filter(item => item !== null)
        .join(' • ');
      
      if (tickerText.trim()) {
        setTrendingTicker(tickerText);
      } else {
        setTrendingTicker('');
      }
    } else {
      setTrendingTicker('');
    }
  }, [combinedNews]);

  // Filter news based on search
  const filteredNews = combinedNews.filter(article => 
    article.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.processed?.website?.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get featured story (first article)
  const featuredStory = filteredNews[0];
  const otherNews = filteredNews.slice(1);

  if (loading && news.length === 0) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={handleRefresh} />;
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      {/* Trending Ticker */}
      {trendingTicker && trendingTicker.trim() && (
        <div className="trending-ticker">
          <div>
            {trendingTicker}
          </div>
        </div>
      )}

      {/* Newspaper Masthead */}
      <header className="bg-white dark:bg-gray-900 border-b-4 border-black dark:border-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 text-sm text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 gap-2">
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="hidden sm:inline">{format(new Date(), 'EEEE, MMMM d, yyyy')}</span>
              <span className="sm:hidden">{format(new Date(), 'MMM d, yyyy')}</span>
              <span className="hidden sm:inline">•</span>
              <span>Vol 1, Issue {Math.floor(Math.random() * 1000) + 1}</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <span>{sourcesCount} Sources</span>
              <span>•</span>
              <span>{news.length} Articles</span>
            </div>
          </div>

          {/* Main Masthead */}
          <div className="py-8 sm:py-12">
            <div className="text-center">
              <h1 className="newspaper-headline text-4xl sm:text-6xl md:text-8xl lg:text-9xl xl:text-[12rem] font-black text-black dark:text-white mb-4 leading-none">
                OCCURS.ORG
              </h1>
              <div className="w-32 sm:w-40 h-2 bg-red-600 mx-auto mb-4 sm:mb-6"></div>
              <p className="newspaper-caption text-gray-600 dark:text-gray-400 text-lg sm:text-xl md:text-2xl">
                THE DIGITAL CHRONICLE
              </p>
              <p className="newspaper-body text-sm sm:text-base md:text-lg text-gray-500 dark:text-gray-500 mt-2 sm:mt-3 px-4">
                &ldquo;All the News That&apos;s Fit to Print&rdquo; • Est. 2025
              </p>
            </div>
          </div>

          {/* Navigation & Controls */}
          <div className="py-4 border-t border-gray-200 dark:border-gray-700">
            {/* Mobile Menu Button */}
            <div className="flex items-center justify-between lg:hidden mb-4">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              
              <div className="flex items-center gap-2">
                {/* Search - Mobile */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="newspaper-search pl-10 pr-4 py-2 w-40 text-sm"
                  />
                </div>
                
                {/* Dark Mode Toggle */}
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                
                {/* Refresh */}
                <button
                  onClick={handleRefresh}
                  className="newspaper-button inline-flex items-center gap-1 px-3 py-2 bg-black dark:bg-white text-white dark:text-black text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
              <div className="lg:hidden mb-4">
                <div className="flex flex-wrap gap-2">
                  <button className="newspaper-caption hover:text-red-600 transition-colors px-2 py-1">WORLD</button>
                  <button className="newspaper-caption hover:text-red-600 transition-colors px-2 py-1">POLITICS</button>
                  <button className="newspaper-caption hover:text-red-600 transition-colors px-2 py-1">BUSINESS</button>
                  <button className="newspaper-caption hover:text-red-600 transition-colors px-2 py-1">TECHNOLOGY</button>
                  <button className="newspaper-caption hover:text-red-600 transition-colors px-2 py-1">CULTURE</button>
                </div>
              </div>
            )}

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center justify-between">
              <div className="flex items-center gap-6">
                <button className="newspaper-caption hover:text-red-600 transition-colors">WORLD</button>
                <button className="newspaper-caption hover:text-red-600 transition-colors">POLITICS</button>
                <button className="newspaper-caption hover:text-red-600 transition-colors">BUSINESS</button>
                <button className="newspaper-caption hover:text-red-600 transition-colors">TECHNOLOGY</button>
                <button className="newspaper-caption hover:text-red-600 transition-colors">CULTURE</button>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Search - Desktop */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="newspaper-search pl-10 pr-4 py-2 w-64"
                  />
                </div>
                
                {/* Dark Mode Toggle */}
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                
                {/* Refresh */}
                <button
                  onClick={handleRefresh}
                  className="newspaper-button inline-flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <LoadingSpinner />
        ) : filteredNews.length === 0 ? (
          <div className="text-center py-12">
            <Newspaper className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No news articles found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or check back later for new articles.
            </p>
          </div>
        ) : (
          <>
            {/* Hero Section - Featured Story */}
            {featuredStory && (
              <section className="mb-12">
                <Link 
                  href={`/article/${generateArticleSlug(featuredStory)}`}
                  onClick={saveCurrentState}
                  className="block"
                >
                  <div className="newspaper-hero p-8 mb-8 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="newspaper-caption text-red-600">BREAKING NEWS</span>
                        </div>
                        <h2 className="newspaper-headline text-4xl md:text-5xl text-black dark:text-white mb-4 leading-tight hover:text-red-600 dark:hover:text-red-400 transition-colors">
                          {featuredStory.headline}
                        </h2>
                        <p className="newspaper-body text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                          {featuredStory.processed?.website?.summary || 'No summary available.'}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {format(new Date(featuredStory.created_at || featuredStory.scraped_at), 'MMM d, yyyy')}
                          </span>
                          <span>•</span>
                          <span>{featuredStory.raw?.reading_time || 5} min read</span>
                        </div>
                      </div>
                      {featuredStory.top_image && featuredStory.top_image !== "NA" && isValidImageUrl(featuredStory.top_image) && (
                        <div className="relative w-full h-80">
                          <Image
                            src={featuredStory.top_image}
                            alt={featuredStory.headline}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </section>
            )}

            {/* Section Divider */}
            <div className="newspaper-section-divider">
              <h3 className="newspaper-caption text-center text-gray-600 dark:text-gray-400">
                LATEST NEWS
              </h3>
            </div>

            {/* News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherNews.map((article) => (
                <NewsCard key={article.id} article={article} onArticleClick={saveCurrentState} />
              ))}
            </div>

            {/* Load More Button */}
            {otherNews.length > 0 && nextPageToken && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={loadMoreNews}
                  disabled={isLoadingMore}
                  className="newspaper-button inline-flex items-center gap-2 px-8 py-3 bg-black dark:bg-white text-white dark:text-black font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingMore ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin"></div>
                      Loading...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      Load More News
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-800 border-t-2 border-black dark:border-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* About */}
            <div>
              <h3 className="newspaper-caption text-black dark:text-white mb-4">About</h3>
              <div className="space-y-2">
                <Link href="/about" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                  About Us
                </Link>
                <Link href="/contact" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                  Contact
                </Link>
              </div>
            </div>

            {/* Legal */}
            <div>
              <h3 className="newspaper-caption text-black dark:text-white mb-4">Legal</h3>
              <div className="space-y-2">
                <Link href="/privacy-policy" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms-of-service" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="newspaper-caption text-black dark:text-white mb-4">Contact Info</h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p>Email: connect@occurs.org</p>
                <p>Noida, Uttar Pradesh, India</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-300 dark:border-gray-600 pt-6">
            <div className="text-center">
              <p className="newspaper-caption text-gray-600 dark:text-gray-400 mb-2">
                © 2025 OCCURS.ORG - THE DIGITAL CHRONICLE
              </p>
              <p className="newspaper-body text-sm text-gray-500 dark:text-gray-500">
                Stay informed with the latest news from trusted sources worldwide.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
