import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { wpClient } from '@/lib/wordpress/client';
import { formatDate, getLocalizedString } from '@/lib/i18n/getLocalized';
import type { Locale } from '@/types';
import { ArrowLeft, ArrowRight, Calendar, Clock, Mail } from 'lucide-react';
import type { Metadata } from 'next';
import { sanitizeNewsContent } from '@/lib/sanitize-news-content';
import { createLocalizedMetadata, getSiteUrl } from '@/lib/seo';

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
  const availableLocales = (['ar', 'en'] as const).filter((articleLocale) =>
    article.title[articleLocale].trim(),
  );
  const metadata = createLocalizedMetadata({
    title: `${title} | Alomar Holding`,
    description: description || (locale === 'ar'
      ? `اقرأ تفاصيل خبر ${title} من العمر القابضة.`
      : `Read the latest details of ${title} from Alomar Holding.`),
    locale,
    pathname: `/${locale}/news/${article.id}`,
    alternateLocales: availableLocales,
    image: article.image,
    imageAlt: article.imageAlt,
    publishedTime: article.publishedAt && !Number.isNaN(Date.parse(article.publishedAt))
      ? article.publishedAt
      : undefined,
    type: 'article',
  });
  return metadata;
}

export async function generateMetadata({ params }: NewsRouteProps): Promise<Metadata> {
  return buildNewsMetadata(await params);
}

function getEstimatedReadTime(article: string, locale: Locale): string {
  const wordCount = article.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / (locale === 'ar' ? 150 : 200)));
  if (locale === 'ar') {
    if (minutes === 1) return 'دقيقة واحدة';
    if (minutes === 2) return 'دقيقتان';
    return `${minutes} دقائق`;
  }
  return `${minutes} min`;
}

function shouldShowExcerpt(excerpt: string, title: string, content: string, locale: Locale): boolean {
  const normalize = (value: string) => value
    .replace(/<[^>]*>/g, ' ')
    .replace(/(?:&hellip;|&#8230;|…)\s*$/i, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLocaleLowerCase(locale);
  const normalizedExcerpt = normalize(excerpt);
  const normalizedContent = normalize(content);
  return Boolean(normalizedExcerpt && normalizedExcerpt !== normalize(title) && !normalizedContent.startsWith(normalizedExcerpt));
}

function getSafeCompanyUrl(value: string): string {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : '';
  } catch {
    return '';
  }
}

export default async function SingleNewsPage({ params }: NewsRouteProps) {
  const { id, lang } = await params;
  const locale: Locale = lang === 'en' ? 'en' : 'ar';
  const localePrefix = lang ? `/${locale}` : '';
  const archivePath = `${localePrefix}/news`;
  const [article, articles] = await Promise.all([
    wpClient.getArticleById(Number(id)),
    wpClient.getNews(),
  ]);

  if (!article) {
    notFound();
  }

  const title = getLocalizedString(article.title, locale);
  const excerpt = getLocalizedString(article.excerpt, locale);
  const category = getLocalizedString(article.category, locale);
  const articleContent = getLocalizedString(article.content, locale);
  const showExcerpt = shouldShowExcerpt(excerpt, title, articleContent, locale);
  const configuredReadTime = locale === 'ar' ? article.read_time : article.read_time_en;
  const readTime = configuredReadTime || getEstimatedReadTime(articleContent || excerpt, locale);
  const relatedNews = (article.relatedNews ?? []).filter((item) => item.id !== article.id);
  const company = article.company;
  const companyName = company ? getLocalizedString(company.name, locale) : '';
  const companyDescription = company ? getLocalizedString(company.description, locale) : '';
  const companyLogo = company?.logo || '';
  const companyUrl = company ? getSafeCompanyUrl(company.link) : '';
  const canonicalUrl = getSiteUrl(`/${locale}/news/${article.id}`);
  const shareUrl = encodeURIComponent(canonicalUrl);
  const shareTitle = encodeURIComponent(title);
  const homePath = `/${locale}`;
  const BackArrow = locale === 'ar' ? ArrowRight : ArrowLeft;

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#F8F9F4] pb-20 pt-28 sm:pt-32" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        <div className="mx-auto max-w-[1216px] space-y-9 px-5 sm:px-8 lg:space-y-12">
          <nav aria-label={locale === 'ar' ? 'مسار التنقل' : 'Breadcrumb'} className="flex items-center justify-between gap-5 text-xs text-[#5A677B] sm:text-sm">
            <ol className="flex min-w-0 items-center gap-2">
              <li><Link href={homePath} className="whitespace-nowrap transition-colors hover:text-[#101E39]">{locale === 'ar' ? 'الرئيسية' : 'Home'}</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href={archivePath} className="whitespace-nowrap transition-colors hover:text-[#101E39]">{locale === 'ar' ? 'الأخبار' : 'News'}</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="truncate font-semibold text-[#101E39]">{title}</li>
            </ol>
            <Link href={archivePath} className="inline-flex shrink-0 items-center gap-2 font-bold text-[#101E39] transition-colors hover:text-[#B7913D]">
              <BackArrow className="h-4 w-4" />
              <span className="hidden sm:inline">{locale === 'ar' ? 'العودة للأخبار' : 'Back to news'}</span>
            </Link>
          </nav>

          <header className="space-y-5">
            {category && (
              <span className="inline-flex rounded-full bg-[#B7913D]/10 px-4 py-1.5 text-xs font-bold text-[#96742B]">
                {category}
              </span>
            )}
            <h1 className="max-w-5xl text-3xl font-bold leading-[1.5] tracking-tight text-[#101E39] sm:text-4xl lg:text-5xl">
              {title}
            </h1>
            <div className="flex flex-col gap-5 border-b border-[#101E39]/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-xs text-[#5A677B] sm:text-sm">
                <span className="inline-flex items-center gap-2">
                  <Calendar aria-hidden="true" className="h-4 w-4 text-[#B7913D]" />
                  <time dateTime={article.publishedAt || undefined}>
                    {article.publishedAt ? formatDate(article.publishedAt, locale) : article.date}
                  </time>
                </span>
                <span aria-hidden="true" className="text-[#B7913D]">•</span>
                <span className="inline-flex items-center gap-2">
                  <Clock aria-hidden="true" className="h-4 w-4 text-[#B7913D]" />
                  <span>{locale === 'ar' ? `${readTime} قراءة` : `${readTime} read`}</span>
                </span>
              </div>
              <div className="flex items-center gap-2" aria-label={locale === 'ar' ? 'مشاركة الخبر' : 'Share article'}>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={locale === 'ar' ? 'مشاركة على لينكدإن' : 'Share on LinkedIn'}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#101E39]/15 bg-white text-[#101E39] transition-colors hover:border-[#101E39] hover:bg-[#101E39] hover:text-white"
                >
                  <span aria-hidden="true" className="text-xs font-extrabold">in</span>
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={locale === 'ar' ? 'مشاركة على إكس' : 'Share on X'}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#101E39]/15 bg-white text-sm font-bold text-[#101E39] transition-colors hover:border-[#101E39] hover:bg-[#101E39] hover:text-white"
                >
                  X
                </a>
                <a
                  href={`mailto:?subject=${shareTitle}&body=${shareUrl}`}
                  aria-label={locale === 'ar' ? 'مشاركة عبر البريد الإلكتروني' : 'Share by email'}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#101E39]/15 bg-white text-[#101E39] transition-colors hover:border-[#101E39] hover:bg-[#101E39] hover:text-white"
                >
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </div>
          </header>

          <div className="relative aspect-[1.8] max-h-[560px] min-h-[220px] overflow-hidden rounded-sm bg-[#101E39]/5 sm:aspect-[2.25]">
            {article.image ? (
              <Image
                src={article.image}
                alt={article.imageAlt || title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 1216px"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#101E39] to-[#1B4332]" aria-hidden="true" />
            )}
          </div>

          <div className={`grid gap-8 lg:gap-12 ${article.statistics?.length || companyName ? 'lg:grid-cols-[minmax(0,1.8fr)_minmax(260px,0.8fr)]' : ''}`}>
            <article className="min-w-0 rounded-sm bg-white px-5 py-7 shadow-[0_8px_32px_rgba(16,30,57,0.05)] sm:px-8 sm:py-10 lg:px-12">
              {showExcerpt && (
                <p className="mb-7 border-b border-[#101E39]/10 pb-7 text-lg font-semibold leading-9 text-[#101E39] sm:text-xl">
                  {excerpt}
                </p>
              )}
              <div
                className="news-article-body"
                dangerouslySetInnerHTML={{ __html: sanitizeNewsContent(articleContent) }}
              />
            </article>

            {Boolean(article.statistics?.length || companyName) && (
              <aside className="space-y-6">
                {article.statistics && article.statistics.length > 0 && (
                  <section className="rounded-sm bg-[#101E39] p-6 text-white sm:p-7">
                    <h2 className="text-lg font-bold">{locale === 'ar' ? 'أرقام المبادرة' : 'Initiative in numbers'}</h2>
                    <ul className="mt-5 grid grid-cols-2 gap-3">
                      {article.statistics.map((statistic, index) => {
                        const value = getLocalizedString(statistic.value, locale);
                        const label = getLocalizedString(statistic.label, locale);
                        if (!value && !label) return null;
                        return (
                          <li key={`${value}-${label}-${index}`} className="min-h-28 rounded-sm border border-white/15 bg-white/5 p-4">
                            {value && <p className="text-xl font-bold text-[#D4AF73]">{value}</p>}
                            {label && <p className="mt-2 text-xs leading-5 text-white/80">{label}</p>}
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                )}

                {companyName && (
                  <section className="rounded-sm border border-[#101E39]/10 bg-white p-6 sm:p-7">
                    <p className="text-xs font-bold text-[#B7913D]">{locale === 'ar' ? 'الشركة المعنية' : 'Featured company'}</p>
                    {companyLogo && (
                      <div className="relative mt-5 h-16 w-40">
                        <Image
                          src={companyLogo}
                          alt={companyName}
                          fill
                          sizes="160px"
                          className="object-contain object-left rtl:object-right"
                        />
                      </div>
                    )}
                    <h2 className="mt-4 text-xl font-bold text-[#101E39]">{companyName}</h2>
                    {companyDescription && <p className="mt-3 text-sm leading-7 text-[#5A677B]">{companyDescription}</p>}
                    {companyUrl && (
                      <a
                        href={companyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#101E39] transition-colors hover:text-[#B7913D]"
                      >
                        <span>{locale === 'ar' ? 'زيارة الموقع' : 'Visit website'}</span>
                        <BackArrow className="h-4 w-4" />
                      </a>
                    )}
                  </section>
                )}
              </aside>
            )}
          </div>

          {relatedNews.length > 0 && (
            <section className="space-y-6 border-t border-[#101E39]/10 pt-10 sm:pt-14">
              <div className="flex items-end justify-between gap-4">
                <h2 className="text-2xl font-bold text-[#101E39] sm:text-3xl">
                  {locale === 'ar' ? 'أخبار ذات صلة' : 'Related news'}
                </h2>
                <Link href={archivePath} className="inline-flex items-center gap-2 text-sm font-bold text-[#101E39] transition-colors hover:text-[#B7913D]">
                  <span>{locale === 'ar' ? 'كل الأخبار' : 'All news'}</span>
                  <BackArrow className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                {relatedNews.map((related) => (
                  <Link
                    key={related.id}
                    href={`${archivePath}/${related.id}`}
                    className="group flex min-w-0 gap-4 overflow-hidden rounded-sm bg-white p-4 shadow-sm transition-shadow hover:shadow-lg sm:gap-5 sm:p-5"
                  >
                    <div className="relative h-24 w-28 shrink-0 overflow-hidden bg-[#101E39]/5 sm:h-32 sm:w-40">
                      {related.image ? (
                        <Image
                          src={related.image}
                          alt={related.imageAlt || getLocalizedString(related.title, locale)}
                          fill
                          sizes="(max-width: 640px) 112px, 160px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#101E39] to-[#1B4332]" aria-hidden="true" />
                      )}
                    </div>
                    <div className="min-w-0 py-1">
                      <time dateTime={related.publishedAt || undefined} className="text-xs font-semibold text-[#B7913D]">
                        {related.publishedAt ? formatDate(related.publishedAt, locale) : related.date}
                      </time>
                      <h3 className="mt-2 line-clamp-3 text-sm font-bold leading-6 text-[#101E39] transition-colors group-hover:text-[#B7913D] sm:text-base">
                        {getLocalizedString(related.title, locale)}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
