import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { PageBanner } from '@/components/sections/PageBanner';
import { ContactSection } from '@/components/sections/ContactSection';
import { wpClient } from '@/lib/wordpress/client';
import { notFound } from 'next/navigation';

export default async function InvestWithUs({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (lang !== 'ar' && lang !== 'en') notFound();
  const { sectors } = await wpClient.getSiteContent();
  const ar = lang === 'ar';
  return <><Header /><main className="flex-1 bg-[#F8F9F4] pt-24"><PageBanner pageKey="invest-with-us" imageFallback="/images/hero_riyadh.jpg" imageAlt={ar ? 'استثمر معنا' : 'Invest with us'} badgeFallback={ar ? 'فرص الاستثمار والشراكات' : 'Investment opportunities'} titleFallback={ar ? 'استثمر معنا وننمو معًا' : 'Invest with us and grow together'} descriptionFallback={ar ? 'اكتشف فرص الشراكة والاستثمار عبر محفظة مجموعة العمر القابضة المتنوعة.' : 'Explore partnership and investment opportunities across Alomar Holding’s diversified portfolio.'} /><ContactSection sectors={sectors} /></main><Footer /></>; 
}
