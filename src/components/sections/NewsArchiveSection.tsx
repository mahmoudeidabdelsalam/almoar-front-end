'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowDownLeft, ArrowLeft, ArrowRight, Search } from 'lucide-react';
import { formatDate, getLocalizedString } from '@/lib/i18n/getLocalized';
import { Notch } from '@/components/ui/Notch';
import type { Locale, NewsArticle } from '@/types';

interface NewsArchiveSectionProps {
  articles: NewsArticle[];
  locale: Locale;
}

const copy = {
  ar: {
    home: 'الرئيسية',
    news: 'المركز الإعلامي',
    heading: 'المركز الإعلامي',
    intro: 'تابع آخر أخبار العمر القابضة وشركاتها.',
    all: 'جميع الأخبار',
    search: 'ابحث في الأخبار',
    searchLabel: 'البحث في الأخبار',
    readMore: 'اقرأ الخبر',
    noResults: 'لا توجد أخبار تطابق بحثك.',
    imageAlt: 'صورة الخبر',
    latestNews: 'آخر الأخبار',
    subHeading: 'آخر المستجدات من العمر القابضة وشركاتها',
  },
  en: {
    home: 'Home',
    news: 'News',
    heading: 'Latest news',
    intro: 'The latest updates from Alomar Holding and its companies.',
    all: 'All news',
    search: 'Search news',
    searchLabel: 'Search news',
    readMore: 'Read article',
    noResults: 'No news articles match your search.',
    imageAlt: 'News article image',
    latestNews: 'Latest news',
    subHeading: 'The latest updates from Alomar Holding and its companies',
  },
} as const;

const PAGE_SIZE = 6;

function NewsCard({ article, locale }: { article: NewsArticle; locale: Locale }) {
  const text = copy[locale];
  const title = getLocalizedString(article.title, locale);
  const category = getLocalizedString(article.category, locale);

  return (
    <article className="group min-w-0 overflow-hidden rounded-sm bg-white">
      <Link
        href={`/${locale}/news/${article.id}`}
        className="relative block aspect-[1.42] overflow-hidden bg-navy-900/5"
        aria-label={`${text.readMore}: ${title}`}
      >
        {article.image ? (
          <Image
            src={article.image}
            alt={article.imageAlt || title || text.imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.035]"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-navy-900 to-[#1B4332]" aria-hidden="true" />
        )}
      </Link>
      <div className="px-5 pb-6 pt-5 sm:px-6">
        <div className="flex items-center justify-between gap-3 text-xs text-[#667085]">
          {category && <span className="font-bold text-gold-500">{category}</span>}
          <time dateTime={article.publishedAt || undefined}>
            {article.publishedAt ? formatDate(article.publishedAt, locale) : article.date}
          </time>
        </div>
        <h3 className="mt-3 line-clamp-2 text-lg font-bold leading-7 text-navy-900 transition-colors group-hover:text-gold-500">
          <Link href={`/${locale}/news/${article.id}`}>{title}</Link>
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#5A677B]">
          {getLocalizedString(article.excerpt, locale)}
        </p>
        <Link
          href={`/${locale}/news/${article.id}`}
          className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-navy-900 transition-colors hover:text-gold-500"
        >
          <span>{text.readMore}</span>
          {locale === 'ar' ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
        </Link>
      </div>
    </article>
  );
}

export function NewsArchiveSection({ articles, locale }: NewsArchiveSectionProps) {
  const text = copy[locale];
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const categories = useMemo(() => {
    const values = articles
      .map((article) => getLocalizedString(article.category, locale).trim())
      .filter(Boolean);
    return [...new Set(values)];
  }, [articles, locale]);

  const filteredArticles = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase(locale);
    return articles.filter((article) => {
      const category = getLocalizedString(article.category, locale);
      const matchesCategory = !activeCategory || category === activeCategory;
      const searchableText = [
        getLocalizedString(article.title, locale),
        getLocalizedString(article.excerpt, locale),
        category,
      ].join(' ').toLocaleLowerCase(locale);
      return matchesCategory && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });
  }, [activeCategory, articles, locale, query]);

  const pageCount = Math.ceil(filteredArticles.length / PAGE_SIZE);
  const pageArticles = filteredArticles.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const [featuredArticle, ...otherArticles] = pageArticles;

  return (
    <>
      <section className="relative overflow-hidden bg-[#10213D] text-white]">
        <div className="mx-auto flex min-h-[600px] max-w-[1440px] flex-col px-5 pb-20 pt-15 sm:px-8 lg:px-14">
          <nav aria-label={locale === 'ar' ? 'مسار التنقل' : 'Breadcrumb'} className="mb-9 text-sm text-white/65">
            <ol className="flex items-center gap-2">
              <li><Link href={`/${locale}`} className="transition-colors hover:text-white">{text.home}</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-white">{text.news}</li>
            </ol>
          </nav>
          <div className="flex flex-1 items-end justify-start pb-12 pt-12">
            <h1 className="text-[84px] text-ivory-50 font-normal tracking-tight sm:text-5xl lg:text-[56px]">{text.heading}</h1>
          </div>
        </div>
        <Notch fill="white" className="absolute start-1/2 bottom-0 z-[1] mb-[-4px] h-[30px] w-[400px] -translate-x-1/2 rotate-180" />
      </section>

      <section className="bg-ivory-50 px-5 py-12 sm:px-8 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-[1216px]">
          <div className="mb-9 flex flex-col gap-7 lg:mb-12 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <p className="text-sm font-bold text-gold-500">{text.latestNews}</p>
              <h2 className="mt-2 text-4xl font-normal tracking-tight text-navy-900 sm:text-5xl">{text.subHeading}</h2>
            </div>
            <label className="relative block w-full lg:max-w-[360px]">
              <span className="sr-only">{text.searchLabel}</span>
              <Search aria-hidden="true" className="absolute top-1/2 start-4 h-5 w-5 -translate-y-1/2 text-[#667085]" />
              <input
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder={text.search}
                className="h-12 w-full rounded-sm border border-navy-900/15 bg-white ps-12 pe-4 text-start text-sm text-navy-900 outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
              />
            </label>
          </div>

          {categories.length > 0 && (
            <div className="mb-9 flex flex-wrap gap-2.5" role="group" aria-label={locale === 'ar' ? 'تصفية حسب الفئة' : 'Filter by category'}>
              <button
                type="button"
                aria-pressed={!activeCategory}
                onClick={() => {
                  setActiveCategory('');
                  setCurrentPage(1);
                }}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${!activeCategory ? 'border-navy-900 bg-navy-900 text-white' : 'border-navy-900/15 bg-white text-navy-900 hover:border-gold-500'}`}
              >
                {text.all}
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  aria-pressed={activeCategory === category}
                  onClick={() => {
                    setActiveCategory(category);
                    setCurrentPage(1);
                  }}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${activeCategory === category ? 'border-navy-900 bg-navy-900 text-white' : 'border-navy-900/15 bg-white text-navy-900 hover:border-gold-500'}`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

          {featuredArticle ? (
            <>
              <article className="mb-8 grid overflow-hidden rounded-sm bg-white shadow-[0_12px_42px_rgba(16,30,57,0.07)] md:min-h-[380px] md:grid-cols-[1.15fr_0.85fr]" dir="ltr">
                <Link
                  href={`/${locale}/news/${featuredArticle.id}`}
                  className="relative block min-h-[240px] overflow-hidden bg-navy-900/5 md:min-h-[380px]"
                  aria-label={`${text.readMore}: ${getLocalizedString(featuredArticle.title, locale)}`}
                >
                  {featuredArticle.image ? (
                    <Image
                      src={featuredArticle.image}
                      alt={featuredArticle.imageAlt || getLocalizedString(featuredArticle.title, locale) || text.imageAlt}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 60vw"
                      className="object-cover transition-transform duration-700 hover:scale-[1.025]"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-navy-900 to-[#1B4332]" aria-hidden="true" />
                  )}
                </Link>
                <div                 className="flex flex-col justify-center px-6 py-8 text-start sm:px-9 sm:py-10 lg:px-12" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                  <div className="flex items-center justify-between gap-3 text-xs text-[#667085]">
                    <span className="font-bold text-gold-500">{getLocalizedString(featuredArticle.category, locale)}</span>
                    <time dateTime={featuredArticle.publishedAt || undefined}>
                      {featuredArticle.publishedAt ? formatDate(featuredArticle.publishedAt, locale) : featuredArticle.date}
                    </time>
                  </div>
                  <h3 className="mt-5 text-2xl font-bold leading-[1.55] text-navy-900 sm:text-3xl">
                    <Link href={`/${locale}/news/${featuredArticle.id}`} className="transition-colors hover:text-gold-500">
                      {getLocalizedString(featuredArticle.title, locale)}
                    </Link>
                  </h3>
                  <p className="mt-4 line-clamp-4 text-sm leading-8 text-[#5A677B] sm:text-base">
                    {getLocalizedString(featuredArticle.excerpt, locale)}
                  </p>
                  <Link
                    href={`/${locale}/news/${featuredArticle.id}`}
                    className="mt-7 inline-flex w-fit items-center gap-2 text-sm font-bold text-navy-900 transition-colors hover:text-gold-500"
                  >
                    {locale === 'ar' ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                    <span>{text.readMore}</span>
                  </Link>
                </div>
              </article>

              {otherArticles.length > 0 && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {otherArticles.map((article) => <NewsCard key={article.id} article={article} locale={locale} />)}
                </div>
              )}
              {pageCount > 1 && (
                <nav aria-label={locale === 'ar' ? 'صفحات الأخبار' : 'News pages'} className="mt-10 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((page) => page - 1)}
                    aria-label={locale === 'ar' ? 'الصفحة السابقة' : 'Previous page'}
                    className="circle-btn disabled:cursor-not-allowed"
                  >
                    {locale === 'ar' ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
                  </button>
                  {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      aria-current={currentPage === page ? 'page' : undefined}
                      onClick={() => setCurrentPage(page)}
                      className={`inline-flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-bold transition-colors ${currentPage === page ? 'bg-navy-900 text-white' : 'border border-navy-900/15 bg-white text-navy-900 hover:border-gold-500'}`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    type="button"
                    disabled={currentPage === pageCount}
                    onClick={() => setCurrentPage((page) => page + 1)}
                    aria-label={locale === 'ar' ? 'الصفحة التالية' : 'Next page'}
                    className="circle-btn disabled:cursor-not-allowed"
                  >
                    {locale === 'ar' ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                  </button>
                </nav>
              )}
            </>
          ) : (
            <p role="status" className="rounded-sm bg-white px-6 py-12 text-center text-[#5A677B]">
              {text.noResults}
            </p>
          )}
        </div>
      </section>
    </>
  );
}
