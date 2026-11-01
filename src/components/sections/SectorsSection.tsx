'use client';

import React, { useId, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { localizedLink } from '@/lib/localized-link';
import type { HomeSector, LocalizedString } from '@/types';

function localized(value: LocalizedString, locale: 'ar' | 'en'): string {
  return value[locale] || value[locale === 'ar' ? 'en' : 'ar'] || '';
}

export const SectorsSection: React.FC = () => {
  const revealRef = useScrollReveal<HTMLElement>();
  const accordionId = useId();
  const { locale, dir, content } = useLanguage();
  const sectors = content.homeAbout.sectors;
  const items = sectors.items.filter((item) => localized(item.title, locale) || localized(item.description, locale) || item.logo);
  const [openIndex, setOpenIndex] = useState<number | null>(() => items.length ? items.length - 1 : null);
  if (!items.length && !localized(sectors.title, locale) && !localized(sectors.description, locale)) return null;

  return (
    <section
      ref={revealRef}
      data-scroll-reveal
      className="bg-ivory-50 py-16 sm:py-20 lg:py-28"
      dir={dir}
      id="sectors"
    >
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start lg:gap-16 lg:px-12">
        <header className="text-start lg:sticky lg:top-32 lg:pt-10">
          {localized(sectors.badge, locale) && (
            <p className="mb-5 text-sm font-semibold text-gold-600">{localized(sectors.badge, locale)}</p>
          )}
          {localized(sectors.title, locale) && (
            <h2 className="max-w-[560px] text-4xl font-semibold leading-[1.18] text-navy-900 sm:text-5xl lg:text-6xl">
              {localized(sectors.title, locale)}
            </h2>
          )}
          {localized(sectors.description, locale) && (
            <p className="mt-6 max-w-[440px] text-base leading-7 text-slate-700 sm:text-lg">
              {localized(sectors.description, locale)}
            </p>
          )}
        </header>

        {items.length > 0 && (
          <div className="overflow-hidden rounded-[22px] border border-slate-200 bg-white">
            {items.map((item: HomeSector, index) => {
              const isOpen = openIndex === index;
              const title = localized(item.title, locale);
              const description = localized(item.description, locale);
              const tags = item.tags
                .map((tag) => ({ label: localized(tag.label, locale), url: localizedLink(tag.url, locale) }))
                .filter((tag) => tag.label);
              const panelId = `${accordionId}-sector-${index}`;

              return (
                <article key={`${title}-${index}`} data-reveal-item className={index < items.length - 1 ? 'border-b border-slate-200' : ''}>
                  <h3 id={`${panelId}-heading`}>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="flex w-full items-center justify-between gap-5 px-5 py-5 text-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-gold-500 sm:px-7 sm:py-6"
                    >
                      <span className="flex min-w-0 flex-row-reverse items-center gap-5" dir="ltr">
                        <span className="shrink-0 font-serif text-xs tabular-nums text-stone-500">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span dir={dir} className="text-xl font-semibold text-navy-900 sm:text-2xl">
                          {title}
                        </span>
                      </span>
                      <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-colors duration-300 ${isOpen ? 'border-gold-500 bg-gold-500 text-white' : 'border-slate-200 text-navy-900'}`}>
                        <Plus className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} aria-hidden="true" />
                      </span>
                    </button>
                  </h3>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={`${panelId}-heading`}
                    hidden={!isOpen}
                    className="px-5 pb-5 sm:px-7 sm:pb-7"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        {description && <p className="text-sm leading-7 text-slate-700 sm:text-base">{description}</p>}
                        {tags.length > 0 && (
                          <ul className="mt-4 flex flex-wrap gap-2" aria-label={locale === 'ar' ? 'روابط القطاع' : 'Sector links'}>
                            {tags.map((tag, tagIndex) => (
                              <li key={`${tag.label}-${tagIndex}`}>
                                {tag.url ? (
                                  <Link href={tag.url} className="inline-flex min-h-9 items-center rounded-full border border-slate-200 bg-ivory-50 px-5 py-1.5 text-sm font-medium text-navy-900 transition-colors hover:border-gold-500 hover:bg-gold-500">
                                    {tag.label}
                                  </Link>
                                ) : (
                                  <span className="inline-flex min-h-9 items-center rounded-full border border-slate-200 bg-ivory-50 px-5 py-1.5 text-sm font-medium text-navy-900">
                                    {tag.label}
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      {item.logo && (
                        <div className="pattern relative flex aspect-[1.6] w-full max-w-[245px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-navy-900 p-0">
                          <Image
                            src={item.logo}
                            alt={title ? `${title} logo` : ''}
                            width={480}
                            height={300}
                            sizes="(max-width: 639px) 100vw, 245px"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
