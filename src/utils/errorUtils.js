// Error types
export const ErrorTypes = {
  API: 'API_ERROR',
  NETWORK: 'NETWORK_ERROR',
  AUTH: 'AUTH_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
};

// Error messages
export const ErrorMessages = {
  [ErrorTypes.API]: 'An error occurred while fetching data. Please try again later.',
  [ErrorTypes.NETWORK]: 'Please check your internet connection and try again.',
  [ErrorTypes.AUTH]: 'Authentication failed. Please check your API key.',
  [ErrorTypes.VALIDATION]: 'Invalid data received. Please try again.',
  [ErrorTypes.UNKNOWN]: 'An unexpected error occurred. Please try again later.'
};

// Error handler function
export const handleError = (error) => {
  console.error('Error occurred:', error);

  if (error.message.includes('api key')) {
    return {
      type: ErrorTypes.AUTH,
      message: ErrorMessages[ErrorTypes.AUTH]
    };
  }

  if (error.message.includes('network') || error.message.includes('fetch')) {
    return {
      type: ErrorTypes.NETWORK,
      message: ErrorMessages[ErrorTypes.NETWORK]
    };
  }

  if (error.message.includes('invalid') || error.message.includes('required')) {
    return {
      type: ErrorTypes.VALIDATION,
      message: ErrorMessages[ErrorTypes.VALIDATION]
    };
  }

  return {
    type: ErrorTypes.UNKNOWN,
    message: ErrorMessages[ErrorTypes.UNKNOWN]
  };
};

// Validation utility
export const validateArticle = (article) => {
  const required = ['title', 'description', 'url'];
  const missing = required.filter(field => !article[field]);
  
  if (missing.length > 0) {
    throw new Error(`Invalid article data. Missing required fields: ${missing.join(', ')}`);
  }
  
  return {
    ...article,
    title: article.title || 'Untitled',
    description: article.description || 'No description available',
    urlToImage: article.urlToImage || null,
    publishedAt: article.publishedAt || new Date().toISOString(),
    source: article.source || { name: 'Unknown Source' }
  };
};

// API response validator
export const validateAPIResponse = (data) => {
  if (!data) {
    throw new Error('Empty response received');
  }

  if (data.status === 'error') {
    throw new Error(data.message || 'API returned an error');
  }

  if (!Array.isArray(data.articles)) {
    throw new Error('Invalid articles data received');
  }

  return {
    articles: data.articles.map(validateArticle),
    totalResults: data.totalResults || data.articles.length
  };
};

// Rate limiting utility
export const rateLimiter = (() => {
  const requests = new Map();
  const maxRequests = 10;
  const timeWindow = 5000; // 5 seconds

  return {
    checkLimit: (key) => {
      const now = Date.now();
      const windowStart = now - timeWindow;
      const requestTimes = requests.get(key) || [];
      const recentRequests = requestTimes.filter(time => time > windowStart);

      if (recentRequests.length >= maxRequests) {
        return false;
      }

      recentRequests.push(now);
      requests.set(key, recentRequests);
      return true;
    }
  };
})();