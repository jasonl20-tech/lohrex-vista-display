
import { useEffect, useRef } from 'react';
import type { CarouselApi } from "@/components/ui/carousel";

export const useAutoCarousel = (api: CarouselApi | undefined, interval: number = 4000) => {
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!api) return;

    const startAutoScroll = () => {
      intervalRef.current = setInterval(() => {
        if (api.canScrollNext()) {
          api.scrollNext();
        } else {
          api.scrollTo(0);
        }
      }, interval);
    };

    const stopAutoScroll = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };

    // Start auto scroll
    startAutoScroll();

    // Pause on hover/interaction
    const carousel = api.rootNode();
    if (carousel) {
      carousel.addEventListener('mouseenter', stopAutoScroll);
      carousel.addEventListener('mouseleave', startAutoScroll);
    }

    return () => {
      stopAutoScroll();
      if (carousel) {
        carousel.removeEventListener('mouseenter', stopAutoScroll);
        carousel.removeEventListener('mouseleave', startAutoScroll);
      }
    };
  }, [api, interval]);
};
