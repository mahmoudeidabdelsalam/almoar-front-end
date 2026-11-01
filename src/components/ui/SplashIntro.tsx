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
  const { locale, t, content } = useLanguage();
  const introSlide = content.heroSlides[0];
  const visible = useSyncExternalStore(subscribeToSplash, getSplashSnapshot, getServerSplashSnapshot);
  const [fading, setFading] = useState(false);
  const dismissTimer = React.useRef<number | null>(null);

  const handleDismiss = React.useCallback(() => {
    if (dismissTimer.current !== null) return;
    setFading(true);
    dismissTimer.current = window.setTimeout(() => {
      safeSetItem('session', 'alomar_splash_seen', 'true');
      window.dispatchEvent(new Event('alomar-splash-change'));
    }, 900);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => {
      handleDismiss();
    }, 3000);
    return () => clearTimeout(timer);
  }, [handleDismiss, visible]);

  useEffect(() => () => {
    if (dismissTimer.current !== null) window.clearTimeout(dismissTimer.current);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`splash-intro text-white ${fading ? 'is-done' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Brand Introduction"
    >
      <div className="splash-intro__content flex flex-col items-center space-y-6 px-4 text-center">
        {/* Golden Emblem */}
        <div className="relative w-28 h-28 md:w-36 md:h-36 drop-shadow-[0_10px_25px_rgba(183,145,61,0.25)]">
          <Image
            src="/branding/alomar_logo_mark.png"
            alt="Alomar Holding Emblem"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Brand Typography */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
            {locale === 'ar' ? content.settings.site_name.ar : content.settings.site_name.en}
          </h1>
          <p className="text-[#B7913D] text-sm md:text-base font-semibold tracking-widest uppercase">
            {locale === 'ar' ? content.settings.tagline.ar : content.settings.tagline.en}
          </p>
        </div>

        {/* Elegant divider */}
        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#B7913D] to-transparent my-2" />

        {/* Subtitle */}
        <p className="text-white/60 text-xs md:text-sm max-w-md leading-relaxed">
          {(locale === 'ar' ? introSlide?.desc_ar : introSlide?.desc_en) || t.hero.subtitle}
        </p>
      </div>

      {/* Skip Button (تخطي) from Prototype */}
      <div className="absolute inset-x-0 bottom-[calc(2.5rem+env(safe-area-inset-bottom))] flex justify-center">
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
