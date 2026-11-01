import SingleProjectPage from '@/app/projects/[slug]/page';
import { generateMetadata as generateProjectMetadata } from '@/app/projects/[slug]/page';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

type Props = { params: Promise<{ lang: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return generateProjectMetadata({ params });
}

export default async function LocalizedProjectSingle({ params }: Props) {
  const { lang, slug } = await params;
  if (lang !== 'ar' && lang !== 'en') notFound();
  return <SingleProjectPage params={Promise.resolve({ lang, slug })} />;
}
