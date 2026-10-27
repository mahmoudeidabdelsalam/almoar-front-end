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
  const { locale, dir, t } = useLanguage();
  const [filter, setFilter] = useState('all');

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

  return (
    <section className="py-20 lg:py-28 bg-[#F8F9F4] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101E39]/5 border border-[#101E39]/10 text-xs font-bold text-[#101E39]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B7913D]" />
            <span>{t.projects_section.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#101E39] tracking-tight">
            {t.projects_section.title}
          </h2>

          <p className="text-base sm:text-lg text-[#5A677B]">
            {t.projects_section.subtitle}
          </p>

          {/* Filter Tabs */}
          <div className="inline-flex p-1.5 rounded-full bg-white border border-[#101E39]/10 shadow-sm mt-6 flex-wrap justify-center gap-1">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-[#101E39] text-white shadow-md'
                  : 'text-[#5A677B] hover:text-[#101E39]'
              }`}
            >
              {t.projects_section.filter_all}
            </button>
            <button
              type="button"
              onClick={() => setFilter('residential')}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                filter === 'residential'
                  ? 'bg-[#101E39] text-white shadow-md'
                  : 'text-[#5A677B] hover:text-[#101E39]'
              }`}
            >
              {t.projects_section.filter_residential}
            </button>
            <button
              type="button"
              onClick={() => setFilter('commercial')}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                filter === 'commercial'
                  ? 'bg-[#101E39] text-white shadow-md'
                  : 'text-[#5A677B] hover:text-[#101E39]'
              }`}
            >
              {t.projects_section.filter_commercial}
            </button>
            <button
              type="button"
              onClick={() => setFilter('mixed')}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                filter === 'mixed'
                  ? 'bg-[#101E39] text-white shadow-md'
                  : 'text-[#5A677B] hover:text-[#101E39]'
              }`}
            >
              {t.projects_section.filter_mixed}
            </button>
          </div>
        </div>

        {/* Projects Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl overflow-hidden border border-[#101E39]/10 shadow-md luxury-card flex flex-col group"
            >
              {/* Image Container with Badges */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={project.image}
                  alt={locale === 'ar' ? project.title.ar : project.title.en}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold text-white bg-[#101E39]/80 backdrop-blur-md border border-white/20">
                    {locale === 'ar' ? project.status : project.status_en}
                  </span>
                </div>

                {/* Location Badge */}
                <div className="absolute bottom-4 right-4 flex items-center gap-1.5 text-white/95 text-xs font-semibold drop-shadow-md">
                  <MapPin className="w-3.5 h-3.5 text-[#B7913D]" />
                  <span>{locale === 'ar' ? project.location : project.location_en || project.location}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#B7913D]">
                    {locale === 'ar' ? project.category : project.category_en || project.category}
                  </span>
                  <h3 className="text-xl font-bold text-[#101E39] group-hover:text-[#B7913D] transition-colors leading-snug">
                    {locale === 'ar' ? project.title.ar : project.title.en}
                  </h3>
                  <p className="text-sm text-[#5A677B] leading-relaxed line-clamp-2">
                    {locale === 'ar' ? project.excerpt.ar : project.excerpt.en}
                  </p>
                </div>

                {/* Key Specs */}
                <div className="pt-4 border-t border-[#101E39]/10 flex items-center justify-between text-xs text-[#5A677B]">
                  {project.units_count && (
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#101E39]" />
                      <span>{project.units_count}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-[#101E39]" />
                    <span>{project.completion_year}</span>
                  </div>
                </div>

                {/* Action Link */}
                <div className="pt-2">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-[#101E39] bg-[#F8F9F4] hover:bg-[#101E39] hover:text-white transition-all duration-300"
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
            href="/projects"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold text-white bg-[#101E39] hover:bg-[#0A1426] shadow-lg hover:shadow-xl transition-all"
          >
            <span>{locale === 'ar' ? 'عرض كافة المشاريع والمحفظة' : 'View Complete Developments Portfolio'}</span>
            <ArrowIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
