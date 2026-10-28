import HomePage from '@/app/page';
import { notFound } from 'next/navigation';

export default async function LocalizedHomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (lang !== 'ar' && lang !== 'en') notFound();
  return <HomePage />;
}
