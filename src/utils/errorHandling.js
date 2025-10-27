// Error handling utilities
export const handleError = (error) => {
  // Log the error
  console.error('Application Error:', error);

  // Check if it's a network error
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    return {
      type: 'NETWORK_ERROR',
      message: 'Unable to connect to the server. Please check your internet connection.'
    };
  }

  // Check if it's a service worker error
  if (error.name === 'SecurityError' && error.message.includes('Service Worker')) {
    return {
      type: 'SERVICE_WORKER_ERROR',
      message: 'Unable to register service worker. The app will continue to work without offline capabilities.'
    };
  }

  // Default error
  return {
    type: 'UNKNOWN_ERROR',
    message: 'An unexpected error occurred. Please try refreshing the page.'
  };
};

// Performance monitoring
export const measurePerformance = (operation) => {
  const start = performance.now();
  return {
    end: () => {
      const duration = performance.now() - start;
      console.debug(`Performance: ${operation} took ${duration.toFixed(2)}ms`);
      return duration;
    }
  };
};

// Service worker utilities
export const checkServiceWorkerUpdate = async (registration) => {
  try {
    await registration.update();
    if (registration.waiting) {
      return true;
    }
  } catch (error) {
    console.warn('Service worker update check failed:', error);
  }
  return false;
};

// Network status checker
export const checkOnlineStatus = () => {
  const updateOnlineStatus = () => {
    const condition = navigator.onLine ? 'online' : 'offline';
    console.log(`Application is now ${condition}`);
    return condition;
  };

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);

  return updateOnlineStatus();
};