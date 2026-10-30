import { Suspense } from 'react';
import SingleNewsPage from '@/app/news/[id]/page';
import { notFound } from 'next/navigation';

type Props = { params: Promise<{ lang: string; id: string }> };

async function LocalizedNewsContent({ params }: Props) {
  const { lang, id } = await params;
  if (lang !== 'ar' && lang !== 'en') notFound();
  return <SingleNewsPage params={Promise.resolve({ lang, id })} />;
}

export default function LocalizedNewsSingle({ params }: Props) {
  return (
    <Suspense fallback={<div className="min-h-screen animate-pulse bg-[#F8F9F4]" aria-label="Loading news article" />}>
      <LocalizedNewsContent params={params} />
    </Suspense>
  );
}
