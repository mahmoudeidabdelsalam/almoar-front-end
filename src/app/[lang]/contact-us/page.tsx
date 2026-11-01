import { Suspense } from 'react';
import ContactPage from '@/app/contact/page';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/wordpress/page-metadata';
import type { Locale } from '@/types';

type Props = { params: Promise<{ lang: string }> };

const pageCopy = {
  ar: {
    title: 'تواصل معنا | العمر القابضة',
    description: 'تواصل مع فريق العمر القابضة للاستفسارات العامة والشراكات.',
  },
  en: {
    title: 'Contact Us | Alomar Holding',
    description: 'Contact the Alomar Holding team for general enquiries and partnerships.',
  },
} satisfies Record<Locale, Metadata>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (lang !== 'ar' && lang !== 'en') notFound();
  return getPageMetadata('contact', pageCopy[lang], lang, '/contact-us');
}

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
