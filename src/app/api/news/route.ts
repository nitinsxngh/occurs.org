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
  
  // Fallback to current time if no valid dates found
  return new Date();
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

    // Build scan parameters
    let filterExpression = '';
    const expressionAttributeValues: Record<string, AttributeValue> = {};
    const expressionAttributeNames: Record<string, string> = {};

    // Always filter for processed content
    filterExpression += 'attribute_exists(#processed)';
    expressionAttributeNames['#processed'] = 'processed';

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

    // Additional S3 data filtering if requested
    if (hasS3Data) {
      filterExpression += ' AND attribute_exists(#s3_key)';
      expressionAttributeNames['#s3_key'] = 's3_key';
    }

    const scanParams: {
      TableName: string;
      Limit: number;
      FilterExpression?: string;
      ExpressionAttributeValues?: Record<string, AttributeValue>;
      ExpressionAttributeNames?: Record<string, string>;
      ExclusiveStartKey?: Record<string, AttributeValue>;
    } = {
      TableName: process.env.DYNAMODB_TABLE_NAME || 'indian-news-content',
      Limit: limit,
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
      // Only add ExpressionAttributeValues if it's not empty
      if (Object.keys(expressionAttributeValues).length > 0) {
        scanParams.ExpressionAttributeValues = expressionAttributeValues;
      }
    }

    const command = new ScanCommand(scanParams);
    const result = await docClient.send(command);

    if (!result.Items) {
      return NextResponse.json({ news: [], count: 0 });
    }

    // Sort by date (newest first) with improved date handling
    const sortedNews = result.Items.sort((a, b) => {
      const dateA = getBestDateForSorting(a);
      const dateB = getBestDateForSorting(b);
      
      // Sort by timestamp (newest first) - higher timestamp comes first
      const timeDiff = dateB.getTime() - dateA.getTime();
      
      // If timestamps are the same, prioritize breaking news
      if (timeDiff === 0) {
        if (a.breaking && !b.breaking) return -1;
        if (!a.breaking && b.breaking) return 1;
      }
      
      return timeDiff;
    });

    // Return rich content articles
    const cleanedNews = sortedNews.map(article => ({
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

    const response = NextResponse.json({
      news: cleanedNews,
      count: cleanedNews.length,
      totalScanned: result.ScannedCount || 0,
      fetchedAt: new Date().toISOString(),
      pagination: {
        currentPage: page,
        itemsPerPage: limit,
        hasNextPage: !!result.LastEvaluatedKey,
        hasPreviousPage: page > 1,
        nextPageToken: result.LastEvaluatedKey ? encodeURIComponent(JSON.stringify(result.LastEvaluatedKey)) : null,
        totalItems: result.Count || 0
      }
    });

    // Add caching headers for better performance
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    
    return response;

  } catch {
    // Error fetching news
    return NextResponse.json(
      { error: 'Failed to fetch news data' },
      { status: 500 }
    );
  }
}
