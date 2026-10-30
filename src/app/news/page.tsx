import { NewsArchivePage } from '@/components/sections/NewsArchivePage';
import { getPageMetadata } from '@/lib/wordpress/page-metadata';
import type { Metadata } from 'next';

export function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('news', {
    title: 'الأخبار | العمر القابضة — الأخبار والبيانات الصحفية',
    description: 'تابع آخر أخبار شركة العمر القابضة، الإعلانات الرسمية، إطلاق المشاريع، والشراكات الاستثمارية.',
  });
}

export default async function NewsPage() {
  return <NewsArchivePage locale="ar" />;
}
