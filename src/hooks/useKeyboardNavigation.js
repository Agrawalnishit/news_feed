import { useEffect, useCallback } from 'react';

export function useKeyboardNavigation() {
  const handleKeyDown = useCallback((event) => {
    // Handle Escape key
    if (event.key === 'Escape') {
      // Close any open modals or dropdowns
      document.querySelectorAll('[role="dialog"]').forEach(dialog => {
        if (dialog.getAttribute('aria-hidden') === 'false') {
          dialog.setAttribute('aria-hidden', 'true');
        }
      });
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}