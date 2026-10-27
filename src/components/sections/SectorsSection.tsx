'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Sector } from '@/types';
import { Building2, TrendingUp, Briefcase, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  building: Building2,
  'trending-up': TrendingUp,
  briefcase: Briefcase,
  'shield-check': ShieldCheck,
};

interface SectorsProps {
  sectors: Sector[];
}

export const SectorsSection: React.FC<SectorsProps> = ({ sectors }) => {
  const { locale, dir, t } = useLanguage();
  const [activeTab, setActiveTab] = useState(0);

  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <section className="py-20 lg:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 lg:mb-16 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101E39]/5 border border-[#101E39]/10 text-xs font-bold text-[#101E39]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B7913D]" />
              <span>{t.sectors_section.badge}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#101E39] tracking-tight">
              {t.sectors_section.title}
            </h2>
            <p className="text-base sm:text-lg text-[#5A677B]">
              {t.sectors_section.subtitle}
            </p>
          </div>

          <Link
            href="/sectors"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#B7913D] hover:text-[#96742B] transition-colors self-start md:self-auto group"
          >
            <span>{t.sectors_section.view_all}</span>
            <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Sectors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sectors.map((sector, index) => {
            const IconComponent = iconMap[sector.icon] || Building2;
            const isHovered = activeTab === index;
            return (
              <div
                key={sector.id}
                onMouseEnter={() => setActiveTab(index)}
                className={`relative rounded-2xl p-7 transition-all duration-300 flex flex-col justify-between border ${
                  isHovered
                    ? 'bg-[#101E39] text-white shadow-2xl scale-[1.02] border-[#B7913D]'
                    : 'bg-[#F8F9F4] text-[#101E39] border-[#101E39]/10 hover:border-[#101E39]/20'
                }`}
              >
                <div>
                  {/* Icon & Index Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`p-3.5 rounded-xl transition-colors ${
                        isHovered ? 'bg-[#B7913D] text-white' : 'bg-[#101E39]/10 text-[#101E39]'
                      }`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className={`text-xs font-bold ${isHovered ? 'text-white/60' : 'text-[#5A677B]'}`}>
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-3 tracking-tight">
                    {locale === 'ar' ? sector.title.ar : sector.title.en}
                  </h3>

                  <p
                    className={`text-sm leading-relaxed mb-6 line-clamp-4 ${
                      isHovered ? 'text-white/80' : 'text-[#5A677B]'
                    }`}
                  >
                    {locale === 'ar' ? sector.summary.ar : sector.summary.en}
                  </p>
                </div>

                {/* Bottom Stats or Explore */}
                <div className={`pt-4 border-t ${isHovered ? 'border-white/15' : 'border-[#101E39]/10'}`}>
                  {sector.stats && sector.stats.length > 0 ? (
                    <div className="space-y-1">
                      <span className="text-xs text-[#B7913D] font-bold block">
                        {locale === 'ar' ? sector.stats[0].label.ar : sector.stats[0].label.en}
                      </span>
                      <span className="text-lg font-black">{sector.stats[0].value}</span>
                    </div>
                  ) : (
                    <Link
                      href={`/sectors#${sector.slug}`}
                      className={`text-xs font-bold inline-flex items-center gap-1 ${
                        isHovered ? 'text-[#B7913D]' : 'text-[#101E39]'
                      }`}
                    >
                      <span>{locale === 'ar' ? 'اكتشف القطاع' : 'Explore Sector'}</span>
                      <ArrowIcon className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
