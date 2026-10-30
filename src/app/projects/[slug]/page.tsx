import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { wpClient } from '@/lib/wordpress/client';
import { MapPin, Download, ArrowRight, ArrowLeft, PhoneCall } from 'lucide-react';
import type { Metadata } from 'next';
import type { Locale, LocalizedString, Project, ProjectTextBand } from '@/types';

interface Props {
  params: Promise<{ slug: string; lang?: string }>;
}

function localizedText(value: LocalizedString | undefined, locale: Locale): string {
  return value?.[locale]?.trim() || value?.[locale === 'ar' ? 'en' : 'ar']?.trim() || '';
}

function ProjectTextBandSection({ band, locale }: { band?: ProjectTextBand; locale: Locale }) {
  if (!band) return null;
  const tag = localizedText(band.tag, locale);
  const headline = localizedText(band.headline, locale);
  const items = band.items.filter((item) => localizedText(item.head, locale) || localizedText(item.text, locale));
  if (!tag && !headline && !items.length) return null;

  return (
    <section className="space-y-7 rounded-3xl border border-[#101E39]/10 bg-white p-8 shadow-lg sm:p-10">
      {(tag || headline) && (
        <div className="space-y-2">
          {tag && <p className="text-xs font-bold uppercase tracking-wider text-[#B7913D]">{tag}</p>}
          {headline && <h2 className="text-2xl font-bold text-[#101E39] sm:text-3xl">{headline}</h2>}
        </div>
      )}
      {items.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => {
            const head = localizedText(item.head, locale);
            const text = localizedText(item.text, locale);
            return (
              <article key={`${head}-${index}`} className="space-y-2 border-s-2 border-[#B7913D] ps-4">
                {head && <h3 className="text-lg font-bold text-[#101E39]">{head}</h3>}
                {text && <p className="text-sm leading-7 text-[#5A677B]">{text}</p>}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function ProjectCompaniesBand({ project, locale }: { project: Project; locale: Locale }) {
  const band = project.companiesBand;
  if (!band) return null;
  const tag = localizedText(band.tag, locale);
  const headline = localizedText(band.headline, locale);
  const items = band.items.filter((item) => item.logo.url);
  if (!tag && !headline && !items.length) return null;

  return (
    <section className="space-y-7 rounded-3xl border border-[#101E39]/10 bg-white p-8 shadow-lg sm:p-10">
      {(tag || headline) && (
        <div className="space-y-2">
          {tag && <p className="text-xs font-bold uppercase tracking-wider text-[#B7913D]">{tag}</p>}
          {headline && <h2 className="text-2xl font-bold text-[#101E39] sm:text-3xl">{headline}</h2>}
        </div>
      )}
      {items.length > 0 && (
        <div className="grid grid-cols-2 items-center gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {items.map((item, index) => {
            const alt = item.logo.alt || `${headline || project.title[locale]} company logo ${index + 1}`;
            const logo = (
              <Image
                src={item.logo.url}
                alt={alt}
                width={220}
                height={120}
                className="h-20 w-full object-contain"
              />
            );
            return item.link ? (
              <a
                key={`${item.link}-${index}`}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={alt}
                className="flex min-h-28 items-center justify-center rounded-2xl border border-[#101E39]/10 bg-[#F8F9F4] p-5 transition-shadow hover:shadow-md"
              >
                {logo}
              </a>
            ) : (
              <div key={`${alt}-${index}`} className="flex min-h-28 items-center justify-center rounded-2xl border border-[#101E39]/10 bg-[#F8F9F4] p-5">
                {logo}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function ProjectKeyProjectsBand({ project, locale }: { project: Project; locale: Locale }) {
  const band = project.keyProjectsBand;
  if (!band) return null;
  const tag = localizedText(band.tag, locale);
  const headline = localizedText(band.headline, locale);
  const items = band.items.filter((item) =>
    item.image?.url || localizedText(item.head, locale) || localizedText(item.text, locale)
  );
  if (!tag && !headline && !items.length) return null;

  return (
    <section className="space-y-7">
      {(tag || headline) && (
        <div className="space-y-2">
          {tag && <p className="text-xs font-bold uppercase tracking-wider text-[#B7913D]">{tag}</p>}
          {headline && <h2 className="text-2xl font-bold text-[#101E39] sm:text-3xl">{headline}</h2>}
        </div>
      )}
      {items.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => {
            const head = localizedText(item.head, locale);
            const location = localizedText(item.location, locale);
            const text = localizedText(item.text, locale);
            const card = (
              <>
                {item.image?.url && (
                  <div className="relative h-52 overflow-hidden">
                    <Image src={item.image.url} alt={item.image.alt || head || project.title[locale]} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                )}
                <div className="space-y-2 p-5">
                  {location && <p className="text-xs font-semibold text-[#B7913D]">{location}</p>}
                  {head && <h3 className="text-lg font-bold text-[#101E39]">{head}</h3>}
                  {text && <p className="text-sm leading-6 text-[#5A677B]">{text}</p>}
                </div>
              </>
            );
            const className = 'group overflow-hidden rounded-2xl border border-[#101E39]/10 bg-white shadow-sm transition-shadow hover:shadow-lg';
            const key = `${head}-${index}`;
            return item.link.url ? (
              <a
                key={key}
                href={item.link.url}
                target={item.link.target || undefined}
                rel={item.link.target === '_blank' ? 'noopener noreferrer' : undefined}
                aria-label={item.link.title || head || undefined}
                className={className}
              >
                {card}
              </a>
            ) : (
              <article key={key} className={className}>{card}</article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export async function generateStaticParams() {
  const projects = await wpClient.getProjects('all');
  return projects.length ? projects.map((p) => ({ slug: p.slug })) : [{ slug: '__no-cms-content__' }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, lang } = await params;
  const locale: Locale = lang === 'en' ? 'en' : 'ar';
  const project = await wpClient.getProjectBySlug(slug);
  if (!project) return { title: locale === 'ar' ? 'المشروع غير موجود | العمر القابضة' : 'Project not found | Alomar Holding' };

  return {
    title: `${localizedText(project.title, locale)} | Alomar Holding`,
    description: localizedText(project.excerpt, locale),
    openGraph: {
      images: project.image ? [project.image] : [],
    },
  };
}

export default async function SingleProjectPage({ params }: Props) {
  const { slug, lang } = await params;
  const locale: Locale = lang === 'en' ? 'en' : 'ar';
  const direction = locale === 'ar' ? 'rtl' : 'ltr';
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
    { ar: 'أنظمة المنازل الذكية والتحكم في الطاقة', en: 'Smart home systems and energy controls' },
    { ar: 'حدائق ومسطحات خضراء وممشى رياضي', en: 'Landscaped gardens and a dedicated walking track' },
    { ar: 'أمن وحراسة وأنظمة مراقبة ذكية 24/7', en: '24/7 security and smart monitoring systems' },
    { ar: 'مواقف سيارات مخصصة وشواحن كهربائية', en: 'Dedicated parking and electric vehicle chargers' },
  ];
  const projectHighlights = project.highlights?.length
    ? project.highlights.map((highlight) => localizedText(highlight, locale)).filter(Boolean)
    : siteContent.previewMode ? previewHighlights.map((highlight) => highlight[locale]) : [];
  const projectTitle = localizedText(project.title, locale);
  const projectExcerpt = localizedText(project.excerpt, locale);
  const projectContent = localizedText(project.content, locale);
  const projectCategory = locale === 'ar' ? project.category : project.category_en || project.category;
  const projectStatus = locale === 'ar' ? project.status : project.status_en || project.status;
  const projectLocation = locale === 'ar' ? project.location : project.location_en || project.location;
  const projectsPath = `/${locale}/projects`;

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#F8F9F4] pt-28 pb-20" dir={direction}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Breadcrumb & Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#5A677B]">
              <Link href={`/${locale}`} className="hover:text-[#101E39] transition-colors">{locale === 'ar' ? 'الرئيسية' : 'Home'}</Link>
              <span>/</span>
              <Link href={projectsPath} className="hover:text-[#101E39] transition-colors">{locale === 'ar' ? 'مشاريعنا' : 'Projects'}</Link>
              <span>/</span>
              <span className="text-[#101E39] font-bold">{projectTitle}</span>
            </div>

            <Link
              href={projectsPath}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#101E39] hover:text-[#B7913D] transition-colors"
            >
              {locale === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              <span>{locale === 'ar' ? 'العودة لكافة المشاريع' : 'Back to all projects'}</span>
            </Link>
          </div>

          {/* Project Title & Badges */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            {project.logo && (
              <div className="flex h-24 w-36 shrink-0 items-center justify-center rounded-2xl border border-[#101E39]/10 bg-white p-4 shadow-sm">
                <Image src={project.logo.url} alt={project.logo.alt || `${projectTitle} logo`} width={160} height={96} className="max-h-full w-full object-contain" />
              </div>
            )}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                {projectCategory && (
                  <span className="rounded-full bg-[#101E39] px-3.5 py-1 text-xs font-bold text-white">
                    {projectCategory}
                  </span>
                )}
                {projectStatus && (
                  <span className="rounded-full border border-[#B7913D]/30 bg-[#B7913D]/20 px-3.5 py-1 text-xs font-bold text-[#101E39]">
                    {projectStatus}
                  </span>
                )}
                {projectLocation && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-[#5A677B]">
                    <MapPin className="h-3.5 w-3.5 text-[#B7913D]" />
                    <span>{projectLocation}</span>
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-[#101E39] sm:text-4xl lg:text-5xl">
                {projectTitle}
              </h1>
            </div>
          </div>

          {/* Main Visual Image & Gallery */}
          <div className="space-y-4">
            <div className="relative h-[380px] sm:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              {project.image ? (
                <Image
                  src={project.image}
                  alt={projectTitle}
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
                      alt={`${projectTitle} ${locale === 'ar' ? 'صورة' : 'image'} ${i + 1}`}
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
                {locale === 'ar' ? 'نظرة عامة على المشروع' : 'Project overview'}
              </h2>

              <div className="space-y-4 text-base text-[#5A677B] leading-relaxed">
                {projectExcerpt && <p>{projectExcerpt}</p>}
                {projectContent && <p>{projectContent}</p>}
              </div>

              {/* Architectural Highlights */}
              {projectHighlights.length > 0 && <div className="pt-6 border-t border-[#101E39]/10 space-y-4">
                <h3 className="text-lg font-bold text-[#101E39]">{locale === 'ar' ? 'أبرز المزايا والمواصفات:' : 'Key features and specifications'}</h3>
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
                  {locale === 'ar' ? 'بيانات ومواصفات المشروع' : 'Project specifications'}
                </h3>

                <div className="space-y-4 text-sm">
                  {project.units_count && (
                    <div className="flex items-center justify-between py-2 border-b border-white/10">
                      <span className="text-white/60">{locale === 'ar' ? 'الوحدات:' : 'Units:'}</span>
                      <span className="font-bold text-white">{project.units_count}</span>
                    </div>
                  )}

                  {project.land_area && (
                    <div className="flex items-center justify-between py-2 border-b border-white/10">
                      <span className="text-white/60">{locale === 'ar' ? 'مساحة الأرض:' : 'Land area:'}</span>
                      <span className="font-bold text-white">{project.land_area}</span>
                    </div>
                  )}

                  {project.built_area && (
                    <div className="flex items-center justify-between py-2 border-b border-white/10">
                      <span className="text-white/60">{locale === 'ar' ? 'المساحة المبنية:' : 'Built area:'}</span>
                      <span className="font-bold text-white">{project.built_area}</span>
                    </div>
                  )}

                  {project.completion_year && (
                    <div className="flex items-center justify-between py-2 border-b border-white/10">
                      <span className="text-white/60">{locale === 'ar' ? 'سنة الإنجاز:' : 'Completion year:'}</span>
                      <span className="font-bold text-white">{project.completion_year}</span>
                    </div>
                  )}

                  {projectLocation && (
                    <div className="flex items-center justify-between py-2 border-b border-white/10">
                      <span className="text-white/60">{locale === 'ar' ? 'الموقع:' : 'Location:'}</span>
                      <span className="font-bold text-white">{projectLocation}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 space-y-3">
                  <Link
                    href={`/${locale}/contact-us`}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-[#101E39] gold-gradient-bg shadow-lg hover:shadow-xl transition-all"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>{locale === 'ar' ? 'حجز أو استفسار عن المشروع' : 'Enquire about this project'}</span>
                  </Link>

                  {project.brochure_url && (
                    <a
                      href={project.brochure_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-xs text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>{locale === 'ar' ? 'تحميل الكتيب الرقمي (PDF)' : 'Download brochure (PDF)'}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          <ProjectTextBandSection band={project.statsBand} locale={locale} />
          <ProjectTextBandSection band={project.makeBand} locale={locale} />
          <ProjectCompaniesBand project={project} locale={locale} />
          <ProjectTextBandSection band={project.experienceBand} locale={locale} />
          <ProjectKeyProjectsBand project={project} locale={locale} />

          {/* Related Projects */}
          {relatedProjects.length > 0 && (
            <div className="space-y-6 pt-12 border-t border-[#101E39]/10">
              <h3 className="text-2xl font-bold text-[#101E39]">{locale === 'ar' ? 'مشاريع أخرى من محفظتنا' : 'Other projects in our portfolio'}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {relatedProjects.map((p) => (
                  <Link
                    key={p.id}
                    href={`${projectsPath}/${p.slug}`}
                    className="bg-white rounded-2xl overflow-hidden border border-[#101E39]/10 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="relative h-44">
                      {p.image ? (
                        <Image
                          src={p.image}
                          alt={localizedText(p.title, locale)}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#101E39] to-[#1B4332]" aria-hidden="true" />
                      )}
                    </div>
                    <div className="p-4 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-[#B7913D]">{locale === 'ar' ? p.category : p.category_en || p.category}</span>
                      <h4 className="font-bold text-[#101E39] text-sm group-hover:text-[#B7913D] transition-colors">
                        {localizedText(p.title, locale)}
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
