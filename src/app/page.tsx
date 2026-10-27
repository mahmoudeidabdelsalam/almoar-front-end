import React from 'react';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { SplashIntro } from '@/components/ui/SplashIntro';
import { HeroSlider } from '@/components/sections/HeroSlider';
import { StatsSection } from '@/components/sections/StatsSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { SectorsSection } from '@/components/sections/SectorsSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { Vision2030Banner } from '@/components/sections/Vision2030Banner';
import { CompaniesSection } from '@/components/sections/CompaniesSection';
import { LeadershipSection } from '@/components/sections/LeadershipSection';
import { NewsSection } from '@/components/sections/NewsSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { wpClient } from '@/lib/wordpress/client';


export default async function HomePage() {
  const [settings, sectors, projects, companies, team, news, heroSlides] = await Promise.all([
    wpClient.getSettings(),
    wpClient.getSectors(),
    wpClient.getProjects('all'),
    wpClient.getCompanies(),
    wpClient.getTeam(),
    wpClient.getNews(),
    wpClient.getHomeHeroSlides(),
  ]);

  return (
    <>
      <SplashIntro />
      <Header />
      <main className="flex-1">
        <HeroSlider slides={heroSlides} />
        <StatsSection stats={settings.statistics} />
        <AboutSection />
        <SectorsSection sectors={sectors} />
        <ProjectsSection projects={projects} />
        <Vision2030Banner />
        <CompaniesSection companies={companies} />
        <LeadershipSection members={team} />
        <NewsSection articles={news} />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
