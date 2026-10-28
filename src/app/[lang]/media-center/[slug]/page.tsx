import SingleNewsPage from '@/app/news/[slug]/page';
import { notFound } from 'next/navigation';
export default async function LocalizedMediaSingle({ params }: { params: Promise<{ lang: string; slug: string }> }) { const { lang, slug } = await params; if (!['ar','en'].includes(lang)) notFound(); return <SingleNewsPage params={Promise.resolve({ slug })} />; }
