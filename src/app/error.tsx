'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4">
        {/* Error Visual */}
        <div className="mb-8">
          <AlertTriangle className="w-24 h-24 text-red-600 mx-auto mb-4" />
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">Error</h1>
          <div className="w-16 h-1 bg-red-600 mx-auto"></div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We encountered an unexpected error. Don&apos;t worry, our team has been notified.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
          
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              <Home className="w-5 h-5" />
              Back to Home
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
