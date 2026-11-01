import type { Metadata } from 'next';
import type { Locale } from '@/types';

export const SITE_URL = 'https://artlanguage.co';
export const SITE_NAME = 'Alomar Holding | العمر القابضة';
export const DEFAULT_SOCIAL_IMAGE = '/images/hero_riyadh.jpg';

type LocalizedMetadataOptions = {
  title: string;
  description: string;
  locale: Locale;
  pathname: string;
  alternateLocales?: Locale[];
  image?: string;
  imageAlt?: string;
  publishedTime?: string;
  type?: 'website' | 'article';
};

export function getSiteUrl(pathname = ''): string {
  return new URL(pathname, SITE_URL).toString();
}

export function getSocialImageUrl(image?: string): string {
  if (!image) return getSiteUrl(DEFAULT_SOCIAL_IMAGE);

  try {
    const imageUrl = new URL(image, SITE_URL);
    if (imageUrl.protocol !== 'https:' && imageUrl.protocol !== 'http:') {
      return getSiteUrl(DEFAULT_SOCIAL_IMAGE);
    }
    if (
      imageUrl.hostname === 'localhost'
      || imageUrl.hostname === '127.0.0.1'
      || imageUrl.hostname.endsWith('.localhost')
      || imageUrl.hostname.endsWith('.test')
    ) {
      return getSiteUrl(DEFAULT_SOCIAL_IMAGE);
    }
    if (imageUrl.hostname === 'admin.artlanguage.co') {
      const proxyUrl = new URL('/_next/image', SITE_URL);
      proxyUrl.searchParams.set('url', imageUrl.toString());
      proxyUrl.searchParams.set('w', '1200');
      proxyUrl.searchParams.set('q', '75');
      return proxyUrl.toString();
    }
    return imageUrl.toString();
  } catch {
    return getSiteUrl(DEFAULT_SOCIAL_IMAGE);
  }
}

export function createLocalizedMetadata({
  title,
  description,
  locale,
  pathname,
  alternateLocales = ['ar', 'en'],
  image,
  imageAlt,
  publishedTime,
  type = 'website',
}: LocalizedMetadataOptions): Metadata {
  const canonical = getSiteUrl(pathname);
  const languages = Object.fromEntries(
    alternateLocales.map((alternateLocale) => [
      alternateLocale,
      getSiteUrl(`/${alternateLocale}${pathname.replace(/^\/(?:ar|en)(?=\/|$)/, '')}`),
    ]),
  );
  const socialImage = getSocialImageUrl(image);

  return {
    title,
    description,
    alternates: {
      canonical,
      ...(alternateLocales.length > 1 ? { languages } : {}),
    },
    openGraph: type === 'article'
      ? {
          title,
          description,
          url: canonical,
          siteName: SITE_NAME,
          locale: locale === 'ar' ? 'ar_SA' : 'en_US',
          type: 'article',
          ...(publishedTime ? { publishedTime } : {}),
          images: [{ url: socialImage, ...(imageAlt ? { alt: imageAlt } : {}) }],
        }
      : {
          title,
          description,
          url: canonical,
          siteName: SITE_NAME,
          locale: locale === 'ar' ? 'ar_SA' : 'en_US',
          type: 'website',
          images: [{ url: socialImage, ...(imageAlt ? { alt: imageAlt } : {}) }],
        },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [socialImage],
    },
  };
}
