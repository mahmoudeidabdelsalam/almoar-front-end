import HomePage from '@/app/page';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import type { Locale } from '@/types';
import { createLocalizedMetadata } from '@/lib/seo';
import { wpClient } from '@/lib/wordpress/client';

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (lang !== 'ar' && lang !== 'en') notFound();

  const locale: Locale = lang;
  const siteContent = await wpClient.getSiteContent();
  const homeBanner = siteContent.pageBanners.home;
  const siteName = siteContent.settings.site_name[locale] || (locale === 'ar' ? 'العمر القابضة' : 'Alomar Holding');
  const tagline = siteContent.settings.tagline[locale];
  const title = homeBanner?.seoTitle[locale] || [siteName, tagline].filter(Boolean).join(' | ');
  const description = homeBanner?.seoDescription[locale]
    || siteContent.heroSlides.find((slide) => slide[`desc_${locale}`])?.[`desc_${locale}`]
    || tagline
    || (locale === 'ar'
      ? 'مجموعة العمر القابضة — استثمارات وتطوير مستدام في المملكة العربية السعودية.'
      : 'Alomar Holding — sustainable investment and development in Saudi Arabia.');

  return createLocalizedMetadata({
    title,
    description,
    locale,
    pathname: `/${locale}`,
  });
}

async function LocalizedHomeContent({ params }: Props) {
  const { lang } = await params;
  if (lang !== 'ar' && lang !== 'en') notFound();
  return <HomePage />;
}

export default function LocalizedHomePage({ params }: Props) {
  return (
    <Suspense fallback={<div className="min-h-screen animate-pulse bg-[#F8F7F3]" aria-label="Loading homepage" />}>
      <LocalizedHomeContent params={params} />
    </Suspense>
  );
}
