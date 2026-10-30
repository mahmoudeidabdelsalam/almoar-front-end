import { Suspense } from 'react';
import AboutPage from '@/app/about/page';
import { getPageMetadata } from '@/lib/wordpress/page-metadata';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface LocalizedAboutProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: LocalizedAboutProps): Promise<Metadata> {
  const { lang } = await params;
  if (lang !== 'ar' && lang !== 'en') notFound();
  return getPageMetadata('about', {
    title: lang === 'ar' ? 'من نحن | العمر القابضة — مسيرة الريادة والاستثمار' : 'About Us | Alomar Holding',
    description: lang === 'ar'
      ? 'تعرف على مجموعة العمر القابضة ورؤيتها الاستثمارية ومبادراتها في المملكة العربية السعودية.'
      : 'Learn about Alomar Holding, its investment vision, and its initiatives in Saudi Arabia.',
  }, lang);
}

async function LocalizedAboutContent({ params }: LocalizedAboutProps) {
  const { lang } = await params;
  if (lang !== 'ar' && lang !== 'en') notFound();
  return <AboutPage />;
}

export default function LocalizedAbout({ params }: LocalizedAboutProps) {
  return (
    <Suspense fallback={null}>
      <LocalizedAboutContent params={params} />
    </Suspense>
  );
}
