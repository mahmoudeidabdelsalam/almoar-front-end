'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { SubsidiaryCompany } from '@/types';
import { ExternalLink, Calendar } from 'lucide-react';

interface CompaniesProps {
  companies: SubsidiaryCompany[];
}

export const CompaniesSection: React.FC<CompaniesProps> = ({ companies }) => {
  const { locale, t, content } = useLanguage();
  const copy = content.sectionCopy.companies;
  const localizedCompanies = companies.filter((company) => company.name[locale]);
  if (!localizedCompanies.length && !content.previewMode) return null;

  return (
    <section className="py-20 lg:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101E39]/5 border border-[#101E39]/10 text-xs font-bold text-[#101E39]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B7913D]" />
            <span>{copy?.badge[locale] || (content.previewMode ? t.companies_section.badge : '')}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#101E39] tracking-tight">
            {copy?.title[locale] || (content.previewMode ? t.companies_section.title : '')}
          </h2>

          <p className="text-base sm:text-lg text-[#5A677B]">
            {copy?.description[locale] || (content.previewMode ? t.companies_section.subtitle : '')}
          </p>
        </div>

        {/* Subsidiaries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {localizedCompanies.map((company) => (
            <div
              key={company.id}
              className="bg-[#F8F9F4] rounded-2xl p-8 border border-[#101E39]/10 shadow-md luxury-card flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Gold Top Accent */}
              <div className="absolute top-0 inset-x-0 h-1 bg-[#B7913D] opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="space-y-6">
                {/* Header: Logo & Founding Year */}
                <div className="flex items-center justify-between">
                  <div className="relative w-14 h-14 p-2.5 rounded-xl bg-white shadow-sm border border-[#101E39]/10">
                    <Image
                      src={company.logo || '/branding/alomar_logo_mark.png'}
                      alt={locale === 'ar' ? company.name.ar : company.name.en}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  {company.year && (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#5A677B]">
                      <Calendar className="w-3.5 h-3.5 text-[#B7913D]" />
                      <span>{company.year}</span>
                    </div>
                  )}
                </div>

                {/* Company Name & Tagline */}
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-[#101E39] group-hover:text-[#B7913D] transition-colors">
                    {locale === 'ar' ? company.name.ar : company.name.en}
                  </h3>
                  <p className="text-xs font-semibold text-[#B7913D]">
                    {locale === 'ar' ? company.tagline.ar : company.tagline.en}
                  </p>
                </div>

                {/* Description */}
                <p className="text-sm text-[#5A677B] leading-relaxed">
                  {locale === 'ar' ? company.description.ar : company.description.en}
                </p>
              </div>

              {/* Action Link */}
              <div className="pt-6 mt-6 border-t border-[#101E39]/10 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#101E39]">
                  {locale === 'ar' ? 'شركة تابعة للمجموعة' : 'Holding Subsidiary'}
                </span>

                {company.website ? (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#B7913D] hover:underline"
                  >
                    <span>{locale === 'ar' ? 'زيارة الموقع' : 'Visit Website'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <Link
                    href="/companies"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#B7913D] hover:underline"
                  >
                    <span>{locale === 'ar' ? 'تفاصيل الشركة' : 'Company Profile'}</span>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
