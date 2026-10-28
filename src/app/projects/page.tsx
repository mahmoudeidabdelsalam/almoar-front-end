import React from 'react';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { PageBanner } from '@/components/sections/PageBanner';
import { wpClient } from '@/lib/wordpress/client';
import { getPageMetadata } from '@/lib/wordpress/page-metadata';
import type { Metadata } from 'next';

export function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('projects', {
    title: 'مشاريعنا العقارية | العمر القابضة — وجهات عصرية رائدة',
    description: 'استكشف محفظة المشاريع العقارية التابعة لمجموعة العمر القابضة، ومشاريع داما السكنية والتجارية في الرياض، الخبر، وجدة.',
  });
}

export default async function ProjectsPage() {
  const projects = await wpClient.getProjects('all');

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#F8F9F4] pt-24">
        <PageBanner
          pageKey="projects"
          imageFallback="/images/project_dama_lazurd.jpg"
          imageAlt="Alomar Projects"
          badgeFallback="المحفظة العقارية والتنموية"
          titleFallback="مشاريع استثنائية تعزز جودة الحياة"
          descriptionFallback="وجهات سكنية وتجارية متكاملة تواكب أحدث المعايير العمرانية العالمية بروح وأصالة وطنية."
        />

        {/* Filterable Section */}
        <ProjectsSection projects={projects} />
      </main>
      <Footer />
    </>
  );
}
