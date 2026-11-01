'use client';

import { useEffect } from 'react';

const REVEAL_SELECTOR = '[data-scroll-reveal]';

export function ScrollRevealObserver() {
  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const observedElements = new WeakSet<Element>();
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll(REVEAL_SELECTOR).forEach((element) => {
        element.classList.add('is-revealed');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.remove('is-pending');
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15 },
    );

    const revealNow = (element: Element) => {
      element.classList.remove('is-pending');
      element.classList.add('is-revealed');
    };

    const prepareElement = (element: Element) => {
      if (observedElements.has(element)) return;
      observedElements.add(element);
      if (motionPreference.matches) {
        revealNow(element);
        return;
      }

      const bounds = element.getBoundingClientRect();
      if (bounds.top < window.innerHeight && bounds.bottom > 0) {
        revealNow(element);
        return;
      }
      element.classList.add('is-pending');
      observer.observe(element);
    };

    const scan = (root: ParentNode) => {
      if (root instanceof Element && root.matches(REVEAL_SELECTOR)) prepareElement(root);
      root.querySelectorAll(REVEAL_SELECTOR).forEach(prepareElement);
    };

    scan(document);
    const mutations = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (node instanceof Element) scan(node);
        });
      });
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    const handleMotionPreference = () => {
      if (!motionPreference.matches) return;
      document.querySelectorAll(`${REVEAL_SELECTOR}.is-pending`).forEach(revealNow);
      observer.disconnect();
    };
    motionPreference.addEventListener('change', handleMotionPreference);

    return () => {
      mutations.disconnect();
      observer.disconnect();
      motionPreference.removeEventListener('change', handleMotionPreference);
    };
  }, []);

  return null;
}
