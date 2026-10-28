import React from 'react';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { LeadershipSection } from '@/components/sections/LeadershipSection';
import { Vision2030Banner } from '@/components/sections/Vision2030Banner';
import { PageBanner } from '@/components/sections/PageBanner';
import { ChairmanMessage, AboutPrinciples } from '@/components/sections/AboutEditorial';
import { wpClient } from '@/lib/wordpress/client';
import { getPageMetadata } from '@/lib/wordpress/page-metadata';
import type { Metadata } from 'next';

export function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('about', {
    title: 'من نحن | العمر القابضة — مسيرة الريادة والاستثمار',
    description: 'تعرف على قصة تأسيس شركة العمر القابضة، ورؤيتنا ومهمتنا في قيادة الاستثمار العقاري والمؤسسي بالمملكة العربية السعودية.',
  });
}

export default async function AboutPage() {
  const team = await wpClient.getTeam();

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#F8F9F4] pt-24">
        <PageBanner
          pageKey="about"
          imageFallback="/images/hero_riyadh.jpg"
          imageAlt="Alomar Holding Headquarters"
          badgeFallback="من نحن — مسيرة الريادة والنمو"
          titleFallback="نبني الأثر ونستثمر برؤية أوسع"
          descriptionFallback="تاريخ عريق من الإنجازات الاستثمارية والتطويرية يسهم في ازدهار الاقتصاد الوطني ومواكبة تطلعات المستقبل."
        />

        <ChairmanMessage />
        <AboutPrinciples />

        {/* Board of Directors Section */}
        <LeadershipSection members={team} />

        {/* Vision 2030 Banner */}
        <Vision2030Banner />
      </main>
      <Footer />
    </>
  );
}
