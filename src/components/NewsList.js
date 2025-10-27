import React from 'react';
import NewsCard from './NewsCard';

const NewsList = ({ articles, loading, error, page, totalPages, onPageChange }) => {
  // Loading State
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="h-48 shimmer"></div>
            <div className="p-5">
              <div className="h-6 shimmer rounded mb-3"></div>
              <div className="h-4 shimmer rounded mb-2"></div>
              <div className="h-4 shimmer rounded mb-4 w-3/4"></div>
              <div className="h-10 shimmer rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <svg className="w-16 h-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Oops! Something went wrong
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
          {error}
        </p>
      </div>
    );
  }

  // No Results
  if (!articles || articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          No articles found
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Try a different search term or category
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {articles.map((article, index) => (
          <NewsCard key={`${article.url}-${index}`} article={article} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200
              ${page === 1
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
              }`}
          >
            ← Previous
          </button>

          <div className="flex items-center space-x-2">
            {[...Array(Math.min(5, totalPages))].map((_, index) => {
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = index + 1;
              } else if (page <= 3) {
                pageNumber = index + 1;
              } else if (page >= totalPages - 2) {
                pageNumber = totalPages - 4 + index;
              } else {
                pageNumber = page - 2 + index;
              }

              return (
                <button
                  key={pageNumber}
                  onClick={() => onPageChange(pageNumber)}
                  className={`w-10 h-10 rounded-lg font-medium transition-all duration-200
                    ${page === pageNumber
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                    }`}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200
              ${page === totalPages
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
              }`}
          >
            Next →
          </button>
        </div>
      )}

      {/* Page Info */}
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Page {page} of {totalPages}
        </p>
      </div>
    </>
  );
};

export default NewsList;
