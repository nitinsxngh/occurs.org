# Global News Dashboard

A modern, responsive web application that displays news articles scraped from multiple sources and stored in AWS DynamoDB. Built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- 📰 **Real-time News Display**: Shows news articles from multiple sources including BBC News, CNN, Reuters, Al Jazeera, Associated Press, and Fox News
- 🔍 **Advanced Filtering**: Filter by news source, category, breaking news status, and article limit
- 📱 **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- 🌙 **Dark Mode Support**: Automatic dark/light mode based on system preferences
- ⚡ **Breaking News Highlighting**: Special badges for breaking news articles
- 🔄 **Auto-refresh**: Manual refresh button to get the latest news
- 📊 **Live Statistics**: Real-time counts of articles, sources, and breaking news

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **AWS Integration**: AWS SDK v3 for DynamoDB

## Prerequisites

- Node.js 18+ 
- AWS account with DynamoDB access
- DynamoDB table named `global_news` with the following structure:
  - Primary key: `id` (String)
  - GSI: `URLHashIndex` on `url_hash` field

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd occurs.org-News
```

2. Install dependencies:
```bash
npm install
```

3. Configure AWS credentials in `src/app/api/news/route.ts`:
```typescript
const awsConfig = {
  region: 'ap-south-1',
  credentials: {
    accessKeyId: 'YOUR_ACCESS_KEY',
    secretAccessKey: 'YOUR_SECRET_KEY',
  },
};
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## DynamoDB Table Structure

The application expects a DynamoDB table with the following structure:

```json
{
  "id": "string",           // Primary key
  "headline": "string",     // Article headline
  "summary": "string",      // Article summary (optional)
  "content": "string",      // Full article content (optional)
  "url": "string",          // Article URL
  "source": "string",       // News source name
  "category": "string",     // Article category
  "published_at": "string", // Publication timestamp (ISO 8601)
  "scraped_at": "string",  // Scraping timestamp (ISO 8601)
  "breaking": "boolean",    // Breaking news flag
  "batch_id": "string",     // Scraping batch identifier
  "created_at": "string",   // Record creation timestamp
  "url_hash": "string"      // URL hash for duplicate detection
}
```

## API Endpoints

### GET /api/news

Fetches news articles with optional filtering:

**Query Parameters:**
- `source`: Filter by news source
- `category`: Filter by article category
- `limit`: Maximum number of articles to return (default: 50)
- `breaking`: Filter for breaking news only (true/false)

**Example:**
```
GET /api/news?source=BBC%20News&category=Politics&limit=25&breaking=true
```

## Components

- **NewsCard**: Displays individual news articles with metadata
- **NewsFilters**: Provides filtering and search capabilities
- **LoadingSpinner**: Shows loading state during data fetching
- **ErrorMessage**: Displays error messages with retry functionality

## Customization

### Adding New News Sources

1. Update the `NEWS_SOURCES` array in `src/components/NewsFilters.tsx`
2. Add source-specific styling in `src/components/NewsCard.tsx` (getSourceColor function)

### Modifying Categories

Update the `NEWS_CATEGORIES` array in `src/components/NewsFilters.tsx`

### Styling

The application uses Tailwind CSS. Custom styles can be added to `src/app/globals.css`

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables for AWS credentials
4. Deploy

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Docker containers

## Environment Variables

For production, set these environment variables:

```bash
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=ap-south-1
DYNAMODB_TABLE_NAME=global_news
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
1. Check the existing issues
2. Create a new issue with detailed information
3. Include error logs and reproduction steps

## Roadmap

- [ ] Real-time updates with WebSocket
- [ ] User authentication and personalization
- [ ] News search functionality
- [ ] Export news data to various formats
- [ ] Mobile app version
- [ ] News sentiment analysis
- [ ] RSS feed generation
