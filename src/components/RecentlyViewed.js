import React from 'react';

const RecentlyViewed = ({ articles }) => {
  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Recently Viewed
      </h2>
      <div className="space-y-4">
        {articles.map((article) => (
          <a
            key={article.url}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block group hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-3 transition-colors duration-200"
          >
            <div className="flex items-start space-x-4">
              {article.urlToImage && (
                <img
                  src={article.urlToImage}
                  alt=""
                  className="w-16 h-16 object-cover rounded"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                  {article.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {new Date(article.viewedAt).toLocaleDateString()} • {article.source.name}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewed;