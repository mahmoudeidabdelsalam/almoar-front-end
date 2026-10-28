'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

function subscribeToSplash(onStoreChange: () => void): () => void {
  window.addEventListener('storage', onStoreChange);
  window.addEventListener('alomar-splash-change', onStoreChange);
  return () => {
    window.removeEventListener('storage', onStoreChange);
    window.removeEventListener('alomar-splash-change', onStoreChange);
  };
}

function getSplashSnapshot(): boolean {
  return !window.sessionStorage.getItem('alomar_splash_seen');
}

export const SplashIntro: React.FC = () => {
  const { locale, t, content } = useLanguage();
  const introSlide = content.heroSlides[0];
  const visible = useSyncExternalStore(subscribeToSplash, getSplashSnapshot, () => false);
  const [fading, setFading] = useState(false);

  const handleDismiss = React.useCallback(() => {
    setFading(true);
    setTimeout(() => {
      sessionStorage.setItem('alomar_splash_seen', 'true');
      window.dispatchEvent(new Event('alomar-splash-change'));
    }, 600);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => {
      handleDismiss();
    }, 3000);
    return () => clearTimeout(timer);
  }, [handleDismiss, visible]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#090D14] text-white transition-opacity duration-700 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Brand Introduction"
    >
      <div className="flex flex-col items-center text-center px-4 space-y-6 animate-in zoom-in-95 duration-700">
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
      <div className="absolute bottom-10 inset-x-0 flex justify-center">
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
