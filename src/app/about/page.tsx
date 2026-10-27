import React from 'react';
import Image from 'next/image';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { LeadershipSection } from '@/components/sections/LeadershipSection';
import { Vision2030Banner } from '@/components/sections/Vision2030Banner';
import { wpClient } from '@/lib/wordpress/client';
import { Compass, Sparkles, Target, CheckCircle2 } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'من نحن | العمر القابضة — مسيرة الريادة والاستثمار',
  description: 'تعرف على قصة تأسيس شركة العمر القابضة، ورؤيتنا ومهمتنا في قيادة الاستثمار العقاري والمؤسسي بالمملكة العربية السعودية.',
};

export default async function AboutPage() {
  const team = await wpClient.getTeam();

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#F8F9F4] pt-24">
        {/* Page Hero Banner */}
        <div className="relative py-20 lg:py-28 bg-[#101E39] text-white overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <Image
              src="/images/hero_riyadh.jpg"
              alt="Alomar Holding Headquarters"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#B7913D]">
              من نحن — مسيرة الريادة والنمو
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              نبني الأثر ونستثمر برؤية أوسع
            </h1>
            <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              تاريخ عريق من الإنجازات الاستثمارية والتطويرية يسهم في ازدهار الاقتصاد الوطني ومواكبة تطلعات المستقبل.
            </p>
          </div>
        </div>

        {/* Chairman's Message Section */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 lg:p-16 shadow-xl border border-[#101E39]/10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 relative">
              <div className="relative h-96 sm:h-[450px] rounded-2xl overflow-hidden shadow-lg border-2 border-[#101E39]/10">
                <Image
                  src="/images/board_chairman.jpg"
                  alt="Chairman Portrait"
                  fill
                  className="object-cover object-top"
                />
              </div>
              <div className="absolute -bottom-4 right-4 bg-[#101E39] text-white px-5 py-3 rounded-xl border border-white/10 shadow-lg">
                <span className="text-xs text-[#B7913D] font-bold block">رئيس مجلس الإدارة</span>
                <span className="text-sm font-bold">عبد العزيز بن محمد العمر</span>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#B7913D] block">
                رسالة رئيس مجلس الإدارة
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#101E39] leading-snug">
                &ldquo;عهد من التميز وشغف بصناعة مستقبل يليق بطموحات وطننا المعطاء&rdquo;
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-[#5A677B] leading-relaxed">
                <p>
                  منذ انطلاقة مجموعة العمر القابضة، وضعنا نصب أعيننا مبدأً ثابتاً: أن الاستثمار الحقيقي هو الذي يتجاوز العوائد المالية إلى بناء قيمة مستدامة للإنسان والمجتمع.
                </p>
                <p>
                  وفي ظل النهضة التاريخية والتحول الاقتصادي غير المسبوق الذي تقوده رؤية السعودية 2030، تواصل مجموعتنا تسخير كافة خبراتها وإمكاناتها لتطوير مشاريع عمرانية ملهمة، واقتناص فرص استثمارية مبتكرة ترسخ مكانة المملكة كقوة اقتصادية عالمية.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Vision, Mission & Values */}
        <section className="py-16 bg-white border-y border-[#101E39]/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Vision */}
              <div className="bg-[#F8F9F4] rounded-2xl p-8 border border-[#101E39]/10 space-y-4">
                <div className="p-3 rounded-xl bg-[#101E39] text-[#B7913D] w-fit">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#101E39]">رؤيتنا الاستراتيجية</h3>
                <p className="text-sm text-[#5A677B] leading-relaxed">
                  أن نكون المجموعة القابضة الأكثر موثوقية وابتكاراً في المملكة العربية السعودية، نصنع الفارق في كل استثمار ونسهم بفاعلية في ازدهار مدننا.
                </p>
              </div>

              {/* Mission */}
              <div className="bg-[#F8F9F4] rounded-2xl p-8 border border-[#101E39]/10 space-y-4">
                <div className="p-3 rounded-xl bg-[#101E39] text-[#B7913D] w-fit">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#101E39]">مهمتنا المؤسسية</h3>
                <p className="text-sm text-[#5A677B] leading-relaxed">
                  إدارة وتنمية محفظة استثمارية متكاملة وفق أعلى معايير الحوكمة والاستدامة، وتطوير مجتمعات سكنية وتجارية ترتقي بجودة الحياة وتلبي تطلعات الأجيال.
                </p>
              </div>

              {/* Values */}
              <div className="bg-[#F8F9F4] rounded-2xl p-8 border border-[#101E39]/10 space-y-4">
                <div className="p-3 rounded-xl bg-[#101E39] text-[#B7913D] w-fit">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#101E39]">قيمنا الجوهرية</h3>
                <ul className="space-y-2 text-sm text-[#5A677B]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#B7913D]" />
                    <span><strong>الريادة:</strong> التميز في جودة المخرجات والتصاميم.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#B7913D]" />
                    <span><strong>النزاهة:</strong> الشفافية المطلقة والالتزام المؤسسي.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#B7913D]" />
                    <span><strong>الاستدامة:</strong> الحفاظ على الموارد وحماية البيئة.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Board of Directors Section */}
        <LeadershipSection members={team} />

        {/* Vision 2030 Banner */}
        <Vision2030Banner />
      </main>
      <Footer />
    </>
  );
}
