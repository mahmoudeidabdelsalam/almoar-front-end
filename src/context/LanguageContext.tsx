'use client';

import React, { createContext, useContext, useEffect, useSyncExternalStore } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Locale, SiteContent } from '@/types';
import { translations } from '@/lib/i18n/translations';

interface LanguageContextType {
  locale: Locale;
  setLocale: (loc: Locale) => void;
  dir: 'rtl' | 'ltr';
  t: (typeof translations)['ar'];
  content: SiteContent;
  toggleLocale: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function subscribeToLocale(onStoreChange: () => void): () => void {
  window.addEventListener('storage', onStoreChange);
  window.addEventListener('alomar-locale-change', onStoreChange);
  return () => {
    window.removeEventListener('storage', onStoreChange);
    window.removeEventListener('alomar-locale-change', onStoreChange);
  };
}

function getLocaleSnapshot(): Locale {
  const saved = window.localStorage.getItem('alomar_locale');
  return saved === 'ar' || saved === 'en' ? saved : 'ar';
}

export const LanguageProvider: React.FC<{ children: React.ReactNode; content: SiteContent }> = ({ children, content }) => {
  const storedLocale = useSyncExternalStore(subscribeToLocale, getLocaleSnapshot, (): Locale => 'ar');
  const pathname = usePathname();
  const router = useRouter();
  const pathLocale = pathname.split('/')[1] === 'en' ? 'en' : pathname.split('/')[1] === 'ar' ? 'ar' : null;
  const locale: Locale = pathLocale || storedLocale;

  useEffect(() => {
    const dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
    localStorage.setItem('alomar_locale', locale);
  }, [locale]);

  const setLocale = (newLoc: Locale) => {
    localStorage.setItem('alomar_locale', newLoc);
    window.dispatchEvent(new Event('alomar-locale-change'));
    const segments = pathname.split('/').filter(Boolean);
    if (segments[0] === 'ar' || segments[0] === 'en') {
      segments[0] = newLoc;
    } else {
      segments.unshift(newLoc);
    }
    router.push(`/${segments.join('/')}`);
  };

  const toggleLocale = () => {
    setLocale(locale === 'ar' ? 'en' : 'ar');
  };

  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const t = translations[locale];

  return (
    <LanguageContext.Provider value={{ locale, setLocale, dir, t, content, toggleLocale }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
};
