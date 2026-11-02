'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowDownLeft, ArrowLeft, ArrowRight, ArrowUpLeft, Plus, UserRound } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import type { LocalizedString } from '@/types';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const overviewImageFallbacks = [
  '/images/project_dama_lazurd.jpg',
  '/images/project_commercial.jpg',
];

const companyImageFallbacks = [
  '/images/project_commercial.jpg',
  '/images/hero_riyadh.jpg',
  '/images/project_dama_lazurd.jpg',
  '/images/riyadh-horizon.png',
];

function localized(value: LocalizedString, locale: 'ar' | 'en'): string {
  return value[locale] || value[locale === 'ar' ? 'en' : 'ar'] || '';
}

function localizedHref(url: string, locale: 'ar' | 'en'): string {
  if (!url || /^(mailto:|tel:|\/\/)/i.test(url)) return url;
  let path = url;
  if (/^https?:/i.test(url)) {
    try {
      const parsed = new URL(url);
      const internalHosts = [
        'localhost',
        '127.0.0.1',
        'almoar-wp.test',
        'alomarholding.sa',
        'www.alomarholding.sa',
        'artlanguage.co',
        'www.artlanguage.co',
      ];
      if (!internalHosts.includes(parsed.hostname)) return url;
      path = `${parsed.pathname}${parsed.search}${parsed.hash}`;
    } catch {
      return url;
    }
  }
  path = path.startsWith('/') ? path : `/${path}`;
  const segments = path.split('/').filter(Boolean);
  if (segments[0] === 'ar' || segments[0] === 'en') return path;
  return `/${locale}${path === '/' ? '' : path}`;
}

function ContentLink({ href, children, className }: { href: string; children: React.ReactNode; className: string }) {
  if (/^(https?:|mailto:|tel:|\/\/)/i.test(href)) {
    const external = /^(https?:|\/\/)/i.test(href);
    return <a href={href} className={className} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>{children}</a>;
  }
  return <Link href={href || '#'} className={className}>{children}</Link>;
}

export const AboutHero: React.FC = () => {
  const { locale, content } = useLanguage();
  const banner = content.pageBanners.about;
  const bannerTitle = localized(banner?.title || { ar: '', en: '' }, locale);
  const title = bannerTitle || (locale === 'ar' ? 'نبذة عن العمر القابضة' : 'About Alomar Holding');
  const image = banner?.image || '/images/project_commercial.jpg';
  const breadcrumbHome = locale === 'ar' ? 'الرئيسية' : 'Home';
  const breadcrumbAbout = locale === 'ar' ? 'من نحن' : 'About Us';

  return (
    <section className="about-hero relative min-h-[430px] overflow-hidden bg-navy-900 pt-[72px] text-white sm:min-h-[470px] lg:min-h-[520px]" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <Image src={image} alt="" fill priority sizes="100vw" className="about-hero__image object-cover" />
      <div className="about-hero__overlay absolute inset-0" aria-hidden="true" />
      <div className="relative z-10 mx-auto flex min-h-[358px] max-w-[1216px] flex-col justify-between px-5 pb-14 pt-10 sm:px-8 sm:pb-16 lg:min-h-[448px] lg:px-0 lg:pb-20 lg:pt-12">
        <nav className="text-xs text-white/65" aria-label={locale === 'ar' ? 'مسار التنقل' : 'Breadcrumb'}>
          <Link href={`/${locale}`} className="transition-colors hover:text-gold-200">{breadcrumbHome}</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span className="text-white/80">{breadcrumbAbout}</span>
        </nav>
        <h1 className="about-hero__title max-w-[435px] self-start text-start text-4xl font-semibold leading-[1.2] tracking-tight sm:text-5xl lg:text-[84px]">
          {title}
        </h1>
      </div>
      <svg className="pointer-events-none absolute inset-x-0 bottom-0 h-8 w-full text-ivory-50 sm:h-12" viewBox="0 0 1440 64" preserveAspectRatio="none" aria-hidden="true">
        <path fill="currentColor" d="M0 30H540C600 30 610 0 720 0s120 30 180 30h540v34H0z" />
      </svg>
    </section>
  );
};

export const AboutOverview: React.FC = () => {
  const revealRef = useScrollReveal<HTMLElement>();
  const { locale, content } = useLanguage();
  const about = content.aboutPage;
  const summary = content.homeAbout;
  const overviewHeading = localized(about.overview.heading, locale);
  const heroTitle = localized(content.pageBanners.about?.title || { ar: '', en: '' }, locale)
    || (locale === 'ar' ? 'نبذة عن العمر القابضة' : 'About Alomar Holding');
  const title = overviewHeading && overviewHeading !== heroTitle
    ? overviewHeading
    : locale === 'ar' ? 'استثمار. رؤية واضحة' : 'Investment. A Clear Vision';
  const firstDescription = localized(about.overview.descriptionOne, locale) || localized(summary.descriptionOne, locale);
  const secondDescription = localized(about.overview.descriptionTwo, locale) || localized(summary.descriptionTwo, locale);
  const firstImageUrl = about.overview.imageOne.url;
  const isRiyadhHorizonImage = firstImageUrl.includes('أفق-الرياض.png')
    || /%D8%A3%D9%81%D9%82-%D8%A7%D9%84%D8%B1%D9%8A%D8%A7%D8%B6\.png/i.test(firstImageUrl);
  const firstImage = isRiyadhHorizonImage
    ? '/images/riyadh-horizon.png'
    : firstImageUrl || overviewImageFallbacks[0];
  const secondImage = about.overview.imageTwo.url || overviewImageFallbacks[1];
  const firstAltFromCms = localized(about.overview.imageOne.alt, locale).trim();
  const firstAlt = firstAltFromCms && firstAltFromCms.length <= 120
    ? firstAltFromCms
    : locale === 'ar' ? 'مشروع أفق الرياض' : 'Riyadh Horizon development';
  const secondAlt = localized(about.overview.imageTwo.alt, locale) || (locale === 'ar' ? 'مشروع عمراني ضمن محفظة العمر القابضة' : 'Development project in Alomar Holding’s portfolio');
  const overviewImageSizes = '(max-width: 767px) min(470px, calc(100vw - 2.5rem)), (max-width: 1023px) calc((100vw - 6rem) / 2), 470px';

  return (
    <section ref={revealRef} data-scroll-reveal className="bg-ivory-50 px-5 py-16 sm:px-8 sm:py-20 lg:px-0 lg:py-28" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="mx-auto flex max-w-[1046px] w-full flex-col md:flex-row justify-between lg:gap-[120px]">
        <div className="min-w-0 max-w-[470px] mb-5 md:mt-0 lg:max-w-[490px]">
          <h2 data-reveal-item className="mb-3 lg:mb-12 min-w-full text-4xl font-semibold leading-[1.2] text-navy-900 sm:text-5xl lg:mb-12 lg:text-[58px]">
            {title}
          </h2>
          <div data-reveal-item className="about-image-frame relative aspect-[0.8] w-full overflow-hidden rounded-xl">
            <Image src={secondImage} alt={secondAlt} fill sizes={overviewImageSizes} loading="eager" className="object-cover" />
          </div>
        </div>
        <div className="min-w-0 max-w-[470px] md:mt-0 lg:max-w-[490px]">
          <div data-reveal-item className="about-image-frame relative aspect-[0.8] w-full overflow-hidden rounded-xl">
            <Image src={firstImage} alt={firstAlt} fill sizes={overviewImageSizes} className="object-cover" />
          </div>
          {(firstDescription || secondDescription) && (
            <div className="mt-7 text-sm leading-7 text-slate-700">
              <span className="mb-5 block h-px w-10 bg-gold-500" aria-hidden="true" />
              {secondDescription && <p className="mt-3">{secondDescription}</p>}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export const AboutStatistics: React.FC = () => {
  const revealRef = useScrollReveal<HTMLElement>();
  const { locale, content } = useLanguage();
  const statistics = content.aboutPage.statistics.length ? content.aboutPage.statistics : [
    { value: '08', label: { ar: 'عدد الشركات في المحفظة', en: 'Companies in the portfolio' } },
    { value: '06', label: { ar: 'القطاعات الاستثمارية', en: 'Investment sectors' } },
    { value: '100%', label: { ar: 'شركات سعودية مستقلة', en: 'Independent Saudi companies' } },
    { value: '2030', label: { ar: 'مواءمة مع رؤية المملكة', en: 'Aligned with Saudi Vision' } },
  ];

  return (
    <section ref={revealRef} data-scroll-reveal className="bg-white" aria-label={locale === 'ar' ? 'إحصائيات العمر القابضة' : 'Alomar Holding statistics'}>
      <dl className="mx-auto grid w-full grid-cols-2 sm:grid-cols-4">
        {statistics.map((statistic, index) => (
          <div key={`${statistic.value}-${index}`} data-reveal-item className="group flex min-h-[146px] flex-col justify-between border-b border-navy-900/15 px-5 py-6 transition-colors duration-300 hover:bg-navy-900 sm:min-h-[210px] sm:border-b-0 sm:border-s sm:px-8 sm:py-7 lg:px-9">
            <dt className="text-xs leading-5 text-slate-500 transition-colors group-hover:text-white/70 sm:text-sm">{localized(statistic.label, locale)}</dt>
            <dd className="mt-6 text-[42px] lg:text-[60px] text-end font-medium leading-none tabular-nums text-navy-900 transition-colors group-hover:text-gold-500 sm:text-5xl">{statistic.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

export const AboutStrategy: React.FC = () => {
  const revealRef = useScrollReveal<HTMLElement>();
  const { locale, content } = useLanguage();
  const about = content.aboutPage;
  const strategy = about.strategy;
  const title = localized(strategy.title, locale) || (locale === 'ar' ? 'نهج يرتكز على الوضوح' : 'A Clear and Focused Approach');
  const description = localized(strategy.description, locale) || localized(about.visionDescription, locale);
  const principles = strategy.principles.length ? strategy.principles : [
    {
      title: { ar: 'تنويع الفرص الاستثمارية', en: 'Diversifying investment opportunities' },
      description: { ar: 'نستثمر بحصافة في فرص متنوعة لبناء محفظة متوازنة تحقق قيمة مستدامة.', en: 'We invest prudently across diverse opportunities to build a balanced portfolio and create lasting value.' },
    },
    {
      title: { ar: 'الابتكار والتميز التشغيلي', en: 'Operational innovation and excellence' },
      description: { ar: 'نعتمد على استراتيجيات مبتكرة وأفضل الممارسات التشغيلية، مع تعزيز ثقافة التميز التي ترفع الكفاءة وتحقق نتائج ملموسة ومستدامة.', en: 'We apply innovative strategies and best operational practices, fostering a culture of excellence that improves efficiency and delivers measurable, sustainable results.' },
    },
    {
      title: { ar: 'الشراكات الاستراتيجية والمسؤولية', en: 'Strategic partnerships and responsibility' },
      description: { ar: 'نبني شراكات استراتيجية مسؤولة تحقق أثراً إيجابياً للمجتمع والاقتصاد.', en: 'We build responsible strategic partnerships that create a positive impact for communities and the economy.' },
    },
  ];
  const [activePrincipleIndex, setActivePrincipleIndex] = useState<number | null>(null);

  const buttonLabel = localized(strategy.ctaLabel, locale) || (locale === 'ar' ? 'استكشف استثماراتنا' : 'Explore our investments');
  const buttonHref = localizedHref(strategy.ctaUrl || '/our-investments', locale);
  const ArrowIcon = locale === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <section
      ref={revealRef}
      data-scroll-reveal
      className="about-strategy relative isolate flex min-h-[640px] items-center overflow-hidden bg-navy-900 py-12 text-white sm:min-h-[680px] sm:py-16 lg:min-h-[700px] lg:py-20"
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
    >
      <Image src="/images/project_dama_lazurd.jpg" alt="" fill sizes="100vw" className="about-strategy__image object-cover" />
      <div className="about-strategy__overlay absolute inset-0" aria-hidden="true" />
      <div className="relative z-10 mx-auto flex min-h-[560px] w-full max-w-[1216px] flex-col justify-between px-5 sm:min-h-[590px] sm:px-8 lg:px-0">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-[660px]">
            {localized(strategy.eyebrow, locale) && <p className="mb-3 text-xs font-medium text-gold-200">{localized(strategy.eyebrow, locale)}</p>}
            <h2 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-[62px]">{title}</h2>
            {description && <p className="mt-4 max-w-[660px] text-sm leading-7 text-white/80 sm:text-base sm:leading-8">{description}</p>}
          </div>
          {buttonLabel && buttonHref && (
            <ContentLink href={buttonHref} className="btn btn--gold about-strategy__button shrink-0">
              <span>{buttonLabel}</span><ArrowIcon aria-hidden="true" />
            </ContentLink>
          )}
        </div>
        <div className="about-strategy__principles mt-auto pt-10 sm:pt-12" onMouseLeave={() => setActivePrincipleIndex(null)}>
          <div className="about-strategy__principle-list">
            {principles.map((principle, index) => {
              const isActive = activePrincipleIndex === index;
              const principleTitle = localized(principle.title, locale);
              const principleDescription = localized(principle.description, locale);
              return (
                <article
                  key={principleTitle || index}
                  className={`about-strategy__principle-card ${isActive ? 'is-active' : ''}`}
                  onMouseEnter={() => setActivePrincipleIndex(index)}
                  onFocus={() => setActivePrincipleIndex(index)}
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) setActivePrincipleIndex(null);
                  }}
                  aria-current={isActive ? 'true' : undefined}
                >
                  <button
                    type="button"
                    onClick={() => setActivePrincipleIndex(index)}
                    aria-label={principleTitle}
                    className="about-strategy__principle-link"
                  >
                    {principleTitle}
                  </button>
                  {principleDescription && (
                    <p className="about-strategy__principle-description">{principleDescription}</p>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export const AboutPortfolio: React.FC = () => {
  const revealRef = useScrollReveal<HTMLElement>();
  const { locale, content } = useLanguage();
  const portfolio = content.aboutPage.portfolio;
  const contentItems = portfolio.items.filter((item) => localized(item.title, locale) || localized(item.description, locale) || item.metric);
  const items = contentItems.length ? contentItems : [
    { title: { ar: 'التطوير العقاري', en: 'Real estate development' }, description: { ar: '', en: '' }, metric: '02' },
    { title: { ar: 'العطور والمنسوجات والديكور', en: 'Perfumes, textiles & decor' }, description: { ar: '', en: '' }, metric: '03' },
    { title: { ar: 'إدارة الأملاك والمرافق', en: 'Property & facilities management' }, description: { ar: '', en: '' }, metric: '02' },
    { title: { ar: 'البناء والتشييد', en: 'Construction' }, description: { ar: '', en: '' }, metric: '01' },
  ];
  const [openIndex, setOpenIndex] = useState(0);
  const title = localized(portfolio.title, locale) || (locale === 'ar' ? 'نظرة عن قرب: كيف تتوزع محفظتنا' : 'A closer look at our portfolio');
  const buttonLabel = localized(portfolio.ctaLabel, locale) || (locale === 'ar' ? 'استكشف استثماراتنا' : 'Explore our investments');
  const buttonHref = localizedHref(portfolio.ctaUrl || '/our-investments', locale);
  const ArrowIcon = locale === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <section ref={revealRef} data-scroll-reveal className="bg-ivory-50 px-5 py-20 sm:px-8 sm:py-24 lg:px-0 lg:py-28" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-w-[1046px]">
        <div className="mb-10 flex flex-col lg:flex-row items-end justify-between gap-6 sm:flex-row sm:gap-8 lg:mb-14">
            <div>
              {localized(portfolio.eyebrow, locale) && <p className="mb-3 text-xs text-gold-500">{localized(portfolio.eyebrow, locale)}</p>}
              <h2 className="max-w-xl text-4xl font-semibold leading-tight text-navy-900 sm:text-5xl lg:text-[54px]">{title}</h2>
            </div>
            <div className="mb-7 flex justify-start">
              {buttonLabel && buttonHref && <ContentLink href={buttonHref} className="btn btn--navy"><ArrowIcon aria-hidden="true" /><span>{buttonLabel}</span></ContentLink>}
            </div>
        </div>
        <div className="grid gap-10 md:grid-cols-2 md:gap-14 items-end">
          <div className="md:col-start-1 md:row-span-2">
            <div className="about-portfolio-chart flex min-h-[310px] items-end justify-center gap-3 sm:gap-4" onMouseLeave={() => setOpenIndex(-1)}>
              {items.map((item, index) => {
                const metricValue = Number(item.metric.match(/\d+/)?.[0]) || index + 1;
                const maxMetric = Math.max(...items.map((entry, entryIndex) => Number(entry.metric.match(/\d+/)?.[0]) || entryIndex + 1));
                const height = Math.max(105, Math.round((metricValue / maxMetric) * 290));
                return (
                  <button
                    type="button"
                    key={`${item.metric}-${index}`}
                    data-reveal-item
                    onMouseEnter={() => setOpenIndex(index)}
                    onFocus={() => setOpenIndex(index)}
                    onClick={() => setOpenIndex(index)}
                    aria-label={localized(item.title, locale) || (locale === 'ar' ? `مجال استثماري ${index + 1}` : `Investment area ${index + 1}`)}
                    aria-pressed={openIndex === index}
                    className={`about-portfolio-bar group flex min-w-0 flex-1 flex-col items-end justify-between rounded-t-xl p-3 text-start transition-colors duration-300 sm:p-5 ${openIndex === index ? 'is-active bg-gold-500 text-navy-900' : ['bg-[#0F1F38] text-[#AAB1B8]', 'bg-[#2A3B4D] text-white', 'bg-[#1A3328] text-white', 'bg-navy-900 text-white'][index % 4]}`}
                    style={{ height: `${height}px`, animationDelay: `${index * 90}ms` }}
                  >
                    <span className="text-2xl font-medium tabular-nums sm:text-3xl">{item.metric || String(index + 1).padStart(2, '0')}</span>
                    <span className="line-clamp-2 text-[10px] leading-4 sm:text-xs">{localized(item.title, locale)}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="md:col-start-2 md:row-span-2">
            <div className="space-y-0" onMouseLeave={() => setOpenIndex(-1)}>
              {items.map((item, index) => {
                const title = localized(item.title, locale);
                const description = localized(item.description, locale);
                const isOpen = openIndex === index;
                return (
                  <div key={`${title}-${index}`} data-reveal-item className="border-t border-navy-900/15 py-4 last:border-b">
                    <button
                      type="button"
                      aria-expanded={description ? isOpen : undefined}
                      aria-controls={description ? `about-portfolio-item-${index}` : undefined}
                      onMouseEnter={() => setOpenIndex(index)}
                      onFocus={() => setOpenIndex(index)}
                      onClick={() => setOpenIndex(isOpen ? -1 : index)}
                      className={`group flex w-full items-center justify-between gap-4 text-start text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-500 ${isOpen ? 'text-gold-600' : 'text-navy-900'}`}
                    >
                      <span>
                        <span className="block text-base font-semibold">{title}</span>
                      </span>
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${isOpen ? 'border-gold-500 bg-gold-500 text-navy-900' : 'border-slate-200 text-slate-400 group-hover:border-gold-500 group-hover:text-gold-600'}`} aria-hidden="true">
                        <Plus className="h-4 w-4" />
                      </span>
                    </button>
                    {description && (
                      <div id={`about-portfolio-item-${index}`} className={`grid transition-[grid-template-rows,opacity] duration-300 ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                        <p className="overflow-hidden pt-2 text-xs leading-6 text-[#687181]" dangerouslySetInnerHTML={{ __html: description }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const AboutCompanies: React.FC = () => {
  const revealRef = useScrollReveal<HTMLElement>();
  const { locale, content } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(-1);
  const companies = content.aboutPage.companies;
  const items = companies.items.filter((item) => item.name.ar || item.name.en || item.logo || item.image);
  if (!items.length) return null;

  return (
    <section
      ref={revealRef}
      data-scroll-reveal
      className="about-companies relative overflow-hidden bg-[#F7F6F1] pb-16 pt-14 text-white sm:pb-20 sm:pt-16 lg:pb-24"
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
    >
      <div aria-hidden="true" className="about-companies__backdrop pattern absolute inset-x-0 top-0" />
      <div className="relative z-10 mx-auto max-w-[1216px] px-5 sm:px-8 lg:px-0">
        <div className="mb-8 flex min-h-[205px] items-center justify-between gap-8 sm:mb-10 md:min-h-[235px]">
          <div className="max-w-2xl">
            {localized(companies.eyebrow, locale) && <p className="mb-3 text-xs text-gold-200">{localized(companies.eyebrow, locale)}</p>}
            {localized(companies.title, locale) && <h2 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-[58px]">{localized(companies.title, locale)}</h2>}
          </div>
          <Image src="/branding/alomar_logo_mark.png" alt="" width={74} height={74} className="hidden h-[72px] w-[72px] object-contain opacity-90 sm:block" />
        </div>
        <div
          className="about-companies__grid grid gap-3"
          onMouseLeave={() => setActiveIndex(-1)}
          style={{
            gridTemplateColumns: items.map((_, index) => `minmax(0, ${activeIndex === index ? '2.2fr' : '1fr'})`).join(' '),
          }}
        >
          {items.map((company, index) => {
            const name = localized(company.name, locale);
            const description = localized(company.description, locale);
            const image = company.image || companyImageFallbacks[index % companyImageFallbacks.length];
            const isActive = activeIndex === index;
            const card = (
              <article data-reveal-item className={`about-companies__card group relative flex overflow-hidden rounded-2xl border border-white/35 shadow-sm transition-[box-shadow,transform] duration-500 ${isActive ? 'is-active' : ''}`}>
                <div className="about-companies__visual relative overflow-hidden">
                  <Image src={image} alt="" fill sizes="(max-width: 767px) 50vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="about-companies__image-overlay absolute inset-0" />
                  {!isActive && name && <h3 className="about-companies__image-title absolute inset-x-4 bottom-4 z-10 text-sm font-semibold text-white sm:inset-x-5 sm:bottom-5">{name}</h3>}
                </div>
                <div className="about-companies__details flex min-w-0 flex-1 flex-col justify-between gap-5">
                  <div>
                    {name && <h3 className="about-companies__title text-base font-semibold sm:text-lg">{name}</h3>}
                    {description && <p className="about-companies__description mt-2 text-xs leading-6">{description}</p>}
                  </div>
                  {company.link && (
                    <Link href={localizedHref(company.link, locale)} className="about-companies__link group mt-auto inline-flex items-center gap-2 text-sm font-medium text-gold-500 transition-colors hover:text-gold-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-500" target={/^(https?:|\/\/)/i.test(company.link) ? '_blank' : undefined} rel={/^(https?:|\/\/)/i.test(company.link) ? 'noopener noreferrer' : undefined}>
                      {locale === 'ar' ? 'تعرّف على الشركة' : 'More about the company'}
                      {locale === 'ar' ? <ArrowUpLeft className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}
                    </Link>
                  )}
                </div>
              </article>
            );
            return (
              <div
                key={`${name}-${index}`}
                className="about-companies__item min-w-0"
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
              >
                {card}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export const AboutResponsibility: React.FC = () => {
  const revealRef = useScrollReveal<HTMLElement>();
  const { locale, content } = useLanguage();
  const responsibility = content.aboutPage.responsibility;
  const items = responsibility.items.filter((item) => localized(item.title, locale) || localized(item.description, locale) || item.image);
  const [activeIndex, setActiveIndex] = useState(0);
  if (!items.length) return null;
  const current = items[activeIndex % items.length];

  return (
    <section ref={revealRef} data-scroll-reveal className="bg-ivory-50 px-5 py-20 sm:px-8 sm:py-24 lg:px-0 lg:py-28" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-w-[1046px]">
        <div className="mb-10 flex items-center justify-between gap-6 sm:mb-14">
          <div>
            {localized(responsibility.eyebrow, locale) && <p className="mb-3 text-xs text-gold-500">{localized(responsibility.eyebrow, locale)}</p>}
            {localized(responsibility.title, locale) && <h2 className="text-3xl font-semibold text-navy-900 sm:text-4xl lg:text-[52px]">{localized(responsibility.title, locale)}</h2>}
          </div>
          {items.length > 1 && (
            <div className="flex gap-2">
              <button type="button" onClick={() => setActiveIndex((activeIndex - 1 + items.length) % items.length)} className="flex h-9 w-9 items-center justify-center rounded-full border border-navy-900/15 text-navy-900 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-500" aria-label={locale === 'ar' ? 'المبادرة السابقة' : 'Previous initiative'}>
                {locale === 'ar' ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
              </button>
              <span className="self-center text-xs tabular-nums text-[#667080]">{String(activeIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</span>
              <button type="button" onClick={() => setActiveIndex((activeIndex + 1) % items.length)} className="flex h-9 w-9 items-center justify-center rounded-full border border-navy-900/15 text-navy-900 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-500" aria-label={locale === 'ar' ? 'المبادرة التالية' : 'Next initiative'}>
                {locale === 'ar' ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
              </button>
            </div>
          )}
        </div>
        <div className={`grid items-center gap-8 lg:gap-14 ${current.image ? 'md:grid-cols-2' : ''}`} dir="ltr">
          {current.image && (
            <div className="about-image-frame relative aspect-[1.45] overflow-hidden rounded-xl">
              <Image src={current.image} alt={localized(current.title, locale)} fill sizes="(max-width: 768px) 100vw, 45vw" className="object-cover transition-transform duration-700 hover:scale-105" />
            </div>
          )}
          <div dir={locale === 'ar' ? 'rtl' : 'ltr'}>
            {localized(current.title, locale) && <h3 className="text-2xl font-semibold text-navy-900">{localized(current.title, locale)}</h3>}
            {localized(current.description, locale) && <p className="mt-4 text-sm leading-7 text-[#667080]">{localized(current.description, locale)}</p>}
          </div>
        </div>
      </div>
    </section>
  );
};

export const AboutBoard: React.FC = () => {
  const revealRef = useScrollReveal<HTMLElement>();
  const { locale, content } = useLanguage();
  const board = content.aboutPage.board;
  const members = board.members.filter((member) => localized(member.name, locale) || localized(member.role, locale) || member.image);
  if (!members.length) return null;

  return (
    <section ref={revealRef} data-scroll-reveal className="bg-ivory-50 px-5 py-20 sm:px-8 sm:py-24 lg:px-0 lg:py-28" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-w-[1046px]">
        <div className="mb-10 text-center sm:mb-14">
          {localized(board.eyebrow, locale) && <p className="mb-3 text-xs text-gold-500">{localized(board.eyebrow, locale)}</p>}
          {localized(board.title, locale) && <h2 className="text-4xl font-semibold text-navy-900 sm:text-5xl lg:text-[58px]">{localized(board.title, locale)}</h2>}
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {members.map((member, index) => {
            const name = localized(member.name, locale);
            const role = localized(member.role, locale);
            return (
              <article key={`${name}-${index}`} data-reveal-item className="text-start">
                <div className="relative mb-4 h-[340px] w-full border border-navy-900/15 hover:border-gold-500 overflow-hidden rounded-tr-2xl bg-[#EFEEE9]">
                  {member.image ? (
                    <Image src={member.image} alt={name || (locale === 'ar' ? 'عضو مجلس الإدارة' : 'Board member')} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover object-top" />
                  ) : <UserRound className="absolute bottom-4 start-1/2 h-[340px] w-2/3 -translate-x-1/2 text-[#C8CDD2]" strokeWidth={1} aria-hidden="true" />}
                </div>
                {name && <h3 className="text-sm text-[22px] font-semibold text-navy-900">{name}</h3>}
                {role && <p className="mt-1 text-[14px] leading-4 text-[#667080]">{role}</p>}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export const AboutNavigationLinks: React.FC = () => {
  const revealRef = useScrollReveal<HTMLElement>();
  const { locale, content } = useLanguage();
  const links = content.aboutPage.navigationLinks.filter((item) => localized(item.label, locale) && item.url);
  if (!links.length) return null;
  const direction = locale === 'ar' ? <ArrowUpLeft className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />;

  return (
    <nav ref={revealRef} data-scroll-reveal className="bg-ivory-50 pb-14 sm:pb-20" aria-label={locale === 'ar' ? 'روابط ذات صلة' : 'Related pages'} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="mx-auto grid max-w-[1046px] gap-4 px-5 sm:grid-cols-2 sm:px-8 lg:px-0">
        {links.map((item, index) => (
          <ContentLink key={`${item.url}-${index}`} href={localizedHref(item.url, locale)} className="group relative flex min-h-[116px] items-center justify-between gap-5 overflow-hidden rounded-xl border border-navy-900/15 bg-white px-6 py-5 text-navy-900 transition-colors hover:border-gold-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-500 sm:min-h-[130px] sm:px-8">
            {item.image && <Image src={item.image} alt="" fill sizes="180px" className="object-cover opacity-[0.04] transition-opacity group-hover:opacity-[0.1]" />}
            <span className="relative z-10">
              <span className="mb-2 block text-[10px] text-stone-500 sm:text-xs">{locale === 'ar' ? 'الاستمرار بالقراءة' : 'Continue reading'}</span>
              <span className="block text-xl font-semibold leading-7 text-navy-900 sm:text-xl my-2">{locale === 'ar' ? 'الذهاب إلى' : 'Go to'}</span>
              <span className="text-lg font-semibold leading-7 sm:text-2xl text-gold-600">{localized(item.label, locale)}</span>
            </span>
            <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors group-hover:border-gold-500 group-hover:bg-gold-500 group-hover:text-navy-900" aria-hidden="true">{direction}</span>
          </ContentLink>
        ))}
      </div>
    </nav>
  );
};
