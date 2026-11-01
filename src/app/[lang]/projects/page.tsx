import ProjectsPage from '@/app/projects/page';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/wordpress/page-metadata';
import type { Locale } from '@/types';

type Props = { params: Promise<{ lang: string }> };

const pageCopy = {
  ar: {
    title: 'مشاريعنا العقارية | العمر القابضة',
    description: 'استكشف المشاريع العقارية والتنموية التابعة لمجموعة العمر القابضة.',
  },
  en: {
    title: 'Projects | Alomar Holding',
    description: 'Explore the real estate and development projects of Alomar Holding.',
  },
} satisfies Record<Locale, Metadata>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (lang !== 'ar' && lang !== 'en') notFound();
  return getPageMetadata('projects', pageCopy[lang], lang, '/projects');
}

export default async function LocalizedProjects({ params }: Props) {
  const { lang } = await params;
  if (lang !== 'ar' && lang !== 'en') notFound();
  return <ProjectsPage />;
}
