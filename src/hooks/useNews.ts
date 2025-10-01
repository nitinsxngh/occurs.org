import { useState, useEffect, useCallback } from 'react';
import { NewsItem, NewsResponse } from '@/types/news';

export function useNews(initialFilters: { limit?: number } = {}) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [lastFetchTime, setLastFetchTime] = useState<Date>(new Date());
  const [limit] = useState(initialFilters.limit || 20); // Reduced default from 100 to 20
  const [pagination, setPagination] = useState<{ 
    currentPage: number; 
    itemsPerPage: number; 
    hasNextPage: boolean; 
    hasPreviousPage: boolean; 
    nextPageToken: string | null; 
    totalItems: number; 
  } | null>(null);

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.append('limit', limit.toString());

      const response = await fetch(`/api/news?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();
      if (!responseText) {
        throw new Error('Empty response from server');
      }

      const data: NewsResponse = JSON.parse(responseText);
      setNews(data.news);
      setTotalCount(data.count);
      setPagination(data.pagination || null);
      if (data.fetchedAt) {
        setLastFetchTime(new Date(data.fetchedAt));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch news');
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  const refreshNews = useCallback(() => {
    fetchNews();
  }, [fetchNews]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return {
    news,
    loading,
    error,
    totalCount,
    lastFetchTime,
    refreshNews,
    pagination,
  };
}
