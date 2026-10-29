import HomePage from '@/app/page';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

async function LocalizedHomeContent({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (lang !== 'ar' && lang !== 'en') notFound();
  return <HomePage />;
}

export default function LocalizedHomePage({ params }: { params: Promise<{ lang: string }> }) {
  return (
    <Suspense fallback={<div className="min-h-screen animate-pulse bg-[#F8F7F3]" aria-label="Loading homepage" />}>
      <LocalizedHomeContent params={params} />
    </Suspense>
  );
}
