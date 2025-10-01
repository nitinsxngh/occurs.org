import { Metadata } from 'next';
import { Newspaper } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Loading... | occurs.org',
  robots: {
    index: false,
    follow: false,
  },
};

export default function Loading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        {/* Loading Animation */}
        <div className="mb-8">
          <Newspaper className="w-16 h-16 text-red-600 mx-auto mb-4 animate-pulse" />
          <div className="w-32 h-2 bg-red-600 mx-auto mb-4"></div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Loading Latest News...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Fetching the most recent articles for you
          </p>
        </div>

        {/* Loading Spinner */}
        <div className="mt-8">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>

        {/* Footer */}
        <div className="mt-12">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © 2025 occurs.org - The Digital Chronicle
          </p>
        </div>
      </div>
    </div>
  );
}
