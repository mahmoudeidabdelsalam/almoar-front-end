'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import type { Project } from '@/types';
import { MapPin, PhoneCall, Download, ArrowRight } from 'lucide-react';

export const ProjectIdentity: React.FC<{ project: Project }> = ({ project }) => {
  const { locale } = useLanguage();
  const title = project.title[locale];
  if (!title) return null;
  const label = locale === 'ar'
    ? { home: 'الرئيسية', projects: 'مشاريعنا', back: 'العودة لكافة المشاريع' }
    : { home: 'Home', projects: 'Projects', back: 'Back to all projects' };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-[#5A677B]">
          <Link href="/" className="hover:text-[#101E39] transition-colors">{label.home}</Link>
          <span>/</span>
          <Link href="/projects" className="hover:text-[#101E39] transition-colors">{label.projects}</Link>
          <span>/</span>
          <span className="text-[#101E39] font-bold">{title}</span>
        </div>
        <Link href="/projects" className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#101E39] hover:text-[#B7913D] transition-colors">
          <ArrowRight className="w-4 h-4" />
          <span>{label.back}</span>
        </Link>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold text-white bg-[#101E39]">
            {locale === 'ar' ? project.category : project.category_en}
          </span>
          <span className="px-3.5 py-1 rounded-full text-xs font-bold text-[#101E39] bg-[#B7913D]/20 border border-[#B7913D]/30">
            {locale === 'ar' ? project.status : project.status_en}
          </span>
          <span className="flex items-center gap-1 text-xs font-semibold text-[#5A677B]">
            <MapPin className="w-3.5 h-3.5 text-[#B7913D]" />
            <span>{locale === 'ar' ? project.location : project.location_en}</span>
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#101E39] tracking-tight">
          {title}
        </h1>
      </div>
    </>
  );
};

export const ProjectNarrativeAndSpecs: React.FC<{ project: Project }> = ({ project }) => {
  const { locale, content } = useLanguage();
  const copy = locale === 'ar'
    ? {
        overview: 'نظرة عامة على المشروع',
        highlights: 'أبرز المزايا والمواصفات:',
        details: 'بيانات ومواصفات المشروع',
        units: 'الوحدات:',
        landArea: 'مساحة الأرض:',
        builtArea: 'المساحة المبنية:',
        completion: 'سنة الإنجاز:',
        location: 'الموقع:',
        inquire: 'حجز أو استفسار عن المشروع',
        brochure: 'تحميل الكتيب الرقمي (PDF)',
      }
    : {
        overview: 'Project Overview',
        highlights: 'Key Features and Specifications',
        details: 'Project Details',
        units: 'Units:',
        landArea: 'Land area:',
        builtArea: 'Built area:',
        completion: 'Completion year:',
        location: 'Location:',
        inquire: 'Project booking or inquiry',
        brochure: 'Download project brochure (PDF)',
      };
  const features = project.highlights?.length
    ? project.highlights.map((highlight) => highlight[locale]).filter(Boolean)
    : content.previewMode && locale === 'ar'
      ? ['أنظمة المنازل الذكية والتحكم في الطاقة', 'حدائق ومسطحات خضراء وممشى رياضي', 'أمن وحراسة وأنظمة مراقبة ذكية 24/7', 'مواقف سيارات مخصصة وشواحن كهربائية']
      : content.previewMode
        ? ['Smart home and energy controls', 'Landscaped gardens and walking paths', '24/7 security and monitoring', 'Dedicated parking and EV charging']
        : [];
  const specs = [
    [copy.units, project.units_count],
    [copy.landArea, project.land_area],
    [copy.builtArea, project.built_area],
    [copy.completion, project.completion_year],
    [copy.location, locale === 'ar' ? project.location : project.location_en],
  ].filter((spec): spec is [string, string] => Boolean(spec[1]));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div className="lg:col-span-8 bg-white rounded-3xl p-8 sm:p-10 shadow-lg border border-[#101E39]/10 space-y-6">
        <h2 className="text-2xl font-bold text-[#101E39] pb-3 border-b border-[#101E39]/10">{copy.overview}</h2>
        <div className="space-y-4 text-base text-[#5A677B] leading-relaxed">
          {project.excerpt[locale] && <p>{project.excerpt[locale]}</p>}
          {project.content?.[locale] && <p>{project.content[locale]}</p>}
        </div>
        {features.length > 0 && (
          <div className="pt-6 border-t border-[#101E39]/10 space-y-4">
            <h3 className="text-lg font-bold text-[#101E39]">{copy.highlights}</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[#5A677B]">
              {features.map((feature, index) => (
                <li key={`${feature}-${index}`} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#B7913D]" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="lg:col-span-4 space-y-6">
        <div className="bg-[#101E39] text-white rounded-3xl p-8 shadow-xl space-y-6">
          <h3 className="text-lg font-bold text-[#B7913D] border-b border-white/10 pb-3">{copy.details}</h3>
          <div className="space-y-4 text-sm">
            {specs.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-white/10">
                <span className="text-white/60">{label}</span>
                <span className="font-bold text-white">{value}</span>
              </div>
            ))}
          </div>
          <div className="pt-2 space-y-3">
            <Link href="/contact" className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-[#101E39] gold-gradient-bg shadow-lg hover:shadow-xl transition-all">
              <PhoneCall className="w-4 h-4" />
              <span>{copy.inquire}</span>
            </Link>
            {project.brochure_url && (
              <a href={project.brochure_url} target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-xs text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-colors">
                <Download className="w-4 h-4" />
                <span>{copy.brochure}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const RelatedProjects: React.FC<{ projects: Project[] }> = ({ projects }) => {
  const { locale } = useLanguage();
  const localizedProjects = projects.filter((project) => project.title[locale]);
  if (!localizedProjects.length) return null;

  return (
    <div className="space-y-6 pt-12 border-t border-[#101E39]/10">
      <h3 className="text-2xl font-bold text-[#101E39]">{locale === 'ar' ? 'مشاريع أخرى من محفظتنا' : 'More from our portfolio'}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {localizedProjects.map((project) => (
          <Link key={project.id} href={`/projects/${project.slug}`} className="bg-white rounded-2xl overflow-hidden border border-[#101E39]/10 shadow-sm hover:shadow-md transition-all group">
            <div className="relative h-44">
            {project.image ? (
              <Image src={project.image} alt={project.title[locale]} fill className="object-cover group-hover:scale-105 transition-transform" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#101E39] to-[#1B4332]" aria-hidden="true" />
            )}
            </div>
            <div className="p-4 space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#B7913D]">{locale === 'ar' ? project.category : project.category_en}</span>
              <h4 className="font-bold text-[#101E39] text-sm group-hover:text-[#B7913D] transition-colors">{project.title[locale]}</h4>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
