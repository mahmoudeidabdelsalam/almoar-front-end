'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { ChevronRight, ChevronLeft, ArrowRight, ArrowLeft } from 'lucide-react';
import type { HeroSlide } from '@/types';

const defaultSlides: HeroSlide[] = [
  {
    id: 1,
    image: '/images/hero_riyadh.jpg',
    badge_ar: 'العمر القابضة — الرياض',
    badge_en: 'Alomar Holding — Riyadh',
    title_ar: 'استثمار برؤية أوسع',
    title_en: 'Investment with a Broader Vision',
    desc_ar: 'نصنع قيمة اقتصادية مستدامة ونبني مجتمعات عصرية رائدة تواكب مستهدفات رؤية المملكة 2030 من خلال استثمارات نوعية وشراكات استراتيجية متكاملة.',
    desc_en: 'Pioneering institutional excellence and master-planned urban communities advancing Saudi Vision 2030 through strategic real estate and venture investments.',
    primary_link: '/sectors',
    secondary_link: '/projects',
  },
  {
    id: 2,
    image: '/images/project_dama_lazurd.jpg',
    badge_ar: 'مشاريع سكنية استثنائية — داما',
    badge_en: 'Flagship Residential Living — Dama',
    title_ar: 'مجتمعات تصنع جودة الحياة',
    title_en: 'Communities Inspiring Quality of Life',
    desc_ar: 'نطور وجهات سكنية متكاملة كـ "داما لازورد" بالخبر والخيّالة بجدة لترسيخ معايير الرفاهية والابتكار المعماري المستدام.',
    desc_en: 'Developing integrated living destinations such as Dama Lazurd in Khobar and Al-Khayala in Jeddah, elevating contemporary Saudi living standards.',
    primary_link: '/projects',
    secondary_link: '/contact',
  },
  {
    id: 3,
    image: '/images/project_commercial.jpg',
    badge_ar: 'الأصول والتطوير التجاري',
    badge_en: 'Commercial & Mixed-Use Assets',
    title_ar: 'بنية أعمال تحتضن المستقبل',
    title_en: 'Infrastructure Empowering Tomorrow',
    desc_ar: 'أبراج ومجمعات أعمال ذكية توفر مقرات حيوية تواكب النهضة الاستثمارية الكبرى في المملكة.',
    desc_en: 'Smart commercial towers and business hubs designed for leading enterprises driving national and regional transformation.',
    primary_link: '/companies',
    secondary_link: '/contact',
  },
];

export const HeroSlider: React.FC<{ slides?: HeroSlide[] }> = ({ slides: contentSlides }) => {
  const { locale, dir, t } = useLanguage();
  const slides = contentSlides?.length ? contentSlides : defaultSlides;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  const activeSlide = slides[current];
  const NextIcon = dir === 'rtl' ? ChevronLeft : ChevronRight;
  const PrevIcon = dir === 'rtl' ? ChevronRight : ChevronLeft;
  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <section className="relative min-h-[90vh] lg:min-h-screen flex items-center bg-[#101E39] text-white pt-24 pb-16 overflow-hidden">
      {/* Background Images with Crossfade */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-35 scale-100' : 'opacity-0 scale-105 pointer-events-none'
          }`}
          style={{ transitionProperty: 'opacity, transform' }}
        >
          <Image
            src={slide.image}
            alt={locale === 'ar' ? slide.title_ar : slide.title_en}
            fill
            className="object-cover object-center"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#101E39] via-[#101E39]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#101E39] via-[#101E39]/70 to-transparent" />
        </div>
      ))}

      {/* Decorative Gold & Navy Glow */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-[#B7913D]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#1B4332]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Typography & CTAs */}
          <div className="lg:col-span-8 space-y-6 lg:space-y-8 animate-in fade-in duration-700">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
              <span className="w-2 h-2 rounded-full bg-[#B7913D] animate-ping" />
              <span className="text-xs md:text-sm font-semibold tracking-wider text-[#B7913D]">
                {locale === 'ar' ? activeSlide.badge_ar : activeSlide.badge_en}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-white leading-[1.15]">
              {locale === 'ar' ? activeSlide.title_ar : activeSlide.title_en}
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg lg:text-xl text-white/80 max-w-2xl leading-relaxed">
              {locale === 'ar' ? activeSlide.desc_ar : activeSlide.desc_en}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href={activeSlide.primary_link}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full text-sm md:text-base font-bold text-[#101E39] gold-gradient-bg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <span>{t.hero.cta_sectors}</span>
                <ArrowIcon className="w-4 h-4" />
              </Link>

              <Link
                href={activeSlide.secondary_link}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full text-sm md:text-base font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all duration-300 hover:scale-105"
              >
                <span>{t.hero.cta_projects}</span>
              </Link>
            </div>
          </div>

          {/* Right Side: Visual Card Preview */}
          <div className="lg:col-span-4 hidden lg:block">
            <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl p-6 bg-gradient-to-b from-white/15 to-white/5 backdrop-blur-xl">
              <div className="relative h-56 rounded-xl overflow-hidden mb-5">
                <Image
                  src={activeSlide.image}
                  alt="Slide preview"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute bottom-3 right-3 text-xs font-bold text-white bg-[#B7913D] px-2.5 py-1 rounded-md">
                  0{activeSlide.id} / 0{slides.length}
                </span>
              </div>

              <div className="space-y-2">
                <h2 className="text-white font-bold text-lg">
                  {locale === 'ar' ? activeSlide.title_ar : activeSlide.title_en}
                </h2>
                <p className="text-white/70 text-xs line-clamp-2 leading-relaxed">
                  {locale === 'ar' ? activeSlide.desc_ar : activeSlide.desc_en}
                </p>
              </div>

              {/* Slider Controls */}
              <div className="flex items-center justify-between pt-5 mt-4 border-t border-white/10">
                <div className="flex items-center gap-1.5">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrent(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === current ? 'w-8 bg-[#B7913D]' : 'w-2 bg-white/30'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={prevSlide}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                    aria-label="Previous Slide"
                  >
                    <PrevIcon className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={nextSlide}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                    aria-label="Next Slide"
                  >
                    <NextIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
