import React, { useState, useEffect } from 'react';
import NewsCard from './NewsCard';

const StockNews = ({ apiKey }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const stockSources = {
    'bloomberg.com': 'Bloomberg',
    'ft.com': 'Financial Times',
    'wsj.com': 'Wall Street Journal',
    'reuters.com': 'Reuters',
    'marketwatch.com': 'MarketWatch',
    'businessinsider.com': 'Business Insider'
  };

  // Fetch stock market news from selected sources
  useEffect(() => {
    const fetchStockNews = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          q: '(stock OR market OR trading OR investment OR stocks OR shares OR finance)',
          domains: Object.keys(stockSources).join(','),
          sortBy: 'publishedAt',
          pageSize: '9',
          language: 'en',
          type: 'everything'
        });

        const response = await fetch(`/.netlify/functions/fetchNews?${params}`);
        const data = await response.json();

        if (data.status === 'error') {
          if (data.code === 'rateLimited') {
            throw new Error('API rate limit exceeded. Please try again later.');
          } else if (data.code === 'apiKeyInvalid') {
            throw new Error('Invalid API key. Please check your configuration.');
          } else if (data.code === 'apiKeyMissing') {
            throw new Error('API key is missing. Please check your configuration.');
          } else {
            throw new Error(data.message || 'Failed to fetch stock news');
          }
        }

        if (data.status === 'ok' && Array.isArray(data.articles)) {
          setNews(data.articles);
        } else {
          throw new Error('Invalid response format from news API');
        }
      } catch (err) {
        console.error('Stock News API Error:', err);
        setError(err.message || 'Something went wrong. Please try again later.');
        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStockNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey]);

  if (loading) {
    return (
      <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900 rounded-lg p-4">
        <p className="text-red-600 dark:text-red-200">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Market & Financial News
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((article, index) => (
          <NewsCard
            key={`${article.url}-${index}`}
            article={article}
          />
        ))}
      </div>
    </div>
  );
};

export default StockNews;