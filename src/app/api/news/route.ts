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

// Helper function to create a composite sort key for consistent ordering
function createSortKey(item: Record<string, unknown>): string {
  const date = getBestDateForSorting(item);
  const isBreaking = item.breaking ? '1' : '0';
  const confidenceScore = String(Number(item.confidence_score) || 0).padStart(10, '0');
  const id = String(item.id || '').padStart(36, '0');
  
  // Format: YYYYMMDDHHMMSS-B-CONF-ID (newest first, breaking first, higher confidence first)
  const dateStr = date.toISOString().replace(/[-T:.Z]/g, '').substring(0, 14);
  return `${dateStr}-${isBreaking}-${confidenceScore}-${id}`;
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

    // Return rich content articles
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