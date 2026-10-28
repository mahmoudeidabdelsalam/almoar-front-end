import React from 'react';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { NewsSection } from '@/components/sections/NewsSection';
import { PageBanner } from '@/components/sections/PageBanner';
import { wpClient } from '@/lib/wordpress/client';
import { getPageMetadata } from '@/lib/wordpress/page-metadata';
import type { Metadata } from 'next';

export function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('news', {
    title: 'المركز الإعلامي | العمر القابضة — الأخبار والبيانات الصحفية',
    description: 'تابع آخر أخبار شركة العمر القابضة، الإعلانات الرسمية، إطلاق المشاريع، والشراكات الاستثمارية.',
  });
}

export default async function NewsPage() {
  const articles = await wpClient.getNews();

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#F8F9F4] pt-24">
        <PageBanner
          pageKey="news"
          imageFallback="/images/hero_riyadh.jpg"
          imageAlt="Media Center"
          badgeFallback="المركز الإعلامي — أخبار وإعلانات"
          titleFallback="أحدث الأخبار والبيانات الصحفية"
          descriptionFallback="نافذتكم المباشرة للاطلاع على إنجازات المجموعة واتفاقياتها وشراكاتها الاستراتيجية."
        />

        {/* Articles List */}
        <NewsSection articles={articles} />
      </main>
      <Footer />
    </>
  );
}
