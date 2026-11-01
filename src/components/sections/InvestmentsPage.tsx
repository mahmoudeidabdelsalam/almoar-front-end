import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { InvestmentsPageContent, Locale, Project } from '@/types';
import { InvestmentPortfolio } from './InvestmentPortfolio';
import { Notch } from '@/components/ui/Notch';

interface InvestmentsPageProps {
  locale: Locale;
  content: InvestmentsPageContent | null;
  projects: Project[];
}

function localized(value: { ar: string; en: string } | undefined, locale: Locale): string {
  return locale === 'en' ? value?.en || value?.ar || '' : value?.ar || value?.en || '';
}

function localizedUrl(url: string, locale: Locale): string {
  if (/^(https?:|mailto:|tel:)/i.test(url)) return url;
  if (!url.startsWith('/') || url.startsWith('//')) return '';
  const segments = url.split('/').filter(Boolean);
  if (segments[0] === 'ar' || segments[0] === 'en') return url;
  return `/${locale}${url === '/' ? '' : url}`;
}

export function InvestmentsPage({ locale, content, projects }: InvestmentsPageProps) {
  const isArabic = locale === 'ar';
  const direction = isArabic ? 'rtl' : 'ltr';
  const heroTitle = localized(content?.heroTitle, locale) || (isArabic ? 'استثماراتنا' : 'Our Investments');
  const introHeading = localized(content?.introHeading, locale) || (isArabic ? 'تمكين الاستثمارات الواعدة' : 'Empowering Promising Investments');
  const portfolioHeading = localized(content?.portfolioHeading, locale) || (isArabic ? 'شركات محفظتنا الاستثمارية' : 'Our Investment Portfolio');
  const ctaHeading = localized(content?.ctaHeading, locale) || (isArabic
    ? 'هل تتطلع إلى تعزيز شركتك وتوسيع نطاق أعمالك؟'
    : 'Looking to strengthen your company and expand your business?');
  const ctaUrl = localizedUrl(content?.ctaUrl || '/invest-with-us', locale) || `/${locale}/invest-with-us`;
  const isExternalCta = /^(https?:|mailto:|tel:)/i.test(ctaUrl);
  const ctaLabel = localized(content?.ctaButtonLabel, locale) || (isArabic ? 'استثمر معنا' : 'Invest with us');
  const navigationLinks = content?.navigationLinks.length
    ? content.navigationLinks
    : [
        {
          label: { ar: 'استثمر معنا', en: 'Invest with us' },
          description: { ar: '', en: '' },
          image: '',
          url: '/invest-with-us',
        },
        {
          label: { ar: 'الأخبار والتحديثات', en: 'News and updates' },
          description: { ar: '', en: '' },
          image: '',
          url: '/news',
        },
      ];

  return (
    <div dir={direction} className="bg-ivory-50 pt-[72px]">
      <section className="relative overflow-hidden bg-navy-900 text-white">
        <div className="relative mx-auto flex min-h-[600px] max-w-[1216px] flex-col  px-5 pb-16 pt-12 sm:px-8 lg:px-0">
          <nav aria-label={isArabic ? 'مسار التنقل' : 'Breadcrumb'} className="mb-10 flex items-center gap-2 text-xs text-white/65 mb-auto">
            <Link href={`/${locale}`} className="transition-colors hover:text-white">{isArabic ? 'الرئيسية' : 'Home'}</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page" className="text-white">{heroTitle}</span>
          </nav>
          {localized(content?.heroBadge, locale) && (
            <p className="mb-2 text-xs font-medium text-gold-200">{localized(content?.heroBadge, locale)}</p>
          )}
          <h1 className="max-w-3xl text-4xl font-normal tracking-tight sm:text-5xl lg:text-6xl">{heroTitle}</h1>
          {localized(content?.heroDescription, locale) && (
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
              {localized(content?.heroDescription, locale)}
            </p>
          )}
        </div>
        <Notch fill="var(--color-ivory-50)" className="absolute start-1/2 bottom-0 z-[1] mb-[-4px] h-[30px] w-[400px] -translate-x-1/2 rotate-180" />
      </section>

      <section className="px-5 py-14 sm:px-8 lg:px-14 lg:py-20 bg-ivory-50">
        <div className="mx-auto grid max-w-[1216px] items-center gap-10 md:grid-cols-2 lg:gap-16">
          <div className="max-w-xl">
            {localized(content?.introEyebrow, locale) && (
              <p className="mb-3 text-xs font-medium text-gold-600">{localized(content?.introEyebrow, locale)}</p>
            )}
            <h2 className="text-3xl font-normal leading-tight text-navy-900 sm:text-[64px]">{introHeading}</h2>
            {localized(content?.introDescription, locale) && (
              <p className="mt-5 text-sm leading-8 text-[#626D7B]">{localized(content?.introDescription, locale)}</p>
            )}
          </div>
          <div className="relative aspect-[1.3] overflow-hidden rounded-3xl bg-[#E8E5DC]">
            <Image
              src={content?.introImage || '/images/project_dama_lazurd.jpg'}
              alt={introHeading}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {content?.statistics.length ? (
      <section className="mt-5 bg-white" aria-label={locale === 'ar' ? 'إحصائيات العمر القابضة' : 'Alomar Holding statistics'}>
        <dl className="mx-auto grid max-w-full grid-cols-2 divide-x divide-navy-900/10 rtl:divide-x-reverse sm:grid-cols-4 items-center lg:max-w-[1440px]">
          {content.statistics.map((statistic, index) => (
            <div key={`${statistic.value}-${index}`} className="group px-4 py-6 border-b-1 lg:border-b-0 lg:min-h-[240px] flex flex-col justify-center border-r border-r-navy-900/10 border-t-[3px] border-t-transparent hover:border-t-gold-500 hover:bg-navy-900 hover:text-gold-500 sm:px-6 sm:py-8">
              <dt className="text-xs text-[#8A8E93] group-hover:text-[#fff] sm:text-sm">{localized(statistic.label, locale)}</dt>
              <dd className="mt-5 text-[44px] lg:text-[72px] font-medium tabular-nums text-navy-900 group-hover:text-gold-500 sm:text-4xl lg:text-[46px]">{statistic.value}</dd>
            </div>
          ))}
        </dl>
      </section>
      ) : null}

      <InvestmentPortfolio
        projects={projects}
        locale={locale}
        eyebrow={localized(content?.portfolioEyebrow, locale) || (isArabic ? 'الشركات' : 'Portfolio')}
        heading={portfolioHeading}
        description={localized(content?.portfolioDescription, locale)}
      />

      <section className="bg-[#19382D]">
        <div 
          className="mx-auto flex max-w-[1440px] flex-col items-start gap-8 md:flex-row md:items-center md:justify-between"
          >
          <div className="max-w-2xl px-5 py-4 text-white">
            {localized(content?.ctaEyebrow, locale) && (
              <p className="mb-3 text-xs font-medium text-gold-200">{localized(content?.ctaEyebrow, locale)}</p>
            )}
            <h2 className="text-3xl font-normal leading-tight sm:text-[64px]">{ctaHeading}</h2>
              {localized(content?.ctaDescription, locale) && (
                <p className="mt-4 max-w-xl text-sm leading-7 text-white/75 mb-5">{localized(content?.ctaDescription, locale)}</p>
              )}
             {isExternalCta ? (
              <a href={ctaUrl} className="btn btn--gold shrink-0">
                {ctaLabel}
                {isArabic ? <ArrowLeft aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}
              </a>
            ) : (
              <Link href={ctaUrl} className="btn btn--line shrink-0">
                {ctaLabel}
                {isArabic ? <ArrowLeft aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}
              </Link>
            )}
          </div>
          <div className="shrink-0 h-[500px] w-[500px]" style={{ backgroundImage: 'url(/bg-pattern.png)', backgroundSize: 'cover', backgroundPosition: 'left bottom' }} />
        </div>
      </section>

      {navigationLinks.length > 0 && (
        <section className="bg-ivory-50 px-5 py-10 sm:px-8 lg:px-14 lg:py-14">
          <div className="mx-auto grid max-w-[1216px] gap-4 sm:grid-cols-2">
            {navigationLinks.map((item, index) => {
              const url = localizedUrl(item.url, locale);
              if (!url) return null;
              const label = localized(item.label, locale);
              const description = localized(item.description, locale);
              const external = /^(https?:|mailto:|tel:)/i.test(url);
              const card = (
                <div className="group relative flex min-h-40 flex-col justify-end overflow-hidden rounded-xl p-6 text-navy-900 border border-[#D7D9DC] bg-white transition hover:-translate-y-1 hover:border-[#C79A32] hover:shadow-lg">
                  {item.image && (
                    <>
                      <Image src={item.image} alt="" fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover opacity-35 transition-transform duration-500 group-hover:scale-105" />
                      <span aria-hidden="true" className="absolute inset-0 bg-navy-900/45" />
                    </>
                  )}
                  <span className="relative z-10 text-lg font-medium">{label}</span>
                  {description && <span className="relative z-10 mt-2 text-sm text-white/75">{description}</span>}
                  <span className="relative z-10 mt-4 flex items-center gap-2 text-xs text-navy-900">
                    {isArabic ? 'اكتشف المزيد' : 'Discover more'}
                    {isArabic ? <ArrowLeft aria-hidden="true" size={14} /> : <ArrowRight aria-hidden="true" size={14} />}
                  </span>
                </div>
              );
              return external
                ? <a key={`${url}-${index}`} href={url} className="block rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500">{card}</a>
                : <Link key={`${url}-${index}`} href={url} className="block rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500">{card}</Link>;
            })}
          </div>
        </section>
      )}
    </div>
  );
}
