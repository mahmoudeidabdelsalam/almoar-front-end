import SingleProjectPage from '@/app/projects/[slug]/page';
import { notFound } from 'next/navigation';
export default async function LocalizedProjectSingle({ params }: { params: Promise<{ lang: string; slug: string }> }) { const { lang, slug } = await params; if (!['ar','en'].includes(lang)) notFound(); return <SingleProjectPage params={Promise.resolve({ slug })} />; }
