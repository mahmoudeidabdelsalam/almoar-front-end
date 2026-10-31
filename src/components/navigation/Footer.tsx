'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUp, Mail, Phone } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import type { FooterColumn } from '@/types';
import { sameOriginImage } from '@/lib/media';

interface FooterSocialLinkProps {
  platform: string;
  url: string;
  locale: 'ar' | 'en';
}

function getSocialPresentation(platform: string): { glyph: string; label: string } | null {
  const normalizedPlatform = platform.trim().toLowerCase();
  if (normalizedPlatform === 'linkedin') return { glyph: 'in', label: 'LinkedIn' };
  if (normalizedPlatform === 'twitter' || normalizedPlatform === 'x') return { glyph: 'X', label: 'X' };
  if (normalizedPlatform === 'instagram') return { glyph: '◎', label: 'Instagram' };
  return null;
}

function getSafeSocialUrl(url: string): string | null {
  try {
    const parsedUrl = new URL(url);
    if (!['http:', 'https:'].includes(parsedUrl.protocol) || !parsedUrl.hostname) return null;
    return parsedUrl.href;
  } catch {
    return null;
  }
}

function FooterSocialLink({ platform, url, locale }: FooterSocialLinkProps) {
  const presentation = getSocialPresentation(platform);
  const safeUrl = getSafeSocialUrl(url);
  if (!presentation || !safeUrl) return null;

  return (
    <a
      href={safeUrl}
      target="_blank"
      rel="noopener noreferrer"
      dir="ltr"
      aria-label={locale === 'ar' ? `تابعنا على ${presentation.label}` : `Follow us on ${presentation.label}`}
      title={presentation.label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#2A3B4D]/20 text-[#2A3B4D] bg-[#F2F0EB] transition-colors hover:border-[#101E39] hover:bg-[#101E39] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B7913D]"
    >
      <span className="text-xs font-bold" aria-hidden="true">{presentation.glyph}</span>
    </a>
  );
}

export const Footer: React.FC = () => {
  const { locale, dir, footer } = useLanguage();

  const fallbackColumns: FooterColumn[] = [
    {
      title: { ar: 'روابط سريعة', en: 'Quick Links' },
      links: [
        { label: { ar: 'من نحن', en: 'About Us' }, url: '/about' },
        { label: { ar: 'مشاريعنا', en: 'Our Projects' }, url: '/projects' },
        { label: { ar: 'الأخبار', en: 'News' }, url: '/news' },
        { label: { ar: 'استثمر معنا', en: 'Invest With Us' }, url: '/invest-with-us' },
        { label: { ar: 'تواصل معنا', en: 'Contact Us' }, url: '/contact-us' },
      ],
    },
  ];
  const unavailableRoutes = new Set(['companies', 'media-center', 'sectors']);
  const columns = (footer?.columns?.length ? footer.columns : fallbackColumns)
    .map((column) => ({
      ...column,
      links: column.links.filter((link) => {
        const path = link.url.replace(/^https?:\/\/[^/]+/i, '').split(/[?#]/, 1)[0];
        const segments = path.split('/').filter(Boolean);
        const route = segments[0] === 'ar' || segments[0] === 'en' ? segments[1] : segments[0];
        return !route || !unavailableRoutes.has(route);
      }),
    }))
    .filter((column) => column.links.length > 0);

  const socialLinks = (footer?.socialLinks ?? []).filter(
    (social) => getSocialPresentation(social.platform) && getSafeSocialUrl(social.url),
  );

  const localizedUrl = (url: string) => {
    if (/^(https?:|mailto:|tel:)/i.test(url) || url.startsWith('//')) return url;
    const segments = url.split('/').filter(Boolean);
    if (!url.startsWith('/') || segments[0] === 'ar' || segments[0] === 'en') return url;
    return `/${locale}${url === '/' ? '' : url}`;
  };

  return (
    <footer className="relative bg-[#101E39] text-white">
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="absolute left-12 top-[-42px] hidden h-[84px] w-[84px] flex-col items-center cursor-pointer justify-center rounded-full bg-[#C5A265] text-white font-bold shadow-lg transition-colors hover:bg-[#BF9432] lg:flex"
        aria-label={locale === 'ar' ? 'العودة إلى الأعلى' : 'Back to top'}
      >
        <ArrowUp className="h-4 w-4 rotate-45" />
        <span className="mt-1 text-xs">{locale === 'ar' ? 'الأعلى' : 'Top'}</span>
      </button>

      <div className="mx-auto grid min-h-[475px] max-w-[1216px] grid-cols-1 gap-12 px-5 py-20 sm:px-8 md:grid-cols-3 lg:px-0 lg:py-[104px]">
        <div className="flex flex-col items-start md:items-start">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={sameOriginImage(footer?.logo) || '/branding/alomar_logo_transparent.png'} alt={footer?.logoAlt || 'Alomar Holding'} className="h-[130px] w-auto object-contain" />
        </div>

        {columns.slice(0, 2).map((column, columnIndex) => (
          <div key={`${column.title.ar}-${columnIndex}`}>
            <h2 className="text-[12px] font-normal text-[#BF9432]">{locale === 'ar' ? column.title.ar : column.title.en}</h2>
            <ul className="mt-8 space-y-4 text-[28px] font-normal text-white">
              {column.links.map((link, linkIndex) => {
                const href = localizedUrl(link.url);
                const external = /^(https?:|mailto:|tel:)/i.test(href);
                const label = locale === 'ar' ? link.label.ar : link.label.en;
                const content = (
                  <>
                    {link.icon && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={sameOriginImage(link.icon)} alt="" className="h-4 w-4 object-contain" />
                    )}
                    {!link.icon && href.startsWith('tel:') && <Phone className="h-4 w-4" />}
                    {!link.icon && href.startsWith('mailto:') && <Mail className="h-4 w-4" />}
                    <span>{label}</span>
                  </>
                );
                return (
                  <li key={`${href}-${linkIndex}`}>
                    {external ? (
                      <a href={href} className="flex items-center gap-3 transition-colors hover:text-[#C5A265]">
                        {content}
                      </a>
                    ) : (
                      <Link href={href} className="flex items-center gap-3 transition-colors hover:text-[#C5A265]">
                        {content}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 bg-white">
        <div className="mx-auto flex min-h-[84px] max-w-[1216px] flex-col items-center justify-between gap-4 px-5 py-5 text-xs text-[#2A3B4D] sm:px-8 md:flex-row lg:px-0">
          {socialLinks.length > 0 && (
            <div dir={dir} className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <span>{locale === 'ar' ? 'تابعونا على:' : 'Follow us:'}</span>
              {socialLinks.map((social) => (
                <FooterSocialLink
                  key={`${social.platform}-${social.url}`}
                  platform={social.platform}
                  url={social.url}
                  locale={locale}
                />
              ))}
            </div>
          )}
          <p>{locale === 'ar' ? footer?.copyright.ar || '© 2026 العمر القابضة. جميع الحقوق محفوظة' : footer?.copyright.en || '© 2026 Alomar Holding. All rights reserved'}</p>
        </div>
      </div>
    </footer>
  );
};
