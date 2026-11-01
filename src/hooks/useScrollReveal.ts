'use client';

import { useEffect, useRef } from 'react';

export function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !('IntersectionObserver' in window)) return;

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const reveal = () => {
      element.classList.remove('is-pending');
      element.classList.add('is-revealed');
    };

    if (motionPreference.matches) return;

    const bounds = element.getBoundingClientRect();
    if (bounds.top < window.innerHeight && bounds.bottom > 0) {
      reveal();
      return;
    }

    element.querySelectorAll<HTMLElement>('[data-reveal-item]').forEach((item, index) => {
      item.style.setProperty('--reveal-delay', `${index * 90}ms`);
    });
    element.classList.add('is-pending');
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        reveal();
        observer.disconnect();
      },
      { threshold: 0.18, rootMargin: '0px 0px -6% 0px' },
    );
    observer.observe(element);

    const handleMotionPreference = () => {
      if (!motionPreference.matches) return;
      reveal();
      observer.disconnect();
    };
    motionPreference.addEventListener('change', handleMotionPreference);

    return () => {
      observer.disconnect();
      motionPreference.removeEventListener('change', handleMotionPreference);
    };
  }, []);

  return ref;
}
