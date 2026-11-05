import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { wpClient } from '@/lib/wordpress/client';
import { Download, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import type { Metadata } from 'next';
import type { Locale, LocalizedString, Project } from '@/types';
import { createLocalizedMetadata } from '@/lib/seo';

interface Props {
  params: Promise<{ slug: string; lang?: string }>;
}

function localizedText(value: LocalizedString | undefined, locale: Locale): string {
  return value?.[locale]?.trim() || value?.[locale === 'ar' ? 'en' : 'ar']?.trim() || '';
}

function ProjectCompaniesBand({ project, locale }: { project: Project; locale: Locale }) {
  const band = project.companiesBand;
  if (!band) return null;
  const tag = localizedText(band.tag, locale);
  const headline = localizedText(band.headline, locale);
  const items = band.items.filter((item) => item.logo.url);
  if (!tag && !headline && !items.length) return null;

  return (
    <section className="project-companies w-full px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
      <div className="mb-5 flex items-end justify-between gap-6 mx-auto max-w-[1216px]">
        <div>
          {tag && <p className="mb-2 text-xs font-medium text-gold-600">{tag}</p>}
          {headline && <h2 className="text-xl font-semibold text-navy-900 sm:text-2xl">{headline}</h2>}
        </div>
        <Link href={`/${locale}/projects`} className="shrink-0 text-xs font-medium text-gold-600 transition-colors hover:text-navy-900">
          {locale === 'ar' ? 'جميع الاستثمارات' : 'All investments'}
          <ArrowLeft className={`ms-2 inline h-3.5 w-3.5 ${locale === 'en' ? 'rotate-180' : ''}`} aria-hidden="true" />
        </Link>
      </div>
      {items.length > 0 && (
        <div className="grid grid-cols-3 items-center gap-3 sm:grid-cols-4 md:grid-cols-6 mx-auto max-w-[1216px]">
          {items.map((item, index) => {
            const alt = item.logo.alt || `${headline || project.title[locale]} company logo ${index + 1}`;
            const logo = (
              <Image
                src={item.logo.url}
                alt={alt}
                width={220}
                height={120}
                sizes="(max-width: 640px) 30vw, 140px"
                className="h-full w-full object-contain"
              />
            );
            return item.link ? (
              <a
                key={`${item.link}-${index}`}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={alt}
                className="flex h-[120px]"
              >
                {logo}
              </a>
            ) : (
              <div key={`${alt}-${index}`} className="flex h-[120px]">
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
    item.image?.url || localizedText(item.head, locale) || localizedText(item.text, locale),
  );
  if (!tag && !headline && !items.length) return null;

  return (
    <section className="project-key-projects">
      <div className="mx-auto max-w-[1216px] px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
      {(tag || headline) && (
        <div className="mb-7">
          {tag && <p className="mb-2 text-xs font-medium text-gold-600">{tag}</p>}
          {headline && <h2 className="text-3xl font-semibold text-navy-900 sm:text-4xl">{headline}</h2>}
        </div>
      )}
      {items.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => {
            const head = localizedText(item.head, locale);
            const location = localizedText(item.location, locale);
            const text = localizedText(item.text, locale);
            const content = (
              <>
                {item.image?.url && (
                  <div className="relative aspect-[1.45] overflow-hidden">
                    <Image
                      src={item.image.url}
                      alt={item.image.alt || head || project.title[locale]}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="space-y-2 p-5 sm:p-6">
                  {location && <p className="text-xs font-medium text-gold-600">{location}</p>}
                  {head && <h3 className="text-lg font-semibold text-navy-900">{head}</h3>}
                  {text && <p className="text-sm leading-6 text-[#5A677B]">{text}</p>}
                </div>
              </>
            );
            const className = 'group overflow-hidden rounded-2xl border border-navy-900/10 bg-white transition-shadow hover:shadow-lg';
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
                {content}
              </a>
            ) : (
              <article key={key} className={className}>{content}</article>
            );
          })}
        </div>
      )}
      </div>
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

  const availableLocales = (['ar', 'en'] as const).filter((projectLocale) =>
    project.title[projectLocale].trim(),
  );
  return createLocalizedMetadata({
    title: `${localizedText(project.title, locale)} | Alomar Holding`,
    description: localizedText(project.excerpt, locale) || `${localizedText(project.title, locale)} | Alomar Holding`,
    locale,
    pathname: `/${locale}/projects/${slug}`,
    alternateLocales: availableLocales,
    image: project.image,
  });
}

export default async function SingleProjectPage({ params }: Props) {
  const { slug, lang } = await params;
  const locale: Locale = lang === 'en' ? 'en' : 'ar';
  const direction = locale === 'ar' ? 'rtl' : 'ltr';
  const project = await wpClient.getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const allProjects = await wpClient.getProjects('all');
  const projectIndex = allProjects.findIndex((item) => item.slug === slug);
  const previousProject = projectIndex >= 0 && allProjects.length > 1
    ? allProjects[(projectIndex - 1 + allProjects.length) % allProjects.length]
    : undefined;
  const nextProject = projectIndex >= 0 && allProjects.length > 1
    ? allProjects[(projectIndex + 1) % allProjects.length]
    : undefined;
  const projectTitle = localizedText(project.title, locale);
  const projectExcerpt = localizedText(project.excerpt, locale);
  const projectContent = localizedText(project.content, locale);
  const projectWebsite = /^https?:\/\//i.test(project.websiteUrl || '') ? project.websiteUrl : undefined;
  const projectLogo = project.logo ? (
    <div className="flex h-[96px] w-[335px] shrink-0 items-center justify-center bg-[#f8f7f3] rounded-xl p-2">
      <Image src={project.logo.url} alt={project.logo.alt || `${projectTitle} logo`} width={190} height={90} className="max-h-full w-full object-contain" />
    </div>
  ) : null;
  const projectCategoryValue = locale === 'ar'
    ? project.categoryTerms?.[0]?.name.ar || project.category
    : project.categoryTerms?.[0]?.name.en || project.category_en || project.category;
  const termTranslations: Record<string, { ar: string; en: string }> = {
    residential: { ar: 'سكني', en: 'Residential' },
    commercial: { ar: 'تجاري', en: 'Commercial' },
    'mixed-use': { ar: 'متعدد الاستخدامات', en: 'Mixed-use' },
  };
  const projectCategory = termTranslations[projectCategoryValue.toLowerCase()]?.[locale] || projectCategoryValue;
  const projectStatus = locale === 'ar' ? project.status : project.status_en || project.status;
  const projectLocationValue = locale === 'ar' ? project.location : project.location_en || project.location;
  const projectLocation = projectLocationValue.toLowerCase() === 'riyadh'
    ? locale === 'ar' ? 'الرياض' : 'Riyadh'
    : projectLocationValue;
  const projectsPath = `/${locale}/projects`;
  const statsTag = localizedText(project.statsBand?.tag, locale);
  const statsHeadline = localizedText(project.statsBand?.headline, locale);
  const statsItems = project.statsBand?.items || [];
  const hasNumericStats = statsItems.some((item) => /[0-9٠-٩]/.test(localizedText(item.head, locale)));
  const stats = statsItems.filter((item) =>
    hasNumericStats
      ? /[0-9٠-٩]/.test(localizedText(item.head, locale))
      : Boolean(localizedText(item.head, locale) || localizedText(item.text, locale)),
  );
  const benefitsTag = localizedText(project.experienceBand?.tag, locale);
  const benefitsTitle = localizedText(project.experienceBand?.headline, locale);
  const benefits = project.experienceBand?.items.filter((item) => localizedText(item.head, locale) || localizedText(item.text, locale)) || [];
  const overviewTitle = localizedText(project.makeBand?.headline, locale) || projectExcerpt;
  const overviewText = [
    projectContent,
    ...((project.makeBand?.items || []).map((item) => localizedText(item.text, locale)).filter(Boolean)),
  ].filter(Boolean);
  const relatedProjectImage = nextProject?.image || previousProject?.image || project.image;

  return (
    <>
      <Header />
      <main className="project-page flex-1 bg-ivory-50" dir={direction}>
        <section className="project-page__hero relative overflow-hidden bg-navy-900 text-white">
          <div className="project-page__hero-inner mx-auto flex w-full max-w-[1216px] flex-col justify-between px-5 pb-36 pt-28 sm:px-8 lg:px-8 2xl:px-0">
            <div className="flex items-center justify-between gap-6 text-xs sm:text-sm" dir="ltr">
              <Link href={projectsPath} className="font-semibold transition-colors hover:text-gold-200">
                {locale === 'ar' ? 'العودة لكافة المشاريع' : 'Back to all projects'}
                {locale === 'ar' ? <ArrowRight className="ms-2 inline h-4 w-4" /> : <ArrowLeft className="ms-2 inline h-4 w-4" />}
              </Link>
              <nav className="flex flex-wrap items-center gap-2 text-white/65" dir={direction} aria-label={locale === 'ar' ? 'مسار التنقل' : 'Breadcrumb'}>
                <Link href={`/${locale}`} className="hover:text-white">{locale === 'ar' ? 'الرئيسية' : 'Home'}</Link>
                <span aria-hidden="true">/</span>
                <Link href={projectsPath} className="hover:text-white">{locale === 'ar' ? 'مشاريعنا' : 'Projects'}</Link>
                <span aria-hidden="true">/</span>
                <span className="text-white">{projectTitle}</span>
              </nav>
            </div>
            <div className="mt-14 flex items-end justify-between gap-8 sm:mt-16" dir="ltr">
              <div className="project-page__brand-card">
                {project.logo && (
                  <>
                    <span className="shrink-0 bg-navy-900/20" aria-hidden="true" />
                    {projectWebsite ? (
                      <a
                        href={projectWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={locale === 'ar' ? `زيارة الموقع الإلكتروني لـ ${projectTitle}` : `Visit ${projectTitle} website`}
                        className="rounded-sm transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
                      >
                        {projectLogo}
                      </a>
                    ) : projectLogo}
                  </>
                )}
              </div>
              <div className="max-w-4xl" dir={direction}>
                {projectStatus && <p className="mb-3 text-sm text-gold-200">{projectStatus}</p>}
                <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-[96px]">{projectTitle}</h1>
              </div>
            </div>
          </div>
          <svg className="pointer-events-none absolute inset-x-0 bottom-0 h-7 w-full text-ivory-50 sm:h-10" viewBox="0 0 1440 64" preserveAspectRatio="none" aria-hidden="true">
            <path fill="currentColor" d="M0 30H540C600 30 610 0 720 0s120 30 180 30h540v34H0z" />
          </svg>
        </section>

        <section className="project-page__overview px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
          <div className="mx-auto grid mx-auto flex w-full max-w-[1216px] items-center gap-10 md:grid-cols-2 lg:gap-20" dir="ltr">
            <div className="project-page__overview-image relative aspect-[0.88] overflow-hidden rounded-2xl bg-navy-900/10">
              {project.image ? (
                <Image src={project.image} alt={projectTitle} fill sizes="(max-width: 767px) 100vw, 42vw" className="object-cover" priority />
              ) : <div className="absolute inset-0 bg-gradient-to-br from-navy-900 to-[#1B4332]" aria-hidden="true" />}
            </div>
            <div className="mb-7" dir={direction}>
              <p className="mb-3 text-xs font-medium text-gold-600">{locale === 'ar' ? 'عن الشركة' : 'About the company'}</p>
              {overviewTitle && <h2 className="mb-5 text-3xl font-semibold leading-tight text-navy-900 sm:text-4xl">{overviewTitle}</h2>}
              <span className="mb-4 inline-block h-px w-8 bg-gold-500" aria-hidden="true" />
              <div className="space-y-4 text-sm leading-7 text-[#5A677B] sm:text-base">
                {overviewText.map((paragraph, index) => <p key={`${paragraph}-${index}`}>{paragraph}</p>)}
              </div>
              {project.brochure_url && (
                <a href={project.brochure_url} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-navy-900 transition-colors hover:text-gold-600">
                  <Download className="h-4 w-4" />
                  {locale === 'ar' ? 'تحميل الكتيب الرقمي' : 'Download brochure'}
                </a>
              )}
            </div>
          </div>
        </section>

        {(statsTag || statsHeadline || stats.length > 0) && (
          <section className="project-page__stats bg-navy-900 text-white">
            <div className="mx-auto flex flex-col w-full max-w-[1216px] px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
              <div className="mb-8">
                {statsTag && <p className="mb-8 text-xs font-medium text-gold-500">{statsTag}</p>}
                {statsHeadline && <h2 className="text-4xl font-medium sm:text-5xl lg:text-[56px]">{statsHeadline}</h2>}
              </div>
              {stats.length > 0 && (
                <div className="grid gap-y-7 sm:grid-cols-3">
                  {stats.map((item, index) => {
                    const head = localizedText(item.head, locale);
                    const text = localizedText(item.text, locale);
                    return (
                      <article key={`${head}-${index}`} className="project-page__stat">
                        {head && <p className="text-[20px] font-medium tabular-nums text-gold-500 sm:text-2xl lg:text-[40px]">{head}</p>}
                        {text && <p className="mt-4 text-sm text-white/80 sm:text-base">{text}</p>}
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        )}

        {benefits.length > 0 && (
          <section className="project-page__benefits px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
            <div className="mx-auto max-w-[1216px]">
              <div className="mb-7">
                {benefitsTag && <p className="mb-2 text-xs font-medium text-gold-600">{benefitsTag}</p>}
                {benefitsTitle && <h2 className="text-3xl font-semibold text-navy-900 sm:text-4xl">{benefitsTitle}</h2>}
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
                {benefits.map((item, index) => {
                  const head = localizedText(item.head, locale);
                  const text = localizedText(item.text, locale);
                  return (
                    <article key={`${head}-${index}`} className="project-page__benefit-card flex min-h-[180px] flex-col items-end gap-5 rounded-2xl border border-navy-900/15 bg-white p-6 sm:min-h-[210px] sm:p-8 lg:min-h-[230px]">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold-50 text-gold-600 sm:h-[60px] sm:w-[60px]"><Check className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" /></span>
                      <div>
                        {head && <h3 className="text-xl font-medium leading-[1.5] text-navy-900 sm:text-2xl lg:text-[28px]">{head}</h3>}
                        {text && <p className="mt-2 text-sm leading-6 text-[#5A677B] sm:text-base">{text}</p>}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        <div className="space-y-14 px-5 pb-16 sm:px-8 sm:pb-20">
          <ProjectKeyProjectsBand project={project} locale={locale} />
          <ProjectCompaniesBand project={project} locale={locale} />
          <nav className="project-page__related mx-auto grid w-full max-w-[1216px] gap-5 lg:grid-cols-2 lg:gap-8" aria-label={locale === 'ar' ? 'روابط ذات صلة' : 'Related links'}>
            <Link href={`/${locale}/our-investments`} className={`related-page-card group${relatedProjectImage ? ' related-page-card--has-image' : ''}`} dir={direction}>
              {relatedProjectImage && (
                <span className="related-page-card__image" aria-hidden="true">
                  <Image src={relatedProjectImage} alt="" fill sizes="130px" className="object-cover" />
                </span>
              )}
              <span className="related-page-card__copy">
                <span className="related-page-card__eyebrow">{locale === 'ar' ? 'الاستمرار بالقراءة' : 'Continue reading'}</span>
                <span className="related-page-card__title">{locale === 'ar' ? 'الذهاب إلى' : 'Go to'}</span>
                <span className="related-page-card__destination">{locale === 'ar' ? 'استثماراتنا' : 'Our investments'}</span>
              </span>
              <span className="related-page-card__arrow" aria-hidden="true"><ArrowLeft className="h-5 w-5" /></span>
            </Link>
            <Link href={`/${locale}/news`} className="related-page-card related-page-card--has-image group" dir={direction}>
              <span className="related-page-card__image" aria-hidden="true">
                <Image src="/images/hero_riyadh.jpg" alt="" fill sizes="130px" className="object-cover" />
              </span>
              <span className="related-page-card__copy">
                <span className="related-page-card__eyebrow">{locale === 'ar' ? 'الاستمرار بالقراءة' : 'Continue reading'}</span>
                <span className="related-page-card__title">{locale === 'ar' ? 'الذهاب إلى' : 'Go to'}</span>
                <span className="related-page-card__destination">{locale === 'ar' ? 'المركز الإعلامي' : 'Media center'}</span>
              </span>
              <span className="related-page-card__arrow" aria-hidden="true"><ArrowLeft className="h-5 w-5" /></span>
            </Link>
          </nav>
        </div>
      </main>
      <Footer />
    </>
  );
}
