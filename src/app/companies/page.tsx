import React from 'react';
import Image from 'next/image';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { wpClient } from '@/lib/wordpress/client';
import { ExternalLink, Calendar, Building, Layers } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'شركاتنا التابعة | العمر القابضة — منظومة استثمارية متكاملة',
  description: 'تعرف على الشركات التابعة لمجموعة العمر القابضة، وفي مقدمتها شركة داما للتطوير العقاري والعمر فنشرز وإدارة الأصول.',
};

export default async function CompaniesPage() {
  const companies = await wpClient.getCompanies();

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#F8F9F4] pt-24">
        {/* Banner */}
        <div className="relative py-20 lg:py-28 bg-[#101E39] text-white overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <Image
              src="/images/hero_riyadh.jpg"
              alt="Alomar Companies"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#B7913D]">
              المنظومة المؤسسية
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              شركاتنا التابعة والزميلة
            </h1>
            <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              كيانات تشغيلية واستثمارية متخصصة تقود التميز في مختلف القطاعات الحيوية.
            </p>
          </div>
        </div>

        {/* Companies Grid */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {companies.map((company) => (
              <div
                key={company.id}
                className="bg-white rounded-3xl p-8 shadow-xl border border-[#101E39]/10 flex flex-col justify-between luxury-card relative group"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="relative w-16 h-16 p-3 rounded-2xl bg-[#F8F9F4] border border-[#101E39]/10 shadow-sm">
                      <Image
                        src={company.logo || '/branding/alomar_logo_mark.png'}
                        alt={company.name.ar}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    {company.year && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-[#5A677B] bg-[#F8F9F4]">
                        <Calendar className="w-3.5 h-3.5 text-[#B7913D]" />
                        <span>تأسست عام {company.year}</span>
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-[#101E39] group-hover:text-[#B7913D] transition-colors">
                      {company.name.ar}
                    </h2>
                    <p className="text-xs font-semibold text-[#B7913D]">
                      {company.tagline.ar}
                    </p>
                  </div>

                  <p className="text-sm text-[#5A677B] leading-relaxed">
                    {company.description.ar}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#101E39]/10 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#101E39]">
                    كيان تابع للمجموعة
                  </span>
                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B7913D] hover:underline"
                    >
                      <span>زيارة الموقع</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
