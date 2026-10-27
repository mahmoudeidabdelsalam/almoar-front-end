import React from 'react';
import Image from 'next/image';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { wpClient } from '@/lib/wordpress/client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'مشاريعنا العقارية | العمر القابضة — وجهات عصرية رائدة',
  description: 'استكشف محفظة المشاريع العقارية التابعة لمجموعة العمر القابضة، ومشاريع داما السكنية والتجارية في الرياض، الخبر، وجدة.',
};

export default async function ProjectsPage() {
  const projects = await wpClient.getProjects('all');

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#F8F9F4] pt-24">
        {/* Banner */}
        <div className="relative py-20 lg:py-28 bg-[#101E39] text-white overflow-hidden">
          <div className="absolute inset-0 opacity-25">
            <Image
              src="/images/project_dama_lazurd.jpg"
              alt="Alomar Projects"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#B7913D]">
              المحفظة العقارية والتنموية
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              مشاريع استثنائية تعزز جودة الحياة
            </h1>
            <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              وجهات سكنية وتجارية متكاملة تواكب أحدث المعايير العمرانية العالمية بروح وأصالة وطنية.
            </p>
          </div>
        </div>

        {/* Filterable Section */}
        <ProjectsSection projects={projects} />
      </main>
      <Footer />
    </>
  );
}
