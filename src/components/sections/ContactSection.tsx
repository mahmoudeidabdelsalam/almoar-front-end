'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, Globe2, Mail, MapPin, Phone } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { GravityForm } from '@/components/sections/GravityForm';
import type { ContactPageContent, GravityFormDefinition, SiteContent } from '@/types';

interface ContactSectionProps {
  pageContent: ContactPageContent | null;
  form: GravityFormDefinition | null;
}

function getWebsiteLink(content: SiteContent, configuredUrl: string): string {
  if (configuredUrl) return configuredUrl;
  for (const column of content.footer.columns) {
    const link = column.links.find((item) =>
      item.url.startsWith('https://') && /alomar/i.test(`${item.label.ar} ${item.label.en} ${item.url}`),
    );
    if (link) return link.url;
  }
  return '';
}

export function ContactSection({ pageContent, form }: ContactSectionProps) {
  const { locale, dir, t, content } = useLanguage();
  const prefix = `/${locale}`;
  const address = pageContent?.address[locale] || content.settings.contact[`address_${locale}`] || '';
  const phone = pageContent?.phone || content.settings.contact.phone;
  const email = pageContent?.email || content.settings.contact.email;
  const website = getWebsiteLink(content, pageContent?.website || '');
  const location = pageContent?.location[locale] || t.contact_section.hq_title;
  const mapUrl = pageContent?.mapUrl || (
    pageContent?.coordinates.lat && pageContent.coordinates.lng
      ? `https://maps.google.com/?q=${pageContent.coordinates.lat},${pageContent.coordinates.lng}`
      : ''
  );
  const title = pageContent?.title[locale] || t.nav.contact;
  const heading = pageContent?.heading[locale] || t.contact_section.contact_heading;
  const formTitle = pageContent?.formTitle[locale] || (locale === 'ar' ? 'أرسل لنا رسالة' : 'Send us a message');

  const cards = [
    { key: 'address', label: t.contact_section.address, value: address, href: mapUrl, icon: MapPin, external: Boolean(mapUrl) },
    { key: 'website', label: t.contact_section.website, value: website.replace(/^https?:\/\//, '').replace(/\/$/, ''), href: website, icon: Globe2, external: true },
    { key: 'email', label: t.contact_section.email, value: email, href: `mailto:${email}`, icon: Mail, external: false },
    { key: 'phone', label: t.contact_section.phone, value: phone, href: `tel:${phone.replace(/[^\d+]/g, '')}`, icon: Phone, external: false },
  ].filter((card) => card.value);

  return (
    <>
      <section className="relative overflow-hidden bg-[#10213D] text-white]">
        <div className="mx-auto flex min-h-[600px] max-w-[1440px] flex-col px-5 pb-20 pt-15 sm:px-8 lg:px-14">
          <nav aria-label={locale === 'ar' ? 'مسار التنقل' : 'Breadcrumb'} className="flex items-center gap-2 text-[12px] text-[#F8F7F2]">
            <Link href={prefix} className="hover:text-white">{t.nav.home}</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page" className="text-white/75">{title}</span>
          </nav>
          <div className="flex flex-1 items-end justify-start pb-12 pt-12">
            <h1 className="text-[84px] text-[#F8F7F2] font-normal tracking-tight sm:text-5xl lg:text-[56px]">{title}</h1>
          </div>
        </div>
        <svg width="420" height="50" viewBox="0 0 420 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="pointer-events-none absolute left-1/2 bottom-0 rotate-180 z-[1] h-[30px] w-[400px] -translate-x-1/2 -mb-[4px]">
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
      </section>

      <section id="contact" className="bg-[#F8F7F2] px-5 pb-14 pt-16 sm:px-8 lg:px-14 lg:pb-20 lg:pt-20">
        <div className="mx-auto max-w-[1280px]">
          <header className="mb-5 text-sm text-[#7D8490] sm:mb-8">
            <p className="mb-2 text-[10px] font-medium text-[#B28B35]">{pageContent?.badge[locale] || t.contact_section.badge}</p>
            <h2 className="text-[56px] font-normal leading-tight text-[#0F1F38]">{heading}</h2>
          </header>

          {cards.length > 0 && (
            <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              {cards.map(({ key, label, value, href, icon: Icon, external }) => {
                const contentNode = (
                  <>
                    <span className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-[#D8DCE2] text-[#12233F] group-hover:border-[#C3942E] group-hover:bg-[#BF9432] transition">
                      <Icon aria-hidden="true" size={16} strokeWidth={1.5} />
                    </span>
                    <span className="mt-2 text-[12px] text-[#8C8984]">{label}</span>
                    <span className="mt-1 max-w-full break-words text-end text-[22px] font-normal text-[#0F1F38]" dir={key === 'email' || key === 'phone' || key === 'website' ? 'ltr' : dir}>
                      {value}
                    </span>
                  </>
                );
                const className = 'group flex min-h-[98px] flex-col gap-[14px] items-start justify-center rounded-lg border border-[#D7DAE0] bg-white p-[14px] transition hover:border-[#C3942E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C3942E]';
                return href ? (
                  <a  key={key} href={href} className={`${className} min-h-[188px]`} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                    {contentNode}
                  </a>
                ) : <div key={key} className={`${className} min-h-[188px]`} >{contentNode}</div>;
              })}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-12 md:gap-5">
            <div className="md:col-span-8">
              {form ? (
                <GravityForm form={form} title={formTitle} submitLabel={locale === 'ar' ? 'إرسال الرسالة' : 'Send Message'} />
              ) : (
                <div className="rounded-lg border border-[#D6D9DE] bg-white p-6 text-sm leading-7 text-[#596273]" role="status">
                  {locale === 'ar'
                    ? 'نموذج التواصل غير متاح حاليًا. يرجى التواصل معنا مباشرة عبر البريد الإلكتروني أو الهاتف.'
                    : 'The contact form is currently unavailable. Please reach us directly by email or phone.'}
                </div>
              )}
            </div>
            <aside className="contact-map-pattern relative flex min-h-[260px] flex-col justify-between overflow-hidden rounded-xl bg-[#10213D] p-5 text-white md:col-span-4 md:min-h-[350px] md:p-6">
              <div className="relative z-10">
                <p className="text-[10px] font-medium text-[#C3942E]">{pageContent?.badge[locale] || t.contact_section.badge}</p>
                <h3 className="mt-2 text-xl font-medium">{location}</h3>
              </div>
              <div aria-hidden="true" className="absolute inset-0 opacity-30">
                <div className="absolute -left-8 top-8 h-64 w-64 rotate-45 border-[18px] border-[#344866]" />
                <div className="absolute -right-12 bottom-5 h-52 w-52 rotate-45 border-[16px] border-[#344866]" />
                <div className="absolute left-1/2 top-1/2 h-[140%] w-[18px] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[#344866]" />
              </div>
              {address && <p className="relative z-10 max-w-[85%] text-sm leading-6 text-white/85">{address}</p>}
              <div className="relative z-10 flex items-end justify-between gap-3">
                {mapUrl && <a href={mapUrl} target="_blank" rel="noopener noreferrer" aria-label={t.contact_section.map} className="flex h-11 w-11 items-center justify-center rounded-full bg-[#C3942E] text-[#10213D] transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                  <MapPin aria-hidden="true" size={18} />
                </a>}
                <span className="text-[10px] text-white/55">{locale === 'ar' ? 'المملكة العربية السعودية' : 'Kingdom of Saudi Arabia'}</span>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <nav aria-label={locale === 'ar' ? 'صفحات ذات صلة' : 'Related pages'} className="bg-[#F8F7F2] px-5 pb-14 pt-2 sm:px-8 lg:px-14">
        <div className="mx-auto grid max-w-[1280px] gap-3 sm:grid-cols-2">
          <Link href={`${prefix}/invest-with-us`} className="flex min-h-[78px] items-center justify-between rounded-lg border border-[#D7DAE0] bg-white px-5 py-4 text-sm transition hover:border-[#C3942E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C3942E]">
            <ArrowLeft aria-hidden="true" size={17} className={dir === 'rtl' ? 'rotate-180' : ''} />
            <span className="text-end"><span className="block text-[9px] text-[#818896]">{locale === 'ar' ? 'الاستثمار والشراكات' : 'Investment & Partnerships'}</span><span className="mt-1 block font-medium text-[#12233F]">{locale === 'ar' ? 'الذهاب إلى استثماراتنا' : 'Invest with us'}</span></span>
          </Link>
          <Link href={`${prefix}/about`} className="flex min-h-[78px] items-center justify-between rounded-lg border border-[#C3942E] bg-white px-5 py-4 text-sm transition hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C3942E]">
            <span className="text-end"><span className="block text-[9px] text-[#818896]">{locale === 'ar' ? 'اكتشف مسيرتنا' : 'Discover our story'}</span><span className="mt-1 block font-medium text-[#12233F]">{t.nav.about}</span></span>
            <ArrowRight aria-hidden="true" size={17} className={dir === 'rtl' ? 'rotate-180' : ''} />
          </Link>
        </div>
      </nav>
    </>
  );
}
