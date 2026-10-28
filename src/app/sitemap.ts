import { MetadataRoute } from 'next';
import { wpClient } from '@/lib/wordpress/client';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://alomarholding.sa';
  const projects = await wpClient.getProjects('all');
  const news = await wpClient.getNews();

  const locales = ['ar', 'en'] as const;
  const staticRoutes = ['', '/about', '/investments', '/companies', '/media-center', '/news', '/contact-us', '/invest-with-us'];
  const staticPages = locales.flatMap((locale) => staticRoutes.map((route) => ({
    url: `${baseUrl}/${locale}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  })));

  const projectPages = locales.flatMap((locale) => projects.map((project) => ({
    url: `${baseUrl}/${locale}/investments/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  })));

  const newsPages = locales.flatMap((locale) => news.map((article) => ({
    url: `${baseUrl}/${locale}/media-center/${article.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  })));

  return [...staticPages, ...projectPages, ...newsPages];
}
