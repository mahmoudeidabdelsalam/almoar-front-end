import type { Metadata } from 'next';
import type { Locale } from '@/types';
import { createLocalizedMetadata } from '@/lib/seo';
import { wpClient } from './client';

export async function getPageMetadata(
  pageKey: string,
  fallback: Metadata,
  locale: Locale = 'ar',
  pathname = pageKey === 'contact' ? '/contact-us' : `/${pageKey}`,
): Promise<Metadata> {
  const content = await wpClient.getSiteContent();
  const banner = content.pageBanners[pageKey];
  const title = banner?.seoTitle[locale] || fallback.title;
  const description = banner?.seoDescription[locale] || fallback.description;
  if (typeof title !== 'string' || typeof description !== 'string') return fallback;
  return createLocalizedMetadata({
    title,
    description,
    locale,
    pathname: `/${locale}${pathname}`,
  });
}
