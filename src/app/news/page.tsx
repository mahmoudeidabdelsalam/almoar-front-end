import React from 'react';
import Image from 'next/image';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { NewsSection } from '@/components/sections/NewsSection';
import { wpClient } from '@/lib/wordpress/client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'المركز الإعلامي | العمر القابضة — الأخبار والبيانات الصحفية',
  description: 'تابع آخر أخبار شركة العمر القابضة، الإعلانات الرسمية، إطلاق المشاريع، والشراكات الاستثمارية.',
};

export default async function NewsPage() {
  const articles = await wpClient.getNews();

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#F8F9F4] pt-24">
        {/* Banner */}
        <div className="relative py-20 lg:py-28 bg-[#101E39] text-white overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <Image
              src="/images/hero_riyadh.jpg"
              alt="Media Center"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#B7913D]">
              المركز الإعلامي — أخبار وإعلانات
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              أحدث الأخبار والبيانات الصحفية
            </h1>
            <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              نافذتكم المباشرة للاطلاع على إنجازات المجموعة واتفاقياتها وشراكاتها الاستراتيجية.
            </p>
          </div>
        </div>

        {/* Articles List */}
        <NewsSection articles={articles} />
      </main>
      <Footer />
    </>
  );
}
