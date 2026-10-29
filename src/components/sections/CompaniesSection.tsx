'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import type { Project } from '@/types';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface CompaniesProps {
  projects: Project[];
}

export const CompaniesSection: React.FC<CompaniesProps> = ({ projects }) => {
  const { locale, dir, content } = useLanguage();
  const localizedProjects = projects.filter((project) => project.title[locale]);
  const [active, setActive] = useState(0);
  if (!localizedProjects.length && !content.previewMode) return null;
  if (!localizedProjects.length) return null;

  const project = localizedProjects[active % localizedProjects.length];
  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;
  const previous = () => setActive((value) => (value - 1 + localizedProjects.length) % localizedProjects.length);
  const next = () => setActive((value) => (value + 1) % localizedProjects.length);

  return (
    <section className="relative min-h-[720px] overflow-hidden bg-[#101E39] text-white lg:h-[960px]">
      {project.image && (
        <Image src={project.image} alt={project.title[locale]} fill priority={false} className="object-cover object-center" />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,13,26,0.58)_0%,rgba(16,30,57,0.50)_45%,rgba(16,30,57,0.78)_100%)]" />
      <div className="relative z-10 mx-auto h-full max-w-[1216px] px-5 py-16 sm:px-8 lg:px-0 lg:py-[120px]">
        <div className="grid grid-cols-2 border-b border-white/25 md:grid-cols-4" dir="ltr">
          {localizedProjects.slice(0, 4).map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(index)}
              className={`border-b border-white/25 px-2 py-3 text-center text-xs font-bold transition-colors md:text-sm ${
                index === active ? 'text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              {item.title[locale]}
            </button>
          ))}
        </div>

        <div className="mt-12 flex items-start justify-between gap-8 lg:mt-[48px]">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-white">{String(active + 1).padStart(2, '0')}</span>
            <span className="text-sm text-white/60">/ {String(localizedProjects.length).padStart(2, '0')}</span>
            <button type="button" onClick={next} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/50 hover:bg-white hover:text-[#101E39]" aria-label={locale === 'ar' ? 'المشروع التالي' : 'Next project'}>
              <ArrowIcon className="h-4 w-4" />
            </button>
            <button type="button" onClick={previous} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/50 hover:bg-white hover:text-[#101E39]" aria-label={locale === 'ar' ? 'المشروع السابق' : 'Previous project'}>
              <ArrowIcon className="h-4 w-4 rotate-180" />
            </button>
          </div>
          <h2 className="max-w-[720px] text-4xl font-bold leading-[1.15] sm:text-5xl lg:text-6xl">
            {project.title[locale]}
            {(locale === 'ar' ? project.location : project.location_en) && (
              <span className="block text-[#C5A265]">{locale === 'ar' ? project.location : project.location_en}</span>
            )}
          </h2>
        </div>

        <div className="absolute bottom-16 left-5 right-5 grid gap-6 rounded-sm border border-white/10 bg-[#101E39]/55 p-6 backdrop-blur-md sm:left-8 sm:right-8 lg:left-0 lg:right-0 lg:grid-cols-[1fr_300px] lg:items-center lg:px-10 lg:py-8">
          <Link
            href={`/${locale}/projects/${project.slug}`}
            className="inline-flex items-center gap-3 text-sm font-bold text-white"
          >
            <span>{locale === 'ar' ? 'اكتشف المزيد' : 'Discover More'}</span>
            <ArrowIcon className="h-4 w-4" />
          </Link>
          <div className="space-y-2 text-right">
            <h3 className="text-lg font-bold">{locale === 'ar' ? project.status : project.status_en || project.status}</h3>
            <p className="text-sm leading-7 text-white/75">
              {project.excerpt[locale] || project.content?.[locale] || ''}
            </p>
            </div>
          </div>
        </div>
    </section>
  );
};
