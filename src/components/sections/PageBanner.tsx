'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import type { ContactPageContent } from '@/types';

interface PageBannerProps {
  pageKey: string;
  imageFallback: string;
  imageAlt: string;
  badgeFallback: string;
  titleFallback: string;
  descriptionFallback: string;
  contactContent?: ContactPageContent | null;
}

export const PageBanner: React.FC<PageBannerProps> = ({
  pageKey,
  imageFallback,
  imageAlt,
  badgeFallback,
  titleFallback,
  descriptionFallback,
  contactContent,
}) => {
  const { locale, content } = useLanguage();
  const banner = content.pageBanners[pageKey];
  const useFallbackCopy = content.previewMode;
  if (!useFallbackCopy && !contactContent?.badge[locale] && !contactContent?.title[locale] && !contactContent?.description[locale] && !banner?.badge[locale] && !banner?.title[locale] && !banner?.description[locale]) return null;

  return (
    <div className="relative py-20 lg:py-28 bg-[#101E39] text-white overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <Image
          src={contactContent?.bannerImage || banner?.image || imageFallback}
          alt={imageAlt}
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-[#B7913D]">
          {contactContent?.badge[locale] || banner?.badge[locale] || (useFallbackCopy ? badgeFallback : '')}
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
          {contactContent?.title[locale] || banner?.title[locale] || (useFallbackCopy ? titleFallback : '')}
        </h1>
        <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
          {contactContent?.description[locale] || banner?.description[locale] || (useFallbackCopy ? descriptionFallback : '')}
        </p>
      </div>
    </div>
  );
};
