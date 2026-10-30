import { Suspense } from 'react';
import ContactPage from '@/app/contact/page';
import { notFound } from 'next/navigation';

type Props = { params: Promise<{ lang: string }> };

async function LocalizedContactContent({ params }: Props) {
  const { lang } = await params;
  if (lang !== 'ar' && lang !== 'en') notFound();

  return <ContactPage />;
}

export default function LocalizedContact({ params }: Props) {
  return (
    <Suspense fallback={<div className="min-h-screen animate-pulse bg-[#F8F7F3]" aria-label="Loading contact page" />}>
      <LocalizedContactContent params={params} />
    </Suspense>
  );
}
