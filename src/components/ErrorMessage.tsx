import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-600 dark:border-red-400 p-8 text-center newspaper-card">
      <div className="flex items-center justify-center gap-2 text-red-600 dark:text-red-400 mb-4">
        <AlertCircle className="w-8 h-8" />
        <h3 className="newspaper-headline text-xl">ERROR LOADING NEWS</h3>
      </div>
      <p className="newspaper-body text-red-700 dark:text-red-300 mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors border border-red-600"
        >
          <RefreshCw className="w-4 h-4" />
          TRY AGAIN
        </button>
      )}
    </div>
  );
}
