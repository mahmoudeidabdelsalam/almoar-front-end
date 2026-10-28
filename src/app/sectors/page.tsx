import React from 'react';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { wpClient } from '@/lib/wordpress/client';
import { PageBanner } from '@/components/sections/PageBanner';
import { SectorDirectory } from '@/components/sections/SectorDirectory';
import { getPageMetadata } from '@/lib/wordpress/page-metadata';
import type { Metadata } from 'next';

export function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('sectors', {
    title: 'قطاعاتنا الاستثمارية | العمر القابضة — تنوع استراتيجي ونمو مستدام',
    description: 'استكشف قطاعات أعمال مجموعة العمر القابضة: التطوير العقاري، الاستثمار الجريء، الأصول التجارية، وإدارة الصناديق الاستثمارية.',
  });
}

export default async function SectorsPage() {
  const { sectors } = await wpClient.getSiteContent();

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#F8F9F4] pt-24">
        <PageBanner
          pageKey="sectors"
          imageFallback="/images/project_commercial.jpg"
          imageAlt="Alomar Sectors"
          badgeFallback="مجالات الأعمال — تنوع وحصافة"
          titleFallback="قطاعاتنا الاستثمارية الرائدة"
          descriptionFallback="توزيع استثماري متوازن ومدروس يحقق أعلى معدلات العائد ويعزز التنمية الاقتصادية في المملكة."
        />

        <SectorDirectory sectors={sectors} />
      </main>
      <Footer />
    </>
  );
}
