import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import { Cairo, IBM_Plex_Sans_Arabic, Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { wpClient } from '@/lib/wordpress/client';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-cairo',
  display: 'swap',
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-arabic',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-serif',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#101E39',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export async function generateMetadata(): Promise<Metadata> {
  const siteContent = await wpClient.getSiteContent();
  const homeBanner = siteContent.pageBanners.home;
  const siteName = siteContent.settings.site_name;
  const title = homeBanner?.seoTitle.ar || (siteContent.previewMode
    ? `${siteName.ar} | ${siteContent.settings.tagline.ar}`
    : siteName.ar || undefined);
  const description = homeBanner?.seoDescription.ar || (siteContent.previewMode
    ? 'شركة العمر القابضة — مجموعة استثمارية وتطويرية سعودية رائدة.'
    : undefined);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://alomarholding.sa';
  return {
  metadataBase: new URL(baseUrl),
  title,
  description,
  alternates: {
    canonical: `${baseUrl}/ar`,
    languages: { ar: `${baseUrl}/ar`, en: `${baseUrl}/en`, 'x-default': `${baseUrl}/ar` },
  },
  keywords: [
    'العمر القابضة',
    'Alomar Holding',
    'استثمار عقاري',
    'داما للتطوير العقاري',
    'مشاريع الرياض',
    'الخبر',
    'رؤية السعودية 2030',
    'استثمار جريء',
  ],
  authors: [{ name: 'Alomar Holding' }],
  creator: 'Alomar Holding',
  publisher: 'Alomar Holding',
  icons: {
    icon: '/branding/alomar_logo_mark.png',
    apple: '/branding/alomar_logo_mark.png',
  },
  openGraph: {
    title,
    description,
    url: 'https://alomarholding.sa',
    siteName: 'Alomar Holding',
    images: [
      {
        url: '/images/hero_riyadh.jpg',
        width: 1200,
        height: 630,
        alt: 'العمر القابضة - Alomar Holding',
      },
    ],
    locale: 'ar_SA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/images/hero_riyadh.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteContent = await wpClient.getSiteContent();

  return (
    <html lang="ar" dir="rtl" className={`${ibmPlexArabic.variable} ${cairo.variable} ${playfair.variable} ${inter.variable}`}>
      <body className="antialiased min-h-screen flex flex-col selection:bg-[#B7913D] selection:text-white">
        <Suspense fallback={null}>
          <LanguageProvider content={siteContent}>
            {children}
          </LanguageProvider>
        </Suspense>
      </body>
    </html>
  );
}
