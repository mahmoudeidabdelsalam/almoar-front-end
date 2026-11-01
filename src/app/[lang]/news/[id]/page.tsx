import { Suspense } from 'react';
import SingleNewsPage from '@/app/news/[id]/page';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { buildNewsMetadata } from '@/app/news/[id]/page';

type Props = { params: Promise<{ lang: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return buildNewsMetadata(await params);
}

async function LocalizedNewsContent({ params }: Props) {
  const { lang, id } = await params;
  if (lang !== 'ar' && lang !== 'en') notFound();
  return <SingleNewsPage params={Promise.resolve({ lang, id })} />;
}

export default function LocalizedNewsSingle({ params }: Props) {
  return (
    <Suspense fallback={<div className="min-h-screen animate-pulse bg-ivory-50" aria-label="Loading news article" />}>
      <LocalizedNewsContent params={params} />
    </Suspense>
  );
}
