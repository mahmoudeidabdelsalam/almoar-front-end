import { Suspense } from 'react';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { InvestWithUsSection } from '@/components/sections/InvestWithUsSection';
import { getGravityFormDefinition } from '@/lib/wordpress/gravity-forms';
import { wpClient } from '@/lib/wordpress/client';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createLocalizedMetadata } from '@/lib/seo';
import type { Locale } from '@/types';

type Props = { params: Promise<{ lang: string }> };

const pageCopy = {
  ar: {
    title: 'استثمر معنا | العمر القابضة',
    description: 'تعرّف على فرص التعاون والاستثمار مع مجموعة العمر القابضة.',
  },
  en: {
    title: 'Invest With Us | Alomar Holding',
    description: 'Explore opportunities to partner and invest with Alomar Holding.',
  },
} satisfies Record<Locale, { title: string; description: string }>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (lang !== 'ar' && lang !== 'en') notFound();
  return createLocalizedMetadata({
    ...pageCopy[lang],
    locale: lang,
    pathname: `/${lang}/invest-with-us`,
  });
}

async function InvestWithUsContent({ params }: Props) {
  const { lang } = await params;
  if (lang !== 'ar' && lang !== 'en') notFound();
  const [pageContent, contactContent] = await Promise.all([
    wpClient.getInvestWithUsPageContent(),
    wpClient.getContactPageContent(),
  ]);
  const form = await getGravityFormDefinition(pageContent?.investmentFormId ?? null);
  return (
    <>
      <Header />
      <main className="flex-1 bg-ivory-50 pt-[72px]">
        <InvestWithUsSection form={form} pageContent={pageContent} contactContent={contactContent} />
      </main>
      <Footer />
    </>
  );
}

export default function InvestWithUs({ params }: Props) {
  return (
    <Suspense fallback={<div className="min-h-screen animate-pulse bg-ivory-50" aria-label="Loading Invest With Us page" />}>
      <InvestWithUsContent params={params} />
    </Suspense>
  );
}
