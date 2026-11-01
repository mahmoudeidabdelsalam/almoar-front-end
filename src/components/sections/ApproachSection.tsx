'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export const ApproachSection: React.FC = () => {
  const revealRef = useScrollReveal<HTMLElement>();
  const { locale, dir, content } = useLanguage();
  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;
  const approach = content.homeAbout;

  if (!approach.title[locale] && !approach.descriptionOne[locale]) return null;

  return (
    <section ref={revealRef} data-scroll-reveal className="bg-white py-24 lg:h-[408px] lg:py-0">
      <div className="mx-auto flex h-full max-w-[1216px] items-center px-5 sm:px-8 lg:px-0">
        <div className="flex w-full flex-col justify-between gap-8 lg:flex-row lg:items-center">
          <div className="space-y-7">
            <h2 className="max-w-[760px] text-3xl font-bold leading-tight text-navy-900 sm:text-4xl lg:text-5xl">
              {approach.title[locale]}
            </h2>
            <p className="max-w-[760px] text-base leading-8 text-[#5A677B] lg:text-lg">
              {approach.descriptionOne[locale]}
            </p>
          </div>
          <Link
            href={`/${locale === 'ar' ? 'ar' : 'en'}/about`}
            className="btn btn--navy"
          >
            <span>{locale === 'ar' ? 'من نحن' : 'About Us'}</span>
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  );
};
