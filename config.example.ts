// Example configuration file - copy this to config.ts and update with your values
// This file is now optional since we use environment variables directly
export const config = {
  aws: {
    region: process.env.AWS_REGION || 'ap-south-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  },
  dynamodb: {
    tableName: process.env.DYNAMODB_TABLE_NAME || 'indian-news-content',
  },
  s3: {
    bucketName: process.env.S3_BUCKET_NAME || 'indian-news-raw-content',
  },
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'occurs.org',
    description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Your trusted source for comprehensive news coverage and journalism',
  },
};
