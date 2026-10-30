import type { Metadata } from 'next';
import type { Locale } from '@/types';
import { wpClient } from './client';

export async function getPageMetadata(pageKey: string, fallback: Metadata, locale: Locale = 'ar'): Promise<Metadata> {
  const content = await wpClient.getSiteContent();
  const banner = content.pageBanners[pageKey];
  return {
    ...fallback,
    title: banner?.seoTitle[locale] || fallback.title,
    description: banner?.seoDescription[locale] || fallback.description,
  };
}
