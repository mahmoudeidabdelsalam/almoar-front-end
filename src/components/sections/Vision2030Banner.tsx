'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Leaf, Award, Rocket, ArrowRight, ArrowLeft } from 'lucide-react';

export const Vision2030Banner: React.FC = () => {
  const { locale, dir, t, content } = useLanguage();
  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;
  const vision = content.visionSection;

  const fallbackPillars = [
    {
      icon: Award,
      title_ar: 'جودة الحياة والرفاهية المجتمعية',
      title_en: 'Quality of Life & Community Well-being',
      desc_ar: 'تصميم مجتمعات متكاملة ومرافق رياضية ومساحات خضراء تسهم مباشرة في رفع معايير المعيشة الحضرية بالمملكة.',
      desc_en: 'Crafting master-planned communities with lush green parks and wellness amenities advancing urban vitality.',
    },
    {
      icon: Leaf,
      title_ar: 'الاستدامة البيئية وكفاءة الطاقة',
      title_en: 'Environmental Sustainability & Clean Energy',
      desc_ar: 'تبني معايير المباني الخضراء والمواد المستدامة وأنظمة إدارة المياه والطاقة المتجددة في كافة مشاريعنا.',
      desc_en: 'Championing green building practices, smart energy conservation, and eco-conscious construction materials.',
    },
    {
      icon: Rocket,
      title_ar: 'تمكين رواد الأعمال والابتكار الرقمي',
      title_en: 'Empowering Founders & Digital Economy',
      desc_ar: 'ضخ استثمارات استراتيجية في الشركات الناشئة ورواد التقنية العقارية والمالية لدعم تنويع مصادر الدخل.',
      desc_en: 'Deploying strategic growth capital into ambitious Saudi founders accelerating digital diversification.',
    },
  ];
  const pillarIcons: Record<string, typeof Award> = { award: Award, leaf: Leaf, rocket: Rocket };
  const pillars = vision.pillars.length
    ? vision.pillars.map((pillar) => ({
        icon: pillarIcons[pillar.icon] || Award,
        title_ar: pillar.title.ar,
        title_en: pillar.title.en,
        desc_ar: pillar.description.ar,
        desc_en: pillar.description.en,
      }))
    : content.previewMode ? fallbackPillars : [];
  if (!vision.title[locale] && !content.previewMode) return null;

  return (
    <section className="py-20 lg:py-28 emerald-pattern-bg text-white relative overflow-hidden">
      {/* Decorative Golden Ambient Light */}
      <div className="absolute top-0 end-1/4 w-80 h-80 bg-gold-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-gold-500" />
            <span className="text-xs font-bold tracking-wider text-gold-500">
              {vision.badge[locale] || (content.previewMode ? t.vision_section.badge : '')}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            {vision.title[locale] || (content.previewMode ? t.vision_section.title : '')}
          </h2>

          <p className="text-base sm:text-lg text-white/80 leading-relaxed">
            {vision.description[locale] || (content.previewMode ? t.vision_section.description : '')}
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <div
                key={index}
                className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-7 border border-white/15 transition-all duration-300 hover:-translate-y-2 group shadow-xl"
              >
                <div className="p-3.5 rounded-xl bg-white/10 text-gold-500 group-hover:bg-gold-500 group-hover:text-navy-900 w-fit mb-5 transition-colors">
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                  {locale === 'ar' ? pillar.title_ar : pillar.title_en}
                </h3>

                <p className="text-sm text-white/75 leading-relaxed">
                  {locale === 'ar' ? pillar.desc_ar : pillar.desc_en}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Bar */}
        <div className="mt-14 pt-8 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/80">
            {vision.footerLine[locale] || (content.previewMode && (locale === 'ar'
              ? 'تلتزم مجموعة العمر القابضة بدعم الاقتصاد الوطني وبناء شراكات تترك أثراً ممتداً للأجيال القادمة.'
              : 'Alomar Holding remains resolutely committed to driving national economic resilience and leaving an enduring legacy.'))}
          </p>
          <Link
            href={vision.ctaUrl || (content.previewMode ? '/about' : '#')}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold text-navy-900 gold-gradient-bg shadow-md hover:scale-105 transition-all flex-shrink-0"
          >
            <span>{vision.ctaLabel[locale] || (content.previewMode ? (locale === 'ar' ? 'اكتشف ركائزنا' : 'Discover Our Pillars') : '')}</span>
            <ArrowIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
