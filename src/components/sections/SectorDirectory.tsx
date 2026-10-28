'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import type { Sector } from '@/types';
import { Building2, TrendingUp, Briefcase, ShieldCheck, ArrowRight } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  building: Building2,
  'trending-up': TrendingUp,
  briefcase: Briefcase,
  'shield-check': ShieldCheck,
};

export const SectorDirectory: React.FC<{ sectors: Sector[] }> = ({ sectors }) => {
  const { locale, content } = useLanguage();
  const localizedSectors = sectors.filter((sector) => sector.title[locale]);
  if (!localizedSectors.length && !content.previewMode) return null;

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {localizedSectors.map((sector, index) => {
        const Icon = iconMap[sector.icon] || Building2;
        const isReversed = index % 2 === 1;
        return (
          <div
            key={sector.id}
            id={sector.slug}
            className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-[#101E39]/10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center scroll-mt-28"
          >
            <div className={`lg:col-span-6 relative ${isReversed ? 'lg:order-2' : 'lg:order-1'}`}>
              <div className="relative h-80 sm:h-[400px] rounded-2xl overflow-hidden shadow-lg border border-[#101E39]/10">
                {sector.image ? (
                  <>
                    <Image
                      src={sector.image}
                      alt={sector.title[locale]}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#101E39]/60 via-transparent to-transparent" />
                  </>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#101E39] to-[#1B4332]" aria-hidden="true" />
                )}
              </div>
            </div>

            <div className={`lg:col-span-6 space-y-6 ${isReversed ? 'lg:order-1' : 'lg:order-2'}`}>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-[#101E39] text-[#B7913D]">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#B7913D]">
                  {locale === 'ar' ? `قطاع استراتيجي #${index + 1}` : `Strategic Sector #${index + 1}`}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#101E39] tracking-tight">
                {sector.title[locale]}
              </h2>

              {sector.summary[locale] && (
                <p className="text-sm sm:text-base text-[#5A677B] leading-relaxed">
                  {sector.summary[locale]}
                </p>
              )}

              {sector.stats?.some((stat) => stat.label[locale]) && (
                <div className="grid grid-cols-2 gap-4 pt-2">
                  {sector.stats.filter((stat) => stat.label[locale]).map((stat, statIndex) => (
                    <div key={`${stat.value}-${statIndex}`} className="p-4 rounded-xl bg-[#F8F9F4] border border-[#101E39]/10">
                      <span className="text-xs text-[#5A677B] block mb-1">{stat.label[locale]}</span>
                      <span className="text-xl font-black text-[#101E39]">{stat.value}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#101E39] hover:text-[#B7913D] transition-colors"
                >
                  <span>{locale === 'ar' ? 'استفسر عن فرص الاستثمار في هذا القطاع' : 'Inquire about investment in this sector'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
};
