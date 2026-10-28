import type { Locale, LocalizedString } from '@/types';

export function getLocalized<T extends { ar?: string | null; en?: string | null }>(field: T | null | undefined, locale: Locale, fallback: Locale = locale === 'ar' ? 'en' : 'ar'): string {
  if (!field) return '';
  const preferred = field[locale]?.trim();
  if (preferred) return preferred;
  return field[fallback]?.trim() || '';
}

export function getLocalizedString(field: LocalizedString | null | undefined, locale: Locale): string {
  return getLocalized(field, locale);
}

export function formatDate(date: string | Date, locale: Locale, options?: Intl.DateTimeFormatOptions): string {
  const value = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(value.getTime())) return '';
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-SA' : 'en-SA', options || { year: 'numeric', month: 'long', day: 'numeric' }).format(value);
}

export function formatNumber(value: number, locale: Locale, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-SA', options).format(value);
}
