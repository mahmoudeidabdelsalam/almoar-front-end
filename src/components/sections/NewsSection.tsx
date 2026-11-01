'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { formatDate } from '@/lib/i18n/getLocalized';
import { NewsArticle } from '@/types';
import { DirectionalArrow } from '@/components/ui/DirectionalArrow';
import { localizedLink } from '@/lib/localized-link';

interface NewsProps {
  articles: NewsArticle[];
}

export const NewsSection: React.FC<NewsProps> = ({ articles }) => {
  const { locale, dir, t, content } = useLanguage();
  const copy = content.sectionCopy.news;
  const archivePath = `/${locale}/news`;
  const localizedArticles = articles.filter((article) => article.title[locale]);
  const [start, setStart] = useState(0);
  if (!localizedArticles.length && !content.previewMode) return null;
  if (!localizedArticles.length) return null;

  const visibleArticles = localizedArticles.length > 1
    ? [localizedArticles[start % localizedArticles.length], localizedArticles[(start + 1) % localizedArticles.length]]
    : localizedArticles;
  const previous = () => setStart((value) => (value - 1 + localizedArticles.length) % localizedArticles.length);
  const next = () => setStart((value) => (value + 1) % localizedArticles.length);
  return (
    <section data-scroll-reveal className="bg-white py-20 lg:h-[796px] lg:py-[112px]">
      <div className="mx-auto max-w-[1216px] px-5 sm:px-8 lg:px-0">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-900/5 border border-navy-900/10 text-xs font-bold text-navy-900">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
              <span>{copy?.badge[locale] || (content.previewMode ? t.news_section.badge : '')}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy-900 tracking-tight">
              {copy?.title[locale] || (content.previewMode ? t.news_section.title : '')}
            </h2>
            <p className="text-base sm:text-lg text-[#5A677B]">
              {copy?.description[locale] || (content.previewMode ? t.news_section.subtitle : '')}
            </p>
          </div>

          <Link
            href={localizedLink(copy?.ctaUrl || archivePath, locale)}
            className="btn btn--navy group"
          >
            <span>{copy?.ctaLabel[locale] || (content.previewMode ? t.news_section.view_all_news : '')}</span>
            <DirectionalArrow direction="next" dir={dir} />
          </Link>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_120px]">
          <div className="grid gap-6 md:grid-cols-2">
            {visibleArticles.map((article) => (
              <article key={article.id} data-reveal-item className="group">
                <Link href={`${archivePath}/${article.id}`} className="relative block h-[300px] overflow-hidden rounded-sm bg-[#F1F3EB]">
                  {article.image && (
                    <Image src={article.image} alt={locale === 'ar' ? article.title.ar : article.title.en} fill sizes="(max-width: 767px) 100vw, (max-width: 1279px) 33vw, 405px" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                  )}
                </Link>
                <p className="mt-3 text-xs font-semibold text-gold-500">
                  {locale === 'ar' ? article.category.ar : article.category.en}
                </p>
                <h3 className="mt-2 line-clamp-2 min-h-14 text-lg font-bold leading-7 text-navy-900">
                  <Link href={`${archivePath}/${article.id}`}>
                    {locale === 'ar' ? article.title.ar : article.title.en}
                  </Link>
                </h3>
                <div className="mt-4 flex items-center justify-between text-xs text-[#5A677B]">
                  <Link href={`${archivePath}/${article.id}`} className="inline-flex items-center gap-2 font-bold text-navy-900">
                    <DirectionalArrow direction="next" dir={dir} className="h-4 w-4" />
                    <span>{t.news_section.read_more}</span>
                  </Link>
                  <span>{article.publishedAt ? formatDate(article.publishedAt, locale) : article.date}</span>
                </div>
              </article>
            ))}
          </div>

          <div className="flex items-start gap-3 lg:flex-col">
            <button type="button" onClick={next} className="circle-btn" aria-label={locale === 'ar' ? 'الأخبار التالية' : 'Next news'}>
              <DirectionalArrow direction="next" dir={dir} className="h-4 w-4" />
            </button>
            <button type="button" onClick={previous} className="circle-btn" aria-label={locale === 'ar' ? 'الأخبار السابقة' : 'Previous news'}>
              <DirectionalArrow direction="previous" dir={dir} className="h-4 w-4" />
            </button>
            <span className="hidden text-xl font-bold text-navy-900 lg:block">
              {String(start + 1).padStart(2, '0')} <span className="text-sm text-[#5A677B]">/ {String(localizedArticles.length).padStart(2, '0')}</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
