'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Award, TrendingUp, Building2, Layers } from 'lucide-react';

interface StatProps {
  stats?: Array<{
    key: string;
    number: string;
    label_ar: string;
    label_en: string;
  }>;
}

export const StatsSection: React.FC<StatProps> = ({ stats }) => {
  const { locale, content } = useLanguage();

  const defaultStats = [
    {
      key: 'years',
      number: '25+',
      label_ar: 'عاماً من الريادة والخبرة الاستثمارية',
      label_en: 'Years of Investment Leadership',
      icon: Award,
    },
    {
      key: 'aum',
      number: '4B+',
      label_ar: 'مليار ريال حجم المحفظة الاستثمارية',
      label_en: 'SAR Total Portfolio Value',
      icon: TrendingUp,
    },
    {
      key: 'projects',
      number: '15+',
      label_ar: 'مشروعاً عقارياً وتنموياً رائداً',
      label_en: 'Flagship Urban Developments',
      icon: Building2,
    },
    {
      key: 'subsidiaries',
      number: '6+',
      label_ar: 'شركات تابعة ومنظومات متخصصة',
      label_en: 'Subsidiaries & Business Units',
      icon: Layers,
    },
  ];

  const items = stats && stats.length > 0 ? stats.map((s, i) => ({
    ...s,
    icon: defaultStats[i % defaultStats.length].icon,
  })) : content.previewMode ? defaultStats : [];
  if (!items.length) return null;

  return (
    <section className="relative z-20 -mt-10 lg:-mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {items.map((item, index) => {
          const Icon = item.icon || Award;
          return (
            <div
              key={item.key || index}
              className="bg-white rounded-2xl p-6 md:p-8 shadow-xl shadow-navy-900/5 border border-navy-900/10 luxury-card group relative overflow-hidden"
            >
              {/* Top Accent Strip */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-gold-500 via-gold-500 to-gold-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-navy-900 tracking-tight group-hover:text-gold-500 transition-colors">
                  {item.number}
                </span>
                <div className="p-3 rounded-xl bg-ivory-50 text-gold-500 group-hover:bg-gold-500 group-hover:text-white transition-all duration-300">
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <p className="text-sm font-semibold text-[#5A677B] leading-relaxed">
                {locale === 'ar' ? item.label_ar : item.label_en}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
