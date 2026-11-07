import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import localFont from 'next/font/local';
import Script from 'next/script';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { wpClient } from '@/lib/wordpress/client';
import { SITE_NAME, SITE_URL } from '@/lib/seo';
import { SplashIntro } from '@/components/ui/SplashIntro';

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

const thmanyahSans = localFont({
  src: [
    { path: '../../public/fonts/thmanyahsans-Light.woff2', weight: '300', style: 'normal' },
    { path: '../../public/fonts/thmanyahsans-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/thmanyahsans-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../../public/fonts/thmanyahsans-Bold.woff2', weight: '700', style: 'normal' },
    { path: '../../public/fonts/thmanyahsans-Black.woff2', weight: '900', style: 'normal' },
  ],
  variable: '--font-arabic',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#0F1F38',
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
    <html lang="ar" dir="rtl" data-scroll-behavior="smooth" suppressHydrationWarning className={thmanyahSans.variable}>
      <body className="antialiased min-h-screen flex flex-col selection:bg-gold-500 selection:text-white">
        <Script id="locale-direction" strategy="beforeInteractive">
          {`const segment = window.location.pathname.split('/')[1]; const locale = segment === 'en' ? 'en' : 'ar'; document.documentElement.lang = locale; document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';`}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([
            { ...organizationSchema, '@id': `${SITE_URL}/#organization` },
            websiteSchema,
          ]) }}
        />
        <Suspense fallback={null}>
          <LanguageProvider content={siteContent} header={header} footer={footer}>
            <SplashIntro />
            {children}
          </LanguageProvider>
        </Suspense>
      </body>
    </html>
  );
}
