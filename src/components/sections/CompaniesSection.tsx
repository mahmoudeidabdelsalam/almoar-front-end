'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import type { LocalizedString, Project } from '@/types';
import { DirectionalArrow } from '@/components/ui/DirectionalArrow';

interface CompaniesProps {
  projects: Project[];
}

export const CompaniesSection: React.FC<CompaniesProps> = ({ projects }) => {
  const { locale, dir, content } = useLanguage();
  const otherLocale = locale === 'ar' ? 'en' : 'ar';
  const localized = (value?: LocalizedString) =>
    value?.[locale]?.trim() || value?.[otherLocale]?.trim() || '';
  const localizedProjects = projects.filter((project) => localized(project.title));
  const hasProjectStats = localizedProjects.some((item) => {
    const band = item.statsBand;
    return Boolean(
      localized(band?.tag)
      || localized(band?.headline)
      || band?.items.some((stat) => localized(stat.head) || localized(stat.text)),
    );
  });
  const minimumStageHeight = hasProjectStats ? 900 : 720;
  const [active, setActive] = useState(0);
  const [outgoingProjectIndex, setOutgoingProjectIndex] = useState<number | null>(null);
  const [stageHeight, setStageHeight] = useState(960);
  const [reducedMotion, setReducedMotion] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const progressElementRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const progressValueRef = useRef(0);
  const activeProjectRef = useRef(0);
  const outgoingTimerRef = useRef<number | null>(null);

  const setActiveProject = useCallback((nextIndex: number) => {
    if (activeProjectRef.current === nextIndex) return;

    const previousIndex = activeProjectRef.current;
    activeProjectRef.current = nextIndex;
    setOutgoingProjectIndex(previousIndex);
    setActive(nextIndex);

    if (outgoingTimerRef.current !== null) window.clearTimeout(outgoingTimerRef.current);
    outgoingTimerRef.current = window.setTimeout(() => {
      setOutgoingProjectIndex(null);
      outgoingTimerRef.current = null;
    }, 700);
  }, []);

  useEffect(() => () => {
    if (outgoingTimerRef.current !== null) window.clearTimeout(outgoingTimerRef.current);
  }, []);

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => setReducedMotion(motionPreference.matches);
    const updateStageHeight = () => setStageHeight(Math.max(window.innerHeight, minimumStageHeight));

    updateMotionPreference();
    updateStageHeight();
    motionPreference.addEventListener('change', updateMotionPreference);
    window.addEventListener('resize', updateStageHeight, { passive: true });

    return () => {
      motionPreference.removeEventListener('change', updateMotionPreference);
      window.removeEventListener('resize', updateStageHeight);
    };
  }, [minimumStageHeight]);

  useEffect(() => {
    if (reducedMotion || localizedProjects.length < 2) return;

    let frame = 0;
    const updateScrollProgress = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = 0;
        const section = sectionRef.current;
        const stage = stageRef.current;
        if (!section || !stage) return;

        const scrollDistance = section.offsetHeight - stage.offsetHeight;
        const progress = scrollDistance > 0
          ? Math.min(1, Math.max(0, -section.getBoundingClientRect().top / scrollDistance))
          : 0;
        if (progress === progressValueRef.current) return;
        progressValueRef.current = progress;
        progressFillRef.current?.style.setProperty('--scroll-progress', String(progress));
        progressElementRef.current?.setAttribute('aria-valuenow', String(Math.round(progress * 100)));
        setActiveProject(Math.min(
          localizedProjects.length - 1,
          Math.floor(progress * localizedProjects.length),
        ));
      });
    };

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('resize', updateScrollProgress, { passive: true });
    updateScrollProgress();

    return () => {
      window.removeEventListener('scroll', updateScrollProgress);
      window.removeEventListener('resize', updateScrollProgress);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [localizedProjects.length, reducedMotion, setActiveProject, stageHeight]);

  const goToSlide = useCallback((index: number) => {
    const nextIndex = Math.min(localizedProjects.length - 1, Math.max(0, index));
    if (reducedMotion || localizedProjects.length < 2) {
      setActiveProject(nextIndex);
      return;
    }

    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    const scrollDistance = section.offsetHeight - stage.offsetHeight;
    const progress = (nextIndex + 0.5) / localizedProjects.length;
    const top = window.scrollY + section.getBoundingClientRect().top + scrollDistance * progress;
    window.scrollTo({ top, behavior: 'smooth' });
  }, [localizedProjects.length, reducedMotion, setActiveProject]);

  if (!localizedProjects.length && !content.previewMode) return null;
  if (!localizedProjects.length) return null;

  const activeIndex = Math.min(active, localizedProjects.length - 1);
  const project = localizedProjects[activeIndex];
  const outgoingProject = outgoingProjectIndex === null
    ? null
    : localizedProjects[outgoingProjectIndex];
  const projectStats = project.statsBand;
  const statsTag = localized(projectStats?.tag);
  const statsHeadline = localized(projectStats?.headline);
  const statsItems = (projectStats?.items || []).filter((item) =>
    localized(item.head) || localized(item.text),
  );
  const showStats = Boolean(statsTag || statsHeadline || statsItems.length);
  const visibleProgress = reducedMotion
    ? (activeIndex + 1) / localizedProjects.length
    : localizedProjects.length > 1 ? activeIndex / localizedProjects.length : 0;
  const sectionHeight = stageHeight * (localizedProjects.length + 1);
  const scrollEnabled = !reducedMotion && localizedProjects.length > 1;

  return (
    <section
      ref={sectionRef}
      className={`homepage-projects-track relative bg-navy-900 text-white ${scrollEnabled ? '' : 'min-h-[720px]'}`}
      style={scrollEnabled ? { height: `${sectionHeight}px` } : undefined}
    >
      <div
        ref={stageRef}
        className={`homepage-projects-stage relative isolate overflow-hidden bg-navy-900 ${scrollEnabled ? 'sticky top-0' : ''}`}
        style={{
          height: scrollEnabled ? `${stageHeight}px` : 'auto',
          minHeight: `${minimumStageHeight}px`,
        }}
      >
        {outgoingProject?.image && (
          <Image
            key={`outgoing-${outgoingProject.id}`}
            src={outgoingProject.image}
            alt=""
            fill
            sizes="100vw"
            aria-hidden="true"
            className="project-image-fade-out object-cover object-center"
          />
        )}
        {project.image && (
          <Image
            key={project.id}
            src={project.image}
            alt={localized(project.title)}
            fill
            sizes="100vw"
            priority={false}
            className={`${outgoingProject ? 'project-image-fade-in' : 'animate-project-slide'} object-cover object-center`}
          />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,13,26,0.58)_0%,rgba(16,30,57,0.50)_45%,rgba(16,30,57,0.78)_100%)]" />

        <div
          ref={progressElementRef}
          className="absolute inset-x-0 top-0 z-20 h-1 bg-white/20"
          role="progressbar"
          aria-label={locale === 'ar' ? 'تقدم شرائح المشاريع' : 'Project slider progress'}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(visibleProgress * 100)}
        >
          <div
            ref={progressFillRef}
            className="project-scroll-progress h-full bg-gold-200 transition-transform duration-300 motion-reduce:transition-none"
            style={{
              transformOrigin: dir === 'rtl' ? 'right' : 'left',
              ...(reducedMotion ? { transform: `scaleX(${visibleProgress})` } : {}),
            }}
          />
        </div>

        <div className="relative z-10 mx-auto flex h-full max-w-[1216px] flex-col px-5 py-10 sm:px-8 sm:py-12 lg:px-0 lg:py-[96px]">
          <div className="grid grid-cols-2 border-b border-white/25 md:grid-cols-4">
            {localizedProjects.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => goToSlide(index)}
                aria-pressed={index === activeIndex}
                className={`border-b border-white/25 px-2 py-3 text-center text-xs font-bold transition-colors md:text-sm ${
                  index === activeIndex ? 'text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                {localized(item.title)}
              </button>
            ))}
          </div>

          <div key={project.id} className="animate-project-slide mt-8 flex min-h-0 flex-1 flex-col items-start justify-between gap-5 lg:mt-12">
            {localized({ ar: project.location, en: project.location_en || project.location }) && (
              <span className="block text-gold-200">
                {localized({ ar: project.location, en: project.location_en || project.location })}
              </span>
            )}
            <div className={`space-y-3 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
              <h2 className="max-w-[720px] text-4xl font-normal leading-tight sm:text-5xl lg:text-7xl">
                {localized(project.title)}
              </h2>
              <p className="max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
                {localized(project.excerpt) || localized(project.content)}
              </p>
            </div>

            <div className="mt-2 flex items-center gap-3">
              <span className="text-2xl font-bold text-white">{String(activeIndex + 1).padStart(2, '0')}</span>
              <span className="text-sm text-white/60">/ {String(localizedProjects.length).padStart(2, '0')}</span>
              <button
                type="button"
                onClick={() => goToSlide(Math.min(activeIndex + 1, localizedProjects.length - 1))}
                disabled={activeIndex === localizedProjects.length - 1}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/50 transition-colors hover:bg-white hover:text-navy-900 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label={locale === 'ar' ? 'المشروع التالي' : 'Next project'}
              >
                <DirectionalArrow direction="next" dir={dir} className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => goToSlide(Math.max(activeIndex - 1, 0))}
                disabled={activeIndex === 0}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/50 transition-colors hover:bg-white hover:text-navy-900 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label={locale === 'ar' ? 'المشروع السابق' : 'Previous project'}
              >
                <DirectionalArrow direction="previous" dir={dir} className="h-4 w-4" />
              </button>
            </div>
          </div>

          <Link
            href={`/${locale}/projects/${project.slug}`}
            className="mt-6 block rounded-sm border border-white/10 bg-navy-900/55 p-5 backdrop-blur-md transition-colors hover:border-white/30 sm:p-6 lg:mt-8 lg:px-10 lg:py-8"
          >
            <span className="sr-only">
              {locale === 'ar' ? 'تفاصيل المشروع: ' : 'Project details: '}
              {localized(project.title)}
            </span>
            {showStats && (
              <>
                {(statsTag || statsHeadline) && (
                  <div className="mb-4 space-y-1">
                    {statsTag && <p className="text-xs font-bold uppercase tracking-wider text-gold-200">{statsTag}</p>}
                    {statsHeadline && <h3 className="text-lg font-bold text-white">{statsHeadline}</h3>}
                  </div>
                )}
                {statsItems.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    {statsItems.map((item, index) => {
                      const head = localized(item.head);
                      const text = localized(item.text);
                      return (
                        <div key={`${head}-${index}`} className="space-y-1 border-s border-white/20 ps-4 first:border-0 first:ps-0">
                          {head && <p className="text-2xl font-bold text-white">{head}</p>}
                          {text && <p className="text-base leading-5 text-white/70 sm:text-xl">{text}</p>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </Link>
        </div>
      </div>
    </section>
  );
};
