import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
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
    console.log('Looking for article with slug:', slug);

    // Detect if slug looks like a hash (32 chars, alphanumeric) vs readable slug
    const isHashLike = /^[a-f0-9]{32}$/i.test(slug);
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
    
    console.log('Slug analysis:', { slug, isHashLike, isUuid });

    // First try to get by ID (if slug is a UUID) - most reliable
    if (isUuid) {
      console.log('Slug is UUID, trying direct ID lookup');
      try {
        const getCommand = new GetCommand({
          TableName: process.env.DYNAMODB_TABLE_NAME || 'indian-news-content',
          Key: { id: slug }
        });
        
        const result = await docClient.send(getCommand);
        if (result.Item) {
          console.log('Found article by ID');
          return NextResponse.json({ article: result.Item });
        }
      } catch (error) {
        console.error('Error in ID lookup:', error);
      }
    }

    // If slug looks like a hash, try url_hash first (most likely case)
    if (isHashLike) {
      console.log('Slug looks like hash, trying url_hash lookup first');
      const urlHashScanCommand = new ScanCommand({
        TableName: process.env.DYNAMODB_TABLE_NAME || 'indian-news-content',
        FilterExpression: 'url_hash = :url_hash',
        ExpressionAttributeValues: {
          ':url_hash': slug
        },
        Limit: 1
      });

      try {
        const result = await docClient.send(urlHashScanCommand);
        if (result.Items && result.Items.length > 0) {
          console.log('Found article by url_hash');
          return NextResponse.json({ article: result.Items[0] });
        }
      } catch (error) {
        console.error('Error in url_hash lookup:', error);
      }
    }

    // Try slug field lookup (for proper readable slugs)
    console.log('Trying slug field lookup');
    const slugScanCommand = new ScanCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME || 'indian-news-content',
      FilterExpression: 'slug = :slug',
      ExpressionAttributeValues: {
        ':slug': slug
      },
      Limit: 10 // Increase limit to improve chances of finding the article
    });

    try {
      const result = await docClient.send(slugScanCommand);
      console.log('Slug scan result:', { 
        count: result.Count, 
        scannedCount: result.ScannedCount,
        items: result.Items?.length || 0 
      });
      
      if (result.Items && result.Items.length > 0) {
        // Find exact match
        const exactMatch = result.Items.find(item => item.slug === slug);
        if (exactMatch) {
          console.log('Found article by slug field');
          return NextResponse.json({ article: exactMatch });
        }
      }
    } catch (error) {
      console.error('Error in slug field lookup:', error);
    }

    // If slug contains date pattern (like 2510058d33), try partial matching
    const lastPart = slug.split('-').pop();
    if (slug.includes('-') && lastPart && /^\d{6}[a-f0-9]{6}$/i.test(lastPart)) {
      console.log('Trying partial slug matching for date-based slugs');
      const slugScanCommand2 = new ScanCommand({
        TableName: process.env.DYNAMODB_TABLE_NAME || 'indian-news-content',
        FilterExpression: 'contains(slug, :partialSlug)',
        ExpressionAttributeValues: {
          ':partialSlug': slug
        },
        Limit: 5
      });

      try {
        const result = await docClient.send(slugScanCommand2);
        if (result.Items && result.Items.length > 0) {
          // Find exact match
          const exactMatch = result.Items.find(item => item.slug === slug);
          if (exactMatch) {
            console.log('Found article by partial slug match');
            return NextResponse.json({ article: exactMatch });
          }
        }
      } catch (error) {
        console.error('Error in partial slug lookup:', error);
      }
    }

    // Special case: If slug looks like a hash and we didn't find it by slug field,
    // but we found it by url_hash earlier, it means the slug field is set to url_hash
    // This is a data inconsistency issue in the database
    if (isHashLike) {
      console.log('Slug looks like hash but not found by slug field - checking for data inconsistency');
      // This case should have been caught by the url_hash lookup above
      // If we reach here, it means the url_hash lookup failed too
    }

    // If not hash-like, try url_hash as fallback
    if (!isHashLike) {
      console.log('Trying url_hash lookup as fallback');
      const urlHashScanCommand = new ScanCommand({
        TableName: process.env.DYNAMODB_TABLE_NAME || 'indian-news-content',
        FilterExpression: 'url_hash = :url_hash',
        ExpressionAttributeValues: {
          ':url_hash': slug
        },
        Limit: 1
      });

      try {
        const result = await docClient.send(urlHashScanCommand);
        if (result.Items && result.Items.length > 0) {
          console.log('Found article by url_hash fallback');
          return NextResponse.json({ article: result.Items[0] });
        }
      } catch (error) {
        console.error('Error in url_hash fallback lookup:', error);
      }
    }

    // Last resort: scan all articles to find by slug (comprehensive search)
    console.log('Trying comprehensive slug search');
    const comprehensiveScanCommand = new ScanCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME || 'indian-news-content',
      Limit: 1000 // Scan more articles
    });

    try {
      const result = await docClient.send(comprehensiveScanCommand);
      if (result.Items && result.Items.length > 0) {
        // Look for article with exact slug match
        const exactMatch = result.Items.find(item => item.slug === slug);
        if (exactMatch) {
          console.log('Found article by comprehensive slug search');
          return NextResponse.json({ article: exactMatch });
        }
        
        // Look for article with matching generated slug (backward compatibility)
        for (const item of result.Items) {
          if (item.headline) {
            const generatedSlug = generateSlug(item.headline);
            const truncatedSlug = generatedSlug.length > 60 
              ? generatedSlug.substring(0, 60).replace(/-+$/, '')
              : generatedSlug;
            
            if (truncatedSlug === slug) {
              console.log('Found article by generated headline slug');
              return NextResponse.json({ article: item });
            }
          }
        }
      }
    } catch (error) {
      console.error('Error in comprehensive slug search:', error);
    }

    console.log('Article not found for slug:', slug);
    return NextResponse.json(
      { error: 'Article not found', slug: slug },
      { status: 404 }
    );

  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
