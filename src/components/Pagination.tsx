import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (page: number) => void;
  onNextPage: () => void;
  onPreviousPage: () => void;
  totalItems?: number;
}

export default function Pagination({
  currentPage,
  itemsPerPage,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
  onNextPage,
  onPreviousPage,
  totalItems
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems || 0);

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      {/* Items info */}
      <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
        <span>
          Showing {startItem} to {endItem} of {totalItems || 'many'} results
        </span>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center space-x-2">
        {/* First page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={!hasPreviousPage}
          className="p-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          title="First page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Previous page */}
        <button
          onClick={onPreviousPage}
          disabled={!hasPreviousPage}
          className="p-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Current page indicator */}
        <div className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md">
          Page {currentPage}
        </div>

        {/* Next page */}
        <button
          onClick={onNextPage}
          disabled={!hasNextPage}
          className="p-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last page (if we can determine it) */}
        {totalItems && (
          <button
            onClick={() => onPageChange(Math.ceil(totalItems / itemsPerPage))}
            disabled={!hasNextPage}
            className="p-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Last page"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
