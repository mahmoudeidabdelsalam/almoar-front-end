import ProjectsPage from '@/app/projects/page';
import { notFound } from 'next/navigation';
export default async function LocalizedProjects({ params }: { params: Promise<{ lang: string }> }) { const { lang } = await params; if (!['ar','en'].includes(lang)) notFound(); return <ProjectsPage />; }
