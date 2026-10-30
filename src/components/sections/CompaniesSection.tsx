'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import type { LocalizedString, Project } from '@/types';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface CompaniesProps {
  projects: Project[];
}

export const CompaniesSection: React.FC<CompaniesProps> = ({ projects }) => {
  const { locale, dir, content } = useLanguage();
  const otherLocale = locale === 'ar' ? 'en' : 'ar';
  const localized = (value: LocalizedString) => value[locale]?.trim() || value[otherLocale]?.trim() || '';
  const localizedProjects = projects.filter((project) => localized(project.title));
  const [active, setActive] = useState(0);
  if (!localizedProjects.length && !content.previewMode) return null;
  if (!localizedProjects.length) return null;

  const project = localizedProjects[active % localizedProjects.length];
  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;
  const projectStats = project.statsBand;
  const statsTag = projectStats?.tag[locale]?.trim() || projectStats?.tag[locale === 'ar' ? 'en' : 'ar']?.trim() || '';
  const statsHeadline = projectStats?.headline[locale]?.trim() || projectStats?.headline[locale === 'ar' ? 'en' : 'ar']?.trim() || '';
  const statsItems = (projectStats?.items || []).filter((item) =>
    item.head[locale]?.trim() || item.head[locale === 'ar' ? 'en' : 'ar']?.trim()
      || item.text[locale]?.trim() || item.text[locale === 'ar' ? 'en' : 'ar']?.trim()
  );
  const showStats = Boolean(statsTag || statsHeadline || statsItems.length);
  const previous = () => setActive((value) => (value - 1 + localizedProjects.length) % localizedProjects.length);
  const next = () => setActive((value) => (value + 1) % localizedProjects.length);

  return (
    <section className={`relative overflow-hidden bg-[#101E39] text-white ${showStats ? 'min-h-[900px] lg:min-h-[960px]' : 'min-h-[720px] lg:h-[960px]'}`}>
      {project.image && (
        <Image src={project.image} alt={project.title[locale]} fill priority={false} className="object-cover object-center" />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,13,26,0.58)_0%,rgba(16,30,57,0.50)_45%,rgba(16,30,57,0.78)_100%)]" />
      <div className={`relative flex flex-col z-10 mx-auto max-w-[1216px] px-5 py-16 sm:px-8 lg:px-0 lg:py-[120px] ${showStats ? 'min-h-[900px] lg:min-h-[960px]' : 'h-full'}`}>
        <div className="grid grid-cols-2 border-b border-white/25 md:grid-cols-4">
          {localizedProjects.slice(0, 4).map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(index)}
              aria-pressed={index === active}
              className={`border-b border-white/25 px-2 py-3 text-center text-xs font-bold transition-colors md:text-sm ${
                index === active ? 'text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              {localized(item.title)}
            </button>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-8 lg:mt-[48px]">
          {(locale === 'ar' ? project.location : project.location_en || project.location) && (
            <span className="block text-[#C5A265]">{locale === 'ar' ? project.location : project.location_en || project.location}</span>
          )}
          <div className="space-y-2 text-right">
            <h2 className="max-w-[720px] text-5xl lg:text-[88px] lg:leading-[1.15] font-normal leading-[1.15] sm:text-5xl lg:text-6xl">
              {localized(project.title)}
            </h2>
            <p className="text-sm lg:text-[88px] leading-7 lg:leading-[1.15] text-white/75">
              {project.excerpt[locale] || project.content?.[locale] || ''}
            </p>
          </div>
          <div className="flex items-center gap-3 mt-20">
            <span className="text-2xl font-bold text-white">{String(active + 1).padStart(2, '0')}</span>
            <span className="text-sm text-white/60">/ {String(localizedProjects.length).padStart(2, '0')}</span>
            <button type="button" onClick={next} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/50 hover:bg-white hover:text-[#101E39]" aria-label={locale === 'ar' ? 'المشروع التالي' : 'Next project'}>
              <ArrowIcon className="h-4 w-4 rotate-180" />
            </button>
            <button type="button" onClick={previous} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/50 hover:bg-white hover:text-[#101E39]" aria-label={locale === 'ar' ? 'المشروع السابق' : 'Previous project'}>
              <ArrowIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-auto rounded-sm border border-white/10 bg-[#101E39]/55 p-6 backdrop-blur-md lg:px-10 lg:py-8">
          <Link
            href={`/${locale}/projects/${project.slug}`}
            className="w-full"
          >
            {showStats && (
              <>
              <div className="mb-4 lg:mb-4">
                 {(statsTag || statsHeadline) && (
                  <div className="space-y-1">
                    {statsTag && <p className="text-xs font-bold uppercase tracking-wider text-[#C5A265]">{statsTag}</p>}
                    {statsHeadline && <h3 className="text-lg font-bold text-white">{statsHeadline}</h3>}
                  </div>
                )}
              </div>
              <div className="space-y-4">
                {statsItems.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                    {statsItems.map((item, index) => {
                      const head = item.head[locale]?.trim() || item.head[locale === 'ar' ? 'en' : 'ar']?.trim();
                      const text = item.text[locale]?.trim() || item.text[locale === 'ar' ? 'en' : 'ar']?.trim();
                      return (
                        <div key={`${head}-${index}`} className="space-y-1 border-s border-white/20 ps-4 first:border-0 first:ps-0">
                          {head && <p className="text-2xl font-bold text-white">{head}</p>}
                          {text && <p className="text-xl leading-5 text-white/70">{text}</p>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>              
              </>
            )}
          </Link>
        </div>
      </div>
    </section>
  );
};
