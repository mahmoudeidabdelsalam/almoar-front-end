import React from 'react';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import {
  AboutBoard,
  AboutCompanies,
  AboutHero,
  AboutNavigationLinks,
  AboutOverview,
  AboutPortfolio,
  AboutResponsibility,
  AboutStatistics,
  AboutStrategy,
} from '@/components/sections/AboutPageSections';
import { getPageMetadata } from '@/lib/wordpress/page-metadata';
import type { Metadata } from 'next';

export function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('about', {
    title: 'من نحن | العمر القابضة — مسيرة الريادة والاستثمار',
    description: 'تعرف على قصة تأسيس شركة العمر القابضة، ورؤيتنا ومهمتنا في قيادة الاستثمار العقاري والمؤسسي بالمملكة العربية السعودية.',
  });
}

export default async function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-ivory-50">
        <AboutHero />
        <AboutOverview />
        <AboutStatistics />
        <AboutStrategy />
        <AboutPortfolio />
        <AboutCompanies />
        <AboutResponsibility />
        <AboutBoard />
        <AboutNavigationLinks />
      </main>
      <Footer />
    </>
  );
}
