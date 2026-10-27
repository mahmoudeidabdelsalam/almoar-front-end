'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { NewsArticle } from '@/types';
import { Calendar, Clock, ArrowRight, ArrowLeft } from 'lucide-react';

interface NewsProps {
  articles: NewsArticle[];
}

export const NewsSection: React.FC<NewsProps> = ({ articles }) => {
  const { locale, dir, t } = useLanguage();
  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <section className="py-20 lg:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 lg:mb-16 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101E39]/5 border border-[#101E39]/10 text-xs font-bold text-[#101E39]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B7913D]" />
              <span>{t.news_section.badge}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#101E39] tracking-tight">
              {t.news_section.title}
            </h2>
            <p className="text-base sm:text-lg text-[#5A677B]">
              {t.news_section.subtitle}
            </p>
          </div>

          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#B7913D] hover:text-[#96742B] transition-colors self-start md:self-auto group"
          >
            <span>{t.news_section.view_all_news}</span>
            <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article) => (
            <article
              key={article.id}
              className="bg-[#F8F9F4] rounded-2xl overflow-hidden border border-[#101E39]/10 shadow-sm luxury-card flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={article.image}
                    alt={locale === 'ar' ? article.title.ar : article.title.en}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold text-white bg-[#101E39]/80 backdrop-blur-md">
                      {locale === 'ar' ? article.category.ar : article.category.en}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-4 text-xs text-[#5A677B]">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#B7913D]" />
                      <span>{article.date}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#B7913D]" />
                      <span>{article.read_time}</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#101E39] group-hover:text-[#B7913D] transition-colors line-clamp-2 leading-snug">
                    <Link href={`/news/${article.slug}`}>
                      {locale === 'ar' ? article.title.ar : article.title.en}
                    </Link>
                  </h3>

                  <p className="text-sm text-[#5A677B] leading-relaxed line-clamp-2">
                    {locale === 'ar' ? article.excerpt.ar : article.excerpt.en}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  href={`/news/${article.slug}`}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#101E39] hover:text-[#B7913D] transition-colors"
                >
                  <span>{t.news_section.read_more}</span>
                  <ArrowIcon className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
