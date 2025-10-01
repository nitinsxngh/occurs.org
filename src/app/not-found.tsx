import { Metadata } from 'next';
import Link from 'next/link';
import { Newspaper, Home } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Page Not Found | occurs.org',
  description: 'The page you are looking for does not exist. Return to occurs.org for the latest news.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4">
        {/* 404 Visual */}
        <div className="mb-8">
          <Newspaper className="w-24 h-24 text-gray-400 mx-auto mb-4" />
          <h1 className="text-6xl font-black text-gray-900 dark:text-white mb-2">404</h1>
          <div className="w-16 h-1 bg-red-600 mx-auto"></div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The page you&apos;re looking for doesn&apos;t exist or has been moved. 
            Let&apos;s get you back to the latest news.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <Link href="/" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">
              Browse Latest News →
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © 2025 occurs.org - The Digital Chronicle
          </p>
        </div>
      </div>
    </div>
  );
}
