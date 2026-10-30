'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Globe2, Mail, Phone } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { GravityForm } from '@/components/sections/GravityForm';
import type { ContactPageContent, GravityFormDefinition, InvestWithUsPageContent } from '@/types';

interface InvestWithUsSectionProps {
  form: GravityFormDefinition | null;
  pageContent: InvestWithUsPageContent | null;
  contactContent: ContactPageContent | null;
}

function localized(value: { ar: string; en: string } | undefined, locale: 'ar' | 'en'): string {
  return locale === 'en' ? value?.en || value?.ar || '' : value?.ar || value?.en || '';
}

export function InvestWithUsSection({ form, pageContent, contactContent }: InvestWithUsSectionProps) {
  const { locale, dir, content, t } = useLanguage();
  const prefix = `/${locale}`;
  const phone = contactContent?.phone || content.settings.contact.phone;
  const email = contactContent?.email || content.settings.contact.email;
  const website = contactContent?.website || '';

  const heroTitle = localized(pageContent?.heroTitle, locale) || (locale === 'ar' ? 'استثمر معنا' : 'Invest with Us');
  const heroBadge = localized(pageContent?.heroBadge, locale);
  const heroDescription = localized(pageContent?.heroDescription, locale);
  const opportunityHeading = localized(pageContent?.opportunityHeading, locale);
  const opportunityDescription = localized(pageContent?.opportunityDescription, locale);
  const processHeading = localized(pageContent?.processHeading, locale);
  const steps = (pageContent?.processItems || []).filter((step) =>
    localized(step.title, locale) || localized(step.description, locale),
  );
  const contactHeading = localized(pageContent?.contactHeading, locale);
  const contactDescription = localized(pageContent?.contactDescription, locale);
  const formTitle = localized(pageContent?.formTitle, locale);
  const formSubmitLabel = localized(pageContent?.formSubmitLabel, locale);

  const contactItems = [
    { href: phone ? `tel:${phone.replace(/[^\d+]/g, '')}` : '', value: phone, icon: Phone, label: t.contact_section.phone, ltr: true },
    { href: email ? `mailto:${email}` : '', value: email, icon: Mail, label: t.contact_section.email, ltr: true },
    { href: website, value: website.replace(/^https?:\/\//, '').replace(/\/$/, ''), icon: Globe2, label: t.contact_section.website, ltr: true },
  ].filter((item) => item.value);
  const hasOpportunityContent = Boolean(opportunityHeading || opportunityDescription || processHeading || steps.length);
  const hasInquiryContent = true;

  return (
    <div className="invest-with-us">
      <section className="relative overflow-hidden bg-[#10213D] text-white">
        {pageContent?.heroImage && (
          <>
            <Image src={pageContent.heroImage} alt="" fill priority sizes="100vw" className="object-cover opacity-25" />
            <div aria-hidden="true" className="absolute inset-0 bg-[#10213D]/70" />
          </>
        )}
        <div className="relative mx-auto flex min-h-[600px] max-w-[1440px] flex-col px-5 pb-20 pt-15 sm:px-8 lg:px-14">
          <nav aria-label={locale === 'ar' ? 'مسار التنقل' : 'Breadcrumb'} className="flex items-center gap-2 text-[12px] text-[#F8F7F2]">
            <Link href={prefix} className="hover:text-white">{t.nav.home}</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page" className="text-white/75">{heroTitle}</span>
          </nav>
          <div className="flex flex-1 items-end justify-start pb-12 pt-12">
            <div className="max-w-3xl">
              {heroBadge && <p className="mb-2 text-[12px] font-medium text-[#D4AF37]">{heroBadge}</p>}
              <h1 className="text-[56px] font-normal tracking-tight text-[#F8F7F2] sm:text-6xl lg:text-[84px]">{heroTitle}</h1>
              {heroDescription && <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">{heroDescription}</p>}
            </div>
          </div>
        </div>
        <svg width="420" height="50" viewBox="0 0 420 50" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="pointer-events-none absolute bottom-0 left-1/2 z-[1] mb-[-4px] h-[30px] w-[400px] -translate-x-1/2 rotate-180">
          <g filter="url(#invest-notch-shadow)">
            <path d="M10 4C100 4 120 34 210 34C300 34 320 4 410 4H10Z" fill="#F8F7F2" />
          </g>
          <defs>
            <filter id="invest-notch-shadow" x="0" y="0" width="420" height="50" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dy="6" />
              <feGaussianBlur stdDeviation="5" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.06 0 0 0 0 0.12 0 0 0 0 0.22 0 0 0 0.08 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
            </filter>
          </defs>
        </svg>
      </section>

      {hasOpportunityContent && (
        <section className="bg-[#F8F7F2] px-5 pb-14 pt-16 sm:px-8 lg:px-14 lg:pb-20 lg:pt-20">
          <div className="mx-auto max-w-[1280px] flex flex-row gap-10 sm:gap-12 lg:gap-14">
            {(opportunityHeading || opportunityDescription) && (
              <header className="mb-8 text-sm text-[#7D8490] sm:mb-10">
                <p className="mb-2 text-[12px] font-normal text-[#A07A22]">{processHeading}</p>
                {opportunityHeading && <h2 className="text-[36px] font-normal leading-tight text-[#0F1F38] sm:text-[56px]">{opportunityHeading}</h2>}
                {opportunityDescription && <p className="mt-4 max-w-4xl text-sm leading-7 text-[#586274] sm:text-base">{opportunityDescription}</p>}
              </header>
            )}

            {steps.length > 0 && (
              <ol className="flex flex-1 flex-col gap-4 sm:gap-5 lg:gap-6 min-w-[540px] rounded-lg border border-[#D7DAE0] bg-white p-5 transition hover:border-[#C3942E]">
                {steps.map((step, index) => (
                  <li key={`${step.title.ar}-${index}`} className="flex flex-row items-start gap-6 sm:p-6">
                    <span className="flex h-[52px] w-[52px] items-center justify-center rounded-full text-sm bg-[#F7F0DE] font-medium text-[#A07A22]">{String(index + 1).padStart(2, '0')}</span>
                    <div>
                      {localized(step.title, locale) && <h3 className="text-lg font-medium text-[#0F1F38]">{localized(step.title, locale)}</h3>}
                      {localized(step.description, locale) && <p className="mt-2 text-sm leading-6 text-[#707784]">{localized(step.description, locale)}</p>}
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </section>
      )}

      {hasInquiryContent && (
        <section className="bg-[#F8F7F2] px-5 pb-14 pt-4 sm:px-8 lg:px-14 lg:pb-20">
          <div className="mx-auto max-w-[1280px]">
            <header className="mb-5 text-sm text-[#7D8490] sm:mb-8">
              {contactHeading && <h2 className="text-[36px] font-normal leading-tight text-[#0F1F38] sm:text-[56px]">{contactHeading}</h2>}
              {contactDescription && <p className="mt-3 max-w-3xl text-sm leading-7 text-[#586274] sm:text-base">{contactDescription}</p>}
            </header>

            <div className="grid gap-4 md:grid-cols-12 md:gap-5">
              <div className="md:col-span-8">
                {form ? (
                  <GravityForm form={form} title={formTitle} submitLabel={formSubmitLabel} />
                ) : (
                  <div className="rounded-lg border border-[#D6D9DE] bg-white p-6 text-sm leading-7 text-[#596273]" role="status">
                    {locale === 'ar' ? 'نموذج الاستثمار غير متاح حاليًا. يرجى التواصل معنا مباشرة.' : 'The investment form is currently unavailable. Please contact us directly.'}
                  </div>
                )}
              </div>

              <aside className="contact-map-pattern relative flex min-h-[260px] flex-col justify-between overflow-hidden rounded-xl bg-[#10213D] p-5 text-white md:col-span-4 md:min-h-[350px] md:p-6">
                <div className="relative z-10">
                  <p className="text-[10px] font-medium text-[#C3942E]">{contactContent?.badge[locale] || t.contact_section.badge}</p>
                  <h3 className="mt-2 text-xl font-medium">{contactHeading || (locale === 'ar' ? 'تواصل معنا' : 'Get in touch')}</h3>
                  {contactDescription && <p className="mt-3 text-sm leading-6 text-white/80">{contactDescription}</p>}
                </div>
                <div aria-hidden="true" className="absolute inset-0 opacity-30">
                  <div className="absolute -left-8 top-8 h-64 w-64 rotate-45 border-[18px] border-[#344866]" />
                  <div className="absolute -right-12 bottom-5 h-52 w-52 rotate-45 border-[16px] border-[#344866]" />
                  <div className="absolute left-1/2 top-1/2 h-[140%] w-[18px] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[#344866]" />
                </div>
                {contactItems.length > 0 && (
                  <ul className="relative z-10 mt-8 space-y-3">
                    {contactItems.map(({ href, value, icon: Icon, label, ltr }) => (
                      <li key={label}>
                        <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined} aria-label={`${label}: ${value}`} className="flex items-center justify-between gap-3 text-sm text-white/90 transition hover:text-[#E2B84A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#C3942E] text-[#10213D]"><Icon aria-hidden="true" size={15} /></span>
                          <span className="min-w-0 flex-1 break-all text-end" dir={ltr ? 'ltr' : dir}>{value}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
                <Link href={`${prefix}/contact-us`} className="relative z-10 mt-6 inline-flex items-center gap-2 self-start text-sm text-white transition hover:text-[#E2B84A]">
                  <span>{t.nav.contact}</span>
                  {dir === 'rtl' ? <ArrowLeft aria-hidden="true" size={16} /> : <ArrowRight aria-hidden="true" size={16} />}
                </Link>
              </aside>
            </div>
          </div>
        </section>
      )}

      <nav aria-label={locale === 'ar' ? 'صفحات ذات صلة' : 'Related pages'} className="bg-[#F8F7F2] px-5 py-12 sm:px-8 lg:px-14">
        <div className="mx-auto grid max-w-[1280px] gap-3 sm:grid-cols-2">
          <Link href={`${prefix}/about`} className="flex min-h-[78px] items-center justify-between rounded-lg border border-[#D7DAE0] bg-white px-5 py-4 text-sm transition hover:border-[#C3942E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C3942E]">
            {dir === 'rtl' ? <ArrowRight aria-hidden="true" size={17} /> : <ArrowLeft aria-hidden="true" size={17} />}
            <span className="text-end"><span className="block text-[9px] text-[#818896]">{locale === 'ar' ? 'اكتشف مسيرتنا' : 'Discover our story'}</span><span className="mt-1 block font-medium text-[#12233F]">{t.nav.about}</span></span>
          </Link>
          <Link href={`${prefix}/contact-us`} className="flex min-h-[78px] items-center justify-between rounded-lg border border-[#C3942E] bg-white px-5 py-4 text-sm transition hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C3942E]">
            <span className="text-end"><span className="block text-[9px] text-[#818896]">{locale === 'ar' ? 'تواصل معنا' : 'Get in touch'}</span><span className="mt-1 block font-medium text-[#12233F]">{t.nav.contact}</span></span>
            {dir === 'rtl' ? <ArrowLeft aria-hidden="true" size={17} /> : <ArrowRight aria-hidden="true" size={17} />}
          </Link>
        </div>
      </nav>
    </div>
  );
}
