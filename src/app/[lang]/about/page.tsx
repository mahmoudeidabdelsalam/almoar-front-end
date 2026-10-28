import AboutPage from '@/app/about/page';
import { notFound } from 'next/navigation';

export default async function LocalizedAbout({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (lang !== 'ar' && lang !== 'en') notFound();
  return <AboutPage />;
}
