'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Project } from '@/types';
import { MapPin, Calendar, Layers, ArrowRight, ArrowLeft } from 'lucide-react';

interface ProjectsSectionProps {
  projects: Project[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  const { locale, dir, t, content } = useLanguage();
  const localizedValue = (ar?: string, en?: string) =>
    (locale === 'ar' ? ar?.trim() || en?.trim() : en?.trim() || ar?.trim()) || '';
  const localized = (value: { ar: string; en: string }) =>
    localizedValue(value.ar, value.en);
  const copy = content.sectionCopy.projects;
  const [selectedCategory, setSelectedCategory] = useState('all');
  if (!projects.length && !content.previewMode) return null;

  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;
  const projectCategories = (project: Project) => project.categoryTerms?.length
    ? project.categoryTerms
    : project.category || project.category_en
      ? [{
          slug: project.category_en || project.category,
          name: { ar: project.category, en: project.category_en || project.category },
        }]
      : [];
  const categories = Array.from(
    new Map(
      projects.flatMap(projectCategories)
        .filter((category) => category.slug)
        .map((category) => [category.slug, category]),
    ).values(),
  );
  const localizedProjects = projects
    .filter((project) => selectedCategory === 'all'
      || projectCategories(project).some((category) => category.slug === selectedCategory))
    .filter((project) => localized(project.title));

  return (
    <section className="py-20 lg:py-28 bg-ivory-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-900/5 border border-navy-900/10 text-xs font-bold text-navy-900">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
            <span>{copy?.badge[locale] || (content.previewMode ? t.projects_section.badge : '')}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy-900 tracking-tight">
            {copy?.title[locale] || t.projects_section.title}
          </h1>

          <p className="text-base sm:text-lg text-[#5A677B]">
            {copy?.description[locale] || (content.previewMode ? t.projects_section.subtitle : '')}
          </p>

          <p className="shrink-0 text-xs text-[#737B86]" aria-live="polite">
            {locale === 'ar' ? `عرض ${localizedProjects.length} مشروع` : `Showing ${localizedProjects.length} projects`}
          </p>
        </div>

        {categories.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label={locale === 'ar' ? 'تصفية حسب التصنيف' : 'Filter by category'}>
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              aria-pressed={selectedCategory === 'all'}
              className={`rounded-full border px-4 py-2 text-xs transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 ${
                selectedCategory === 'all'
                  ? 'border-navy-900 bg-navy-900 text-white'
                  : 'border-[#D7D9DC] bg-transparent text-[#566174] hover:border-navy-900'
              }`}
            >
              {locale === 'ar' ? 'الكل' : 'All'}
            </button>
            {categories.map((category) => (
              <button
                type="button"
                key={category.slug}
                onClick={() => setSelectedCategory(category.slug)}
                aria-pressed={selectedCategory === category.slug}
                className={`rounded-full border px-4 py-2 text-xs transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 ${
                  selectedCategory === category.slug
                    ? 'border-navy-900 bg-navy-900 text-white'
                    : 'border-[#D7D9DC] bg-transparent text-[#566174] hover:border-navy-900'
                }`}
              >
                {localized(category.name)}
              </button>
            ))}
          </div>
        )}

        {localizedProjects.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {localizedProjects.map((project) => (
            <article
              key={project.id}
              className="group flex min-h-[330px] flex-col overflow-hidden rounded-xl border border-[#D8DADF] bg-white transition duration-300 hover:-translate-y-1 hover:border-[#C79A32] hover:shadow-lg"
            >
              <Link
                href={`/projects/${project.slug}`}
                className="flex flex-1 flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-gold-500"
                aria-label={`${locale === 'ar' ? 'عرض' : 'View'} ${localized(project.title)}`}
              >
                <div className="relative flex h-[160px] items-center justify-center bg-[#f8f7f3]">
                  {project.logo?.url || project.image ? (
                    <Image
                      src={project.logo?.url || project.image}
                      alt={project.logo?.alt || localized(project.title)}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className={project.logo ? 'object-contain p-2' : 'object-contain p-0'}
                    />
                  ) : (
                    <span className="text-sm font-semibold text-navy-900/70">{localized(project.title)}</span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  {projectCategories(project)[0] && (
                    <span className="mb-2 text-[10px] font-medium text-gold-600">
                      {localized(projectCategories(project)[0].name)}
                    </span>
                  )}
                  <h2 className="text-base font-medium text-navy-900 transition-colors group-hover:text-gold-600">
                    {localized(project.title)}
                  </h2>
                  {localized(project.excerpt) && (
                    <p className="mt-2 line-clamp-3 text-xs leading-6 text-[#68717E]">{localized(project.excerpt)}</p>
                  )}
                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-[#737B86]">
                    {localizedValue(project.location, project.location_en) && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin aria-hidden="true" size={12} />
                        {localizedValue(project.location, project.location_en)}
                      </span>
                    )}
                    {localizedValue(project.status, project.status_en) && (
                      <span>{localizedValue(project.status, project.status_en)}</span>
                    )}
                    {project.units_count && (
                      <span className="inline-flex items-center gap-1">
                        <Layers aria-hidden="true" size={12} />
                        {project.units_count}
                      </span>
                    )}
                    {project.completion_year && (
                      <span className="inline-flex items-center gap-1">
                        <Calendar aria-hidden="true" size={12} />
                        {project.completion_year}
                      </span>
                    )}
                  </div>
                  <span className="mt-auto flex items-center gap-2 pt-5 text-[11px] font-medium text-gold-600">
                    {t.projects_section.view_project}
                    <ArrowIcon aria-hidden="true" size={14} />
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
        ) : (
          <p className="rounded-xl border border-[#D8DADF] bg-white px-6 py-10 text-center text-sm text-[#68717E]">
            {locale === 'ar' ? 'لا توجد مشاريع ضمن هذا التصنيف.' : 'There are no projects in this category.'}
          </p>
        )}

        {/* View All Projects CTA */}
        <div className="text-center mt-12">
          <Link
            href={copy?.ctaUrl || '/projects'}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold text-white bg-navy-900 hover:bg-navy-900 shadow-lg hover:shadow-xl transition-all"
          >
            <span>{copy?.ctaLabel[locale] || (locale === 'ar' ? 'عرض كافة المشاريع والمحفظة' : 'View Complete Developments Portfolio')}</span>
            <ArrowIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
