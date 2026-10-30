import type { Metadata } from 'next';
import type { Locale } from '@/types';
import { wpClient } from './client';

export async function getPageMetadata(pageKey: string, fallback: Metadata, locale: Locale = 'ar'): Promise<Metadata> {
  const content = await wpClient.getSiteContent();
  const banner = content.pageBanners[pageKey];
  return {
    ...fallback,
    title: banner?.seoTitle[locale] || (content.previewMode ? fallback.title : undefined),
    description: banner?.seoDescription[locale] || (content.previewMode ? fallback.description : undefined),
  };
}
