const handler = async (event) => {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const { queryStringParameters } = event;
    
    // Get API key from environment variable
    const apiKey = process.env.REACT_APP_NEWS_API_KEY || '95f304b755ff4246946d1f68453b55c9';
    
    if (!apiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'API key not configured' })
      };
    }

    // Build the NewsAPI URL
    const { type, category, query, q, page, pageSize, domains, sortBy } = queryStringParameters || {};
    
    let url;
    const params = new URLSearchParams({
      apiKey: apiKey,
      pageSize: pageSize || '12',
      page: page || '1',
      language: 'en'
    });

    // Add all other parameters (domains, sortBy, etc.)
    Object.keys(queryStringParameters || {}).forEach(key => {
      if (!['type', 'category', 'query', 'page', 'pageSize'].includes(key)) {
        if (queryStringParameters[key]) {
          params.append(key, queryStringParameters[key]);
        }
      }
    });

    if (type === 'top-headlines') {
      params.append('country', queryStringParameters.country || 'us');
      if (category) {
        params.append('category', category);
      }
      url = `https://newsapi.org/v2/top-headlines?${params}`;
    } else if (type === 'everything') {
      // Add q parameter for everything endpoint if present
      if (query) {
        params.append('q', query);
      } else if (q) {
        params.append('q', q);
      }
      url = `https://newsapi.org/v2/everything?${params}`;
    } else {
      // Get all query params and construct the URL
      const apiParams = new URLSearchParams();
      apiParams.append('apiKey', apiKey);
      
      Object.keys(queryStringParameters || {}).forEach(key => {
        if (key !== 'type' && queryStringParameters[key]) {
          apiParams.append(key, queryStringParameters[key]);
        }
      });

      // If it has 'q' parameter, it's everything endpoint, otherwise top-headlines
      if (queryStringParameters.q) {
        url = `https://newsapi.org/v2/everything?${apiParams}`;
      } else {
        if (!apiParams.has('country')) {
          apiParams.append('country', 'us');
        }
        url = `https://newsapi.org/v2/top-headlines?${apiParams}`;
      }
    }

    console.log('Fetching from:', url);

    // Fetch from NewsAPI
    const response = await fetch(url);
    const data = await response.json();

    return {
      statusCode: response.status,
      headers,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to fetch news',
        message: error.message 
      })
    };
  }
};

module.exports = { handler };

