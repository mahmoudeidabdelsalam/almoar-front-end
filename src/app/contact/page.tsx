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
  const pageContent = await wpClient.getContactPageContent();

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#F8F9F4] pt-24">
        <PageBanner
          pageKey="contact"
          imageFallback={pageContent?.bannerImage || "/images/hero_riyadh.jpg"}
          imageAlt="Contact Alomar Holding"
          badgeFallback={pageContent?.badge.ar || "قنوات التواصل المباشر"}
          titleFallback={pageContent?.title.ar || "تواصل مع العمر القابضة"}
          descriptionFallback={pageContent?.description.ar || "يسعدنا استقبال استفساراتكم ومناقشة الفرص الاستثمارية والشراكات الاستراتيجية."}
          contactContent={pageContent}
        />

        {/* Full Form & Headquarters Details */}
        <ContactSection pageContent={pageContent} />
      </main>
      <Footer />
    </>
  );
}
