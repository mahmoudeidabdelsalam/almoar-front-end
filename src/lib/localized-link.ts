import { SITE_URL } from '@/lib/seo';
import type { Locale } from '@/types';

export function localizedLink(url: string, locale: Locale): string {
  if (!url || /^(mailto:|tel:)/i.test(url) || url.startsWith('//')) return url;

  try {
    const base = new URL(SITE_URL);
    const target = new URL(url, base);
    const localHost = target.hostname === 'localhost' || target.hostname === '127.0.0.1';
    if (target.origin !== base.origin && !localHost) return url;

    const segments = target.pathname.split('/').filter(Boolean);
    if (segments[0] === 'ar' || segments[0] === 'en') {
      return `${target.pathname}${target.search}${target.hash}`;
    }

    const path = target.pathname === '/' ? '' : target.pathname;
    return `/${locale}${path}${target.search}${target.hash}`;
  } catch {
    return url;
  }
}
