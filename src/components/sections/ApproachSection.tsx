'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const ApproachSection: React.FC = () => {
  const { locale, dir, content } = useLanguage();
  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;
  const approach = content.homeAbout;

  if (!approach.title[locale] && !approach.descriptionOne[locale]) return null;

  return (
    <section className="bg-[#F8F9F4] py-24 lg:h-[408px] lg:py-0">
      <div className="mx-auto flex h-full max-w-[1216px] items-center px-5 sm:px-8 lg:px-0">
        <div className="w-full gap-8 flex flex-row lg:items-center justify-between">
          <div className="space-y-7">
            <h2 className="max-w-[760px] text-3xl font-bold leading-tight text-[#101E39] sm:text-4xl lg:text-5xl">
              {approach.title[locale]}
            </h2>
            <p className="max-w-[760px] text-base leading-8 text-[#5A677B] lg:text-lg">
              {approach.descriptionOne[locale]}
            </p>
          </div>
          <Link
            href={`/${locale === 'ar' ? 'ar' : 'en'}/about`}
            className="inline-flex h-[54px] w-fit items-center justify-center gap-3 rounded-sm bg-[#101E39] px-7 text-sm font-bold text-white transition-colors hover:bg-[#B7913D]"
          >
            <span>{locale === 'ar' ? 'من نحن' : 'About Us'}</span>
            <ArrowIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
