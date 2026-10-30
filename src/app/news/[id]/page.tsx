import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { wpClient } from '@/lib/wordpress/client';
import { formatDate, getLocalizedString } from '@/lib/i18n/getLocalized';
import type { Locale } from '@/types';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export interface NewsRouteProps {
  params: Promise<{ id: string; lang?: string }>;
}

export async function generateStaticParams() {
  const news = await wpClient.getNews();
  return news.length ? news.map((article) => ({ id: String(article.id) })) : [{ id: '__no-cms-content__' }];
}

export async function buildNewsMetadata(
  params: { id: string; lang?: string },
): Promise<Metadata> {
  const { id, lang } = params;
  const locale: Locale = lang === 'en' ? 'en' : 'ar';
  const article = await wpClient.getArticleById(Number(id));
  if (!article) return { title: locale === 'ar' ? 'الخبر غير موجود | العمر القابضة' : 'Article not found | Alomar Holding' };

  const title = getLocalizedString(article.title, locale);
  const description = getLocalizedString(article.excerpt, locale);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://alomarholding.sa';
  const canonical = `${baseUrl}/${locale}/news/${article.id}`;
  return {
    title: `${title} | Alomar Holding`,
    description,
    alternates: {
      canonical,
      languages: {
        ar: `${baseUrl}/ar/news/${article.id}`,
        en: `${baseUrl}/en/news/${article.id}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
      type: 'article',
      ...(article.image ? { images: [article.image] } : {}),
      ...(article.publishedAt ? { publishedTime: article.publishedAt } : {}),
    },
  };
}

export async function generateMetadata({ params }: NewsRouteProps): Promise<Metadata> {
  return buildNewsMetadata(await params);
}

export default async function SingleNewsPage({ params }: NewsRouteProps) {
  const { id, lang } = await params;
  const locale: Locale = lang === 'en' ? 'en' : 'ar';
  const localePrefix = lang ? `/${locale}` : '';
  const archivePath = `${localePrefix}/news`;
  const article = await wpClient.getArticleById(Number(id));

  if (!article) {
    notFound();
  }

  const title = getLocalizedString(article.title, locale);
  const excerpt = getLocalizedString(article.excerpt, locale);
  const category = getLocalizedString(article.category, locale);
  const readTime = locale === 'ar' ? article.read_time : article.read_time_en || article.read_time;
  const relatedNews = (article.relatedNews ?? []).filter((item) => item.id !== article.id);

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#F8F9F4] pt-28 pb-20" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Breadcrumbs */}
          <div className="flex items-center justify-between text-xs sm:text-sm text-[#5A677B]">
            <div className="flex items-center gap-2">
              <Link href={localePrefix || '/'} className="hover:text-[#101E39]">{locale === 'ar' ? 'الرئيسية' : 'Home'}</Link>
              <span>/</span>
              <Link href={archivePath} className="hover:text-[#101E39]">{locale === 'ar' ? 'الأخبار' : 'News'}</Link>
              <span>/</span>
              <span className="text-[#101E39] font-bold truncate max-w-xs">{title}</span>
            </div>

            <Link
              href={archivePath}
              className="inline-flex items-center gap-1.5 font-bold text-[#101E39] hover:text-[#B7913D]"
            >
              <ArrowRight className="w-4 h-4" />
              <span>{locale === 'ar' ? 'العودة للأخبار' : 'Back to news'}</span>
            </Link>
          </div>

          {/* Article Header */}
          <div className="space-y-4">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold text-white bg-[#101E39]">
              {category}
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#101E39] leading-tight tracking-tight">
              {title}
            </h1>

            <div className="flex items-center gap-4 text-xs sm:text-sm text-[#5A677B] pt-2">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#B7913D]" />
                <span>{article.publishedAt ? formatDate(article.publishedAt, locale) : article.date}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#B7913D]" />
                <span>{locale === 'ar' ? `زمن القراءة: ${readTime}` : `Reading time: ${readTime}`}</span>
              </span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative h-96 sm:h-[480px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
            {article.image ? (
              <Image
                src={article.image}
                alt={title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#101E39] to-[#1B4332]" aria-hidden="true" />
            )}
          </div>

          {/* Article Body */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-lg border border-[#101E39]/10 space-y-6 text-base sm:text-lg text-[#101E39]/90 leading-relaxed">
            <p className="font-semibold text-xl text-[#101E39] leading-relaxed">
              {excerpt}
            </p>
            <hr className="border-[#101E39]/10 my-6" />
            <div
              className="space-y-4"
              dangerouslySetInnerHTML={{ __html: article.content[locale] }}
            />
          </div>

          {/* Related Articles */}
          {relatedNews.length > 0 && (
            <div className="space-y-6 pt-10 border-t border-[#101E39]/10">
              <h2 className="text-2xl font-bold text-[#101E39]">{locale === 'ar' ? 'أخبار ذات صلة' : 'Related news'}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {relatedNews.map((n) => (
                  <Link
                    key={n.id}
                    href={`${archivePath}/${n.id}`}
                    className="bg-white rounded-2xl p-5 border border-[#101E39]/10 shadow-sm hover:shadow-md transition-all flex gap-4 group"
                  >
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                      {n.image ? (
                        <Image
                          src={n.image}
                          alt={getLocalizedString(n.title, locale)}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#101E39] to-[#1B4332]" aria-hidden="true" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#B7913D] block">{n.publishedAt ? formatDate(n.publishedAt, locale) : n.date}</span>
                      <h4 className="font-bold text-[#101E39] text-sm group-hover:text-[#B7913D] transition-colors line-clamp-2">
                        {getLocalizedString(n.title, locale)}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
