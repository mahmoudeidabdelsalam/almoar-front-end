import React from 'react';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { ContactSection } from '@/components/sections/ContactSection';
import { PageBanner } from '@/components/sections/PageBanner';
import { wpClient } from '@/lib/wordpress/client';
import { getPageMetadata } from '@/lib/wordpress/page-metadata';
import type { Metadata } from 'next';

export function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('contact', {
    title: 'تواصل معنا | العمر القابضة — علاقات المستثمرين وخدمة العملاء',
    description: 'تواصل مع فريق شركة العمر القابضة في الرياض. استفسارات المشاريع السكنية، الشراكات الاستثمارية، وخدمة العملاء.',
  });
}

export default async function ContactPage() {
  const { sectors } = await wpClient.getSiteContent();

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#F8F9F4] pt-24">
        <PageBanner
          pageKey="contact"
          imageFallback="/images/hero_riyadh.jpg"
          imageAlt="Contact Alomar Holding"
          badgeFallback="قنوات التواصل المباشر"
          titleFallback="تواصل مع العمر القابضة"
          descriptionFallback="يسعدنا استقبال استفساراتكم ومناقشة الفرص الاستثمارية والشراكات الاستراتيجية."
        />

        {/* Full Form & Headquarters Details */}
        <ContactSection sectors={sectors} />
      </main>
      <Footer />
    </>
  );
}
