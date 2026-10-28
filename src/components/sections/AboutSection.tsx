'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { ShieldCheck, Compass, Sparkles, Handshake, ArrowRight, ArrowLeft } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { locale, dir, t, content } = useLanguage();
  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;
  const about = content.homeAbout;
  const image = about.image || (content.previewMode ? '/images/project_dama_lazurd.jpg' : '');

  const fallbackPillars = [
    {
      icon: Compass,
      title_ar: 'رؤية استشرافية',
      title_en: 'Forward-Looking Vision',
      desc_ar: 'اقتناص الفرص الاستثمارية النوعية ودعم المشاريع الواعدة.',
      desc_en: 'Capturing strategic investments and unlocking high-impact ventures.',
    },
    {
      icon: ShieldCheck,
      title_ar: 'حوكمة مؤسسية راسخة',
      title_en: 'Institutional Governance',
      desc_ar: 'أعلى معايير الشفافية والمسؤولية وإدارة المخاطر المحكمة.',
      desc_en: 'Uncompromising transparency, fiduciary rigor, and risk governance.',
    },
    {
      icon: Sparkles,
      title_ar: 'استدامة وجودة حياة',
      title_en: 'Sustainability & Impact',
      desc_ar: 'تطوير بيئات عمرانية خضراء تواكب مستهدفات رؤية 2030.',
      desc_en: 'Crafting resilient, green urban environments enhancing societal well-being.',
    },
    {
      icon: Handshake,
      title_ar: 'شراكات وطنية استراتيجية',
      title_en: 'National Alliances',
      desc_ar: 'تحالفات رائدة مع الكيانات الحكومية والشركاء التنمويين.',
      desc_en: 'Pioneering collaborations with public entities and institutional leaders.',
    },
  ];
  const pillarIcons: Record<string, typeof Compass> = {
    compass: Compass,
    shield: ShieldCheck,
    sparkle: Sparkles,
    handshake: Handshake,
  };
  const pillars = about.pillars.length
    ? about.pillars.map((pillar) => ({
        icon: pillarIcons[pillar.icon] || Compass,
        title_ar: pillar.title.ar,
        title_en: pillar.title.en,
        desc_ar: pillar.description.ar,
        desc_en: pillar.description.en,
      }))
    : content.previewMode ? fallbackPillars : [];
  if (!about.title[locale] && !content.previewMode) return null;

  return (
    <section className="py-20 lg:py-28 bg-[#F8F9F4] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Visual Showcase with Framing */}
          <div className="lg:col-span-5 relative order-2 lg:order-1">
            <div className="relative h-[420px] sm:h-[500px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              {image && <Image
                src={image}
                alt={about.title[locale]}
                fill
                className="object-cover"
              />}
              <div className="absolute inset-0 bg-gradient-to-t from-[#101E39]/80 via-transparent to-transparent" />
            </div>

            {/* Floating Experience Badge */}
            {content.previewMode && (
              <div className="absolute -bottom-6 -right-4 sm:-bottom-8 sm:right-6 bg-[#101E39] text-white p-5 sm:p-6 rounded-2xl shadow-xl border border-white/10 max-w-[240px]">
                <span className="text-[#B7913D] text-xs font-bold uppercase tracking-wider block mb-1">
                  {locale === 'ar' ? 'العمر القابضة' : 'Alomar Holding'}
                </span>
                <p className="text-white font-bold text-base sm:text-lg leading-snug">
                  {locale === 'ar' ? 'استثمار برؤية أوسع يصنع أثراً مستداماً' : 'Investment with a Broader Vision for Sustainable Impact'}
                </p>
              </div>
            )}
          </div>

          {/* Narrative & Pillars */}
          <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101E39]/5 border border-[#101E39]/10 text-xs font-bold text-[#101E39]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B7913D]" />
              <span>{about.badge[locale] || (content.previewMode ? t.about_section.badge : '')}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#101E39] leading-tight tracking-tight">
              {about.title[locale] || (content.previewMode ? t.about_section.title : '')}
            </h2>

            <div className="space-y-4 text-base sm:text-lg text-[#5A677B] leading-relaxed">
              <p>{about.descriptionOne[locale] || (content.previewMode ? t.about_section.description_1 : '')}</p>
              <p>{about.descriptionTwo[locale] || (content.previewMode ? t.about_section.description_2 : '')}</p>
            </div>

            {/* 4 Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {pillars.map((pillar, idx) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-white border border-[#101E39]/5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-[#101E39]/5 text-[#B7913D]">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-[#101E39] text-sm">
                        {locale === 'ar' ? pillar.title_ar : pillar.title_en}
                      </h4>
                    </div>
                    <p className="text-xs text-[#5A677B] leading-relaxed">
                      {locale === 'ar' ? pillar.desc_ar : pillar.desc_en}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="pt-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#101E39] hover:text-[#B7913D] transition-colors group"
              >
                <span>{t.about_section.learn_more}</span>
                <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
