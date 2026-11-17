'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import type { LocalizedString, Project } from '@/types';

interface CompaniesProps {
  projects: Project[];
}

export const CompaniesSection: React.FC<CompaniesProps> = ({ projects }) => {
  const { locale } = useLanguage();
  const otherLocale = locale === 'ar' ? 'en' : 'ar';
  const localized = (value?: LocalizedString) =>
    value?.[locale]?.trim() || value?.[otherLocale]?.trim() || '';
  const localizedProjects = projects.filter((project) => localized(project.title)).reverse();
  const [active, setActive] = useState(0);
  if (!localizedProjects.length) return null;

  const activeIndex = Math.min(active, localizedProjects.length - 1);
  const project = localizedProjects[activeIndex];
  const projectStats = project.statsBand;
  const statsTag = localized(projectStats?.tag);
  const statsHeadline = localized(projectStats?.headline);
  const statsItems = (projectStats?.items || []).filter((item) =>
    localized(item.head) || localized(item.text),
  );
  const showStats = Boolean(statsTag || statsHeadline || statsItems.length);
  return (
    <section className="homepage-projects-track relative bg-navy-900 text-white">
      <div className="homepage-projects-stage relative isolate min-h-[100svh] overflow-hidden bg-navy-900">
        <div className="absolute inset-0">
          {project.image && (
            <Image
              key={project.id}
              src={project.image}
              alt={localized(project.title)}
              fill
              sizes="100vw"
              priority={false}
              className="animate-project-slide object-cover object-center"
            />
          )}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,13,26,0.58)_0%,rgba(16,30,57,0.50)_45%,rgba(16,30,57,0.78)_100%)]" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1216px] flex-col px-5 py-8 sm:px-8 sm:py-10 lg:px-0 lg:py-12">
          <div
            className="grid grid-cols-2 border-b border-white/25 md:grid-cols-4 lg:grid-cols-8"
            role="tablist"
            aria-label={locale === 'ar' ? 'المشاريع' : 'Projects'}
          >
            {localizedProjects.map((item, index) => (
              <button
                key={item.id}
                type="button"
                id={`homepage-project-tab-${item.id}`}
                role="tab"
                aria-selected={index === activeIndex}
                aria-controls={`homepage-project-panel-${item.id}`}
                onClick={() => setActive(index)}
                className={`min-w-0 break-words border-b border-white/25 px-2 py-3 text-center text-xs font-bold transition-colors md:text-sm ${
                  index === activeIndex ? 'text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                {localized(item.title)}
              </button>
            ))}
          </div>

          <div
            key={project.id}
            id={`homepage-project-panel-${project.id}`}
            role="tabpanel"
            aria-labelledby={`homepage-project-tab-${project.id}`}
            className="animate-project-slide mt-8 flex min-h-0 flex-1 flex-col items-start justify-between gap-5 lg:mt-12"
          >
            {localized({ ar: project.location, en: project.location_en || project.location }) && (
              <span className="block text-gold-200">
                {localized({ ar: project.location, en: project.location_en || project.location })}
              </span>
            )}
            <div className="space-y-3 text-start">
              <h2 className="max-w-[720px] text-4xl font-normal leading-tight sm:text-5xl lg:text-7xl">
                {localized(project.title)}
              </h2>
              <p className="max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
                {localized(project.excerpt) || localized(project.content)}
              </p>
            </div>

          </div>

          <Link
            href={`/${locale}/projects/${project.slug}`}
            className="mt-6 block rounded-sm border border-white/10 bg-navy-900/55 p-5 backdrop-blur-md transition-colors hover:border-white/30 sm:p-6 lg:mt-8 lg:px-10 lg:py-8"
          >
            <span className="sr-only">
              {locale === 'ar' ? 'تفاصيل المشروع: ' : 'Project details: '}
              {localized(project.title)}
            </span>
            {showStats && (
              <>
                {(statsTag || statsHeadline) && (
                  <div className="mb-4 space-y-1">
                    {statsTag && <p className="text-xs font-bold uppercase tracking-wider text-gold-200">{statsTag}</p>}
                    {statsHeadline && <h3 className="text-lg font-bold text-white">{statsHeadline}</h3>}
                  </div>
                )}
                {statsItems.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    {statsItems.map((item, index) => {
                      const head = localized(item.head);
                      const text = localized(item.text);
                      return (
                        <div key={`${head}-${index}`} className="space-y-1 border-s border-white/20 ps-4 first:border-0 first:ps-0">
                          {head && <p className="text-2xl font-bold text-white">{head}</p>}
                          {text && <p className="text-base leading-5 text-white/70 sm:text-xl">{text}</p>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </Link>
        </div>
      </div>
    </section>
  );
};
