'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { safeGetItem, safeSetItem } from '@/lib/safe-storage';

function subscribeToSplash(onStoreChange: () => void): () => void {
  window.addEventListener('storage', onStoreChange);
  window.addEventListener('alomar-splash-change', onStoreChange);
  return () => {
    window.removeEventListener('storage', onStoreChange);
    window.removeEventListener('alomar-splash-change', onStoreChange);
  };
}

function getSplashSnapshot(): boolean {
  return !safeGetItem('session', 'alomar_splash_seen');
}

function getServerSplashSnapshot(): boolean {
  return true;
}

export const SplashIntro: React.FC = () => {
  const { locale, t } = useLanguage();
  const visible = useSyncExternalStore(subscribeToSplash, getSplashSnapshot, getServerSplashSnapshot);
  const [fading, setFading] = useState(false);
  const dismissTimer = React.useRef<number | null>(null);

  const handleDismiss = React.useCallback(() => {
    if (dismissTimer.current !== null) return;
    setFading(true);
    const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 900;
    dismissTimer.current = window.setTimeout(() => {
      safeSetItem('session', 'alomar_splash_seen', 'true');
      window.dispatchEvent(new Event('alomar-splash-change'));
    }, delay);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 3000;
    const timer = setTimeout(() => {
      handleDismiss();
    }, delay);
    return () => clearTimeout(timer);
  }, [handleDismiss, visible]);

  useEffect(() => () => {
    if (dismissTimer.current !== null) window.clearTimeout(dismissTimer.current);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`splash-intro text-white ${fading ? 'is-done' : ''}`}
      role="status"
      aria-label={locale === 'ar' ? 'جاري التحميل' : 'Loading'}
    >
      <div className="splash-intro__content relative h-full w-full">
        <Image
          src="/branding/loader.gif"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          unoptimized
          priority
        />
      </div>

      <div className="absolute inset-x-0 bottom-[calc(28px+env(safe-area-inset-bottom))] flex justify-center">
        <button
          type="button"
          onClick={handleDismiss}
          className="text-white/60 hover:text-white text-xs md:text-sm tracking-wider py-2 px-5 rounded-full border border-white/15 hover:border-white/40 bg-white/5 hover:bg-white/10 transition-all duration-300"
        >
          {t.hero.skip_intro}
        </button>
      </div>
    </div>
  );
};
