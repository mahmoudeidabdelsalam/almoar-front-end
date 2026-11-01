'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Search, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import type { HeaderMenuItem } from '@/types';
import { safeGetItem } from '@/lib/safe-storage';
import { Notch } from '@/components/ui/Notch';

const FALLBACK_LOGO = '/branding/alomar_logo_transparent.png';

function pickText(value: HeaderMenuItem['label'] | undefined, locale: 'ar' | 'en') {
  return value?.[locale] || value?.[locale === 'ar' ? 'en' : 'ar'] || '';
}

function withLocalePath(url: string, locale: 'ar' | 'en') {
  if (!url || !url.startsWith('/') || url.startsWith('//')) return url;
  const segments = url.split('/').filter(Boolean);
  if (segments[0] === 'ar' || segments[0] === 'en') return url;
  return `/${locale}${url === '/' ? '' : url}`;
}

const unavailableRoutes = new Set(['companies', 'media-center', 'sectors']);

function filterUnavailableRoutes(items: HeaderMenuItem[]): HeaderMenuItem[] {
  return items
    .filter((item) => {
      const path = item.url.replace(/^https?:\/\/[^/]+/i, '').split(/[?#]/, 1)[0];
      const segments = path.split('/').filter(Boolean);
      const route = segments[0] === 'ar' || segments[0] === 'en' ? segments[1] : segments[0];
      return !route || !unavailableRoutes.has(route);
    })
    .map((item) => ({ ...item, children: filterUnavailableRoutes(item.children) }));
}

export const Header: React.FC = () => {
  const { locale, toggleLocale, header } = useLanguage();
  const [hidden, setHidden] = useState(false);
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeImage, setActiveImage] = useState('');
  const [submenu, setSubmenu] = useState<HeaderMenuItem | null>(null);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ id: number; title: string; url: string }>>([]);
  const [searching, setSearching] = useState(false);
  const lastScroll = useRef(0);

  useEffect(() => {
    const markReady = () => setReady(true);
    if (safeGetItem('session', 'alomar_splash_seen')) markReady();
    window.addEventListener('alomar-splash-change', markReady);
    return () => window.removeEventListener('alomar-splash-change', markReady);
  }, []);

  const prefix = `/${locale}`;
  const fallbackMenu: HeaderMenuItem[] = [
    { label: { ar: 'الرئيسية', en: 'Home' }, url: prefix, image: '', children: [] },
    { label: { ar: 'من نحن', en: 'About Us' }, url: `${prefix}/about`, image: '', children: [] },
    { label: { ar: 'مشاريعنا', en: 'Our Projects' }, url: `${prefix}/projects`, image: '', children: [] },
    { label: { ar: 'الأخبار', en: 'News' }, url: `${prefix}/news`, image: '', children: [] },
    { label: { ar: 'تواصل معنا', en: 'Contact Us' }, url: `${prefix}/contact-us`, image: '', children: [] },
  ];

  useEffect(() => {
    const onScroll = () => {
      if (!ready) return;
      const current = window.scrollY;
      if (current > lastScroll.current && current > 100 && !menuOpen && !searchOpen) setHidden(true);
      else if (current < lastScroll.current || current < 40) setHidden(false);
      lastScroll.current = current;
    };
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateScrollListener = () => {
      window.removeEventListener('scroll', onScroll);
      if (motionPreference.matches) {
        setHidden(false);
        return;
      }
      window.addEventListener('scroll', onScroll, { passive: true });
    };
    updateScrollListener();
    motionPreference.addEventListener('change', updateScrollListener);
    return () => {
      window.removeEventListener('scroll', onScroll);
      motionPreference.removeEventListener('change', updateScrollListener);
    };
  }, [menuOpen, ready, searchOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen, searchOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (submenu) {
          setSubmenu(null);
          setActiveImage('');
          return;
        }
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [submenu]);

  const cmsMenu = filterUnavailableRoutes(header?.menu ?? []);
  const menu = cmsMenu.length ? cmsMenu : fallbackMenu;
  const logo = locale === 'ar' ? (header?.logo || FALLBACK_LOGO) : (header?.logo_en || header?.logo || FALLBACK_LOGO);

  const closeOverlays = () => {
    setMenuOpen(false);
    setSearchOpen(false);
    setSubmenu(null);
  };

  const runSearch = async (value: string) => {
    setQuery(value);
    if (value.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const graphqlUrl = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL || '';
      if (!graphqlUrl) {
        setSearchResults([]);
        return;
      }
      const response = await fetch(graphqlUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `query SearchContent($search: String!) { contentNodes(first: 8, where: { search: $search }) { nodes { databaseId title uri } } }`, variables: { search: value } }),
      });
      if (!response.ok) throw new Error('Search failed');
      const body = await response.json() as { data?: { contentNodes?: { nodes?: Array<{ databaseId?: number; title?: string; uri?: string }> } }; errors?: Array<{ message?: string }> };
      if (body.errors?.length) throw new Error(body.errors[0]?.message || 'Search failed');
      setSearchResults((body.data?.contentNodes?.nodes ?? []).map((item) => ({ id: item.databaseId ?? 0, title: item.title || '', url: withLocalePath(item.uri || '/', locale) })));
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  return (
    <>
      <header
        onMouseMove={(event) => { if (event.clientY < 80) setHidden(false); }}
        className={`fixed inset-x-0 top-0 z-[59] bg-white text-navy-900 border-b border-navy-900/8 ${ready ? 'transition-transform duration-300 ease-[cubic-bezier(.4,0,.2,1)]' : 'transition-none'} ${hidden ? '-translate-y-[calc(100%+40px)]' : 'translate-y-0'}`}
      >
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <button
            type="button"
            onClick={() => { setSearchOpen(false); setMenuOpen((open) => !open); setSubmenu(null); setActiveImage(menu[0]?.image || ''); }}
            className={`group inline-flex items-center gap-2 border-0 bg-transparent p-2 text-navy-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-500 cursor-pointer ${locale === 'ar' ? 'order-1' : 'order-2'}`}
            aria-label={menuOpen ? (locale === 'ar' ? 'إغلاق القائمة' : 'Close menu') : (locale === 'ar' ? 'فتح القائمة' : 'Open menu')}
            aria-expanded={menuOpen}
          >
            <span className="hidden text-sm font-bold sm:inline">{locale === 'ar' ? 'القائمة' : 'Menu'}</span>
            <span className={`menu-btn__icon ${menuOpen ? 'is-open' : ''}`} aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          </button>
          <Link href={prefix} aria-label="Alomar Holding" onClick={closeOverlays} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} alt={locale === 'ar' ? 'شعار العمر القابضة' : 'Alomar Holding logo'} className="max-h-[58px] w-auto object-contain lg:max-h-[68px]" />
          </Link>
          <div className={`flex items-center gap-1 sm:gap-2 ${locale === 'ar' ? 'order-2' : 'order-1'}`}>
            <button
              type="button"
              onClick={toggleLocale}
              className="flex h-10 items-center gap-1  px-3 text-xs font-bold transition-colors hover:bg-navy-900 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
              aria-label={locale === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
            >
              <span>{locale === 'ar' ? 'English' : 'عربي'}</span>
            </button>
            <button
              type="button"
              onClick={() => { setSubmenu(null); setMenuOpen(false); setSearchOpen((open) => !open); }}
              className="flex h-10 w-10 items-center justify-center transition-colors hover:bg-navy-900 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
              aria-label={locale === 'ar' ? 'فتح البحث' : 'Open search'}
              aria-expanded={searchOpen}
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>
        <Notch fill="white" className="absolute start-1/2 top-full z-[1] -mt-[4px] h-[30px] w-[400px] -translate-x-1/2" />
      </header>

      <div
        className={`site-menu fixed inset-0 z-[60] px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-[calc(1.25rem+env(safe-area-inset-top))] sm:px-8 lg:px-20 lg:pb-[calc(5rem+env(safe-area-inset-bottom))] lg:pt-[calc(5rem+env(safe-area-inset-top))] ${menuOpen ? 'is-open' : ''} ${submenu ? 'is-sub' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={locale === 'ar' ? 'القائمة الرئيسية' : 'Main navigation'}
        aria-hidden={!menuOpen}
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
      >
        <div className="site-menu__scrim absolute inset-0" />
        <div className="relative h-full">
          <div className="site-menu__panel pattern mx-auto grid h-full max-w-[1440px] grid-cols-1 rounded-lg bg-navy-900 bg-[url('/bg-menu.png')] bg-no-repeat bg-right-bottom px-5 py-5 lg:grid-cols-[60%_40%]">
            <nav className="site-menu__body h-full px-0 lg:px-[7%]" aria-label={locale === 'ar' ? 'القائمة الرئيسية' : 'Main menu'}>
              <div className="site-menu__top">
                <div className="site-menu__crumb">
                  <span>{locale === 'ar' ? 'القائمة' : 'menu'}</span>
                  {submenu && (
                    <>
                      <span aria-hidden="true">/</span>
                      <span className="crumb-sub">{pickText(submenu.label, locale)}</span>
                    </>
                  )}
                </div>
                <button
                  type="button"
                  onClick={closeOverlays}
                  className="site-menu__close text-white"
                  aria-label={locale === 'ar' ? 'إغلاق القائمة' : 'Close menu'}
                >
                  <X />
                </button>
              </div>

              <div className="site-menu__views">
                <div className="site-menu__view site-menu__view--main" aria-hidden={Boolean(submenu)}>
                  <ul className="site-menu__list">
                    {menu.map((item, index) => {
                      const hasChildren = item.children?.length > 0;
                      const label = pickText(item.label, locale);
                      const content = (
                        <>
                          <span>{label || '—'}</span>
                          {hasChildren && (locale === 'ar' ? <ChevronLeft className="h-5 w-5 opacity-50 transition-transform group-hover:-translate-x-1" /> : <ChevronRight className="h-5 w-5 opacity-50 transition-transform group-hover:translate-x-1" />)}
                        </>
                      );
                      return (
                        <li key={`${label}-${index}`}>
                          {hasChildren ? (
                            <button
                              type="button"
                              onClick={() => {
                                setSubmenu(item);
                                setActiveImage(item.children[0]?.image || item.image || '');
                              }}
                              onMouseEnter={() => setActiveImage(item.image || item.children[0]?.image || '')}
                              onFocus={() => setActiveImage(item.image || item.children[0]?.image || '')}
                              className="site-menu__link group text-start"
                            >
                              {content}
                            </button>
                          ) : (
                            <Link
                              href={withLocalePath(item.url || prefix, locale)}
                              onClick={closeOverlays}
                              onMouseEnter={() => setActiveImage(item.image || '')}
                              onFocus={() => setActiveImage(item.image || '')}
                              className="site-menu__link group"
                            >
                              {content}
                            </Link>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="site-menu__view site-menu__view--sub" aria-hidden={!submenu}>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmenu(null);
                      setActiveImage(menu[0]?.image || '');
                    }}
                    className="site-menu__back"
                    tabIndex={submenu ? 0 : -1}
                  >
                    {locale === 'ar' ? <ChevronRight /> : <ChevronLeft />}
                    <span>{locale === 'ar' ? 'العودة للقائمة الرئيسية' : 'Back to main menu'}</span>
                  </button>
                  <ul className="site-menu__list site-menu__list--sub">
                    {(submenu?.children || []).map((child, index) => (
                      <li key={`${pickText(child.label, locale)}-${index}`}>
                        <Link
                          href={withLocalePath(child.url || '#', locale)}
                          onClick={closeOverlays}
                          onMouseEnter={() => setActiveImage(child.image || submenu?.image || '')}
                          onFocus={() => setActiveImage(child.image || submenu?.image || '')}
                          className="site-menu__link"
                          tabIndex={submenu ? 0 : -1}
                        >
                          <span>{pickText(child.label, locale)}</span>
                          {pickText(child.category, locale) && <small>{pickText(child.category, locale)}</small>}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </nav>
            <div className="relative hidden overflow-hidden rounded-[24px] lg:block">
              {activeImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={activeImage} src={activeImage} alt="" className="h-full w-full object-cover animate-[menuImageIn_.45s_cubic-bezier(.2,.8,.2,1)_both]" />
              ) : (
                <div className="flex h-full items-center justify-center bg-[#1A2B49]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={logo} alt="" className="max-h-32 max-w-[220px] object-contain brightness-0 invert" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/55 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-[60] bg-white transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${searchOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-4 opacity-0'}`}
        role="dialog"
        aria-modal="true"
        aria-label={locale === 'ar' ? 'البحث' : 'Search'}
      >
        <div className="mx-auto max-w-[960px] px-5 pt-[110px] lg:px-12 lg:pt-[140px]">
          <form onSubmit={(event) => { event.preventDefault(); runSearch(query); }} className="flex items-center border-b-2 border-navy-900">
            <Search className="h-7 w-7 shrink-0 text-gold-500" />
            <input
              value={query}
              onChange={(event) => runSearch(event.target.value)}
              autoFocus={searchOpen}
              className="min-h-20 w-full border-0 bg-transparent px-4 text-2xl outline-none placeholder:text-navy-900/35 lg:text-4xl"
              placeholder={locale === 'ar' ? 'ابحث في الموقع...' : 'Search the website...'}
              aria-label={locale === 'ar' ? 'بحث' : 'Search'}
            />
          </form>
          <div className="mt-8" aria-live="polite">
            {searching && <p className="text-sm text-navy-900/55">{locale === 'ar' ? 'جارٍ البحث...' : 'Searching...'}</p>}
            {!searching && query.trim().length >= 2 && searchResults.length === 0 && (
              <p className="text-sm text-navy-900/55">{locale === 'ar' ? 'لا توجد نتائج' : 'No results found'}</p>
            )}
            <div className="divide-y divide-navy-900/10">
              {searchResults.map((result) => (
                <Link key={result.id} href={result.url} onClick={closeOverlays} className="group flex items-center justify-between py-5 text-xl font-bold hover:text-gold-500">
                  <span>{result.title}</span>
                  <ChevronRight className="directional-icon h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
