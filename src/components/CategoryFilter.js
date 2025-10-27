import React from 'react';

const categories = [
  { id: 'general', name: 'General', icon: '📰' },
  { id: 'business', name: 'Business', icon: '💼' },
  { id: 'technology', name: 'Technology', icon: '💻' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
  { id: 'health', name: 'Health', icon: '🏥' },
  { id: 'science', name: 'Science', icon: '🔬' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
];

const CategoryFilter = ({ currentCategory, onCategoryChange, disabled }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
          Categories
        </h2>
      </div>
      
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            disabled={disabled}
            className={`
              px-4 py-2 rounded-lg font-medium transition-all duration-200
              flex items-center space-x-2
              ${disabled 
                ? 'opacity-50 cursor-not-allowed bg-gray-200 dark:bg-gray-700 text-gray-500' 
                : currentCategory === cat.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md hover:scale-105 border border-gray-200 dark:border-gray-700'
              }
            `}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>
      
      {disabled && (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3">
          Clear search to use category filters
        </p>
      )}
    </div>
  );
};

export default CategoryFilter;
