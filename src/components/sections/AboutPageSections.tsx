'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowDownLeft, ArrowLeft, ArrowRight, ArrowUpLeft, ChevronDown, UserRound } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import type { LocalizedString } from '@/types';

const overviewImageFallbacks = [
  '/images/project_dama_lazurd.jpg',
  '/images/project_commercial.jpg',
];

const portfolioCardColors = [
  'bg-gold-500 text-navy-900',
  'bg-[#19392F] text-white',
  'bg-[#17294A] text-white',
  'bg-[#10203B] text-white',
  'bg-[#E8DFCF] text-navy-900',
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
  const title = localized(banner?.title || { ar: '', en: '' }, locale) || (locale === 'ar' ? 'نبذة عن العمر القابضة' : 'About Alomar Holding');
  const breadcrumbHome = locale === 'ar' ? 'الرئيسية' : 'Home';
  const breadcrumbAbout = locale === 'ar' ? 'من نحن' : 'About Us';

  return (
    <section className="pattern relative min-h-[390px] overflow-hidden bg-navy-900 pt-[118px] text-white sm:min-h-[450px] lg:min-h-[520px] lg:pt-[150px]" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="mx-auto flex min-h-[250px] max-w-[1216px] flex-col justify-between px-5 pb-16 sm:px-8 lg:min-h-[300px] lg:px-0 lg:pb-20">
        <nav className="text-xs text-white/55" aria-label={locale === 'ar' ? 'مسار التنقل' : 'Breadcrumb'}>
          <Link href={`/${locale}`} className="transition-colors hover:text-gold-200">{breadcrumbHome}</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span className="text-white/80">{breadcrumbAbout}</span>
        </nav>
        <h1 className="max-w-[620px] self-start text-start text-4xl font-semibold leading-[1.25] tracking-tight sm:text-5xl lg:text-6xl">
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
  const { locale, content } = useLanguage();
  const about = content.aboutPage;
  const summary = content.homeAbout;
  const title = localized(about.overview.heading, locale) || (locale === 'ar' ? 'استثمار برؤية واضحة' : 'Investing with a Clear Vision');
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
    <section data-scroll-reveal className="bg-ivory-50 py-14 sm:py-20 lg:py-24" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-8 px-5 sm:px-8 md:flex-row md:items-center lg:px-0">
        <div className="order-2 w-full min-w-0 md:order-1 md:flex-1" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
          {firstDescription && <p className="mt-6 text-navy-900 text-[64px]">{firstDescription}</p>}
          <div className="relative aspect-square w-full max-w-[470px] overflow-hidden rounded-xl md:mt-20">
            <Image src={firstImage} alt={firstAlt} fill priority  className="object-cover" />
          </div>
        </div>
        <div className="order-1 w-full min-w-0 md:order-2 md:flex-1" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
          <div className="relative aspect-square w-full max-w-[470px] overflow-hidden rounded-xl md:ml-auto">
            <Image src={secondImage} alt={secondAlt} fill sizes={overviewImageSizes} className="object-cover" />
          </div>
          {secondDescription && <p className="mt-6 max-w-[360px] text-[18px] leading-7 text-slate-700">{secondDescription}</p>}
        </div>
      </div>
    </section>
  );
};

export const AboutStatistics: React.FC = () => {
  const { locale, content } = useLanguage();
  const statistics = content.aboutPage.statistics;
  if (!statistics.length) return null;

  return (
    <section data-scroll-reveal className="mt-5" aria-label={locale === 'ar' ? 'إحصائيات العمر القابضة' : 'Alomar Holding statistics'}>
      <dl className="mx-auto grid max-w-full grid-cols-2 divide-x divide-navy-900/10 rtl:divide-x-reverse sm:grid-cols-4 items-center lg:max-w-[1440px]">
        {statistics.map((statistic, index) => (
          <div key={`${statistic.value}-${index}`} data-reveal-item className="group px-4 py-6 border-b-1 lg:border-b-0 lg:min-h-[240px] flex flex-col justify-center border-r border-r-navy-900/10 border-t-[3px] border-t-transparent hover:border-t-gold-500 hover:bg-navy-900 hover:text-gold-500 sm:px-6 sm:py-8">
            <dt className="text-xs text-[#8A8E93] group-hover:text-[#fff] sm:text-sm">{localized(statistic.label, locale)}</dt>
            <dd className="mt-5 text-[44px] lg:text-[72px] font-medium tabular-nums text-navy-900 group-hover:text-gold-500 sm:text-4xl lg:text-[46px]">{statistic.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

export const AboutStrategy: React.FC = () => {
  const { locale, content } = useLanguage();
  const about = content.aboutPage;
  const strategy = about.strategy;
  const title = localized(strategy.title, locale) || (locale === 'ar' ? 'نهج يرتكز على الوضوح' : 'A Clear and Focused Approach');
  const description = localized(strategy.description, locale) || localized(about.visionDescription, locale);
  const focusTitle = localized(strategy.focusTitle, locale) || localized(about.missionTitle, locale);
  const focusDescription = localized(strategy.focusDescription, locale) || localized(about.missionDescription, locale);
  const principles = strategy.principles.length ? strategy.principles : about.values;
  if (!title && !description && !focusTitle && !principles.length) return null;

  const buttonLabel = localized(strategy.ctaLabel, locale);
  const buttonHref = localizedHref(strategy.ctaUrl, locale);
  const ArrowIcon = locale === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <section data-scroll-reveal className="pattern bg-navy-900 py-16 text-white sm:py-20 lg:py-24" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-w-[1216px] px-5 sm:px-8 lg:px-0">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-3xl">
            {localized(strategy.eyebrow, locale) && <p className="mb-3 text-xs font-medium text-gold-200">{localized(strategy.eyebrow, locale)}</p>}
            <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">{title}</h2>
            {description && <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65">{description}</p>}
          </div>
          {buttonLabel && buttonHref && (
            <ContentLink href={buttonHref} className="btn btn--gold shrink-0">
              <span>{buttonLabel}</span><ArrowIcon aria-hidden="true" />
            </ContentLink>
          )}
        </div>

        {(focusTitle || focusDescription || principles.length > 0) && (
          <div className="mt-14 grid gap-8 pt-8 md:grid-cols-3 md:items-end lg:mt-20">
            {(focusTitle || focusDescription) && (
              <article className="rounded-xl border border-white/10 p-6 md:col-span-1">
                {focusTitle && <h3 className="mt-4 text-[22px] font-semibold">{focusTitle}</h3>}
                {focusDescription && <p className="mt-30 text-xs leading-6 text-white/60">{focusDescription}</p>}
              </article>
            )}
            {principles.length > 0 && (
              <div className="grid gap-6 md:col-span-2 md:grid-cols-2">
                {principles.map((principle, index) => {
                  const label = localized(principle.title, locale);
                  const detail = localized(principle.description, locale);
                  if (!label && !detail) return null;
                  return (
                    <div key={`${label}-${index}`} className="border-b border-white/15 pb-4 text-[22px] font-medium text-white/80 md:pb-6">
                      {label}
                      {detail && <p className="mt-12 text-xs font-normal leading-6 text-white/55">{detail}</p>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export const AboutPortfolio: React.FC = () => {
  const { locale, content } = useLanguage();
  const portfolio = content.aboutPage.portfolio;
  const items = portfolio.items.filter((item) => localized(item.title, locale) || localized(item.description, locale) || item.metric);
  const [openIndex, setOpenIndex] = useState(0);
  if (!items.length && !localized(portfolio.title, locale)) return null;
  const buttonLabel = localized(portfolio.ctaLabel, locale);
  const buttonHref = localizedHref(portfolio.ctaUrl, locale);
  const ArrowIcon = locale === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <section data-scroll-reveal className="bg-ivory-50 py-16 sm:py-20 lg:py-24" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-w-[1216px] px-5 sm:px-8 lg:px-0">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            {localized(portfolio.eyebrow, locale) && <p className="mb-3 text-xs text-gold-500">{localized(portfolio.eyebrow, locale)}</p>}
            {localized(portfolio.title, locale) && <h2 className="max-w-xl text-3xl font-semibold leading-tight text-navy-900 sm:text-4xl">{localized(portfolio.title, locale)}</h2>}
          </div>
          {buttonLabel && buttonHref && <ContentLink href={buttonHref} className="btn btn--navy"><span>{buttonLabel}</span><ArrowIcon aria-hidden="true" /></ContentLink>}
        </div>

        {items.length > 0 && (
          <div className="mt-10 grid gap-10 md:grid-cols-[1fr_1.2fr] md:items-center lg:mt-14">
            <div className="space-y-1">
              {items.map((item, index) => {
                const title = localized(item.title, locale);
                const description = localized(item.description, locale);
                const isOpen = openIndex === index;
                return (
                  <div key={`${title}-${index}`} data-reveal-item className="border-b border-navy-900/10">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`about-portfolio-item-${index}`}
                      onClick={() => setOpenIndex(isOpen ? -1 : index)}
                      className="flex w-full items-center justify-between gap-4 py-4 text-start text-sm font-medium text-navy-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-500"
                    >
                      <span>{title}</span>
                      <ChevronDown className={`h-4 w-4 shrink-0 text-gold-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                    </button>
                    {isOpen && description && <p id={`about-portfolio-item-${index}`} className="pb-4 text-xs leading-6 text-[#687181]">{description}</p>}
                  </div>
                );
              })}
            </div>
            <div className="flex min-h-[170px] items-end justify-center gap-2 sm:gap-3">
              {items.map((item, index) => (
                <button
                  type="button"
                  key={`${item.metric}-${index}`}
                  onClick={() => setOpenIndex(index)}
                  aria-label={localized(item.title, locale) || (locale === 'ar' ? `مجال استثماري ${index + 1}` : `Investment area ${index + 1}`)}
                  aria-pressed={openIndex === index}
                  className={`flex min-h-20 min-w-0 flex-1 flex-col justify-between rounded-lg p-2 text-start transition-transform hover:-translate-y-1 sm:min-h-28 sm:p-4 ${portfolioCardColors[index % portfolioCardColors.length]} ${openIndex === index ? 'ring-1 ring-gold-500' : ''}`}
                >
                  <span className="text-lg font-medium tabular-nums sm:text-2xl">{item.metric || String(index + 1).padStart(2, '0')}</span>
                  <span className="line-clamp-2 text-[9px] leading-4 sm:text-[11px]">{localized(item.title, locale)}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export const AboutCompanies: React.FC = () => {
  const { locale, content } = useLanguage();
  const companies = content.aboutPage.companies;
  const items = companies.items.filter((item) => item.name.ar || item.name.en || item.logo || item.image);
  if (!items.length) return null;

  return (
    <section
      data-scroll-reveal
      className="pattern relative overflow-hidden bg-[#1B382D] py-16 text-white sm:py-20 lg:py-24"
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="relative z-10 mx-auto max-w-[1216px] px-5 sm:px-8 lg:px-0">
        <div className="mb-10 flex flex-col gap-3 md:mb-14 md:items-end">
          {localized(companies.eyebrow, locale) && <p className="text-xs text-gold-200">{localized(companies.eyebrow, locale)}</p>}
          {localized(companies.title, locale) && <h2 className="max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl">{localized(companies.title, locale)}</h2>}
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((company, index) => {
            const name = localized(company.name, locale);
            const card = (
              <article data-reveal-item className={`group relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-xl p-5 transition-transform hover:-translate-y-1 sm:min-h-[290px] ${company.image ? 'bg-white text-navy-900 lg:col-span-1' : 'border border-white/10 bg-[#10203B]/90 text-white'}`}>
                {company.image && <Image src={company.image} alt="" fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />}
                {company.image && <div className="absolute inset-0 bg-gradient-to-t from-navy-900/85 via-navy-900/10 to-transparent" />}
                <div className="relative z-10 flex h-full flex-col justify-between gap-5">
                  {company.logo && <Image src={company.logo} alt={name ? `${name} logo` : ''} width={150} height={72} className="max-h-14 w-auto max-w-[150px] object-contain object-start" />}
                  <div>
                    {name && <h3 className="text-base font-semibold">{name}</h3>}
                    {localized(company.description, locale) && <p className="mt-2 text-xs leading-5 opacity-75">{localized(company.description, locale)}</p>}
                  </div>
                </div>
              </article>
            );
            return company.link ? (
              <ContentLink key={`${name}-${index}`} href={localizedHref(company.link, locale)} className="block rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-200">{card}</ContentLink>
            ) : <div key={`${name}-${index}`}>{card}</div>;
          })}
        </div>
      </div>
    </section>
  );
};

export const AboutResponsibility: React.FC = () => {
  const { locale, content } = useLanguage();
  const responsibility = content.aboutPage.responsibility;
  const items = responsibility.items.filter((item) => localized(item.title, locale) || localized(item.description, locale) || item.image);
  const [activeIndex, setActiveIndex] = useState(0);
  if (!items.length) return null;
  const current = items[activeIndex % items.length];

  return (
    <section data-scroll-reveal className="bg-ivory-50 py-16 sm:py-20 lg:py-24" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-w-[1216px] px-5 sm:px-8 lg:px-0">
        <div className="mb-8 flex items-center justify-between gap-6">
          <div>
            {localized(responsibility.eyebrow, locale) && <p className="mb-3 text-xs text-gold-500">{localized(responsibility.eyebrow, locale)}</p>}
            {localized(responsibility.title, locale) && <h2 className="text-2xl font-semibold text-navy-900 sm:text-3xl">{localized(responsibility.title, locale)}</h2>}
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
        <div className={`grid items-center gap-8 lg:gap-14 ${current.image ? 'md:grid-cols-2' : ''}`}>
          {current.image && (
            <div className="relative aspect-[1.45] overflow-hidden rounded-xl">
              <Image src={current.image} alt={localized(current.title, locale)} fill sizes="(max-width: 768px) 100vw, 45vw" className="object-cover" />
            </div>
          )}
          <div>
            {localized(current.title, locale) && <h3 className="text-2xl font-semibold text-navy-900">{localized(current.title, locale)}</h3>}
            {localized(current.description, locale) && <p className="mt-4 text-sm leading-7 text-[#667080]">{localized(current.description, locale)}</p>}
          </div>
        </div>
      </div>
    </section>
  );
};

export const AboutBoard: React.FC = () => {
  const { locale, content } = useLanguage();
  const board = content.aboutPage.board;
  const members = board.members.filter((member) => localized(member.name, locale) || localized(member.role, locale) || member.image);
  if (!members.length) return null;

  return (
    <section data-scroll-reveal className="bg-ivory-50 py-14 sm:py-20 lg:py-24" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-w-[1216px] px-5 sm:px-8 lg:px-0">
        <div className="mb-10 text-center">
          {localized(board.eyebrow, locale) && <p className="mb-3 text-xs text-gold-500">{localized(board.eyebrow, locale)}</p>}
          {localized(board.title, locale) && <h2 className="text-3xl font-semibold text-navy-900 sm:text-4xl">{localized(board.title, locale)}</h2>}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {members.map((member, index) => {
            const name = localized(member.name, locale);
            const role = localized(member.role, locale);
            return (
              <article key={`${name}-${index}`} data-reveal-item className="text-center">
                <div className="relative mb-4 aspect-[.9] overflow-hidden rounded-t-2xl bg-[#EFEEE9]">
                  {member.image ? (
                    <Image src={member.image} alt={name || (locale === 'ar' ? 'عضو مجلس الإدارة' : 'Board member')} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover object-top" />
                  ) : <UserRound className="absolute bottom-4 left-1/2 h-2/3 w-2/3 -translate-x-1/2 text-[#C8CDD2]" strokeWidth={1} aria-hidden="true" />}
                </div>
                {name && <h3 className="text-sm font-semibold text-navy-900">{name}</h3>}
                {role && <p className="mt-1 text-[10px] leading-4 text-[#667080]">{role}</p>}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export const AboutNavigationLinks: React.FC = () => {
  const { locale, content } = useLanguage();
  const links = content.aboutPage.navigationLinks.filter((item) => localized(item.label, locale) && item.url);
  if (!links.length) return null;
  const direction = locale === 'ar' ? <ArrowUpLeft className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />;

  return (
    <nav className="bg-ivory-50 pb-14 sm:pb-20" aria-label={locale === 'ar' ? 'روابط ذات صلة' : 'Related pages'} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="mx-auto grid max-w-[1216px] gap-3 px-5 sm:grid-cols-2 sm:px-8 lg:px-0">
        {links.map((item, index) => (
          <ContentLink key={`${item.url}-${index}`} href={localizedHref(item.url, locale)} className="group relative flex min-h-[88px] items-center justify-between overflow-hidden rounded-xl border border-navy-900/15 bg-white p-5 text-navy-900 transition-colors hover:border-gold-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-500">
            {item.image && <Image src={item.image} alt="" fill sizes="180px" className="object-cover opacity-20" />}
            <span className="relative z-10 text-sm font-semibold">{localized(item.label, locale)}</span>
            <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-navy-900 text-white transition-colors group-hover:bg-gold-500 group-hover:text-navy-900" aria-hidden="true">{direction}</span>
          </ContentLink>
        ))}
      </div>
    </nav>
  );
};
