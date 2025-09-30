import { NextRequest, NextResponse } from 'next/server';
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tableName = searchParams.get('table') || process.env.DYNAMODB_TABLE_NAME || 'indian-news-content';
    const limit = parseInt(searchParams.get('limit') || '5');

    console.log(`🔍 Debug: Scanning table "${tableName}" with limit ${limit}`);

    // Basic scan without any filters
    const scanParams = {
      TableName: tableName,
      Limit: limit,
    };

    const command = new ScanCommand(scanParams);
    const result = await docClient.send(command);

    console.log(`📊 Debug: Scanned ${result.ScannedCount} items, found ${result.Items?.length || 0} items`);

    if (!result.Items || result.Items.length === 0) {
      return NextResponse.json({
        success: false,
        message: `No items found in table "${tableName}"`,
        scannedCount: result.ScannedCount,
        tableName: tableName
      });
    }

    // Analyze the structure of the first item
    const firstItem = result.Items[0];
    const structure = {
      fields: Object.keys(firstItem),
      fieldTypes: Object.keys(firstItem).reduce((acc, key) => {
        acc[key] = typeof firstItem[key];
        return acc;
      }, {} as Record<string, string>),
      hasS3Bucket: 's3_bucket' in firstItem,
      hasS3Key: 's3_key' in firstItem,
      hasContent: 'content' in firstItem && firstItem.content && firstItem.content.length > 0,
      contentLength: firstItem.content ? firstItem.content.length : 0
    };

    return NextResponse.json({
      success: true,
      tableName: tableName,
      scannedCount: result.ScannedCount,
      itemCount: result.Items.length,
      structure: structure,
      sampleItems: result.Items.map(item => ({
        id: item.id,
        headline: item.headline?.substring(0, 100),
        source: item.source,
        s3_bucket: item.s3_bucket,
        s3_key: item.s3_key,
        hasContent: !!(item.content && item.content.length > 0),
        contentLength: item.content ? item.content.length : 0
      }))
    });

  } catch (error) {
    console.error('❌ Debug API Error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        errorType: error instanceof Error ? error.name : 'UnknownError'
      },
      { status: 500 }
    );
  }
}
