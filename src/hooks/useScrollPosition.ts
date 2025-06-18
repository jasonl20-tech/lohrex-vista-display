
import { useEffect, useRef } from 'react';

export const useScrollPosition = (key: string) => {
  const scrollPositions = useRef<{ [key: string]: number }>({});

  const saveScrollPosition = (customKey?: string) => {
    const positionKey = customKey || key;
    scrollPositions.current[positionKey] = window.scrollY;
    // Also save to sessionStorage for persistence across navigation
    sessionStorage.setItem(`scroll-${positionKey}`, window.scrollY.toString());
  };

  const restoreScrollPosition = (customKey?: string) => {
    const positionKey = customKey || key;
    let position = scrollPositions.current[positionKey];
    
    // Try to get from sessionStorage if not in memory
    if (position === undefined) {
      const saved = sessionStorage.getItem(`scroll-${positionKey}`);
      position = saved ? parseInt(saved, 10) : 0;
    }

    if (position) {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        window.scrollTo({ top: position, behavior: 'smooth' });
      });
    }
  };

  const clearScrollPosition = (customKey?: string) => {
    const positionKey = customKey || key;
    delete scrollPositions.current[positionKey];
    sessionStorage.removeItem(`scroll-${positionKey}`);
  };

  return {
    saveScrollPosition,
    restoreScrollPosition,
    clearScrollPosition
  };
};
