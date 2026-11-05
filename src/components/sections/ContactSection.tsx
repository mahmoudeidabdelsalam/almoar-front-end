'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, Globe2, Mail, MapPin, Phone } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { GravityForm } from '@/components/sections/GravityForm';
import { Notch } from '@/components/ui/Notch';
import { RelatedPages } from '@/components/ui/RelatedPages';
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
          <nav aria-label={locale === 'ar' ? 'مسار التنقل' : 'Breadcrumb'} className="flex items-center gap-2 text-[12px] text-ivory-50">
            <Link href={prefix} className="hover:text-white">{t.nav.home}</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page" className="text-white/75">{title}</span>
          </nav>
          <div className="flex flex-1 items-end justify-start pb-12 pt-12">
            <h1 className="text-[84px] text-ivory-50 font-normal tracking-tight sm:text-5xl lg:text-[56px]">{title}</h1>
          </div>
        </div>
        <Notch fill="white" className="absolute start-1/2 bottom-0 z-[1] mb-[-4px] h-[30px] w-[400px] -translate-x-1/2 rtl:translate-x-1/2 rotate-180" />
      </section>

      <section id="contact" className="bg-ivory-50 px-5 pb-14 pt-16 sm:px-8 lg:px-14 lg:pb-20 lg:pt-20">
        <div className="mx-auto max-w-[1280px]">
          <header className="mb-5 text-sm text-[#7D8490] sm:mb-8">
            <p className="mb-2 text-[10px] font-medium text-[#B28B35]">{pageContent?.badge[locale] || t.contact_section.badge}</p>
            <h2 className="text-[56px] font-normal leading-tight text-navy-900">{heading}</h2>
          </header>

          {cards.length > 0 && (
            <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              {cards.map(({ key, label, value, href, icon: Icon, external }) => {
                const contentNode = (
                  <>
                    <span className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-[#D8DCE2] text-navy-800 group-hover:border-gold-500 group-hover:bg-gold-500 transition">
                      <Icon aria-hidden="true" size={16} strokeWidth={1.5} />
                    </span>
                    <span className="mt-2 text-[12px] text-[#8C8984]">{label}</span>
                    <span className="mt-1 max-w-full break-words text-end text-[22px] font-normal text-navy-900" dir={key === 'email' || key === 'phone' || key === 'website' ? 'ltr' : dir}>
                      {value}
                    </span>
                  </>
                );
                const className = 'group flex min-h-[98px] flex-col gap-[14px] items-start justify-center rounded-lg border border-[#D7DAE0] bg-white p-[14px] transition hover:border-gold-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500';
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
            <aside dir={dir} className="contact-map-pattern relative flex aspect-[2/3] min-h-[480px] flex-col overflow-hidden rounded-2xl bg-[#10213D] p-8 text-white md:col-span-4 md:min-h-[590px]">
              <div className="relative z-10d">
                <p className="text-[10px] font-medium text-gold-500">{locale === 'ar' ? 'موقعنا' : 'Our location'}</p>
                <h3 className="mt-3 text-[28px] font-normal leading-tight sm:text-[32px]">{location}</h3>
              </div>
              {mapUrl ? (
                <a href={mapUrl} target="_blank" rel="noopener noreferrer" aria-label={t.contact_section.map} className="absolute start-[18%] top-[40%] z-10 flex h-24 w-24 items-center justify-center rounded-full bg-[#C99B2E] text-[#10213D] transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                  <MapPin aria-hidden="true" size={18} />
                </a>
              ) : (
                <span aria-hidden="true" className="absolute start-[18%] top-[40%] z-10 flex h-24 w-24 items-center justify-center rounded-full bg-[#C99B2E] text-[#10213D]">
                  <MapPin size={18} />
                </span>
              )}
              <div className="relative z-10 mt-auto rounded-2xl bg-[#F8F7F2] px-5 py-5 text-navy-900 sm:px-7">
                <p className="text-[18px] leading-7 sm:text-[21px]">{address || (locale === 'ar' ? 'المملكة العربية السعودية' : 'Kingdom of Saudi Arabia')}</p>
                {mapUrl && (
                  <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-2 text-[12px] text-[#A77C22] transition hover:text-[#806017] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500">
                    {dir === 'rtl' ? <ArrowLeft aria-hidden="true" size={15} /> : <ArrowRight aria-hidden="true" size={15} />}
                    <span>{locale === 'ar' ? 'عرض على الخريطة' : 'View on map'}</span>
                  </a>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <RelatedPages
        locale={locale}
        links={[
          { href: `${prefix}/invest-with-us`, label: locale === 'ar' ? 'استثمر معنا' : 'Invest with us' },
          { href: `${prefix}/about`, label: t.nav.about },
        ]}
        className="bg-ivory-50 px-5 pb-14 pt-2 sm:px-8 lg:px-14"
        gridClassName="mx-auto grid max-w-[1280px] gap-3 sm:grid-cols-2"
      />
    </>
  );
}
