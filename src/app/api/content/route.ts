import { NextRequest, NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

// AWS S3 configuration from environment variables
const s3Config = {
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
};

const s3Client = new S3Client(s3Config);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const s3Key = searchParams.get('s3Key');
    const bucket = searchParams.get('bucket') || process.env.S3_BUCKET_NAME || 'indian-news-raw-content';

    if (!s3Key) {
      return NextResponse.json(
        { error: 'S3 key is required' },
        { status: 400 }
      );
    }

    // Fetching content from S3

    // Get object from S3
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: s3Key,
    });

    const response = await s3Client.send(command);
    
    if (!response.Body) {
      return NextResponse.json(
        { error: 'Content not found in S3' },
        { status: 404 }
      );
    }

    // Convert stream to string
    const chunks: Uint8Array[] = [];
    const reader = response.Body.transformToWebStream().getReader();
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }
    
    const content = new TextDecoder().decode(new Uint8Array(chunks.reduce((acc, chunk) => [...acc, ...Array.from(chunk)], [] as number[])));
    
    // Parse JSON content
    let parsedContent;
    try {
      parsedContent = JSON.parse(content);
    } catch {
      // If not JSON, return as plain text
      parsedContent = {
        raw_content: content,
        content_type: 'text'
      };
    }

    return NextResponse.json({
      success: true,
      content: parsedContent,
      metadata: {
        bucket: bucket,
        key: s3Key,
        contentType: response.ContentType,
        lastModified: response.LastModified,
        contentLength: response.ContentLength
      }
    });

  } catch (error) {
    // Error fetching S3 content
    
    if (error instanceof Error) {
      if (error.name === 'NoSuchKey') {
        return NextResponse.json(
          { error: 'Content not found in S3 bucket' },
          { status: 404 }
        );
      }
      if (error.name === 'NoSuchBucket') {
        return NextResponse.json(
          { error: 'S3 bucket not found' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { 
        error: 'Failed to fetch content from S3',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
