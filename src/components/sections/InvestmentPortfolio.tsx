'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import type { Locale, Project } from '@/types';

interface InvestmentPortfolioProps {
  projects: Project[];
  locale: Locale;
  heading: string;
  eyebrow: string;
  description: string;
}

function localized(value: { ar: string; en: string } | undefined, locale: Locale): string {
  return locale === 'en' ? value?.en || value?.ar || '' : value?.ar || value?.en || '';
}

function projectCategories(project: Project) {
  if (project.categoryTerms?.length) return project.categoryTerms;
  if (!project.category && !project.category_en) return [];
  return [{
    slug: project.category || project.category_en || '',
    name: { ar: project.category || '', en: project.category_en || project.category },
  }];
}

function categoryLabel(category: { slug: string; name: { ar: string; en: string } }, locale: Locale): string {
  const translations: Record<string, { ar: string; en: string }> = {
    riyadh: { ar: 'الرياض', en: 'Riyadh' },
    residential: { ar: 'سكني', en: 'Residential' },
  };
  const currentLabel = localized(category.name, locale);
  const translatedLabel = translations[category.slug]?.[locale];
  return translatedLabel && currentLabel.toLowerCase() === category.slug.toLowerCase()
    ? translatedLabel
    : currentLabel;
}

export function InvestmentPortfolio({
  projects,
  locale,
  heading,
  eyebrow,
  description,
}: InvestmentPortfolioProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const isArabic = locale === 'ar';
  const direction = isArabic ? 'rtl' : 'ltr';
  const categories = Array.from(
    new Map(
      projects.flatMap(projectCategories)
        .filter((category) => category.slug)
        .map((category) => [category.slug, category]),
    ).values(),
  );
  const visibleProjects = selectedCategory === 'all'
    ? projects
    : projects.filter((project) => projectCategories(project).some((category) => category.slug === selectedCategory));

  return (
    <section className="bg-[#F8F7F2] px-5 py-16 sm:px-8 lg:px-14 lg:py-24" dir={direction}>
      <div className="mx-auto max-w-[1216px]">
        <header className="mb-9 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            {eyebrow && <p className="mb-3 text-xs font-medium text-[#A07A22]">{eyebrow}</p>}
            <h2 className="text-3xl font-normal leading-tight text-[#101E39] sm:text-[64px]">{heading}</h2>
            {description && <p className="mt-4 max-w-xl text-sm leading-7 text-[#626D7B]">{description}</p>}
          </div>
          <p className="shrink-0 text-xs text-[#737B86]" aria-live="polite">
            {isArabic ? `عرض ${visibleProjects.length} مشروع` : `Showing ${visibleProjects.length} projects`}
          </p>
        </header>

        {categories.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label={isArabic ? 'تصفية حسب القطاع' : 'Filter by category'}>
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              aria-pressed={selectedCategory === 'all'}
              className={`rounded-full border px-4 py-2 text-xs transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B7913D] ${
                selectedCategory === 'all'
                  ? 'border-[#101E39] bg-[#101E39] text-white'
                  : 'border-[#D7D9DC] bg-transparent text-[#566174] hover:border-[#101E39]'
              }`}
            >
              {isArabic ? 'الكل' : 'All'}
            </button>
            {categories.map((category) => (
              <button
                type="button"
                key={category.slug}
                onClick={() => setSelectedCategory(category.slug)}
                aria-pressed={selectedCategory === category.slug}
                className={`rounded-full border px-4 py-2 text-xs transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B7913D] ${
                  selectedCategory === category.slug
                    ? 'border-[#101E39] bg-[#101E39] text-white'
                    : 'border-[#D7D9DC] bg-transparent text-[#566174] hover:border-[#101E39]'
                }`}
              >
                {categoryLabel(category, locale)}
              </button>
            ))}
          </div>
        )}

        {visibleProjects.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {visibleProjects.map((project) => {
              const category = projectCategories(project)[0];
              const title = localized(project.title, locale);
              const image = project.logo?.url || project.image;
              return (
                <article
                  key={project.id}
                  className="group flex min-h-[330px] flex-col overflow-hidden rounded-xl border border-[#D8DADF] bg-white transition duration-300 hover:-translate-y-1 hover:border-[#C79A32] hover:shadow-lg"
                >
                  <Link
                    href={`/${locale}/projects/${project.slug}`}
                    className="flex flex-1 flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#B7913D]"
                    aria-label={`${isArabic ? 'عرض' : 'View'} ${title}`}
                  >
                    <div className="relative flex h-[124px] items-center justify-center bg-[#F0EFEA]">
                      {image ? (
                        <Image
                          src={image}
                          alt={project.logo?.alt || title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className={project.logo ? 'object-contain p-8' : 'object-contain p-5'}
                        />
                      ) : (
                        <span className="text-sm font-semibold text-[#101E39]/70">{title}</span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      {category && <span className="mb-2 text-[10px] font-medium text-[#A07A22]">{categoryLabel(category, locale)}</span>}
                      <h3 className="text-base font-medium text-[#101E39] transition-colors group-hover:text-[#A07A22]">{title}</h3>
                      {localized(project.excerpt, locale) && (
                        <p className="mt-2 line-clamp-3 text-xs leading-6 text-[#68717E]">{localized(project.excerpt, locale)}</p>
                      )}
                      <span className="mt-auto flex items-center gap-2 pt-5 text-[11px] font-medium text-[#A07A22]">
                        {isArabic ? 'تعرف على الشركة' : 'Discover the company'}
                        {isArabic
                          ? <ArrowLeft aria-hidden="true" size={14} />
                          : <ArrowRight aria-hidden="true" size={14} />}
                      </span>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="rounded-xl border border-[#D8DADF] bg-white px-6 py-10 text-center text-sm text-[#68717E]">
            {isArabic ? 'لا توجد مشاريع ضمن هذا التصنيف.' : 'There are no projects in this category.'}
          </p>
        )}
      </div>
    </section>
  );
}
