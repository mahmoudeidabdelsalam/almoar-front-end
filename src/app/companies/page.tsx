import React from 'react';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { wpClient } from '@/lib/wordpress/client';
import { PageBanner } from '@/components/sections/PageBanner';
import { CompanyDirectory } from '@/components/sections/CompanyDirectory';
import { getPageMetadata } from '@/lib/wordpress/page-metadata';
import type { Metadata } from 'next';

export function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('companies', {
    title: 'شركاتنا التابعة | العمر القابضة — منظومة استثمارية متكاملة',
    description: 'تعرف على الشركات التابعة لمجموعة العمر القابضة، وفي مقدمتها شركة داما للتطوير العقاري والعمر فنشرز وإدارة الأصول.',
  });
}

export default async function CompaniesPage() {
  const { companies } = await wpClient.getSiteContent();

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#F8F9F4] pt-24">
        <PageBanner
          pageKey="companies"
          imageFallback="/images/hero_riyadh.jpg"
          imageAlt="Alomar Companies"
          badgeFallback="المنظومة المؤسسية"
          titleFallback="شركاتنا التابعة والزميلة"
          descriptionFallback="كيانات تشغيلية واستثمارية متخصصة تقود التميز في مختلف القطاعات الحيوية."
        />

        <CompanyDirectory companies={companies} />
      </main>
      <Footer />
    </>
  );
}
