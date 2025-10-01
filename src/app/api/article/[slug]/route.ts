import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { generateSlug } from '@/utils/slug';

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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // First try to get by ID (if slug is a UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
    if (uuidRegex.test(slug)) {
      try {
        const getCommand = new GetCommand({
          TableName: process.env.DYNAMODB_TABLE_NAME || 'indian-news-content',
          Key: { id: slug }
        });
        
        const result = await docClient.send(getCommand);
        if (result.Item) {
          return NextResponse.json({ article: result.Item });
        }
      } catch {
        // Continue to next method if get fails
      }
    }

    // Try to get by url_hash
    try {
      const queryCommand = new QueryCommand({
        TableName: process.env.DYNAMODB_TABLE_NAME || 'indian-news-content',
        IndexName: 'url_hash-index', // Assuming you have a GSI on url_hash
        KeyConditionExpression: 'url_hash = :url_hash',
        ExpressionAttributeValues: {
          ':url_hash': slug
        }
      });
      
      const result = await docClient.send(queryCommand);
      if (result.Items && result.Items.length > 0) {
        return NextResponse.json({ article: result.Items[0] });
      }
    } catch {
      // Continue to scan if query fails
    }

    // If no GSI, fall back to scan with filter
    // First try exact matches
    const scanCommand = new ScanCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME || 'indian-news-content',
      FilterExpression: 'url_hash = :url_hash OR id = :id',
      ExpressionAttributeValues: {
        ':url_hash': slug,
        ':id': slug
      },
      Limit: 1
    });

    let result = await docClient.send(scanCommand);
    
    if (result.Items && result.Items.length > 0) {
      return NextResponse.json({ article: result.Items[0] });
    }

    // If no exact match, try to find by headline slug
    const allItemsCommand = new ScanCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME || 'indian-news-content',
      Limit: 50 // Scan first 50 items to find by headline (reduced for performance)
    });

    result = await docClient.send(allItemsCommand);
    
    if (result.Items && result.Items.length > 0) {
      const foundArticle = result.Items.find(item => {
        if (!item.headline) return false;
        const headlineSlug = generateSlug(item.headline);
        const truncatedSlug = headlineSlug.length > 60 
          ? headlineSlug.substring(0, 60).replace(/-+$/, '')
          : headlineSlug;
        return truncatedSlug === slug && truncatedSlug.length > 10;
      });
      
      if (foundArticle) {
        return NextResponse.json({ article: foundArticle });
      }
    }

    return NextResponse.json(
      { error: 'Article not found' },
      { status: 404 }
    );

      } catch {
        return NextResponse.json(
          { error: 'Failed to fetch article' },
          { status: 500 }
        );
      }
}
