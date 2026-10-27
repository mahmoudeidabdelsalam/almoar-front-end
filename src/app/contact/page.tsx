import React from 'react';
import Image from 'next/image';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { ContactSection } from '@/components/sections/ContactSection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'تواصل معنا | العمر القابضة — علاقات المستثمرين وخدمة العملاء',
  description: 'تواصل مع فريق شركة العمر القابضة في الرياض. استفسارات المشاريع السكنية، الشراكات الاستثمارية، وخدمة العملاء.',
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-[#F8F9F4] pt-24">
        {/* Banner */}
        <div className="relative py-20 lg:py-28 bg-[#101E39] text-white overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <Image
              src="/images/hero_riyadh.jpg"
              alt="Contact Alomar Holding"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#B7913D]">
              قنوات التواصل المباشر
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              تواصل مع العمر القابضة
            </h1>
            <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              يسعدنا استقبال استفساراتكم ومناقشة الفرص الاستثمارية والشراكات الاستراتيجية.
            </p>
          </div>
        </div>

        {/* Full Form & Headquarters Details */}
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
