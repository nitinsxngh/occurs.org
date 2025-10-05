import { NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { generateArticleSlug } from '@/utils/slug';

const awsConfig = {
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
};

const client = new DynamoDBClient(awsConfig);
const docClient = DynamoDBDocumentClient.from(client);

export async function POST() {
  try {
    const tableName = process.env.DYNAMODB_TABLE_NAME || 'indian-news-content';
    
    // Step 1: Get all articles
    console.log('Fetching all articles...');
    const scanCommand = new ScanCommand({
      TableName: tableName,
      ProjectionExpression: "id, headline, slug, url_hash"
    });
    
    const result = await docClient.send(scanCommand);
    const articles = result.Items || [];
    
    console.log(`Found ${articles.length} articles`);
    
    // Step 2: Analyze slug issues
    const issues = {
      duplicateHash: [] as Array<{ id: string; headline: string; slug: string; url_hash: string }>,
      hashLike: [] as Array<{ id: string; headline: string; slug: string; url_hash: string }>,
      properSlugs: [] as Array<{ id: string; headline: string; slug: string; url_hash: string }>,
      duplicateSlugs: [] as Array<{ slug: string; articleIds: string[] }>
    };
    
    const slugMap = new Map<string, string[]>(); // slug -> [article_ids]
    
    articles.forEach(article => {
      const { id, headline, slug, url_hash } = article;
      
      if (!slug) {
        issues.duplicateHash.push({ id, headline, slug, url_hash });
        return;
      }
      
      if (slug === url_hash) {
        issues.duplicateHash.push({ id, headline, slug, url_hash });
      } else if (/^[a-f0-9]{32}$/i.test(slug)) {
        issues.hashLike.push({ id, headline, slug, url_hash });
      } else {
        issues.properSlugs.push({ id, headline, slug, url_hash });
        
        // Track slug usage
        if (!slugMap.has(slug)) {
          slugMap.set(slug, []);
        }
        slugMap.get(slug)!.push(id);
      }
    });
    
    // Find duplicate slugs
    slugMap.forEach((articleIds, slug) => {
      if (articleIds.length > 1) {
        issues.duplicateSlugs.push({ slug, articleIds });
      }
    });
    
    // Step 3: Generate new slugs for problematic articles
    const updates = [];
    const usedSlugs = new Set(issues.properSlugs.map(a => a.slug));
    
    // Fix duplicate hash slugs
    for (const article of issues.duplicateHash) {
      const newSlug = generateArticleSlug({
        headline: article.headline,
        slug: article.slug,
        url_hash: article.url_hash,
        id: article.id
      });
      
      // Ensure uniqueness
      let uniqueSlug = newSlug;
      let counter = 1;
      while (usedSlugs.has(uniqueSlug)) {
        uniqueSlug = `${newSlug}-${counter}`;
        counter++;
      }
      
      usedSlugs.add(uniqueSlug);
      
      updates.push({
        id: article.id,
        oldSlug: article.slug,
        newSlug: uniqueSlug,
        type: 'duplicate_hash'
      });
    }
    
    // Fix hash-like slugs
    for (const article of issues.hashLike) {
      const newSlug = generateArticleSlug({
        headline: article.headline,
        slug: article.slug,
        url_hash: article.url_hash,
        id: article.id
      });
      
      let uniqueSlug = newSlug;
      let counter = 1;
      while (usedSlugs.has(uniqueSlug)) {
        uniqueSlug = `${newSlug}-${counter}`;
        counter++;
      }
      
      usedSlugs.add(uniqueSlug);
      
      updates.push({
        id: article.id,
        oldSlug: article.slug,
        newSlug: uniqueSlug,
        type: 'hash_like'
      });
    }
    
    // Fix duplicate slugs
    for (const duplicate of issues.duplicateSlugs) {
      const articleIds = duplicate.articleIds;
      
      // Keep the first article's slug, update others
      for (let i = 1; i < articleIds.length; i++) {
        const articleId = articleIds[i];
        const article = articles.find(a => a.id === articleId);
        
        if (article) {
          const baseSlug = generateArticleSlug({
            headline: article.headline,
            slug: article.slug,
            url_hash: article.url_hash,
            id: article.id
          });
          
          let uniqueSlug = `${baseSlug}-duplicate-${i}`;
          let counter = 1;
          while (usedSlugs.has(uniqueSlug)) {
            uniqueSlug = `${baseSlug}-duplicate-${i}-${counter}`;
            counter++;
          }
          
          usedSlugs.add(uniqueSlug);
          
          updates.push({
            id: articleId,
            oldSlug: duplicate.slug,
            newSlug: uniqueSlug,
            type: 'duplicate_slug'
          });
        }
      }
    }
    
    // Step 4: Apply updates (optional - uncomment to actually update)
    const appliedUpdates = [];
    
    for (const update of updates.slice(0, 5)) { // Limit to first 5 for safety
      try {
        const updateCommand = new UpdateCommand({
          TableName: tableName,
          Key: { id: update.id },
          UpdateExpression: 'SET slug = :newSlug',
          ExpressionAttributeValues: {
            ':newSlug': update.newSlug
          },
          ReturnValues: 'ALL_NEW'
        });
        
        const updateResult = await docClient.send(updateCommand);
        appliedUpdates.push({
          ...update,
          success: true,
          updatedArticle: updateResult.Attributes
        });
        
        console.log(`Updated article ${update.id}: ${update.oldSlug} -> ${update.newSlug}`);
      } catch (error) {
        console.error(`Failed to update article ${update.id}:`, error);
        appliedUpdates.push({
          ...update,
          success: false,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
    
    return NextResponse.json({
      message: "Slug analysis and fix completed",
      summary: {
        totalArticles: articles.length,
        duplicateHash: issues.duplicateHash.length,
        hashLike: issues.hashLike.length,
        properSlugs: issues.properSlugs.length,
        duplicateSlugs: issues.duplicateSlugs.length,
        plannedUpdates: updates.length,
        appliedUpdates: appliedUpdates.length
      },
      issues,
      updates: updates.slice(0, 10), // Show first 10 planned updates
      appliedUpdates
    });
    
  } catch (error) {
    console.error('Error in slug fix API:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fix slugs', 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const tableName = process.env.DYNAMODB_TABLE_NAME || 'indian-news-content';
    
    // Analyze current slug situation
    const scanCommand = new ScanCommand({
      TableName: tableName,
      ProjectionExpression: "id, headline, slug, url_hash"
    });
    
    const result = await docClient.send(scanCommand);
    const articles = result.Items || [];
    
    const analysis = {
      total: articles.length,
      duplicateHash: 0,
      hashLike: 0,
      properSlugs: 0,
      missingSlugs: 0,
      duplicateSlugs: 0
    };
    
    const slugMap = new Map<string, number>();
    
    articles.forEach(article => {
      const { slug } = article;
      
      if (!slug) {
        analysis.missingSlugs++;
      } else if (slug === article.url_hash) {
        analysis.duplicateHash++;
      } else if (/^[a-f0-9]{32}$/i.test(slug)) {
        analysis.hashLike++;
      } else {
        analysis.properSlugs++;
        
        // Count slug usage
        slugMap.set(slug, (slugMap.get(slug) || 0) + 1);
      }
    });
    
    // Count duplicate slugs
    slugMap.forEach(count => {
      if (count > 1) {
        analysis.duplicateSlugs += count - 1;
      }
    });
    
    return NextResponse.json({
      message: "Slug analysis completed",
      analysis,
      sampleArticles: articles.slice(0, 10).map(a => ({
        id: a.id,
        headline: a.headline,
        slug: a.slug,
        url_hash: a.url_hash,
        issues: [
          !a.slug && 'MISSING_SLUG',
          a.slug === a.url_hash && 'DUPLICATE_HASH',
          a.slug && /^[a-f0-9]{32}$/i.test(a.slug) && 'HASH_LIKE',
          a.slug && (slugMap.get(a.slug) || 0) > 1 && 'DUPLICATE_SLUG'
        ].filter(Boolean)
      }))
    });
    
  } catch (error) {
    console.error('Error in slug analysis:', error);
    return NextResponse.json(
      { 
        error: 'Failed to analyze slugs', 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}
