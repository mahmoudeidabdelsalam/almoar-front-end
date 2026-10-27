import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { wpClient } from '@/lib/wordpress/client';
import { Building2, TrendingUp, Briefcase, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'قطاعاتنا الاستثمارية | العمر القابضة — تنوع استراتيجي ونمو مستدام',
  description: 'استكشف قطاعات أعمال مجموعة العمر القابضة: التطوير العقاري، الاستثمار الجريء، الأصول التجارية، وإدارة الصناديق الاستثمارية.',
};

const iconMap: Record<string, React.ElementType> = {
  building: Building2,
  'trending-up': TrendingUp,
  briefcase: Briefcase,
  'shield-check': ShieldCheck,
};

export default async function SectorsPage() {
  const sectors = await wpClient.getSectors();

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#F8F9F4] pt-24">
        {/* Banner */}
        <div className="relative py-20 lg:py-28 bg-[#101E39] text-white overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <Image
              src="/images/project_commercial.jpg"
              alt="Alomar Sectors"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#B7913D]">
              مجالات الأعمال — تنوع وحصافة
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              قطاعاتنا الاستثمارية الرائدة
            </h1>
            <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              توزيع استثماري متوازن ومدروس يحقق أعلى معدلات العائد ويعزز التنمية الاقتصادية في المملكة.
            </p>
          </div>
        </div>

        {/* Sectors List */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {sectors.map((sector, index) => {
            const Icon = iconMap[sector.icon] || Building2;
            const isReversed = index % 2 === 1;
            return (
              <div
                key={sector.id}
                id={sector.slug}
                className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-[#101E39]/10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center scroll-mt-28"
              >
                {/* Visual Image */}
                <div className={`lg:col-span-6 relative ${isReversed ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div className="relative h-80 sm:h-[400px] rounded-2xl overflow-hidden shadow-lg border border-[#101E39]/10">
                    <Image
                      src={sector.image || '/images/project_dama_lazurd.jpg'}
                      alt={sector.title.ar}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#101E39]/60 via-transparent to-transparent" />
                  </div>
                </div>

                {/* Details */}
                <div className={`lg:col-span-6 space-y-6 ${isReversed ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-[#101E39] text-[#B7913D]">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#B7913D]">
                      قطاع استراتيجي #{index + 1}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#101E39] tracking-tight">
                    {sector.title.ar}
                  </h2>

                  <p className="text-sm sm:text-base text-[#5A677B] leading-relaxed">
                    {sector.summary.ar}
                  </p>

                  {/* Stats highlights */}
                  {sector.stats && (
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      {sector.stats.map((st, i) => (
                        <div key={i} className="p-4 rounded-xl bg-[#F8F9F4] border border-[#101E39]/10">
                          <span className="text-xs text-[#5A677B] block mb-1">{st.label.ar}</span>
                          <span className="text-xl font-black text-[#101E39]">{st.value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-2">
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#101E39] hover:text-[#B7913D] transition-colors"
                    >
                      <span>استفسر عن فرص الاستثمار في هذا القطاع</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </main>
      <Footer />
    </>
  );
}
