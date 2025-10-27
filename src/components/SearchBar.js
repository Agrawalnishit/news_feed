import React, { useState } from 'react';

const SearchBar = ({ onSearch, searchQuery }) => {
  const [input, setInput] = useState(searchQuery);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(input.trim());
  };

  const handleClear = () => {
    setInput('');
    onSearch('');
  };

  return (
    <div className="mb-8">
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg 
              className="h-5 w-5 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </div>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search news articles..."
            className="block w-full pl-12 pr-24 py-4 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                     focus:ring-2 focus:ring-primary focus:border-transparent
                     placeholder-gray-400 dark:placeholder-gray-500
                     transition-all duration-200"
          />
          
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 space-x-2">
            {input && (
              <button
                type="button"
                onClick={handleClear}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 
                       transition-colors duration-200 font-medium"
            >
              Search
            </button>
          </div>
        </div>
      </form>
      
      {searchQuery && (
        <div className="max-w-2xl mx-auto mt-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing results for: <span className="font-semibold text-gray-900 dark:text-gray-100">"{searchQuery}"</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
