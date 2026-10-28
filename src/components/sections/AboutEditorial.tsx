'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { Compass, Sparkles, Target, CheckCircle2 } from 'lucide-react';

export const ChairmanMessage: React.FC = () => {
  const { locale, content } = useLanguage();
  const about = content.aboutPage;
  const previewText = {
    ar: {
      role: 'رئيس مجلس الإدارة',
      name: 'عبد العزيز بن محمد العمر',
      heading: 'رسالة رئيس مجلس الإدارة',
      quote: 'عهد من التميز وشغف بصناعة مستقبل يليق بطموحات وطننا المعطاء',
      first: 'منذ انطلاقة مجموعة العمر القابضة، وضعنا نصب أعيننا مبدأً ثابتاً: أن الاستثمار الحقيقي هو الذي يتجاوز العوائد المالية إلى بناء قيمة مستدامة للإنسان والمجتمع.',
      second: 'وفي ظل النهضة التاريخية والتحول الاقتصادي غير المسبوق الذي تقوده رؤية السعودية 2030، تواصل مجموعتنا تسخير كافة خبراتها وإمكاناتها لتطوير مشاريع عمرانية ملهمة، واقتناص فرص استثمارية مبتكرة ترسخ مكانة المملكة كقوة اقتصادية عالمية.',
    },
    en: {
      role: 'Chairman of the Board',
      name: 'Abdulaziz bin Mohammed Alomar',
      heading: 'Message from the Chairman',
      quote: 'A commitment to excellence and a passion for building a future worthy of our nation.',
      first: 'Since Alomar Holding began, we have held to a clear principle: meaningful investment goes beyond financial returns to create lasting value for people and society.',
      second: 'As Saudi Arabia advances through Vision 2030, we continue to apply our experience and capabilities to inspiring urban projects and innovative investment opportunities that strengthen the Kingdom’s global economic standing.',
    },
  };
  const text = content.previewMode ? previewText[locale] : {
    role: '',
    name: '',
    heading: '',
    quote: '',
    first: '',
    second: '',
  };
  const chairmanImage = about.chairmanImage || (content.previewMode ? '/images/board_chairman.jpg' : '');
  if (!content.previewMode && !about.messageHeading[locale] && !about.chairmanName[locale] && !about.quote[locale] && !about.messageOne[locale] && !about.messageTwo[locale]) return null;

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-3xl p-8 sm:p-12 lg:p-16 shadow-xl border border-[#101E39]/10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-5 relative">
          <div className="relative h-96 sm:h-[450px] rounded-2xl overflow-hidden shadow-lg border-2 border-[#101E39]/10">
            {chairmanImage && <Image
              src={chairmanImage}
              alt={about.chairmanName[locale] || text.name}
              fill
              className="object-cover object-top"
            />}
          </div>
          <div className="absolute -bottom-4 right-4 bg-[#101E39] text-white px-5 py-3 rounded-xl border border-white/10 shadow-lg">
            <span className="text-xs text-[#B7913D] font-bold block">{about.chairmanRole[locale] || text.role}</span>
            <span className="text-sm font-bold">{about.chairmanName[locale] || text.name}</span>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#B7913D] block">
            {about.messageHeading[locale] || text.heading}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#101E39] leading-snug">
            &ldquo;{about.quote[locale] || text.quote}&rdquo;
          </h2>
          <div className="space-y-4 text-sm sm:text-base text-[#5A677B] leading-relaxed">
            <p>{about.messageOne[locale] || text.first}</p>
            <p>{about.messageTwo[locale] || text.second}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export const AboutPrinciples: React.FC = () => {
  const { locale, content } = useLanguage();
  const about = content.aboutPage;
  const values = about.values.length ? about.values : content.previewMode ? [
    { title: { ar: 'الريادة', en: 'Leadership' }, description: { ar: 'التميز في جودة المخرجات والتصاميم.', en: 'Excellence in outcomes and design.' } },
    { title: { ar: 'النزاهة', en: 'Integrity' }, description: { ar: 'الشفافية المطلقة والالتزام المؤسسي.', en: 'Transparency and institutional accountability.' } },
    { title: { ar: 'الاستدامة', en: 'Sustainability' }, description: { ar: 'الحفاظ على الموارد وحماية البيئة.', en: 'Protecting resources and the environment.' } },
  ] : [];
  const previewCopy = locale === 'ar'
    ? {
        visionTitle: 'رؤيتنا الاستراتيجية',
        visionDescription: 'أن نكون المجموعة القابضة الأكثر موثوقية وابتكاراً في المملكة العربية السعودية، نصنع الفارق في كل استثمار ونسهم بفاعلية في ازدهار مدننا.',
        missionTitle: 'مهمتنا المؤسسية',
        missionDescription: 'إدارة وتنمية محفظة استثمارية متكاملة وفق أعلى معايير الحوكمة والاستدامة، وتطوير مجتمعات سكنية وتجارية ترتقي بجودة الحياة وتلبي تطلعات الأجيال.',
        valuesTitle: 'قيمنا الجوهرية',
      }
    : {
        visionTitle: 'Our Strategic Vision',
        visionDescription: 'To be Saudi Arabia’s most trusted and innovative holding group, creating lasting value through every investment and contributing to thriving cities.',
        missionTitle: 'Our Mission',
        missionDescription: 'To grow a diversified portfolio with strong governance and sustainability, while developing residential and commercial places that improve quality of life.',
        valuesTitle: 'Our Core Values',
      };
  const copy = content.previewMode ? previewCopy : {
    visionTitle: '',
    visionDescription: '',
    missionTitle: '',
    missionDescription: '',
    valuesTitle: '',
  };
  if (!content.previewMode && !about.visionTitle[locale] && !about.missionTitle[locale] && !values.length) return null;

  return (
    <section className="py-16 bg-white border-y border-[#101E39]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#F8F9F4] rounded-2xl p-8 border border-[#101E39]/10 space-y-4">
            <div className="p-3 rounded-xl bg-[#101E39] text-[#B7913D] w-fit"><Compass className="w-6 h-6" /></div>
            <h3 className="text-xl font-bold text-[#101E39]">{about.visionTitle[locale] || copy.visionTitle}</h3>
            <p className="text-sm text-[#5A677B] leading-relaxed">{about.visionDescription[locale] || copy.visionDescription}</p>
          </div>
          <div className="bg-[#F8F9F4] rounded-2xl p-8 border border-[#101E39]/10 space-y-4">
            <div className="p-3 rounded-xl bg-[#101E39] text-[#B7913D] w-fit"><Target className="w-6 h-6" /></div>
            <h3 className="text-xl font-bold text-[#101E39]">{about.missionTitle[locale] || copy.missionTitle}</h3>
            <p className="text-sm text-[#5A677B] leading-relaxed">{about.missionDescription[locale] || copy.missionDescription}</p>
          </div>
          <div className="bg-[#F8F9F4] rounded-2xl p-8 border border-[#101E39]/10 space-y-4">
            <div className="p-3 rounded-xl bg-[#101E39] text-[#B7913D] w-fit"><Sparkles className="w-6 h-6" /></div>
            <h3 className="text-xl font-bold text-[#101E39]">{copy.valuesTitle}</h3>
            <ul className="space-y-2 text-sm text-[#5A677B]">
              {values.filter((value) => value.title[locale] && value.description[locale]).map((value, index) => (
                <li key={`${value.title.ar}-${index}`} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#B7913D]" />
                  <span><strong>{value.title[locale]}:</strong> {value.description[locale]}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
