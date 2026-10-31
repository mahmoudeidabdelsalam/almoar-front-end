import React from 'react';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { ContactSection } from '@/components/sections/ContactSection';
import { wpClient } from '@/lib/wordpress/client';
import { getPageMetadata } from '@/lib/wordpress/page-metadata';
import { getGravityFormDefinition } from '@/lib/wordpress/gravity-forms';
import type { Metadata } from 'next';

export function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('contact', {
    title: 'تواصل معنا | العمر القابضة — علاقات المستثمرين وخدمة العملاء',
    description: 'تواصل مع فريق شركة العمر القابضة في الرياض. استفسارات المشاريع السكنية، الشراكات الاستثمارية، وخدمة العملاء.',
  });
}

async function loadContactForm() {
  try {
    return await getGravityFormDefinition(1);
  } catch (error) {
    console.error('[WordPress Gravity Forms] Contact form could not be loaded.', error);
    return null;
  }
}

export default async function ContactPage() {
  const [pageContent, form] = await Promise.all([
    wpClient.getContactPageContent(),
    loadContactForm(),
  ]);

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#F8F7F2] pt-[72px]">
        <ContactSection pageContent={pageContent} form={form} />
      </main>
      <Footer />
    </>
  );
}
