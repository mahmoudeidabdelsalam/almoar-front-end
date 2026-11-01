import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import { Cairo, IBM_Plex_Sans_Arabic, Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { wpClient } from '@/lib/wordpress/client';
import { SITE_NAME, SITE_URL } from '@/lib/seo';

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Alomar Holding',
  alternateName: 'العمر القابضة',
  url: SITE_URL,
  logo: `${SITE_URL}/branding/alomar_logo_full.png`,
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: ['ar', 'en'],
  publisher: { '@id': `${SITE_URL}/#organization` },
};

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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'العمر القابضة | Alomar Holding',
  description: 'مجموعة العمر القابضة — استثمارات وتطوير مستدام في المملكة العربية السعودية.',
  authors: [{ name: 'Alomar Holding' }],
  creator: 'Alomar Holding',
  publisher: 'Alomar Holding',
  icons: {
    icon: '/branding/alomar_logo_mark.png',
    apple: '/branding/alomar_logo_mark.png',
  },
  openGraph: {
    siteName: SITE_NAME,
    images: [{ url: '/images/hero_riyadh.jpg', width: 1200, height: 630, alt: 'العمر القابضة - Alomar Holding' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/hero_riyadh.jpg'],
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [siteContent, header, footer] = await Promise.all([
    wpClient.getSiteContent(),
    wpClient.getHeader(),
    wpClient.getFooter(),
  ]);

  return (
    <html lang="ar" dir="rtl" className={`${ibmPlexArabic.variable} ${cairo.variable} ${playfair.variable} ${inter.variable}`}>
      <body className="antialiased min-h-screen flex flex-col selection:bg-[#B7913D] selection:text-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([
            { ...organizationSchema, '@id': `${SITE_URL}/#organization` },
            websiteSchema,
          ]) }}
        />
        <Suspense fallback={null}>
          <LanguageProvider content={siteContent} header={header} footer={footer}>
            {children}
          </LanguageProvider>
        </Suspense>
      </body>
    </html>
  );
}
