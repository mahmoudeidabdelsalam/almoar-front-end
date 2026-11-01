import { MetadataRoute } from 'next';
import { wpClient } from '@/lib/wordpress/client';
import { SITE_URL } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, news] = await Promise.all([
    wpClient.getProjects('all'),
    wpClient.getNews(),
  ]);
  const locales = ['ar', 'en'] as const;
  const staticRoutes = ['', '/about', '/projects', '/news', '/contact-us', '/invest-with-us', '/our-investments'];
  const urls = new Set<string>();
  const entries: MetadataRoute.Sitemap = [];

  for (const route of staticRoutes) {
    const languages = Object.fromEntries(
      locales.map((locale) => [locale, `${SITE_URL}/${locale}${route}`]),
    );
    for (const locale of locales) {
      const url = `${SITE_URL}/${locale}${route}`;
      if (urls.has(url)) continue;
      urls.add(url);
      entries.push({
        url,
        alternates: { languages },
        changeFrequency: 'weekly',
        priority: route === '' ? 1 : 0.8,
      });
    }
  }

  for (const project of projects) {
    if (!project.slug) continue;
    const availableLocales = locales.filter((locale) => project.title[locale].trim());
    const languages = Object.fromEntries(
      availableLocales.map((locale) => [locale, `${SITE_URL}/${locale}/projects/${project.slug}`]),
    );
    for (const locale of availableLocales) {
      const url = `${SITE_URL}/${locale}/projects/${project.slug}`;
      if (urls.has(url)) continue;
      urls.add(url);
      entries.push({
        url,
        ...(availableLocales.length > 1 ? { alternates: { languages } } : {}),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }

  for (const article of news) {
    if (!Number.isInteger(article.id) || article.id <= 0) continue;
    const availableLocales = locales.filter((locale) => article.title[locale].trim());
    const languages = Object.fromEntries(
      availableLocales.map((locale) => [locale, `${SITE_URL}/${locale}/news/${article.id}`]),
    );
    for (const locale of availableLocales) {
      const url = `${SITE_URL}/${locale}/news/${article.id}`;
      if (urls.has(url)) continue;
      urls.add(url);
      entries.push({
        url,
        ...(availableLocales.length > 1 ? { alternates: { languages } } : {}),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  }

  return entries;
}
