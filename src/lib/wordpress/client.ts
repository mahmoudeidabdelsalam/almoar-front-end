import {
  SiteSettings,
  Project,
  Sector,
  SubsidiaryCompany,
  TeamMember,
  NewsArticle,
  HeroSlide,
} from '@/types';
import {
  mockSettings,
  mockProjects,
  mockSectors,
  mockCompanies,
  mockTeam,
  mockNews,
} from './mock-data';
import { cacheLife } from 'next/cache';

const WP_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || process.env.WORDPRESS_API_URL || '';
const WP_GRAPHQL_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL ||
  process.env.WORDPRESS_GRAPHQL_URL ||
  (WP_API_URL ? `${WP_API_URL.replace(/\/$/, '')}/graphql` : '');

type GraphQLNode = {
  databaseId?: number;
  id?: string;
  slug?: string;
  date?: string | null;
  title?: string;
  content?: string;
  excerpt?: string;
  titleEn?: string | null;
  excerptEn?: string | null;
  contentEn?: string | null;
  statusAr?: string | null;
  statusEn?: string | null;
  locationAr?: string | null;
  locationEn?: string | null;
  unitsCount?: string | null;
  landArea?: string | null;
  builtArea?: string | null;
  completionYear?: string | null;
  brochureUrl?: string | null;
  featured?: boolean | null;
  summaryEn?: string | null;
  sectorIcon?: string | null;
  nameEn?: string | null;
  taglineAr?: string | null;
  taglineEn?: string | null;
  descriptionEn?: string | null;
  companyWebsite?: string | null;
  companyYear?: string | null;
  roleAr?: string | null;
  roleEn?: string | null;
  bioEn?: string | null;
  displayOrder?: number | null;
  uri?: string;
  sourceUrl?: string;
  name?: string;
  featuredImage?: {
    node?: {
      sourceUrl?: string | null;
    } | null;
  } | null;
  projectCategories?: {
    nodes?: Array<{ name?: string | null }> | null;
  } | null;
  projectLocations?: {
    nodes?: Array<{ name?: string | null }> | null;
  } | null;
};

type GraphQLResponse<T> = {
  data?: T;
  errors?: Array<{ message?: string }>;
};

function stripHtml(value?: string | null): string {
  return (value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function toLocalizedText(value?: string | null): { ar: string; en: string } {
  const text = stripHtml(value || '');
  return {
    ar: text || '—',
    en: text || '—',
  };
}

function pickImage(node?: GraphQLNode | null): string {
  return node?.featuredImage?.node?.sourceUrl || node?.sourceUrl || '/images/hero_riyadh.jpg';
}

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 3000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

async function fetchGraphQL<T>(query: string): Promise<T> {
  'use cache';
  cacheLife('minutes');

  if (!WP_GRAPHQL_URL) {
    throw new Error('GraphQL endpoint is not configured');
  }

  const res = await fetchWithTimeout(WP_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ query }),
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`GraphQL request failed: ${res.status}`);
  }

  const body = (await res.json()) as GraphQLResponse<T>;

  if (body.errors?.length) {
    throw new Error(body.errors[0]?.message || 'GraphQL request returned an error');
  }

  return (body.data ?? {}) as T;
}

export const wpClient = {
  async getHomeHeroSlides(): Promise<HeroSlide[]> {
    if (!WP_GRAPHQL_URL) return [];

    try {
      const data = await fetchGraphQL<{
        homePageContent?: Array<{
          image?: string | null;
          badgeAr?: string | null;
          badgeEn?: string | null;
          titleAr?: string | null;
          titleEn?: string | null;
          descAr?: string | null;
          descEn?: string | null;
          primaryLink?: string | null;
          secondaryLink?: string | null;
        }> | null;
      }>(`{
        homePageContent {
          image
          badgeAr
          badgeEn
          titleAr
          titleEn
          descAr
          descEn
          primaryLink
          secondaryLink
        }
      }`);

      return (data.homePageContent ?? []).map((slide, index) => ({
        id: index + 1,
        image: slide.image || '/images/hero_riyadh.jpg',
        badge_ar: slide.badgeAr || '',
        badge_en: slide.badgeEn || '',
        title_ar: slide.titleAr || '',
        title_en: slide.titleEn || '',
        desc_ar: slide.descAr || '',
        desc_en: slide.descEn || '',
        primary_link: slide.primaryLink || '/sectors',
        secondary_link: slide.secondaryLink || '/projects',
      }));
    } catch {
      return [];
    }
  },

  async getSettings(): Promise<SiteSettings> {
    'use cache';
    cacheLife('minutes');

    if (!WP_API_URL) return mockSettings;
    try {
      const res = await fetchWithTimeout(`${WP_API_URL}/wp-json/alomar/v1/settings`, {
        next: { revalidate: 300 },
      });
      if (!res.ok) throw new Error('Failed to fetch settings');
      return await res.json();
    } catch {
      return mockSettings;
    }
  },

  async getProjects(category?: string): Promise<Project[]> {
    if (!WP_GRAPHQL_URL && !WP_API_URL) {
      if (!category || category === 'all') return mockProjects;
      return mockProjects.filter(
        (p) => p.category.toLowerCase().includes(category.toLowerCase()) || p.category_en?.toLowerCase().includes(category.toLowerCase())
      );
    }

    try {
      if (WP_GRAPHQL_URL) {
        const data = await fetchGraphQL<{
          projects?: { nodes?: GraphQLNode[] | null };
        }>(`{
          projects(first: 50) {
            nodes {
              databaseId
              slug
              title
              excerpt
              content
              titleEn
              excerptEn
              contentEn
              statusAr
              statusEn
              locationAr
              locationEn
              unitsCount
              landArea
              builtArea
              completionYear
              brochureUrl
              featured
              featuredImage { node { sourceUrl } }
              projectCategories { nodes { name } }
              projectLocations { nodes { name } }
            }
          }
        }`);

        const mapped = (data.projects?.nodes ?? []).map((node) => {
          const title = stripHtml(node.title || '');
          const excerpt = stripHtml(node.excerpt || '');
          const content = stripHtml(node.content || '');
          const categoryName = node.projectCategories?.nodes?.[0]?.name || 'Residential';
          const locationName = node.projectLocations?.nodes?.[0]?.name || 'Riyadh';

          return {
            id: node.databaseId ?? 0,
            slug: node.slug || node.uri || title.toLowerCase().replace(/\s+/g, '-'),
            title: {
              ar: title || 'مشروع العمر',
              en: stripHtml(node.titleEn) || title || 'Alomar project',
            },
            excerpt: {
              ar: excerpt || 'مشروع من محفظة العمر القابضة.',
              en: stripHtml(node.excerptEn) || excerpt || 'A project from Alomar Holding.',
            },
            content: {
              ar: content || 'مشروع من محفظة العمر القابضة.',
              en: stripHtml(node.contentEn) || content || 'A project from Alomar Holding.',
            },
            image: pickImage(node),
            category: categoryName,
            category_en: categoryName,
            location: stripHtml(node.locationAr) || locationName,
            location_en: stripHtml(node.locationEn) || locationName,
            status: stripHtml(node.statusAr) || 'قيد التطوير',
            status_en: stripHtml(node.statusEn) || 'Under Development',
            units_count: node.unitsCount || undefined,
            land_area: node.landArea || undefined,
            built_area: node.builtArea || undefined,
            completion_year: node.completionYear || '2026',
            brochure_url: node.brochureUrl || undefined,
            featured: node.featured ?? true,
          } as Project;
        });

        if (mapped.length > 0) {
          if (!category || category === 'all') return mapped;
          return mapped.filter(
            (p) => p.category.toLowerCase().includes(category.toLowerCase()) || p.category_en?.toLowerCase().includes(category.toLowerCase())
          );
        }
        if (!category || category === 'all') return mockProjects;
        return mockProjects.filter((p) => p.category.includes(category));
      }

      if (!WP_API_URL) throw new Error('WordPress REST API is not configured');

      const url = new URL(`${WP_API_URL}/wp-json/alomar/v1/projects`);
      if (category && category !== 'all') {
        url.searchParams.set('category', category);
      }
      const res = await fetchWithTimeout(url.toString(), { next: { revalidate: 60 } });
      if (!res.ok) throw new Error('Failed to fetch projects');
      return await res.json();
    } catch {
      if (!category || category === 'all') return mockProjects;
      return mockProjects.filter((p) => p.category.includes(category));
    }
  },

  async getProjectBySlug(slug: string): Promise<Project | null> {
    const list = await this.getProjects('all');
    return list.find((p) => p.slug === slug) || null;
  },

  async getSectors(): Promise<Sector[]> {
    if (!WP_GRAPHQL_URL && !WP_API_URL) return mockSectors;

    try {
      if (WP_GRAPHQL_URL) {
        const data = await fetchGraphQL<{
          sectors?: { nodes?: GraphQLNode[] | null };
        }>(`{
          sectors(first: 20) {
            nodes {
              databaseId
              slug
              title
              excerpt
              content
              titleEn
              summaryEn
              sectorIcon
              featuredImage { node { sourceUrl } }
            }
          }
        }`);

        const mapped = (data.sectors?.nodes ?? []).map((node) => ({
          id: node.databaseId ?? 0,
          slug: node.slug || node.uri || 'sector',
          title: { ar: stripHtml(node.title), en: stripHtml(node.titleEn) || stripHtml(node.title) },
          summary: { ar: stripHtml(node.excerpt), en: stripHtml(node.summaryEn) || stripHtml(node.excerpt) },
          content: toLocalizedText(node.content),
          icon: node.sectorIcon || 'building',
          image: pickImage(node),
          stats: [],
        } as Sector));

        return mapped.length > 0 ? mapped : mockSectors;
      }

      if (!WP_API_URL) return mockSectors;
      const res = await fetchWithTimeout(`${WP_API_URL}/wp-json/alomar/v1/sectors`, {
        next: { revalidate: 300 },
      });
      if (!res.ok) throw new Error('Failed to fetch sectors');
      return await res.json();
    } catch {
      return mockSectors;
    }
  },

  async getCompanies(): Promise<SubsidiaryCompany[]> {
    if (!WP_GRAPHQL_URL && !WP_API_URL) return mockCompanies;

    try {
      if (WP_GRAPHQL_URL) {
        const data = await fetchGraphQL<{
          companies?: { nodes?: GraphQLNode[] | null };
        }>(`{
          companies(first: 20) {
            nodes {
              databaseId
              slug
              title
              excerpt
              content
              nameEn
              taglineAr
              taglineEn
              descriptionEn
              companyWebsite
              companyYear
              featuredImage { node { sourceUrl } }
            }
          }
        }`);

        const mapped = (data.companies?.nodes ?? []).map((node) => ({
          id: node.databaseId ?? 0,
          slug: node.slug || node.uri || 'company',
          name: { ar: stripHtml(node.title), en: stripHtml(node.nameEn) || stripHtml(node.title) },
          tagline: {
            ar: stripHtml(node.taglineAr) || stripHtml(node.excerpt),
            en: stripHtml(node.taglineEn) || stripHtml(node.excerpt),
          },
          description: {
            ar: stripHtml(node.content) || stripHtml(node.excerpt),
            en: stripHtml(node.descriptionEn) || stripHtml(node.content) || stripHtml(node.excerpt),
          },
          logo: pickImage(node),
          website: node.companyWebsite || undefined,
          year: node.companyYear || undefined,
        } as SubsidiaryCompany));

        return mapped.length > 0 ? mapped : mockCompanies;
      }

      if (!WP_API_URL) return mockCompanies;
      const res = await fetchWithTimeout(`${WP_API_URL}/wp-json/alomar/v1/companies`, {
        next: { revalidate: 300 },
      });
      if (!res.ok) throw new Error('Failed to fetch companies');
      return await res.json();
    } catch {
      return mockCompanies;
    }
  },

  async getTeam(): Promise<TeamMember[]> {
    if (!WP_GRAPHQL_URL && !WP_API_URL) return mockTeam;

    try {
      if (WP_GRAPHQL_URL) {
        const data = await fetchGraphQL<{
          boardMembers?: { nodes?: GraphQLNode[] | null };
        }>(`{
          boardMembers(first: 20) {
            nodes {
              databaseId
              slug
              title
              content
              nameEn
              roleAr
              roleEn
              bioEn
              displayOrder
              featuredImage { node { sourceUrl } }
            }
          }
        }`);

        const mapped = (data.boardMembers?.nodes ?? []).map((node) => ({
          id: node.databaseId ?? 0,
          name: {
            ar: stripHtml(node.title),
            en: stripHtml(node.nameEn) || stripHtml(node.title),
          },
          role: {
            ar: node.roleAr || 'مجلس الإدارة',
            en: node.roleEn || 'Board Member',
          },
          bio: {
            ar: stripHtml(node.content),
            en: stripHtml(node.bioEn) || stripHtml(node.content),
          },
          image: pickImage(node),
          order: node.displayOrder ?? 0,
        } as TeamMember));

        return mapped.length > 0 ? mapped : mockTeam;
      }

      if (!WP_API_URL) return mockTeam;
      const res = await fetchWithTimeout(`${WP_API_URL}/wp-json/alomar/v1/team`, {
        next: { revalidate: 300 },
      });
      if (!res.ok) throw new Error('Failed to fetch team');
      return await res.json();
    } catch {
      return mockTeam;
    }
  },

  async getNews(): Promise<NewsArticle[]> {
    if (!WP_GRAPHQL_URL && !WP_API_URL) return mockNews;

    try {
      if (WP_GRAPHQL_URL) {
        const data = await fetchGraphQL<{
          posts?: { nodes?: GraphQLNode[] | null };
        }>(`{
          posts(first: 10) {
            nodes {
              databaseId
              date
              slug
              title
              excerpt
              content
              featuredImage { node { sourceUrl } }
            }
          }
        }`);

        const mapped = (data.posts?.nodes ?? []).filter((node) => node.slug !== 'hello-world').map((node) => ({
          id: node.databaseId ?? 0,
          slug: node.slug || node.uri || 'news-item',
          title: toLocalizedText(node.title),
          excerpt: toLocalizedText(node.excerpt),
          content: toLocalizedText(node.content),
          image: pickImage(node),
          date: node.date ? new Date(node.date).toLocaleDateString('ar-SA', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }) : mockNews[0]?.date || '1 يناير 2025',
          category: { ar: 'أخبار المجموعة', en: 'Corporate News' },
          read_time: '3 دقائق',
        } as NewsArticle));

        return mapped.length > 0 ? mapped : mockNews;
      }

      if (!WP_API_URL) return mockNews;
      const res = await fetchWithTimeout(`${WP_API_URL}/wp-json/wp/v2/posts?_embed&per_page=10`, {
        next: { revalidate: 60 },
      });
      if (!res.ok) throw new Error('Failed to fetch news');
      const posts = (await res.json()) as Array<{
        id: number;
        slug: string;
        title: { rendered: string };
        excerpt?: { rendered?: string };
        content?: { rendered?: string };
        date: string;
        _embedded?: {
          'wp:featuredmedia'?: Array<{ source_url?: string }>;
        };
      }>;

      return posts.map((post) => ({
        id: post.id,
        slug: post.slug,
        title: { ar: post.title.rendered, en: post.title.rendered },
        excerpt: { ar: post.excerpt?.rendered?.replace(/<[^>]+>/g, '') || '', en: '' },
        content: { ar: post.content?.rendered || '', en: '' },
        image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/images/hero_riyadh.jpg',
        date: new Date(post.date).toLocaleDateString('ar-SA', { day: 'numeric', month: 'long', year: 'numeric' }),
        category: { ar: 'أخبار المجموعة', en: 'Corporate News' },
        read_time: '3 دقائق',
      }));
    } catch {
      return mockNews;
    }
  },

  async getArticleBySlug(slug: string): Promise<NewsArticle | null> {
    const list = await this.getNews();
    return list.find((item) => item.slug === slug) || null;
  },
};