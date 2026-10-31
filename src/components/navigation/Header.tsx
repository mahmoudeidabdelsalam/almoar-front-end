'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Menu, TextAlignStart, Search, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import type { HeaderMenuItem } from '@/types';

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeImage, setActiveImage] = useState('');
  const [submenu, setSubmenu] = useState<HeaderMenuItem | null>(null);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ id: number; title: string; url: string }>>([]);
  const [searching, setSearching] = useState(false);
  const lastScroll = useRef(0);

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
      const current = window.scrollY;
      if (current > lastScroll.current && current > 100 && !menuOpen && !searchOpen) setHidden(true);
      else if (current < lastScroll.current || current < 40) setHidden(false);
      lastScroll.current = current;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [menuOpen, searchOpen]);

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
        className={`fixed inset-x-0 top-0 z-[59] bg-white text-[#101E39] border-b border-[#101E39]/8 transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${hidden ? '-translate-y-full' : 'translate-y-0'}`}
      >
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <button
            type="button"
            onClick={() => { setSearchOpen(false); setMenuOpen((open) => !open); setSubmenu(null); setActiveImage(menu[0]?.image || ''); }}
            className={`group inline-flex items-center gap-2 border-0 bg-transparent p-2 text-[#101E39] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B7913D] cursor-pointer ${locale === 'ar' ? 'order-1' : 'order-2'}`}
            aria-label={menuOpen ? (locale === 'ar' ? 'إغلاق القائمة' : 'Close menu') : (locale === 'ar' ? 'فتح القائمة' : 'Open menu')}
            aria-expanded={menuOpen}
          >
            <span className="hidden text-sm font-bold sm:inline">{locale === 'ar' ? 'القائمة' : 'Menu'}</span>
            <span className="relative flex h-10 w-10 items-center justify-center transition-colors">
              {menuOpen ? <Menu className="h-5 w-5" /> : <TextAlignStart className="h-5 w-5" />}
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
              className="flex h-10 items-center gap-1  px-3 text-xs font-bold transition-colors hover:bg-[#101E39] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B7913D]"
              aria-label={locale === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
            >
              <span>{locale === 'ar' ? 'English' : 'عربي'}</span>
            </button>
            <button
              type="button"
              onClick={() => { setSubmenu(null); setMenuOpen(false); setSearchOpen((open) => !open); }}
              className="flex h-10 w-10 items-center justify-center transition-colors hover:bg-[#101E39] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B7913D]"
              aria-label={locale === 'ar' ? 'فتح البحث' : 'Open search'}
              aria-expanded={searchOpen}
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>
        <svg width="420" height="50" viewBox="0 0 420 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="pointer-events-none absolute left-1/2 top-full z-[1] h-[30px] w-[400px] -translate-x-1/2 -mt-[4px]">
          <g filter="url(#filter0_d_1_3221)">
          <path d="M10 4C100 4 120 34 210 34C300 34 320 4 410 4H10Z" fill="white"/>
          </g>
          <defs>
          <filter id="filter0_d_1_3221" x="0" y="0" width="420" height="50" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="6"/>
          <feGaussianBlur stdDeviation="5"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.06 0 0 0 0 0.12 0 0 0 0 0.22 0 0 0 0.08 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1_3221"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1_3221" result="shape"/>
          </filter>
          </defs>
        </svg>
      </header>

      <div
        className={`fixed inset-0 z-[60] px-5 pb-5 pt-5 sm:px-8 lg:px-20 lg:pb-20 lg:pt-20 bg-black/90 ${menuOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-4 opacity-0'}`}
        role="dialog"
        aria-modal="true"
        aria-label={locale === 'ar' ? 'القائمة الرئيسية' : 'Main navigation'}
      >
        <div className="relative h-full" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
          <div className="mx-auto grid h-full rounded-lg max-w-[1440px] grid-cols-1 px-5 px-5 py-5 lg:grid-cols-[60%_40%] bg-[#0F1F38] bg-[url('/bg-menu.png')] bg-no-repeat bg-right-bottom transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]">
            <nav className="h-full px-0 lg:px-[7%]" aria-label={submenu ? (locale === 'ar' ? 'القائمة الفرعية' : 'Submenu') : (locale === 'ar' ? 'القائمة الرئيسية' : 'Main menu')}>
              {submenu ? (
                <div className="w-full h-full flex flex-col">
                  <div className="flex items-center justify-between lg:left-12 lg:right-12 lg:top-[112px]">
                    <div className="flex items-center gap-3 text-xs font-semibold text-white/55">
                      <span>{locale === 'ar' ? 'القائمة' : 'menu'}</span>
                      <span>/</span>
                      <span className="text-[#C5A265]">{pickText(submenu.label, locale)}</span>
                    </div>
                    <button
                      type="button"
                      onClick={closeOverlays}
                      className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white hover:text-[#101E39] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B7913D]"
                      aria-label={locale === 'ar' ? 'إغلاق القائمة' : 'Close menu'}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="my-auto">
                    <button
                      type="button"
                      onClick={() => {
                        setSubmenu(null);
                        setActiveImage(menu[0]?.image || '');
                      }}
                      className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#BF9432] transition-colors hover:text-[#C5A265]"
                    >
                      {locale === 'ar' ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                      <span>{locale === 'ar' ? 'العودة للقائمة الرئيسية' : 'Back to main menu'}</span>
                    </button>
                    {submenu.children.map((child, index) => (
                      <Link
                        key={`${pickText(child.label, locale)}-${index}`}
                        href={withLocalePath(child.url || '#', locale)}
                        onClick={closeOverlays}
                        onMouseEnter={() => setActiveImage(child.image || submenu.image || '')}
                        onFocus={() => setActiveImage(child.image || submenu.image || '')}
                        className="group flex flex-row items-center gap-5 py-2 text-white transition-colors hover:text-[#BF9432] hover:underline lg:py-6"
                      >
                        <span className="flex flex-row">
                          <span className="text-[46px] font-normal leading-tight sm:text-[38px] lg:text-[42px]">{pickText(child.label, locale)}</span>
                          {pickText(child.category, locale) && (
                            <span className="mt-2 text-[12px] font-semibold text-[#BF9432] mx-4">{pickText(child.category, locale)}</span>
                          )}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full flex flex-col  gap-5 lg:gap-6">
                  <div className="flex items-center justify-between lg:left-12 lg:right-12 lg:top-[112px]">
                    <div className="flex items-center gap-3 text-xs font-semibold text-white/55">
                      <span>{locale === 'ar' ? 'القائمة' : 'menu'}</span>
                    </div>
                    <button
                      type="button"
                      onClick={closeOverlays}
                      className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white hover:text-[#101E39] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B7913D]"
                      aria-label={locale === 'ar' ? 'إغلاق القائمة' : 'Close menu'}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="my-auto">
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
                        <div key={`${label}-${index}`} className="mb-0">
                          {hasChildren ? (
                            <button
                              type="button"
                              onClick={() => {
                                setSubmenu(item);
                                setActiveImage(item.children[0]?.image || item.image || '');
                              }}
                              onMouseEnter={() => setActiveImage(item.image || item.children[0]?.image || '')}
                              onFocus={() => setActiveImage(item.image || item.children[0]?.image || '')}
                              className="group flex w-full items-center py-2 text-start text-[46px] font-normal leading-[1.1] text-[#fff] transition-colors hover:underline sm:text-[44px] lg:text-[48px]"
                            >
                              {content}
                            </button>
                          ) : (
                            <Link
                              href={withLocalePath(item.url || prefix, locale)}
                              onClick={closeOverlays}
                              onMouseEnter={() => setActiveImage(item.image || '')}
                              onFocus={() => setActiveImage(item.image || '')}
                              className="group flex items-center py-2 text-start text-[46px] font-normal leading-[1.1] text-[#fff] transition-colors hover:underline sm:text-[44px] lg:text-[48px]"
                            >
                              {content}
                            </Link>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
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
              <div className="absolute inset-0 bg-gradient-to-t from-[#101E39]/55 via-transparent to-transparent" />
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
          <form onSubmit={(event) => { event.preventDefault(); runSearch(query); }} className="flex items-center border-b-2 border-[#101E39]">
            <Search className="h-7 w-7 shrink-0 text-[#B7913D]" />
            <input
              value={query}
              onChange={(event) => runSearch(event.target.value)}
              autoFocus={searchOpen}
              className="min-h-20 w-full border-0 bg-transparent px-4 text-2xl outline-none placeholder:text-[#101E39]/35 lg:text-4xl"
              placeholder={locale === 'ar' ? 'ابحث في الموقع...' : 'Search the website...'}
              aria-label={locale === 'ar' ? 'بحث' : 'Search'}
            />
          </form>
          <div className="mt-8" aria-live="polite">
            {searching && <p className="text-sm text-[#101E39]/55">{locale === 'ar' ? 'جارٍ البحث...' : 'Searching...'}</p>}
            {!searching && query.trim().length >= 2 && searchResults.length === 0 && (
              <p className="text-sm text-[#101E39]/55">{locale === 'ar' ? 'لا توجد نتائج' : 'No results found'}</p>
            )}
            <div className="divide-y divide-[#101E39]/10">
              {searchResults.map((result) => (
                <Link key={result.id} href={result.url} onClick={closeOverlays} className="group flex items-center justify-between py-5 text-xl font-bold hover:text-[#B7913D]">
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
