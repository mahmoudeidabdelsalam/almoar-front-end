import ContactPage from '@/app/contact/page';
import { notFound } from 'next/navigation';
export default async function LocalizedContact({ params }: { params: Promise<{ lang: string }> }) { const { lang } = await params; if (!['ar','en'].includes(lang)) notFound(); return <ContactPage />; }
