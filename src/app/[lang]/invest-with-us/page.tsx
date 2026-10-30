import { Suspense } from 'react';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { InvestWithUsSection } from '@/components/sections/InvestWithUsSection';
import { getGravityFormDefinition } from '@/lib/wordpress/gravity-forms';
import { wpClient } from '@/lib/wordpress/client';
import { notFound } from 'next/navigation';

type Props = { params: Promise<{ lang: string }> };

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
      <main className="flex-1 bg-[#F8F7F2] pt-[72px]">
        <InvestWithUsSection form={form} pageContent={pageContent} contactContent={contactContent} />
      </main>
      <Footer />
    </>
  );
}

export default function InvestWithUs({ params }: Props) {
  return (
    <Suspense fallback={<div className="min-h-screen animate-pulse bg-[#F8F7F3]" aria-label="Loading Invest With Us page" />}>
      <InvestWithUsContent params={params} />
    </Suspense>
  );
}
