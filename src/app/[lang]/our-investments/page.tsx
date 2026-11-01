import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Footer } from '@/components/navigation/Footer';
import { Header } from '@/components/navigation/Header';
import { InvestmentsPage } from '@/components/sections/InvestmentsPage';
import { wpClient } from '@/lib/wordpress/client';
import type { Locale } from '@/types';
import { createLocalizedMetadata } from '@/lib/seo';

type Props = { params: Promise<{ lang: string }> };

const pageCopy = {
  ar: {
    title: 'استثماراتنا | العمر القابضة',
    description: 'تعرف على محفظة استثمارات العمر القابضة وشركاتها.',
  },
  en: {
    title: 'Our Investments | Alomar Holding',
    description: 'Explore Alomar Holding’s investment portfolio and companies.',
  },
} satisfies Record<Locale, { title: string; description: string }>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (lang !== 'ar' && lang !== 'en') return {};

  const locale: Locale = lang;
  const content = await wpClient.getInvestmentsPageContent();
  return createLocalizedMetadata({
    title: content?.seoTitle[locale] || pageCopy[locale].title,
    description: content?.seoDescription[locale] || pageCopy[locale].description,
    locale,
    pathname: `/${locale}/our-investments`,
  });
}

async function LocalizedInvestmentsContent({ params }: Props) {
  const { lang } = await params;
  if (lang !== 'ar' && lang !== 'en') notFound();

  const locale: Locale = lang;
  const [content, projects] = await Promise.all([
    wpClient.getInvestmentsPageContent(),
    wpClient.getProjects('all', { usePreviewData: false }),
  ]);
  return (
    <>
      <Header />
      <main className="flex-1">
        <InvestmentsPage locale={locale} content={content} projects={projects} />
      </main>
      <Footer />
    </>
  );
}

export default function LocalizedInvestments({ params }: Props) {
  return (
    <Suspense fallback={<div className="min-h-screen animate-pulse bg-[#F8F7F2]" aria-label="Loading investments page" />}>
      <LocalizedInvestmentsContent params={params} />
    </Suspense>
  );
}
