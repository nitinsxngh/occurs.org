export interface NewsItem {
  id: string;
  headline: string;
  url: string;
  source: string;
  category: string;
  scraped_at: string;
  created_at: string;
  url_hash: string;
  crawled_id: string;
  source_key: string;
  s3_bucket: string;
  content_hash: string;
  confidence_score: number;
  processing_status: string;
  processed_at: string;
  llm_model: string;
  llm_version: string;
  top_image: string;
  authors: string[];
  
  // Rich content objects
  raw: {
    text: string;
    char_count: number;
    word_count: number;
    reading_time: number;
  };
  
  processed: {
    website: {
      summary: string;
      sentiment: 'positive' | 'negative' | 'neutral';
      entities: {
        organizations: string[];
        people: string[];
        locations: string[];
      };
      full_content: string;
      fact_check_status: string;
      key_points: string[];
      tags: string[];
    };
    social: {
      caption: string;
      image: string;
      hashtags: string[];
      short_summary: string;
    };
  };
  
  metadata: {
    news_score: number;
    rewrite_quality: number;
    news_type: string;
    language: string;
    fact_check_confidence: number;
    region: string;
    distribution_channels: string[];
    source_name: string;
  };
}

export interface NewsResponse {
  news: NewsItem[];
  count: number;
  totalScanned: number;
  fetchedAt: string;
  pagination?: {
    currentPage: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPageToken: string | null;
    totalItems: number;
  };
  filteringInfo?: {
    hasS3Data: boolean;
    hasContent: boolean | string;
    tableName: string;
    s3Bucket?: string;
  };
  sortingInfo: {
    method: string;
    priority: string[];
    breakingNewsPriority: boolean;
  };
}

export interface NewsFilters {
  source?: string;
  category?: string;
  limit?: number;
  breaking?: boolean;
  hasS3Data?: boolean;
  hasContent?: boolean;
  page?: number;
  lastEvaluatedKey?: string;
}
