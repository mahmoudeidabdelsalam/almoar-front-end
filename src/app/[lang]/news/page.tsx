import NewsPage from '@/app/news/page';
import { notFound } from 'next/navigation';
export default async function LocalizedNews({ params }: { params: Promise<{ lang: string }> }) { const { lang } = await params; if (!['ar','en'].includes(lang)) notFound(); return <NewsPage />; }
