import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import CategoryFilter from './components/CategoryFilter';
import NewsList from './components/NewsList';
import ThemeToggle from './components/ThemeToggle';
import BookmarksList from './components/BookmarksList';
import RecentlyViewed from './components/RecentlyViewed';
import StockNews from './components/StockNews';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useDebounce } from './hooks/useUtilityHooks';
import { rateLimiter } from './utils/errorUtils';

const API_KEY = process.env.REACT_APP_NEWS_API_KEY || '95f304b755ff4246946d1f68453b55c9';
const NETLIFY_FUNCTION_URL = '/.netlify/functions/fetchNews';

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('general');
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useLocalStorage('recentlyViewed', []);

  const pageSize = 12;

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const fetchNews = useCallback(async () => {
    if (!rateLimiter.checkLimit('fetchNews')) {
      setError('Too many requests. Please wait a moment.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Build query parameters for Netlify function
      const params = new URLSearchParams({
        pageSize: pageSize.toString(),
        page: page.toString(),
        language: 'en'
      });

      let functionUrl;
      if (searchQuery) {
        params.append('q', searchQuery);
        params.append('type', 'everything');
        functionUrl = `${NETLIFY_FUNCTION_URL}?${params}`;
      } else {
        params.append('country', 'us');
        params.append('category', category);
        params.append('type', 'top-headlines');
        functionUrl = `${NETLIFY_FUNCTION_URL}?${params}`;
      }

      console.log('Fetching from Netlify function:', functionUrl);
      const response = await fetch(functionUrl);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      if (data.status === 'error') {
        throw new Error(data.message || 'Failed to fetch news');
      }

      if (!data.articles || !Array.isArray(data.articles)) {
        throw new Error('Invalid response format');
      }

      setArticles(data.articles);
      setTotalResults(data.totalResults || data.articles.length);
      setError(null);
    } catch (err) {
      console.error('News API Error:', err);
      setError(err.message || 'Failed to fetch news. Please try again later.');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [category, page, searchQuery, pageSize]);

  useEffect(() => {
    const controller = new AbortController();
    fetchNews().catch(error => {
      if (error.name === 'AbortError') {
        console.log('Fetch aborted');
      } else {
        console.error('Fetch error:', error);
      }
    });
    return () => controller.abort();
  }, [fetchNews]);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setCategory('general');
    setPage(1);
  }, []);

  const debouncedSearch = useDebounce(handleSearch, 500);

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setSearchQuery('');
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleBookmarks = () => {
    setShowBookmarks(!showBookmarks);
  };

  const trackArticleView = (article) => {
    const viewed = { ...article, viewedAt: new Date().toISOString() };
    setRecentlyViewed(prev => {
      const filtered = prev.filter(a => a.url !== article.url);
      return [viewed, ...filtered].slice(0, 20);
    });
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const totalPages = Math.ceil(totalResults / pageSize);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-lg text-gray-900 dark:text-gray-100">
        Skip to content
      </a>
      
      <Header showBookmarks={showBookmarks} onToggleBookmarks={toggleBookmarks} />
      
      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleBookmarks}
              className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                showBookmarks ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
              aria-label={showBookmarks ? 'Show all articles' : 'Show bookmarked articles'}
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
              {showBookmarks ? 'All Articles' : 'Bookmarks'}
            </button>
            <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          </div>
        </div>

        {!showBookmarks && (
          <>
            <div className="mb-8">
              <StockNews apiKey={API_KEY} />
            </div>

            <div className="space-y-4">
              <SearchBar onSearch={debouncedSearch} searchQuery={searchQuery} />
              <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                <CategoryFilter 
                  currentCategory={category} 
                  onCategoryChange={handleCategoryChange}
                  disabled={!!searchQuery}
                />
              </div>
            </div>
          </>
        )}

        {showBookmarks ? (
          <BookmarksList />
        ) : (
          <NewsList 
            articles={articles}
            loading={loading}
            error={error}
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onArticleView={trackArticleView}
          />
        )}

        {!showBookmarks && <RecentlyViewed articles={recentlyViewed} />}
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
            © 2024 News Feed App. Powered by NewsAPI.org
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;