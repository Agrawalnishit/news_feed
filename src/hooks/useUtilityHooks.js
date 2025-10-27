import { useCallback, useRef, useEffect, useState } from 'react';

export function useDebounce(callback, delay) {
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
}

export function useThrottle(callback, limit) {
  const inThrottle = useRef(false);

  return useCallback((...args) => {
    if (!inThrottle.current) {
      callback(...args);
      inThrottle.current = true;
      setTimeout(() => {
        inThrottle.current = false;
      }, limit);
    }
  }, [callback, limit]);
}

export function useIntersectionObserver(ref, options = {}, forward = true) {
  const callback = useRef();
  
  useEffect(() => {
    if (ref.current) {
      const observer = new IntersectionObserver(([entry]) => {
        if (callback.current && entry.isIntersecting === forward) {
          callback.current();
        }
      }, options);

      observer.observe(ref.current);

      return () => {
        observer.disconnect();
      };
    }
  }, [ref, options, forward]);

  return (cb) => {
    callback.current = cb;
  };
}

export function useMediaQuery(query) {
  const mediaQuery = window.matchMedia(query);
  const [match, setMatch] = useState(mediaQuery.matches);

  useEffect(() => {
    const handler = () => setMatch(mediaQuery.matches);
    mediaQuery.addListener(handler);
    return () => mediaQuery.removeListener(handler);
  }, [mediaQuery]);

  return match;
}