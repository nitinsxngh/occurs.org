# Environment Setup

This project now uses environment variables instead of hardcoded values for better security and configuration management.

## Setup Instructions

### 1. Create Environment File

Copy the example environment file and update it with your actual values:

```bash
cp env.example .env.local
```

### 2. Configure Environment Variables

Edit `.env.local` and update the following variables:

```bash
# AWS Configuration
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your_actual_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_actual_aws_secret_access_key

# DynamoDB Configuration
DYNAMODB_TABLE_NAME=your-dynamodb-table-name

# S3 Configuration (if needed)
S3_BUCKET_NAME=your-s3-bucket-name

# App Configuration
NEXT_PUBLIC_APP_NAME=occurs.org
NEXT_PUBLIC_APP_DESCRIPTION=Your trusted source for comprehensive news coverage and journalism
```

### 3. Security Notes

- **Never commit `.env.local`** to version control
- **Keep your AWS credentials secure**
- **Use IAM roles in production** instead of access keys when possible
- **Rotate your credentials regularly**

### 4. Required AWS Permissions

Your AWS credentials need the following permissions:

- **DynamoDB**: `dynamodb:Scan`, `dynamodb:Query` on your table
- **S3**: `s3:GetObject` on your bucket (if using S3 content)

### 5. Environment Variables Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `AWS_REGION` | AWS region for services | No | `ap-south-1` |
| `AWS_ACCESS_KEY_ID` | AWS access key | Yes | - |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | Yes | - |
| `DYNAMODB_TABLE_NAME` | DynamoDB table name | No | `indian-news-content` |
| `S3_BUCKET_NAME` | S3 bucket name | No | `indian-news-raw-content` |
| `NEXT_PUBLIC_APP_NAME` | App name | No | `occurs.org` |
| `NEXT_PUBLIC_APP_DESCRIPTION` | App description | No | Default description |

### 6. Deployment

For production deployment, set these environment variables in your hosting platform:

- **Vercel**: Add in Project Settings > Environment Variables
- **Netlify**: Add in Site Settings > Environment Variables
- **AWS**: Use AWS Systems Manager Parameter Store or AWS Secrets Manager

### 7. Development vs Production

- **Development**: Use `.env.local` file
- **Production**: Use platform-specific environment variable settings
- **Never** hardcode credentials in your code

## Migration from Hardcoded Values

The following files have been updated to use environment variables:

- `src/app/api/news/route.ts`
- `src/app/api/content/route.ts`
- `src/app/api/debug/route.ts`
- `config.example.ts`

All hardcoded AWS credentials and table names have been replaced with environment variable references.
