import { Footer } from '@/components/navigation/Footer';
import { Header } from '@/components/navigation/Header';
import { NewsArchiveSection } from '@/components/sections/NewsArchiveSection';
import { wpClient } from '@/lib/wordpress/client';
import type { Locale } from '@/types';

export async function NewsArchivePage({ locale }: { locale: Locale }) {
  const articles = await wpClient.getNews();

  return (
    <>
      <Header />
      <main className="flex-1 pt-[72px]">
        <NewsArchiveSection articles={articles} locale={locale} />
      </main>
      <Footer />
    </>
  );
}
