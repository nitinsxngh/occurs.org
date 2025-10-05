import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { AttributeValue } from '@aws-sdk/client-dynamodb';

// AWS configuration from environment variables
const awsConfig = {
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
};

const client = new DynamoDBClient(awsConfig);
const docClient = DynamoDBDocumentClient.from(client);

// Helper function to get the best available date for sorting
function getBestDateForSorting(item: Record<string, unknown>): Date {
  // Priority order: processed_at > scraped_at > created_at > current time
  const dateStrings = [
    item.processed_at as string,
    item.scraped_at as string,
    item.created_at as string
  ];
  
  for (const dateStr of dateStrings) {
    if (dateStr) {
      try {
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
          return date;
        }
      } catch (error) {
        console.warn(`Invalid date string: ${dateStr}`, error);
      }
    }
  }
  
  // Fallback to epoch time (oldest possible) to push items without dates to bottom
  return new Date(0);
}

// ENHANCED: Multi-factor sorting with new fields
function createSortKey(item: Record<string, unknown>): string {
  const date = getBestDateForSorting(item);
  
  // Enhanced priority system
  const isBreaking = (item.news_type === 'Breaking' || item.breaking) ? '1' : '0';
  const urgencyLevel = item.urgency_level === 'high' ? '3' : 
                      item.urgency_level === 'medium' ? '2' : '1';
  const impactScope = item.impact_scope === 'international' ? '4' :
                     item.impact_scope === 'national' ? '3' :
                     item.impact_scope === 'regional' ? '2' : '1';
  
  // Use news_score if available, otherwise fallback to confidence_score
  const qualityScore = String(Number(item.news_score || item.confidence_score) || 0).padStart(10, '0');
  const id = String(item.id || '').padStart(36, '0');
  
  // Format: YYYYMMDDHHMMSS-B-U-I-Q-ID 
  // (Date-Breaking-Urgency-Impact-Quality-ID)
  const dateStr = date.toISOString().replace(/[-T:.Z]/g, '').substring(0, 14);
  return `${dateStr}-${isBreaking}-${urgencyLevel}-${impactScope}-${qualityScore}-${id}`;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source');
    const category = searchParams.get('category');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50); // Max 50 items, default 20
    const breaking = searchParams.get('breaking') === 'true';
    const hasS3Data = searchParams.get('hasS3Data') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const lastEvaluatedKey = searchParams.get('lastEvaluatedKey');
    
    // NEW: Enhanced filtering with new fields
    const newsType = searchParams.get('newsType');
    const newsCategory = searchParams.get('newsCategory');
    const urgencyLevel = searchParams.get('urgencyLevel');
    const impactScope = searchParams.get('impactScope');
    const minNewsScore = parseFloat(searchParams.get('minNewsScore') || '0');
    const minConfidence = parseFloat(searchParams.get('minConfidence') || '0');

    // Build filter expression for processed content
    let filterExpression = 'attribute_exists(#processed)';
    const expressionAttributeValues: Record<string, AttributeValue> = {};
    const expressionAttributeNames: Record<string, string> = {
      '#processed': 'processed'
    };

    // Add additional filters
    if (source) {
      filterExpression += ' AND #source = :source';
      expressionAttributeNames['#source'] = 'source';
      expressionAttributeValues[':source'] = { S: source };
    }

    if (category) {
      filterExpression += ' AND #category = :category';
      expressionAttributeNames['#category'] = 'category';
      expressionAttributeValues[':category'] = { S: category };
    }

    if (breaking) {
      filterExpression += ' AND #breaking = :breaking';
      expressionAttributeNames['#breaking'] = 'breaking';
      expressionAttributeValues[':breaking'] = { BOOL: true };
    }

    if (hasS3Data) {
      filterExpression += ' AND attribute_exists(#s3_key)';
      expressionAttributeNames['#s3_key'] = 's3_key';
    }

    // NEW: Enhanced filtering with new fields
    if (newsType) {
      filterExpression += ' AND #news_type = :news_type';
      expressionAttributeNames['#news_type'] = 'news_type';
      expressionAttributeValues[':news_type'] = { S: newsType };
    }

    if (newsCategory) {
      filterExpression += ' AND #news_category = :news_category';
      expressionAttributeNames['#news_category'] = 'news_category';
      expressionAttributeValues[':news_category'] = { S: newsCategory };
    }

    if (urgencyLevel) {
      filterExpression += ' AND #urgency_level = :urgency_level';
      expressionAttributeNames['#urgency_level'] = 'urgency_level';
      expressionAttributeValues[':urgency_level'] = { S: urgencyLevel };
    }

    if (impactScope) {
      filterExpression += ' AND #impact_scope = :impact_scope';
      expressionAttributeNames['#impact_scope'] = 'impact_scope';
      expressionAttributeValues[':impact_scope'] = { S: impactScope };
    }

    if (minNewsScore > 0) {
      filterExpression += ' AND #news_score >= :min_news_score';
      expressionAttributeNames['#news_score'] = 'news_score';
      expressionAttributeValues[':min_news_score'] = { N: minNewsScore.toString() };
    }

    if (minConfidence > 0) {
      filterExpression += ' AND #confidence_score >= :min_confidence';
      expressionAttributeNames['#confidence_score'] = 'confidence_score';
      expressionAttributeValues[':min_confidence'] = { N: minConfidence.toString() };
    }

    // For the first page, fetch more items to ensure we have enough after sorting
    const fetchLimit = page === 1 ? limit * 3 : limit * 2;

    // Use efficient scan with proper pagination
    const scanParams: {
      TableName: string;
      Limit: number;
      FilterExpression?: string;
      ExpressionAttributeValues?: Record<string, AttributeValue>;
      ExpressionAttributeNames?: Record<string, string>;
      ExclusiveStartKey?: Record<string, AttributeValue>;
    } = {
      TableName: process.env.DYNAMODB_TABLE_NAME || 'indian-news-content',
      Limit: fetchLimit,
    };

    // Add pagination support
    if (lastEvaluatedKey) {
      try {
        scanParams.ExclusiveStartKey = JSON.parse(decodeURIComponent(lastEvaluatedKey));
      } catch (error) {
        console.warn('Invalid lastEvaluatedKey provided:', error);
      }
    }

    if (filterExpression) {
      scanParams.FilterExpression = filterExpression;
      scanParams.ExpressionAttributeNames = expressionAttributeNames;
      if (Object.keys(expressionAttributeValues).length > 0) {
        scanParams.ExpressionAttributeValues = expressionAttributeValues;
      }
    }

    const command = new ScanCommand(scanParams);
    const result = await docClient.send(command);

    if (!result.Items) {
      return NextResponse.json({ news: [], count: 0 });
    }

    // Sort items by composite sort key (newest first)
    const sortedNews = result.Items.sort((a, b) => {
      const sortKeyA = createSortKey(a);
      const sortKeyB = createSortKey(b);
      return sortKeyB.localeCompare(sortKeyA); // Descending order (newest first)
    });

    // Apply pagination after sorting
    const startIndex = page === 1 ? 0 : (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedNews = sortedNews.slice(startIndex, endIndex);

    // Return rich content articles with new fields and fallbacks
    const cleanedNews = paginatedNews.map(article => ({
      id: article.id,
      headline: article.headline,
      url: article.url,
      source: article.source,
      category: article.category,
      scraped_at: article.scraped_at,
      created_at: article.created_at,
      url_hash: article.url_hash,
      crawled_id: article.crawled_id,
      source_key: article.source_key,
      s3_bucket: article.s3_bucket,
      content_hash: article.content_hash,
      confidence_score: article.confidence_score,
      processing_status: article.processing_status,
      processed_at: article.processed_at,
      llm_model: article.llm_model,
      llm_version: article.llm_version,
      top_image: article.top_image,
      authors: article.authors,
      // NEW: Enhanced fields with fallbacks for backward compatibility
      slug: article.slug || article.url_hash || article.id,
      news_type: article.news_type || 'General',
      news_category: article.news_category || article.category || 'General',
      urgency_level: article.urgency_level || 'medium',
      impact_scope: article.impact_scope || 'national',
      news_score: article.news_score || article.confidence_score || 0.5,
      news_worthiness: article.news_worthiness || {
        impact_significance: 0.5,
        public_interest: 0.5,
        relevance: 0.5,
        timeliness: 0.5,
        uniqueness: 0.5
      },
      raw: article.raw,
      processed: article.processed,
      metadata: article.metadata
    }));

    // Create pagination info
    const hasNextPage = result.LastEvaluatedKey !== undefined || (sortedNews.length > endIndex);
    const nextPageToken = hasNextPage ? (page + 1).toString() : null;

    const response = NextResponse.json({
      news: cleanedNews,
      count: cleanedNews.length,
      totalScanned: result.ScannedCount || 0,
      fetchedAt: new Date().toISOString(),
      pagination: {
        currentPage: page,
        itemsPerPage: limit,
        hasNextPage,
        hasPreviousPage: page > 1,
        nextPageToken,
        totalItems: result.Count || 0
      },
      sortingInfo: {
        method: 'chronological_with_priority',
        priority: ['date', 'breaking_news', 'confidence_score', 'id'],
        breakingNewsPriority: true,
      }
    });

    // Add caching headers for better performance
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    
    return response;

  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news data' },
      { status: 500 }
    );
  }
}