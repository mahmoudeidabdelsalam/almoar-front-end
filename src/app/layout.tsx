import type { Metadata, Viewport } from 'next';
import { Cairo, IBM_Plex_Sans_Arabic, Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://alomarholding.sa'),
  title: 'العمر القابضة | استثمار برؤية أوسع - Alomar Holding',
  description: 'شركة العمر القابضة — مجموعة استثمارية وتطويرية سعودية رائدة، نبني مجتمعات المستقبل ونستثمر برؤية أوسع عبر التطوير العقاري والاستثمار الجريء وإدارة الأصول.',
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
    title: 'العمر القابضة | استثمار برؤية أوسع',
    description: 'العمر القابضة — استثمار برؤية أوسع في التطوير العقاري والمشاريع الاستراتيجية بالمملكة العربية السعودية.',
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
    title: 'العمر القابضة | استثمار برؤية أوسع',
    description: 'العمر القابضة — استثمار برؤية أوسع في التطوير العقاري والفرص التنموية بالمملكة.',
    images: ['/images/hero_riyadh.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${ibmPlexArabic.variable} ${cairo.variable} ${playfair.variable} ${inter.variable}`}>
      <body className="antialiased min-h-screen flex flex-col selection:bg-[#B7913D] selection:text-white">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
