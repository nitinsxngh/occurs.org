import { NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

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

export async function GET() {
  try {
    console.log('Debug endpoint called');
    
    // Get a few sample articles to see their structure
    const scanCommand = new ScanCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME || 'indian-news-content',
      Limit: 5,
      ProjectionExpression: 'id, headline, slug, url_hash, news_type, urgency_level, impact_scope'
    });

    const result = await docClient.send(scanCommand);
    
    console.log('Debug scan result:', result);
    
    return NextResponse.json({
      message: 'Debug info',
      tableName: process.env.DYNAMODB_TABLE_NAME || 'indian-news-content',
      sampleArticles: result.Items || [],
      count: result.Count || 0,
      scannedCount: result.ScannedCount || 0
    });

  } catch (error) {
    console.error('Error in debug endpoint:', error);
    return NextResponse.json(
      { error: 'Debug failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
