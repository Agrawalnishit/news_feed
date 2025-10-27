import React from 'react';
import NewsCard from './NewsCard';
import { useLocalStorage } from '../hooks/useLocalStorage';

const BookmarksList = () => {
  const [bookmarks] = useLocalStorage('bookmarkedArticles', []);

  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          No bookmarks yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Articles you bookmark will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Your Bookmarks
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookmarks.map((article) => (
          <NewsCard 
            key={article.url} 
            article={article}
            isBookmarked={true}
          />
        ))}
      </div>
    </div>
  );
};

export default BookmarksList;