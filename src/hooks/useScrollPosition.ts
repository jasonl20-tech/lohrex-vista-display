
import { useEffect, useRef } from 'react';

export const useScrollPosition = (key: string) => {
  const scrollPositions = useRef<{ [key: string]: number }>({});

  const saveScrollPosition = (customKey?: string) => {
    const positionKey = customKey || key;
    const position = window.scrollY;
    scrollPositions.current[positionKey] = position;
    
    // Also save to sessionStorage for persistence across navigation
    sessionStorage.setItem(`scroll-${positionKey}`, position.toString());
    console.log(`Saved scroll position for ${positionKey}:`, position);
  };

  const restoreScrollPosition = (customKey?: string) => {
    const positionKey = customKey || key;
    let position = scrollPositions.current[positionKey];
    
    // Try to get from sessionStorage if not in memory
    if (position === undefined) {
      const saved = sessionStorage.getItem(`scroll-${positionKey}`);
      position = saved ? parseInt(saved, 10) : 0;
    }

    console.log(`Restoring scroll position for ${positionKey}:`, position);

    if (position && position > 0) {
      // Use multiple attempts to ensure DOM is ready
      const attemptRestore = (attempts = 0) => {
        if (attempts < 5) {
          setTimeout(() => {
            window.scrollTo({ top: position, behavior: 'auto' });
            // Check if scroll was successful
            if (Math.abs(window.scrollY - position) > 50) {
              attemptRestore(attempts + 1);
            }
          }, 50 * (attempts + 1));
        }
      };
      attemptRestore();
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
