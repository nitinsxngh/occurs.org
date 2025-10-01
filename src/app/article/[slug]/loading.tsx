export default function ArticleLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header Skeleton */}
      <header className="bg-white dark:bg-gray-900 border-b-4 border-black dark:border-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </header>

      {/* Article Content Skeleton */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="newspaper-card">
          {/* Header Skeleton */}
          <div className="p-8 border-b-2 border-black dark:border-white">
            <div className="mb-4">
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            
            {/* Title Skeleton */}
            <div className="space-y-3 mb-6">
              <div className="h-8 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-8 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            
            {/* Meta info skeleton */}
            <div className="flex gap-4 mb-6">
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>

            {/* Summary skeleton */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 border-l-4 border-red-600">
              <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-3"></div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Image skeleton */}
          <div className="p-8 border-b-2 border-black dark:border-white">
            <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>

          {/* Content skeleton */}
          <div className="p-8">
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-6"></div>
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
