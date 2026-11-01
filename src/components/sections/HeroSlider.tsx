'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import type { HeroSlide } from '@/types';
import { localizedLink } from '@/lib/localized-link';

const previewSlides: HeroSlide[] = [
  {
    id: 1,
    image: '/images/hero_riyadh.jpg',
    badge_ar: 'نبذة عن',
    badge_en: 'About Us',
    title_ar: 'العمر القابضة',
    title_en: 'Alomar Holding',
    desc_ar: 'استثمار برؤية أوسع، نقود الفرص نحو مستقبل أكثر تطورًا.',
    desc_en: 'Investment with a broader vision, creating opportunities for a more developed future.',
    primary_link: '/about',
    secondary_link: '/projects',
  },
  {
    id: 2,
    image: '/images/project_dama_lazurd.jpg',
    badge_ar: 'مشاريعنا',
    badge_en: 'Our Projects',
    title_ar: 'مجتمعات تصنع جودة الحياة',
    title_en: 'Communities that inspire quality of life',
    desc_ar: 'نطور وجهات سكنية متكاملة تواكب مستهدفات رؤية المملكة 2030.',
    desc_en: 'We develop integrated destinations aligned with Saudi Vision 2030.',
    primary_link: '/projects',
    secondary_link: '/contact',
  },
  {
    id: 3,
    image: '/images/project_commercial.jpg',
    badge_ar: 'استثماراتنا',
    badge_en: 'Our Investments',
    title_ar: 'بنية أعمال تحتضن المستقبل',
    title_en: 'Business infrastructure for tomorrow',
    desc_ar: 'أصول ومجمعات ذكية تدعم نمو القطاعات الوطنية والاستثمارية.',
    desc_en: 'Smart assets and developments supporting national economic growth.',
    primary_link: '/projects',
    secondary_link: '/contact',
  },
];

export const HeroSlider: React.FC<{ slides?: HeroSlide[] }> = ({ slides: cmsSlides }) => {
  const { locale, dir, content } = useLanguage();
  const slides = cmsSlides?.length ? cmsSlides : content.previewMode ? previewSlides : [];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = window.setInterval(() => setCurrent((value) => (value + 1) % slides.length), 6500);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  if (!slides.length) return null;

  const active = slides[current] || slides[0];
  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <section className="relative h-[720px] overflow-hidden bg-[#101E39] text-white lg:h-[900px]" aria-label="Homepage hero">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === current ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          aria-hidden={index !== current}
        >
          <Image src={slide.image} alt={locale === 'ar' ? slide.title_ar : slide.title_en} fill priority={index === 0} sizes="100vw" className="object-cover object-center" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,13,26,0.78)_0%,rgba(16,30,57,0.18)_58%,rgba(16,30,57,0.08)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#101E39]/85 to-transparent" />
        </div>
      ))}

      <div className="absolute left-5 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-3 lg:left-[72px] lg:flex">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => setCurrent(index)}
            className={`flex h-10 w-10 items-center justify-center rounded-full border text-xs transition-colors ${
              index === current ? 'border-white bg-[#B7913D] text-white' : 'border-white/35 text-white/70 hover:border-white'
            }`}
            aria-label={`${locale === 'ar' ? 'عرض الشريحة' : 'Show slide'} ${index + 1}`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <div className="relative z-10 mx-auto flex h-full max-w-[1216px] items-center px-5 sm:px-8 lg:px-0">
        <div className={`w-full max-w-[680px] space-y-6 ${dir === 'rtl' ? 'mr-auto text-right' : 'ml-auto text-left'}`}>
          <p className="text-sm font-bold text-[#D4AF37]">{locale === 'ar' ? active.badge_ar : active.badge_en}</p>
          <h1 className="text-5xl font-bold leading-[1.05] sm:text-6xl lg:text-7xl">
            {locale === 'ar' ? active.title_ar : active.title_en}
          </h1>
          <p className="max-w-[520px] text-base leading-8 text-white/85 sm:text-lg lg:ml-auto">
            {locale === 'ar' ? active.desc_ar : active.desc_en}
          </p>
          <Link
            href={localizedLink(active.primary_link, locale)}
            className="inline-flex h-[54px] items-center gap-3 rounded-sm bg-[#C5A265] px-7 text-sm font-bold text-[#101E39] transition-colors hover:bg-white"
          >
            <span>{locale === 'ar' ? 'اكتشف' : 'Discover'}</span>
            <ArrowIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="absolute bottom-20 left-5 z-20 hidden items-center gap-3 text-xs text-white/75 lg:left-[72px] lg:flex">
        <span>{locale === 'ar' ? 'مرّر للأسفل لاستكشاف المزيد' : 'Scroll to explore more'}</span>
        <span className="h-8 w-5 rounded-full border border-white/50" />
      </div>
    </section>
  );
};
