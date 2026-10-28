'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import type { SubsidiaryCompany } from '@/types';
import { ExternalLink, Calendar } from 'lucide-react';

export const CompanyDirectory: React.FC<{ companies: SubsidiaryCompany[] }> = ({ companies }) => {
  const { locale, content } = useLanguage();
  const localizedCompanies = companies.filter((company) => company.name[locale]);
  if (!localizedCompanies.length && !content.previewMode) return null;

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {localizedCompanies.map((company) => (
          <div
            key={company.id}
            id={company.slug}
            className="bg-white rounded-3xl p-8 shadow-xl border border-[#101E39]/10 flex flex-col justify-between luxury-card relative group"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="relative w-16 h-16 p-3 rounded-2xl bg-[#F8F9F4] border border-[#101E39]/10 shadow-sm">
                  <Image
                    src={company.logo || '/branding/alomar_logo_mark.png'}
                    alt={company.name[locale]}
                    fill
                    className="object-contain p-2"
                  />
                </div>
                {company.year && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-[#5A677B] bg-[#F8F9F4]">
                    <Calendar className="w-3.5 h-3.5 text-[#B7913D]" />
                    <span>{locale === 'ar' ? `تأسست عام ${company.year}` : `Founded ${company.year}`}</span>
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-[#101E39] group-hover:text-[#B7913D] transition-colors">
                  {company.name[locale]}
                </h2>
                {company.tagline[locale] && (
                  <p className="text-xs font-semibold text-[#B7913D]">{company.tagline[locale]}</p>
                )}
              </div>

              {company.description[locale] && (
                <p className="text-sm text-[#5A677B] leading-relaxed">{company.description[locale]}</p>
              )}
            </div>

            <div className="pt-6 mt-6 border-t border-[#101E39]/10 flex items-center justify-between">
              <span className="text-xs font-semibold text-[#101E39]">
                {locale === 'ar' ? 'كيان تابع للمجموعة' : 'Holding subsidiary'}
              </span>
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B7913D] hover:underline"
                >
                  <span>{locale === 'ar' ? 'زيارة الموقع' : 'Visit Website'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
