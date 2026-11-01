'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import type { HeroSlide } from '@/types';
import { localizedLink } from '@/lib/localized-link';
import { safeGetItem } from '@/lib/safe-storage';

type SlideDirection = 'next' | 'previous';
type SlideTransition = { from: number; to: number; direction: SlideDirection };

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
  const [transition, setTransition] = useState<SlideTransition | null>(null);
  const [focused, setFocused] = useState(false);
  const [pageVisible, setPageVisible] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const currentRef = useRef(0);
  const busyRef = useRef(false);
  const transitionTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => {
      const shouldReduceMotion = motionPreference.matches;
      setReducedMotion(shouldReduceMotion);
      if (!shouldReduceMotion) return;
      if (transitionTimerRef.current !== null) window.clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
      busyRef.current = false;
      setTransition(null);
    };
    const updatePageVisibility = () => setPageVisible(!document.hidden);
    updateMotionPreference();
    updatePageVisibility();
    motionPreference.addEventListener('change', updateMotionPreference);
    document.addEventListener('visibilitychange', updatePageVisibility);
    return () => {
      motionPreference.removeEventListener('change', updateMotionPreference);
      document.removeEventListener('visibilitychange', updatePageVisibility);
    };
  }, []);

  useEffect(() => {
    const markReady = () => setHeroReady(true);
    if (safeGetItem('session', 'alomar_splash_seen')) markReady();
    window.addEventListener('alomar-splash-change', markReady);
    return () => window.removeEventListener('alomar-splash-change', markReady);
  }, []);

  const navigateToSlide = useCallback((requestedIndex: number, requestedDirection?: SlideDirection) => {
    if (slides.length < 2 || busyRef.current) return;
    const from = currentRef.current;
    const to = (requestedIndex + slides.length) % slides.length;
    if (to === from) return;
    const direction = requestedDirection || (to > from ? 'next' : 'previous');
    currentRef.current = to;
    setCurrent(to);
    if (reducedMotion) return;

    busyRef.current = true;
    setTransition({ from, to, direction });
    if (transitionTimerRef.current !== null) window.clearTimeout(transitionTimerRef.current);
    transitionTimerRef.current = window.setTimeout(() => {
      setTransition(null);
      busyRef.current = false;
      transitionTimerRef.current = null;
    }, 980);
  }, [reducedMotion, slides.length]);

  useEffect(() => () => {
    if (transitionTimerRef.current !== null) window.clearTimeout(transitionTimerRef.current);
  }, []);

  useEffect(() => {
    if (slides.length < 2 || focused || reducedMotion || !pageVisible || !heroReady) return;
    const timer = window.setInterval(() => navigateToSlide((current + 1) % slides.length, 'next'), 5000);
    return () => window.clearInterval(timer);
  }, [current, focused, heroReady, navigateToSlide, pageVisible, reducedMotion, slides.length]);

  if (!slides.length) return null;

  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;
  const isPaused = focused || reducedMotion || !pageVisible || !heroReady;

  return (
    <section
      className={`hero-slider relative h-[720px] overflow-hidden bg-navy-900 text-white lg:h-[900px] ${heroReady ? 'is-ready' : ''} ${isPaused ? 'is-paused' : ''}`}
      aria-label="Homepage hero"
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
    >
      {slides.map((slide, index) => {
        const isActive = index === current;
        const isEntering = transition?.to === index;
        const isExiting = transition?.from === index;
        const slideState = isEntering
          ? `hero-slide--enter-${transition.direction}`
          : isExiting
            ? `hero-slide--exit-${transition.direction}`
            : isActive ? 'hero-slide--active' : 'hero-slide--inactive';

        return (
          <div key={slide.id} className={`hero-slide ${slideState}`} aria-hidden={!isActive}>
            <div className="hero-slide__bg absolute inset-[-2%]">
              <Image src={slide.image} alt={locale === 'ar' ? slide.title_ar : slide.title_en} fill priority={index === 0} sizes="100vw" className="object-cover object-center" />
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,13,26,0.78)_0%,rgba(16,30,57,0.18)_58%,rgba(16,30,57,0.08)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-navy-900/85 to-transparent" />

            <div className="relative z-10 mx-auto flex h-full max-w-[1216px] items-center px-5 sm:px-8 lg:px-12">
              <div className="hero-slide__content me-auto w-full max-w-[680px] space-y-6 text-start">
                <p className="hero-anim text-sm font-bold text-gold-500">{locale === 'ar' ? slide.badge_ar : slide.badge_en}</p>
                {isActive ? (
                  <h1 className="hero-anim text-5xl font-bold leading-[1.05] sm:text-6xl lg:text-7xl">
                    {locale === 'ar' ? slide.title_ar : slide.title_en}
                  </h1>
                ) : (
                  <h2 className="hero-anim text-5xl font-bold leading-[1.05] sm:text-6xl lg:text-7xl">
                    {locale === 'ar' ? slide.title_ar : slide.title_en}
                  </h2>
                )}
                <p className="hero-anim me-auto max-w-[520px] text-base leading-8 text-white/85 sm:text-lg">
                  {locale === 'ar' ? slide.desc_ar : slide.desc_en}
                </p>
                <Link href={localizedLink(slide.primary_link, locale)} className="hero-anim btn btn--gold" tabIndex={isActive ? 0 : -1}>
                  <span>{locale === 'ar' ? 'اكتشف' : 'Discover'}</span>
                  <ArrowIcon />
                </Link>
              </div>
            </div>
          </div>
        );
      })}

      <div className={`hero-slider__controls absolute ${dir === 'rtl' ? 'end-5 lg:end-[72px]' : 'start-5 lg:start-[72px]'} top-1/2 z-20 hidden -translate-y-1/2 flex-col items-center gap-6 lg:flex`}>
        {slides.map((slide, index) => (
          <button
            key={`${slide.id}-${isPaused}`}
            type="button"
            onClick={() => navigateToSlide(index)}
            className="hero-slide-control"
            aria-label={`${locale === 'ar' ? 'عرض الشريحة' : 'Show slide'} ${index + 1}`}
            aria-current={index === current ? 'true' : undefined}
          >
            <span>{index + 1}</span>
            {index === current && (
              <svg className="hero-slide-control__progress" viewBox="0 0 64 64" aria-hidden="true">
                <circle cx="32" cy="32" r="30" />
              </svg>
            )}
          </button>
        ))}
      </div>
      <div className={`hero-slider__controls hero-slider__progress absolute bottom-20 ${dir === 'rtl' ? 'start-5 lg:start-[72px]' : 'end-5 lg:end-[72px]'} z-20 hidden text-white/75 lg:flex`} dir={dir} role="group" aria-label={locale === 'ar' ? `الشريحة ${current + 1} من ${slides.length}` : `Slide ${current + 1} of ${slides.length}`}>
        <span className="hero-slider__progress-items" dir="ltr">
          <span className="hero-slider__total">{String(slides.length).padStart(2, '0')}</span>
          <span className="hero-slider__progress-track" aria-hidden="true">
            <i key={`${current}-${isPaused}`} />
          </span>
          <span className="hero-slider__current">{String(current + 1).padStart(2, '0')}</span>
        </span>
      </div>
      <div className={`hero-slider__controls hero-slider__scroll absolute bottom-20 ${dir === 'rtl' ? 'end-5 lg:end-[72px] flex-row-reverse' : 'start-5 lg:start-[72px]'} z-20 hidden items-center gap-3 text-xs text-white/75 lg:flex`}>
        <span>{locale === 'ar' ? 'مرّر للأسفل لاستكشاف المزيد' : 'Scroll to explore more'}</span>
        <span className="hero-scroll-cue" aria-hidden="true"><i /></span>
      </div>
    </section>
  );
};
