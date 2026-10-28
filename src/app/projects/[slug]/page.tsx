import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { wpClient } from '@/lib/wordpress/client';
import { MapPin, Calendar, Layers, Maximize2, Download, ArrowRight, ArrowLeft, PhoneCall } from 'lucide-react';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await wpClient.getProjects('all');
  return projects.length ? projects.map((p) => ({ slug: p.slug })) : [{ slug: '__no-cms-content__' }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await wpClient.getProjectBySlug(slug);
  if (!project) return { title: 'المشروع غير موجود | العمر القابضة' };

  return {
    title: `${project.title.ar} | العمر القابضة`,
    description: project.excerpt.ar,
    openGraph: {
      images: project.image ? [project.image] : [],
    },
  };
}

export default async function SingleProjectPage({ params }: Props) {
  const { slug } = await params;
  const [project, siteContent] = await Promise.all([
    wpClient.getProjectBySlug(slug),
    wpClient.getSiteContent(),
  ]);

  if (!project) {
    notFound();
  }

  const allProjects = await wpClient.getProjects('all');
  const relatedProjects = allProjects.filter((p) => p.slug !== slug).slice(0, 3);
  const previewHighlights = [
    'أنظمة المنازل الذكية والتحكم في الطاقة',
    'حدائق ومسطحات خضراء وممشى رياضي',
    'أمن وحراسة وأنظمة مراقبة ذكية 24/7',
    'مواقف سيارات مخصصة وشواحن كهربائية',
  ];
  const projectHighlights = project.highlights?.length
    ? project.highlights.map((highlight) => highlight.ar).filter(Boolean)
    : siteContent.previewMode ? previewHighlights : [];

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#F8F9F4] pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Breadcrumb & Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#5A677B]">
              <Link href="/" className="hover:text-[#101E39] transition-colors">الرئيسية</Link>
              <span>/</span>
              <Link href="/projects" className="hover:text-[#101E39] transition-colors">مشاريعنا</Link>
              <span>/</span>
              <span className="text-[#101E39] font-bold">{project.title.ar}</span>
            </div>

            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#101E39] hover:text-[#B7913D] transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة لكافة المشاريع</span>
            </Link>
          </div>

          {/* Project Title & Badges */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold text-white bg-[#101E39]">
                {project.category}
              </span>
              <span className="px-3.5 py-1 rounded-full text-xs font-bold text-[#101E39] bg-[#B7913D]/20 border border-[#B7913D]/30">
                {project.status}
              </span>
              <span className="flex items-center gap-1 text-xs font-semibold text-[#5A677B]">
                <MapPin className="w-3.5 h-3.5 text-[#B7913D]" />
                <span>{project.location}</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#101E39] tracking-tight">
              {project.title.ar}
            </h1>
          </div>

          {/* Main Visual Image & Gallery */}
          <div className="space-y-4">
            <div className="relative h-[380px] sm:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              {project.image ? (
                <Image
                  src={project.image}
                  alt={project.title.ar}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#101E39] to-[#1B4332]" aria-hidden="true" />
              )}
            </div>

            {project.gallery && project.gallery.length > 1 && (
              <div className="grid grid-cols-3 gap-4">
                {project.gallery.map((imgUrl, i) => (
                  <div key={i} className="relative h-28 sm:h-36 rounded-2xl overflow-hidden shadow-sm border border-white/40">
                    <Image
                      src={imgUrl}
                      alt={`${project.title.ar} gallery ${i}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details & Specs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Narrative Column */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-8 sm:p-10 shadow-lg border border-[#101E39]/10 space-y-6">
              <h2 className="text-2xl font-bold text-[#101E39] pb-3 border-b border-[#101E39]/10">
                نظرة عامة على المشروع
              </h2>

              <div className="space-y-4 text-base text-[#5A677B] leading-relaxed">
                <p>{project.excerpt.ar}</p>
                {project.content && <p>{project.content.ar}</p>}
              </div>

              {/* Architectural Highlights */}
              {projectHighlights.length > 0 && <div className="pt-6 border-t border-[#101E39]/10 space-y-4">
                <h3 className="text-lg font-bold text-[#101E39]">أبرز المزايا والمواصفات:</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[#5A677B]">
                  {projectHighlights.map((highlight, index) => (
                    <li key={`${highlight}-${index}`} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#B7913D]" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>}
            </div>

            {/* Right Specs Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#101E39] text-white rounded-3xl p-8 shadow-xl space-y-6">
                <h3 className="text-lg font-bold text-[#B7913D] border-b border-white/10 pb-3">
                  بيانات ومواصفات المشروع
                </h3>

                <div className="space-y-4 text-sm">
                  {project.units_count && (
                    <div className="flex items-center justify-between py-2 border-b border-white/10">
                      <span className="text-white/60">الوحدات:</span>
                      <span className="font-bold text-white">{project.units_count}</span>
                    </div>
                  )}

                  {project.land_area && (
                    <div className="flex items-center justify-between py-2 border-b border-white/10">
                      <span className="text-white/60">مساحة الأرض:</span>
                      <span className="font-bold text-white">{project.land_area}</span>
                    </div>
                  )}

                  {project.built_area && (
                    <div className="flex items-center justify-between py-2 border-b border-white/10">
                      <span className="text-white/60">المساحة المبنية:</span>
                      <span className="font-bold text-white">{project.built_area}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between py-2 border-b border-white/10">
                    <span className="text-white/60">سنة الإنجاز:</span>
                    <span className="font-bold text-white">{project.completion_year}</span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-white/10">
                    <span className="text-white/60">الموقع:</span>
                    <span className="font-bold text-white">{project.location}</span>
                  </div>
                </div>

                <div className="pt-2 space-y-3">
                  <Link
                    href="/contact"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-[#101E39] gold-gradient-bg shadow-lg hover:shadow-xl transition-all"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>حجز أو استفسار عن المشروع</span>
                  </Link>

                  {project.brochure_url && (
                    <a
                      href={project.brochure_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-xs text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>تحميل الكتيب الرقمي (PDF)</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Related Projects */}
          {relatedProjects.length > 0 && (
            <div className="space-y-6 pt-12 border-t border-[#101E39]/10">
              <h3 className="text-2xl font-bold text-[#101E39]">مشاريع أخرى من محفظتنا</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {relatedProjects.map((p) => (
                  <Link
                    key={p.id}
                    href={`/projects/${p.slug}`}
                    className="bg-white rounded-2xl overflow-hidden border border-[#101E39]/10 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="relative h-44">
                      {p.image ? (
                        <Image
                          src={p.image}
                          alt={p.title.ar}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#101E39] to-[#1B4332]" aria-hidden="true" />
                      )}
                    </div>
                    <div className="p-4 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-[#B7913D]">{p.category}</span>
                      <h4 className="font-bold text-[#101E39] text-sm group-hover:text-[#B7913D] transition-colors">
                        {p.title.ar}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
