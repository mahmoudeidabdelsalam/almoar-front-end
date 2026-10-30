import SingleProjectPage from '@/app/projects/[slug]/page';
import { notFound } from 'next/navigation';

type Props = { params: Promise<{ lang: string; slug: string }> };

export default async function LocalizedProjectSingle({ params }: Props) {
  const { lang, slug } = await params;
  if (lang !== 'ar' && lang !== 'en') notFound();
  return <SingleProjectPage params={Promise.resolve({ lang, slug })} />;
}
