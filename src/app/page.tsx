import React from 'react';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { HeroSlider } from '@/components/sections/HeroSlider';
import { CompaniesSection } from '@/components/sections/CompaniesSection';
import { NewsSection } from '@/components/sections/NewsSection';
import { ApproachSection } from '@/components/sections/ApproachSection';
import { wpClient } from '@/lib/wordpress/client';
import { Suspense } from 'react';

function HomeLoading() {
  return (
    <div className="min-h-[70vh]" aria-label="Loading homepage content">
      <div className="mx-auto max-w-[1440px] px-6 py-24">
        <div className="h-[420px] animate-pulse rounded-[2rem] bg-[#101E39]/5" />
      </div>
    </div>
  );
}

async function HomeContent() {
  const [siteContent, news, projects] = await Promise.all([
    wpClient.getSiteContent(),
    wpClient.getNews(),
    wpClient.getProjects('all'),
  ]);

  return (
    <>
      <HeroSlider slides={siteContent.heroSlides} />
      <CompaniesSection projects={projects} />
      <ApproachSection />
      <NewsSection articles={news} />
    </>
  );
}


export default async function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Suspense fallback={<HomeLoading />}>
          <HomeContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
