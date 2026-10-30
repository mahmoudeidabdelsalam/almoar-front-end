import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NewsArchivePage } from '@/components/sections/NewsArchivePage';
import type { Locale } from '@/types';

type Props = {
  params: Promise<{ lang: string }>;
};

const archiveCopy = {
  ar: {
    title: 'الأخبار | العمر القابضة',
    description: 'تابع آخر أخبار العمر القابضة وشركاتها.',
  },
  en: {
    title: 'News | Alomar Holding',
    description: 'The latest updates from Alomar Holding and its companies.',
  },
} satisfies Record<Locale, { title: string; description: string }>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (lang !== 'ar' && lang !== 'en') return {};

  const locale: Locale = lang;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://alomarholding.sa';
  return {
    title: archiveCopy[locale].title,
    description: archiveCopy[locale].description,
    alternates: {
      canonical: `${baseUrl}/${locale}/news`,
      languages: {
        ar: `${baseUrl}/ar/news`,
        en: `${baseUrl}/en/news`,
      },
    },
    openGraph: {
      title: archiveCopy[locale].title,
      description: archiveCopy[locale].description,
      url: `${baseUrl}/${locale}/news`,
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
      type: 'website',
    },
  };
}

export default async function LocalizedNewsArchive({ params }: Props) {
  const { lang } = await params;
  if (lang !== 'ar' && lang !== 'en') notFound();

  return <NewsArchivePage locale={lang} />;
}
