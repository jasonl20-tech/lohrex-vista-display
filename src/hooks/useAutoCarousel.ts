
import { useEffect, useRef } from 'react';
import type { CarouselApi } from "@/components/ui/carousel";

export const useAutoCarousel = (api: CarouselApi | undefined, interval: number = 4000) => {
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!api) {
      console.log('Auto-carousel: API not available yet');
      return;
    }

    console.log('Auto-carousel: Setting up auto-scroll');

    const startAutoScroll = () => {
      console.log('Auto-carousel: Starting auto-scroll');
      intervalRef.current = setInterval(() => {
        console.log('Auto-carousel: Attempting to scroll');
        if (api.canScrollNext()) {
          console.log('Auto-carousel: Scrolling to next');
          api.scrollNext();
        } else {
          console.log('Auto-carousel: Scrolling to start');
          api.scrollTo(0);
        }
      }, interval);
    };

    const stopAutoScroll = () => {
      console.log('Auto-carousel: Stopping auto-scroll');
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
    };

    // Start auto scroll immediately
    startAutoScroll();

    // Set up hover events
    const carousel = api.rootNode();
    if (carousel) {
      console.log('Auto-carousel: Adding event listeners');
      carousel.addEventListener('mouseenter', stopAutoScroll);
      carousel.addEventListener('mouseleave', startAutoScroll);
    }

    return () => {
      console.log('Auto-carousel: Cleaning up');
      stopAutoScroll();
      if (carousel) {
        carousel.removeEventListener('mouseenter', stopAutoScroll);
        carousel.removeEventListener('mouseleave', startAutoScroll);
      }
    };
  }, [api, interval]);
};
