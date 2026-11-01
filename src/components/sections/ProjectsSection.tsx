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
  const [filter, setFilter] = useState('all');
  if (!projects.length && !content.previewMode) return null;

  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  const filteredProjects = projects.filter((project) => {
    if (filter === 'all') return true;
    if (filter === 'residential') {
      return project.category.includes('سكني') || project.category_en?.toLowerCase().includes('residential');
    }
    if (filter === 'commercial') {
      return project.category.includes('تجاري') || project.category_en?.toLowerCase().includes('commercial');
    }
    if (filter === 'mixed') {
      return project.category.includes('متعدد') || project.category_en?.toLowerCase().includes('mixed');
    }
    return true;
  });
  const localizedProjects = filteredProjects.filter((project) => localized(project.title));

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

          {/* Filter Tabs */}
          <div className="inline-flex p-1.5 rounded-full bg-white border border-navy-900/10 shadow-sm mt-6 flex-wrap justify-center gap-1">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-navy-900 text-white shadow-md'
                  : 'text-[#5A677B] hover:text-navy-900'
              }`}
            >
              {t.projects_section.filter_all}
            </button>
            <button
              type="button"
              onClick={() => setFilter('residential')}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                filter === 'residential'
                  ? 'bg-navy-900 text-white shadow-md'
                  : 'text-[#5A677B] hover:text-navy-900'
              }`}
            >
              {t.projects_section.filter_residential}
            </button>
            <button
              type="button"
              onClick={() => setFilter('commercial')}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                filter === 'commercial'
                  ? 'bg-navy-900 text-white shadow-md'
                  : 'text-[#5A677B] hover:text-navy-900'
              }`}
            >
              {t.projects_section.filter_commercial}
            </button>
            <button
              type="button"
              onClick={() => setFilter('mixed')}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                filter === 'mixed'
                  ? 'bg-navy-900 text-white shadow-md'
                  : 'text-[#5A677B] hover:text-navy-900'
              }`}
            >
              {t.projects_section.filter_mixed}
            </button>
          </div>
        </div>

        {/* Projects Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {localizedProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl overflow-hidden border border-navy-900/10 shadow-md luxury-card flex flex-col group"
            >
              {/* Image Container with Badges */}
              <div className="relative h-64 overflow-hidden">
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={localized(project.title)}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-108"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-navy-900 to-[#1B4332]" aria-hidden="true" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                {/* Status Badge */}
                {localizedValue(project.status, project.status_en) && (
                  <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold text-white bg-navy-900/80 backdrop-blur-md border border-white/20">
                    {localizedValue(project.status, project.status_en)}
                  </span>
                  </div>
                )}

                {/* Location Badge */}
                {localizedValue(project.location, project.location_en) && (
                  <div className="absolute bottom-4 right-4 flex items-center gap-1.5 text-white/95 text-xs font-semibold drop-shadow-md">
                  <MapPin className="w-3.5 h-3.5 text-gold-500" />
                    <span>{localizedValue(project.location, project.location_en)}</span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  {localizedValue(project.category, project.category_en) && (
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gold-500">
                      {localizedValue(project.category, project.category_en)}
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-navy-900 group-hover:text-gold-500 transition-colors leading-snug">
                    {localized(project.title)}
                  </h3>
                  {localized(project.excerpt) && (
                    <p className="text-sm text-[#5A677B] leading-relaxed line-clamp-2">
                      {localized(project.excerpt)}
                    </p>
                  )}
                </div>

                {/* Key Specs */}
                <div className="pt-4 border-t border-navy-900/10 flex items-center justify-between text-xs text-[#5A677B]">
                  {project.units_count && (
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-navy-900" />
                      <span>{project.units_count}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-navy-900" />
                    <span>{project.completion_year}</span>
                  </div>
                </div>

                {/* Action Link */}
                <div className="pt-2">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-navy-900 bg-ivory-50 hover:bg-navy-900 hover:text-white transition-all duration-300"
                  >
                    <span>{t.projects_section.view_project}</span>
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

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
