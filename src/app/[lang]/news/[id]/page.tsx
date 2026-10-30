import SingleNewsPage from '@/app/news/[id]/page';
import { notFound } from 'next/navigation';

type Props = { params: Promise<{ lang: string; id: string }> };

export default async function LocalizedNewsSingle({ params }: Props) {
  const { lang, id } = await params;
  if (lang !== 'ar' && lang !== 'en') notFound();
  return <SingleNewsPage params={Promise.resolve({ lang, id })} />;
}
