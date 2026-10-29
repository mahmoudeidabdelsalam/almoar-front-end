import {
  SiteSettings,
  Project,
  Sector,
  SubsidiaryCompany,
  TeamMember,
  NewsArticle,
  HeroSlide,
  SiteContent,
  InvestmentArticle,
  MediaCenterItem,
  Locale,
  HeaderContent,
  FooterContent,
  ContactPageContent,
} from '@/types';
import {
  mockSettings,
  mockProjects,
  mockSectors,
  mockCompanies,
  mockTeam,
  mockNews,
} from './mock-data';
import { cache } from 'react';

const WP_GRAPHQL_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL ||
  process.env.WORDPRESS_GRAPHQL_URL ||
  '';
const PREVIEW_MODE = process.env.NODE_ENV === 'development' && !WP_GRAPHQL_URL;
if (PREVIEW_MODE) {
  console.warn('[WordPress CMS] No endpoint is configured; development-only mock content is active.');
}

type GraphQLNode = {
  databaseId?: number;
  id?: string;
  slug?: string;
  date?: string | null;
  title?: string;
  content?: string;
  excerpt?: string;
  titleAr?: string | null;
  excerptAr?: string | null;
  contentAr?: string | null;
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
    nodes?: Array<{ name?: string | null; nameEn?: string | null }> | null;
  } | null;
  projectLocations?: {
    nodes?: Array<{ name?: string | null; nameEn?: string | null }> | null;
  } | null;
  categories?: {
    nodes?: Array<{ name?: string | null }> | null;
  } | null;
  projectGallery?: string[] | null;
  projectHighlights?: Array<{ ar?: string | null; en?: string | null }> | null;
  newsCategoryAr?: string | null;
  newsCategoryEn?: string | null;
  readTimeAr?: string | null;
  readTimeEn?: string | null;
};

type GraphQLResponse<T> = {
  data?: T | null;
  errors?: Array<{ message?: string }>;
};

class GraphQLResponseError extends Error {}

function reportCMSIssue(operation: string, error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  const log = process.env.NODE_ENV === 'development' ? console.warn : console.error;
  log(`[WordPress CMS] ${operation} failed: ${message}`);
}

function stripHtml(value?: string | null): string {
  return (value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function toLocalizedText(value?: string | null, valueEn?: string | null): { ar: string; en: string } {
  return {
    ar: stripHtml(value),
    en: stripHtml(valueEn),
  };
}

function pickImage(node?: GraphQLNode | null): string {
  return node?.featuredImage?.node?.sourceUrl || node?.sourceUrl || '';
}

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 3000): Promise<Response> {
  if (
    process.env.ALLOW_INSECURE_LOCAL_WORDPRESS_TLS === 'true'
    && /^https:\/\/(?:[^.]+\.)*(?:test|localhost)(?:[:/]|$)/i.test(url)
  ) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  }

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (error) {
    clearTimeout(id);
    const cause = error instanceof Error && error.cause instanceof Error
      ? ` (${error.cause.message})`
      : '';
    throw new Error(`CMS request failed for ${url}${cause}`, { cause: error });
  }
}

const fetchCachedGraphQLResponse = cache(async (graphqlQuery: string) => {
  const response = await fetchWithTimeout(WP_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ query: graphqlQuery }),
    next: { revalidate: 60, tags: ['wordpress-content'] },
  });

  return {
    ok: response.ok,
    status: response.status,
    statusText: response.statusText,
    body: await response.text(),
  };
});

async function fetchGraphQL<T>(query: string): Promise<T> {
  if (!WP_GRAPHQL_URL) {
    throw new Error('GraphQL endpoint is not configured');
  }

  const result = typeof window === 'undefined'
    ? await fetchCachedGraphQLResponse(query)
    : await (async () => {
        const response = await fetchWithTimeout(WP_GRAPHQL_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ query }),
        });
        return {
          ok: response.ok,
          status: response.status,
          statusText: response.statusText,
          body: await response.text(),
        };
      })();

  if (!result.ok) {
    throw new Error(`GraphQL request failed: ${result.status} ${result.statusText}`.trim());
  }

  const body = JSON.parse(result.body) as GraphQLResponse<T>;

  if (body.errors?.length) {
    throw new GraphQLResponseError(body.errors[0]?.message || 'GraphQL request returned an error');
  }

  if (!body.data) {
    throw new Error('GraphQL response did not contain data');
  }

  return body.data;
}

export const wpClient = {
  async getSiteContent(): Promise<SiteContent> {
    const emptyContent: SiteContent = {
      previewMode: PREVIEW_MODE,
      settings: PREVIEW_MODE ? mockSettings : {
        site_name: { ar: '', en: '' },
        tagline: { ar: '', en: '' },
        contact: {
          phone: '',
          email: '',
          address_ar: '',
          address_en: '',
          working_hours_ar: '',
          working_hours_en: '',
          coordinates: { lat: 0, lng: 0 },
        },
        statistics: [],
        social_links: { x: '', linkedin: '', instagram: '' },
      },
      sectors: PREVIEW_MODE ? mockSectors : [],
      companies: PREVIEW_MODE ? mockCompanies : [],
      heroSlides: [],
      pageBanners: {},
      sectionCopy: {},
      homeAbout: {
        badge: { ar: '', en: '' },
        title: { ar: '', en: '' },
        descriptionOne: { ar: '', en: '' },
        descriptionTwo: { ar: '', en: '' },
        image: '',
        pillars: [],
      },
      aboutPage: {
        chairmanImage: '',
        chairmanName: { ar: '', en: '' },
        chairmanRole: { ar: '', en: '' },
        messageHeading: { ar: '', en: '' },
        quote: { ar: '', en: '' },
        messageOne: { ar: '', en: '' },
        messageTwo: { ar: '', en: '' },
        visionTitle: { ar: '', en: '' },
        visionDescription: { ar: '', en: '' },
        missionTitle: { ar: '', en: '' },
        missionDescription: { ar: '', en: '' },
        values: [],
      },
      visionSection: {
        badge: { ar: '', en: '' },
        title: { ar: '', en: '' },
        description: { ar: '', en: '' },
        pillars: [],
        footerLine: { ar: '', en: '' },
        ctaLabel: { ar: '', en: '' },
        ctaUrl: '',
      },
      footer: {
        companyDescription: { ar: '', en: '' },
        visionBadge: { ar: '', en: '' },
        logo: '',
        logoAlt: '',
        columns: [],
        newsletterTitle: { ar: '', en: '' },
        newsletterDescription: { ar: '', en: '' },
        newsletterPlaceholder: { ar: '', en: '' },
        newsletterButton: { ar: '', en: '' },
        copyright: { ar: '', en: '' },
        socialLinks: [],
      },
    };

    if (!WP_GRAPHQL_URL) return emptyContent;

    try {
      const data = await fetchGraphQL<{
        alomarSiteContent?: {
          settings?: {
            siteNameAr?: string | null;
            siteNameEn?: string | null;
            taglineAr?: string | null;
            taglineEn?: string | null;
            phone?: string | null;
            email?: string | null;
            addressAr?: string | null;
            addressEn?: string | null;
            workingHoursAr?: string | null;
            workingHoursEn?: string | null;
            mapLat?: number | null;
            mapLng?: number | null;
            statistics?: Array<{ key?: string | null; number?: string | null; labelAr?: string | null; labelEn?: string | null }> | null;
            socialX?: string | null;
            socialLinkedin?: string | null;
            socialInstagram?: string | null;
          } | null;
          pageBanners?: Array<{
            pageKey?: string | null;
            badgeAr?: string | null;
            badgeEn?: string | null;
            titleAr?: string | null;
            titleEn?: string | null;
            descriptionAr?: string | null;
            descriptionEn?: string | null;
            imageUrl?: string | null;
            seoTitleAr?: string | null;
            seoTitleEn?: string | null;
            seoDescriptionAr?: string | null;
            seoDescriptionEn?: string | null;
          }> | null;
          sectionCopy?: Array<{
            sectionKey?: string | null;
            badgeAr?: string | null;
            badgeEn?: string | null;
            titleAr?: string | null;
            titleEn?: string | null;
            descriptionAr?: string | null;
            descriptionEn?: string | null;
            ctaLabelAr?: string | null;
            ctaLabelEn?: string | null;
            ctaUrl?: string | null;
          }> | null;
          homeAbout?: {
            badgeAr?: string | null;
            badgeEn?: string | null;
            titleAr?: string | null;
            titleEn?: string | null;
            descriptionOneAr?: string | null;
            descriptionOneEn?: string | null;
            descriptionTwoAr?: string | null;
            descriptionTwoEn?: string | null;
            imageUrl?: string | null;
            pillars?: Array<{ icon?: string | null; titleAr?: string | null; titleEn?: string | null; descriptionAr?: string | null; descriptionEn?: string | null }> | null;
          } | null;
          aboutPage?: {
            chairmanImageUrl?: string | null;
            chairmanNameAr?: string | null;
            chairmanNameEn?: string | null;
            chairmanRoleAr?: string | null;
            chairmanRoleEn?: string | null;
            messageHeadingAr?: string | null;
            messageHeadingEn?: string | null;
            quoteAr?: string | null;
            quoteEn?: string | null;
            messageOneAr?: string | null;
            messageOneEn?: string | null;
            messageTwoAr?: string | null;
            messageTwoEn?: string | null;
            visionTitleAr?: string | null;
            visionTitleEn?: string | null;
            visionDescriptionAr?: string | null;
            visionDescriptionEn?: string | null;
            missionTitleAr?: string | null;
            missionTitleEn?: string | null;
            missionDescriptionAr?: string | null;
            missionDescriptionEn?: string | null;
            values?: Array<{ titleAr?: string | null; titleEn?: string | null; descriptionAr?: string | null; descriptionEn?: string | null }> | null;
          } | null;
          visionSection?: {
            badgeAr?: string | null;
            badgeEn?: string | null;
            titleAr?: string | null;
            titleEn?: string | null;
            descriptionAr?: string | null;
            descriptionEn?: string | null;
            pillars?: Array<{ icon?: string | null; titleAr?: string | null; titleEn?: string | null; descriptionAr?: string | null; descriptionEn?: string | null }> | null;
            footerLineAr?: string | null;
            footerLineEn?: string | null;
            ctaLabelAr?: string | null;
            ctaLabelEn?: string | null;
            ctaUrl?: string | null;
          } | null;
          footer?: { companyDescriptionAr?: string | null; companyDescriptionEn?: string | null; visionBadgeAr?: string | null; visionBadgeEn?: string | null } | null;
        } | null;
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
        sectors?: { nodes?: GraphQLNode[] | null } | null;
        companies?: { nodes?: GraphQLNode[] | null } | null;
      }>(`{
        alomarSiteContent {
          settings {
            siteNameAr siteNameEn taglineAr taglineEn phone email addressAr addressEn
            workingHoursAr workingHoursEn mapLat mapLng socialX socialLinkedin socialInstagram
            statistics { key number labelAr labelEn }
          }
          pageBanners {
            pageKey badgeAr badgeEn titleAr titleEn descriptionAr descriptionEn imageUrl
            seoTitleAr seoTitleEn seoDescriptionAr seoDescriptionEn
          }
          sectionCopy { sectionKey badgeAr badgeEn titleAr titleEn descriptionAr descriptionEn ctaLabelAr ctaLabelEn ctaUrl }
          homeAbout {
            badgeAr badgeEn titleAr titleEn descriptionOneAr descriptionOneEn descriptionTwoAr descriptionTwoEn imageUrl
            pillars { icon titleAr titleEn descriptionAr descriptionEn }
          }
          aboutPage {
            chairmanImageUrl chairmanNameAr chairmanNameEn chairmanRoleAr chairmanRoleEn messageHeadingAr messageHeadingEn
            quoteAr quoteEn messageOneAr messageOneEn messageTwoAr messageTwoEn visionTitleAr visionTitleEn
            visionDescriptionAr visionDescriptionEn missionTitleAr missionTitleEn missionDescriptionAr missionDescriptionEn
            values { titleAr titleEn descriptionAr descriptionEn }
          }
          visionSection {
            badgeAr badgeEn titleAr titleEn descriptionAr descriptionEn
            pillars { icon titleAr titleEn descriptionAr descriptionEn }
            footerLineAr footerLineEn ctaLabelAr ctaLabelEn ctaUrl
          }
          footer { companyDescriptionAr companyDescriptionEn visionBadgeAr visionBadgeEn }
        }
        homePageContent { image badgeAr badgeEn titleAr titleEn descAr descEn primaryLink secondaryLink }
        sectors(first: 20) {
          nodes { databaseId slug title excerpt content contentEn titleEn summaryEn sectorIcon featuredImage { node { sourceUrl } } }
        }
        companies(first: 20) {
          nodes {
            databaseId slug title excerpt content nameEn taglineAr taglineEn descriptionEn companyWebsite companyYear
            featuredImage { node { sourceUrl } }
          }
        }
      }`);

      const cms = data.alomarSiteContent;
      if (!cms) {
        reportCMSIssue('getSiteContent', new Error('The alomarSiteContent field returned null'));
        if (!PREVIEW_MODE) {
          throw new Error('WordPress CMS returned no alomarSiteContent data');
        }
        return emptyContent;
      }
      const rawSettings = cms.settings;
      const validStatistics = rawSettings?.statistics?.filter((stat) =>
        Boolean(stat.key && stat.number && stat.labelAr && stat.labelEn)
      ) || [];
      const statistics = validStatistics.length
        ? validStatistics.map((stat) => ({
            key: stat.key || '',
            number: stat.number || '',
            label_ar: stat.labelAr || '',
            label_en: stat.labelEn || '',
          }))
        : PREVIEW_MODE ? mockSettings.statistics : [];
      const mapPillars = (items: Array<{ icon?: string | null; titleAr?: string | null; titleEn?: string | null; descriptionAr?: string | null; descriptionEn?: string | null }> | null | undefined) =>
        (items || []).map((item) => ({
          icon: item.icon || '',
          title: { ar: item.titleAr || '', en: item.titleEn || '' },
          description: { ar: item.descriptionAr || '', en: item.descriptionEn || '' },
        }));
      const sectors = (data.sectors?.nodes || []).map((node) => ({
        id: node.databaseId ?? 0,
        slug: node.slug || node.uri || 'sector',
        title: { ar: stripHtml(node.title), en: stripHtml(node.titleEn) },
        summary: { ar: stripHtml(node.excerpt), en: stripHtml(node.summaryEn) },
        content: toLocalizedText(node.content, node.contentEn),
        icon: node.sectorIcon || 'building',
        image: pickImage(node),
        stats: [],
      } as Sector));
      const companies = (data.companies?.nodes || []).map((node) => ({
        id: node.databaseId ?? 0,
        slug: node.slug || node.uri || 'company',
        name: { ar: stripHtml(node.title), en: stripHtml(node.nameEn) },
        tagline: { ar: stripHtml(node.taglineAr), en: stripHtml(node.taglineEn) },
        description: { ar: stripHtml(node.content) || stripHtml(node.excerpt), en: stripHtml(node.descriptionEn) },
        logo: pickImage(node),
        website: node.companyWebsite || undefined,
        year: node.companyYear || undefined,
      } as SubsidiaryCompany));

      return {
        previewMode: false,
        sectors: sectors.length ? sectors : PREVIEW_MODE ? mockSectors : [],
        companies: companies.length ? companies : PREVIEW_MODE ? mockCompanies : [],
        settings: {
          site_name: {
            ar: rawSettings?.siteNameAr || (PREVIEW_MODE ? mockSettings.site_name.ar : ''),
            en: rawSettings?.siteNameEn || (PREVIEW_MODE ? mockSettings.site_name.en : ''),
          },
          tagline: {
            ar: rawSettings?.taglineAr || (PREVIEW_MODE ? mockSettings.tagline.ar : ''),
            en: rawSettings?.taglineEn || (PREVIEW_MODE ? mockSettings.tagline.en : ''),
          },
          contact: {
            phone: rawSettings?.phone || (PREVIEW_MODE ? mockSettings.contact.phone : ''),
            email: rawSettings?.email || (PREVIEW_MODE ? mockSettings.contact.email : ''),
            address_ar: rawSettings?.addressAr || (PREVIEW_MODE ? mockSettings.contact.address_ar : ''),
            address_en: rawSettings?.addressEn || (PREVIEW_MODE ? mockSettings.contact.address_en : ''),
            working_hours_ar: rawSettings?.workingHoursAr || (PREVIEW_MODE ? mockSettings.contact.working_hours_ar : ''),
            working_hours_en: rawSettings?.workingHoursEn || (PREVIEW_MODE ? mockSettings.contact.working_hours_en : ''),
            coordinates: {
              lat: rawSettings?.mapLat ?? (PREVIEW_MODE ? mockSettings.contact.coordinates.lat : 0),
              lng: rawSettings?.mapLng ?? (PREVIEW_MODE ? mockSettings.contact.coordinates.lng : 0),
            },
          },
          statistics,
          social_links: {
            x: rawSettings?.socialX || (PREVIEW_MODE ? mockSettings.social_links.x : ''),
            linkedin: rawSettings?.socialLinkedin || (PREVIEW_MODE ? mockSettings.social_links.linkedin : ''),
            instagram: rawSettings?.socialInstagram || (PREVIEW_MODE ? mockSettings.social_links.instagram : ''),
          },
        },
        heroSlides: (data.homePageContent || [])
          .filter((slide) => Boolean(slide.image && slide.titleAr && slide.titleEn))
          .map((slide, index) => ({
          id: index + 1,
          image: slide.image || '',
          badge_ar: slide.badgeAr || '',
          badge_en: slide.badgeEn || '',
          title_ar: slide.titleAr || '',
          title_en: slide.titleEn || '',
          desc_ar: slide.descAr || '',
          desc_en: slide.descEn || '',
          primary_link: slide.primaryLink || '/sectors',
          secondary_link: slide.secondaryLink || '/projects',
        })),
        pageBanners: Object.fromEntries((cms.pageBanners || []).filter((item) => item.pageKey).map((item) => [item.pageKey as string, {
          pageKey: item.pageKey || '',
          badge: { ar: item.badgeAr || '', en: item.badgeEn || '' },
          title: { ar: item.titleAr || '', en: item.titleEn || '' },
          description: { ar: item.descriptionAr || '', en: item.descriptionEn || '' },
          image: item.imageUrl || '',
          seoTitle: { ar: item.seoTitleAr || '', en: item.seoTitleEn || '' },
          seoDescription: { ar: item.seoDescriptionAr || '', en: item.seoDescriptionEn || '' },
        }])),
        sectionCopy: Object.fromEntries((cms.sectionCopy || []).filter((item) => item.sectionKey).map((item) => [item.sectionKey as string, {
          sectionKey: item.sectionKey || '',
          badge: { ar: item.badgeAr || '', en: item.badgeEn || '' },
          title: { ar: item.titleAr || '', en: item.titleEn || '' },
          description: { ar: item.descriptionAr || '', en: item.descriptionEn || '' },
          ctaLabel: { ar: item.ctaLabelAr || '', en: item.ctaLabelEn || '' },
          ctaUrl: item.ctaUrl || '',
        }])),
        homeAbout: {
          badge: { ar: cms.homeAbout?.badgeAr || '', en: cms.homeAbout?.badgeEn || '' },
          title: { ar: cms.homeAbout?.titleAr || '', en: cms.homeAbout?.titleEn || '' },
          descriptionOne: { ar: cms.homeAbout?.descriptionOneAr || '', en: cms.homeAbout?.descriptionOneEn || '' },
          descriptionTwo: { ar: cms.homeAbout?.descriptionTwoAr || '', en: cms.homeAbout?.descriptionTwoEn || '' },
          image: cms.homeAbout?.imageUrl || '',
          pillars: mapPillars(cms.homeAbout?.pillars),
        },
        aboutPage: {
          chairmanImage: cms.aboutPage?.chairmanImageUrl || '',
          chairmanName: { ar: cms.aboutPage?.chairmanNameAr || '', en: cms.aboutPage?.chairmanNameEn || '' },
          chairmanRole: { ar: cms.aboutPage?.chairmanRoleAr || '', en: cms.aboutPage?.chairmanRoleEn || '' },
          messageHeading: { ar: cms.aboutPage?.messageHeadingAr || '', en: cms.aboutPage?.messageHeadingEn || '' },
          quote: { ar: cms.aboutPage?.quoteAr || '', en: cms.aboutPage?.quoteEn || '' },
          messageOne: { ar: cms.aboutPage?.messageOneAr || '', en: cms.aboutPage?.messageOneEn || '' },
          messageTwo: { ar: cms.aboutPage?.messageTwoAr || '', en: cms.aboutPage?.messageTwoEn || '' },
          visionTitle: { ar: cms.aboutPage?.visionTitleAr || '', en: cms.aboutPage?.visionTitleEn || '' },
          visionDescription: { ar: cms.aboutPage?.visionDescriptionAr || '', en: cms.aboutPage?.visionDescriptionEn || '' },
          missionTitle: { ar: cms.aboutPage?.missionTitleAr || '', en: cms.aboutPage?.missionTitleEn || '' },
          missionDescription: { ar: cms.aboutPage?.missionDescriptionAr || '', en: cms.aboutPage?.missionDescriptionEn || '' },
          values: (cms.aboutPage?.values || []).map((value) => ({
            title: { ar: value.titleAr || '', en: value.titleEn || '' },
            description: { ar: value.descriptionAr || '', en: value.descriptionEn || '' },
          })),
        },
        visionSection: {
          badge: { ar: cms.visionSection?.badgeAr || '', en: cms.visionSection?.badgeEn || '' },
          title: { ar: cms.visionSection?.titleAr || '', en: cms.visionSection?.titleEn || '' },
          description: { ar: cms.visionSection?.descriptionAr || '', en: cms.visionSection?.descriptionEn || '' },
          pillars: mapPillars(cms.visionSection?.pillars),
          footerLine: { ar: cms.visionSection?.footerLineAr || '', en: cms.visionSection?.footerLineEn || '' },
          ctaLabel: { ar: cms.visionSection?.ctaLabelAr || '', en: cms.visionSection?.ctaLabelEn || '' },
          ctaUrl: cms.visionSection?.ctaUrl || '',
        },
        footer: {
          companyDescription: { ar: cms.footer?.companyDescriptionAr || '', en: cms.footer?.companyDescriptionEn || '' },
          visionBadge: { ar: cms.footer?.visionBadgeAr || '', en: cms.footer?.visionBadgeEn || '' },
          logo: '', logoAlt: '', columns: [],
          newsletterTitle: { ar: '', en: '' }, newsletterDescription: { ar: '', en: '' },
          newsletterPlaceholder: { ar: '', en: '' }, newsletterButton: { ar: '', en: '' },
          copyright: { ar: '', en: '' }, socialLinks: [],
        },
      };
    } catch (error) {
      reportCMSIssue('getSiteContent', error);
      if (!PREVIEW_MODE) {
        throw error;
      }
      return emptyContent;
    }
  },

  async getHomeHeroSlides(): Promise<HeroSlide[]> {
    return (await this.getSiteContent()).heroSlides;
  },

  async getSettings(): Promise<SiteSettings> {
    return (await this.getSiteContent()).settings;
  },

  async getContactPageContent(): Promise<ContactPageContent | null> {
    if (!WP_GRAPHQL_URL) return null;
    try {
      const data = await fetchGraphQL<{ alomarContactPageContent?: {
        badgeAr?: string | null; badgeEn?: string | null;
        titleAr?: string | null; titleEn?: string | null;
        descriptionAr?: string | null; descriptionEn?: string | null;
        bannerImage?: string | null;
        headingAr?: string | null; headingEn?: string | null;
        email?: string | null; phone?: string | null;
        addressAr?: string | null; addressEn?: string | null;
        workingHoursAr?: string | null; workingHoursEn?: string | null;
        mapLat?: number | null; mapLng?: number | null;
        linkedinUrl?: string | null; twitterUrl?: string | null;
        formTitleAr?: string | null; formTitleEn?: string | null;
      } | null }>(`{
        alomarContactPageContent {
          badgeAr badgeEn titleAr titleEn descriptionAr descriptionEn bannerImage
          headingAr headingEn email phone addressAr addressEn
          workingHoursAr workingHoursEn mapLat mapLng
          linkedinUrl twitterUrl formTitleAr formTitleEn
        }
      }`);
      const content = data.alomarContactPageContent;
      if (!content) return null;
      return {
        badge: { ar: content.badgeAr || '', en: content.badgeEn || '' },
        title: { ar: content.titleAr || '', en: content.titleEn || '' },
        description: { ar: content.descriptionAr || '', en: content.descriptionEn || '' },
        bannerImage: content.bannerImage || '',
        heading: { ar: content.headingAr || '', en: content.headingEn || '' },
        email: content.email || '',
        phone: content.phone || '',
        address: { ar: content.addressAr || '', en: content.addressEn || '' },
        workingHours: { ar: content.workingHoursAr || '', en: content.workingHoursEn || '' },
        coordinates: { lat: content.mapLat || 0, lng: content.mapLng || 0 },
        linkedinUrl: content.linkedinUrl || '',
        twitterUrl: content.twitterUrl || '',
        formTitle: { ar: content.formTitleAr || '', en: content.formTitleEn || '' },
      };
    } catch (error) {
      reportCMSIssue('getContactPageContent', error);
      return null;
    }
  },

  async getFooter(): Promise<FooterContent | null> {
    if (!WP_GRAPHQL_URL) return null;
    try {
      const data = await fetchGraphQL<{
        footerSettings?: {
          footerFields?: {
            footerLogo?: { node?: { sourceUrl?: string | null } | null } | null;
            socialLinks?: Array<{
              platform?: string[] | null;
              socialLink?: { url?: string | null } | null;
            }> | null;
            columns?: Array<{
              columnTitle?: string | null;
              columnTitleEn?: string | null;
              links?: Array<{
                columnLink?: { url?: string | null; title?: string | null } | null;
                columnLinkEn?: { url?: string | null; title?: string | null } | null;
                columnLinkIcon?: { node?: { sourceUrl?: string | null } | null } | null;
              }> | null;
            }> | null;
            copyrightText?: string | null;
            copyrightTextEn?: string | null;
          } | null;
        } | null;
      }>(`{
        footerSettings {
          footerFields {
            footerLogo { node { sourceUrl } }
            socialLinks {
              platform
              socialLink { url title target }
            }
            columns {
              columnTitle
              columnTitleEn
              links {
                columnLink { url title target }
                columnLinkEn { url title target }
                columnLinkIcon { node { sourceUrl } }
              }
            }
            copyrightText
            copyrightTextEn
          }
        }
      }`);
      const fields = data.footerSettings?.footerFields;
      if (!fields) return null;
      return {
        companyDescription: { ar: '', en: '' },
        visionBadge: { ar: '', en: '' },
        logo: fields.footerLogo?.node?.sourceUrl || '',
        logoAlt: 'Alomar Holding',
        columns: (fields.columns ?? []).map((column) => ({
          title: { ar: column.columnTitle || '', en: column.columnTitleEn || column.columnTitle || '' },
          links: (column.links ?? []).map((link) => ({
            label: { ar: link.columnLink?.title || '', en: link.columnLinkEn?.title || link.columnLink?.title || '' },
            url: link.columnLink?.url || link.columnLinkEn?.url || '',
            icon: link.columnLinkIcon?.node?.sourceUrl || '',
          })),
        })),
        newsletterTitle: { ar: '', en: '' },
        newsletterDescription: { ar: '', en: '' },
        newsletterPlaceholder: { ar: '', en: '' },
        newsletterButton: { ar: '', en: '' },
        copyright: { ar: fields.copyrightText || '', en: fields.copyrightTextEn || fields.copyrightText || '' },
        socialLinks: (fields.socialLinks ?? []).map((item) => ({
          platform: item.platform?.[0] || '',
          url: item.socialLink?.url || '',
        })).filter((item) => Boolean(item.url && item.url !== '/')),
      };
    } catch (error) {
      reportCMSIssue('getFooter', error);
      return null;
    }
  },

  async getProjects(category?: string): Promise<Project[]> {
    if (!WP_GRAPHQL_URL) {
      if (PREVIEW_MODE && (!category || category === 'all')) return mockProjects;
      if (PREVIEW_MODE) return mockProjects.filter((p) => p.category.includes(category || ''));
      return [];
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
              titleAr
              excerptAr
              contentAr
              contentEn
              titleEn
              excerptEn
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
              projectGallery
              projectHighlights { ar en }
              projectCategories { nodes { name nameEn } }
              projectLocations { nodes { name nameEn } }
            }
          }
        }`);

        const mapped = (data.projects?.nodes ?? []).map((node) => {
          const title = stripHtml(node.titleAr || node.title || '');
          const excerpt = stripHtml(node.excerptAr || node.excerpt || '');
          const content = stripHtml(node.contentAr || node.content || '');
          const categoryName = node.projectCategories?.nodes?.[0]?.name || '';
          const locationName = node.projectLocations?.nodes?.[0]?.name || '';
          const categoryNameEn = node.projectCategories?.nodes?.[0]?.nameEn || '';
          const locationNameEn = node.projectLocations?.nodes?.[0]?.nameEn || '';

          return {
            id: node.databaseId ?? 0,
            slug: node.slug || node.uri || title.toLowerCase().replace(/\s+/g, '-'),
            title: {
              ar: title,
              en: stripHtml(node.titleEn),
            },
            excerpt: {
              ar: excerpt,
              en: stripHtml(node.excerptEn),
            },
            content: {
              ar: content,
              en: stripHtml(node.contentEn),
            },
            image: pickImage(node),
            gallery: node.projectGallery || [],
            category: categoryName,
            category_en: categoryNameEn,
            location: stripHtml(node.locationAr) || locationName,
            location_en: stripHtml(node.locationEn) || locationNameEn,
            status: stripHtml(node.statusAr),
            status_en: stripHtml(node.statusEn),
            units_count: node.unitsCount || undefined,
            land_area: node.landArea || undefined,
            built_area: node.builtArea || undefined,
            completion_year: node.completionYear || '',
            brochure_url: node.brochureUrl || undefined,
            featured: node.featured ?? false,
            highlights: (node.projectHighlights || []).map((highlight) => ({
              ar: highlight.ar || '',
              en: highlight.en || '',
            })),
          } as Project;
        });

        if (!category || category === 'all') return mapped;
        return mapped.filter(
          (p) => p.category.toLowerCase().includes(category.toLowerCase()) || p.category_en?.toLowerCase().includes(category.toLowerCase())
        );
      }

      return [];
    } catch (error) {
      reportCMSIssue('getProjects', error);
      return [];
    }
  },

  async getProjectBySlug(slug: string): Promise<Project | null> {
    const list = await this.getProjects('all');
    return list.find((p) => p.slug === slug) || null;
  },

  async getSectors(): Promise<Sector[]> {
    if (!WP_GRAPHQL_URL) return PREVIEW_MODE ? mockSectors : [];

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
              contentEn
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
          title: { ar: stripHtml(node.title), en: stripHtml(node.titleEn) },
          summary: { ar: stripHtml(node.excerpt), en: stripHtml(node.summaryEn) },
          content: toLocalizedText(node.content, node.contentEn),
          icon: node.sectorIcon || 'building',
          image: pickImage(node),
          stats: [],
        } as Sector));

        return mapped;
      }

      return [];
    } catch (error) {
      reportCMSIssue('getSectors', error);
      return [];
    }
  },

  async getCompanies(): Promise<SubsidiaryCompany[]> {
    if (!WP_GRAPHQL_URL) return PREVIEW_MODE ? mockCompanies : [];

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
          name: { ar: stripHtml(node.title), en: stripHtml(node.nameEn) },
          tagline: {
            ar: stripHtml(node.taglineAr),
            en: stripHtml(node.taglineEn),
          },
          description: {
            ar: stripHtml(node.content) || stripHtml(node.excerpt),
            en: stripHtml(node.descriptionEn),
          },
          logo: pickImage(node),
          website: node.companyWebsite || undefined,
          year: node.companyYear || undefined,
        } as SubsidiaryCompany));

        return mapped;
      }

      return [];
    } catch (error) {
      reportCMSIssue('getCompanies', error);
      return [];
    }
  },

  async getTeam(): Promise<TeamMember[]> {
    if (!WP_GRAPHQL_URL) return PREVIEW_MODE ? mockTeam : [];

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
            en: stripHtml(node.nameEn),
          },
          role: {
            ar: node.roleAr || '',
            en: node.roleEn || '',
          },
          bio: {
            ar: stripHtml(node.content),
            en: stripHtml(node.bioEn),
          },
          image: pickImage(node),
          order: node.displayOrder ?? 0,
        } as TeamMember));

        return mapped;
      }

      return [];
    } catch (error) {
      reportCMSIssue('getTeam', error);
      return [];
    }
  },

  async getHeader(): Promise<HeaderContent | null> {
    if (!WP_GRAPHQL_URL) return null;
    try {
      const data = await fetchGraphQL<{
        headerSettings?: {
          headerFields?: {
            logo?: { node?: { sourceUrl?: string | null } | null } | null;
            menu?: Array<{
              label?: string | null;
              labelEn?: string | null;
              link?: { url?: string | null } | null;
              image?: { node?: { sourceUrl?: string | null } | null } | null;
              submenu?: Array<{
                label?: string | null;
                labelSmall?: string | null;
                labelEn?: string | null;
                labelSmallEn?: string | null;
                link?: { url?: string | null } | null;
                image?: { node?: { sourceUrl?: string | null } | null } | null;
              }> | null;
            }> | null;
            labelButtonRight?: string | null;
            labelButtonRightEn?: string | null;
            linkButtonRight?: { url?: string | null } | null;
          } | null;
        } | null;
      }>(`{
        headerSettings {
          headerFields {
            logo { node { sourceUrl } }
            menu {
              label
              labelEn
              link { url }
              image { node { sourceUrl } }
              submenu {
                label
                labelSmall
                labelEn
                labelSmallEn
                link { url }
                image { node { sourceUrl } }
              }
            }
            labelButtonRight
            labelButtonRightEn
            linkButtonRight { url }
          }
        }
      }`);
      const fields = data.headerSettings?.headerFields;
      if (!fields) return null;
      return {
        logo: fields.logo?.node?.sourceUrl || '',
        logo_en: fields.logo?.node?.sourceUrl || '',
        menu: (fields.menu ?? []).map((item) => ({
          label: { ar: item.label || '', en: item.labelEn || item.label || '' },
          url: item.link?.url || '',
          image: item.image?.node?.sourceUrl || '',
          children: (item.submenu ?? []).map((child) => ({
            label: { ar: child.label || child.labelSmall || '', en: child.labelEn || child.labelSmallEn || child.label || child.labelSmall || '' },
            url: child.link?.url || '',
            image: child.image?.node?.sourceUrl || '',
            children: [],
            category: {
              ar: child.labelSmall || '',
              en: child.labelSmallEn || child.labelSmall || '',
            },
          })),
        })),
        cta_label: { ar: fields.labelButtonRight || '', en: fields.labelButtonRightEn || fields.labelButtonRight || '' },
        cta_url: fields.linkButtonRight?.url || '',
      };
    } catch (error) {
      reportCMSIssue('getHeader', error);
      return null;
    }
  },

  async getInvestments(lang: Locale = 'ar', page = 1): Promise<InvestmentArticle[]> {
    if (!WP_GRAPHQL_URL) return [];
    void lang;
    void page;
    try {
      const data = await fetchGraphQL<{ investments?: { nodes?: Array<{ databaseId?: number; slug?: string; title?: string; excerpt?: string; featuredImage?: { node?: { sourceUrl?: string | null } | null } | null }> | null } | null }>(`{
        investments(first: 12, after: null) {
          nodes { databaseId slug title excerpt featuredImage { node { sourceUrl } } }
        }
      }`);
      return (data.investments?.nodes ?? []).map((item) => {
        const titleText = item.title || '';
        const summaryText = stripHtml(item.excerpt);
        const title = { ar: titleText, en: titleText };
        const summary = { ar: summaryText, en: summaryText };
        return { id: item.databaseId ?? 0, slug: item.slug ?? '', title, summary, description: summary, image: item.featuredImage?.node?.sourceUrl || '', location: { ar: '', en: '' }, status: { ar: '', en: '' } };
      });
    } catch (error) {
      reportCMSIssue('getInvestments', error);
      return [];
    }
  },

  async getMediaCenter(lang: Locale = 'ar', page = 1): Promise<MediaCenterItem[]> {
    if (!WP_GRAPHQL_URL) return [];
    void lang;
    void page;
    try {
      const data = await fetchGraphQL<{ mediaCenters?: { nodes?: Array<{ databaseId?: number; slug?: string; title?: string; excerpt?: string; date?: string; featuredImage?: { node?: { sourceUrl?: string | null } | null } | null }> | null } | null }>(`{
        mediaCenters(first: 12, after: null) {
          nodes { databaseId slug title excerpt date featuredImage { node { sourceUrl } } }
        }
      }`);
      return (data.mediaCenters?.nodes ?? []).map((item) => {
        const titleText = item.title || '';
        const summaryText = stripHtml(item.excerpt);
        const title = { ar: titleText, en: titleText };
        const summary = { ar: summaryText, en: summaryText };
        return { id: item.databaseId ?? 0, slug: item.slug ?? '', title, summary, content: summary, image: item.featuredImage?.node?.sourceUrl || '', date: item.date || '', mediaType: '' };
      });
    } catch (error) {
      reportCMSIssue('getMediaCenter', error);
      return [];
    }
  },

  async getNews(): Promise<NewsArticle[]> {
    if (!WP_GRAPHQL_URL) return PREVIEW_MODE ? mockNews : [];

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
              titleEn
              excerptEn
              contentEn
              newsCategoryAr
              newsCategoryEn
              readTimeAr
              readTimeEn
              featuredImage { node { sourceUrl } }
            }
          }
        }`);

        const mapped = (data.posts?.nodes ?? []).filter((node) => node.slug !== 'hello-world').map((node) => ({
          id: node.databaseId ?? 0,
          slug: node.slug || node.uri || 'news-item',
          title: { ar: stripHtml(node.title), en: stripHtml(node.titleEn) },
          excerpt: { ar: stripHtml(node.excerpt), en: stripHtml(node.excerptEn) },
          content: { ar: node.content || '', en: node.contentEn || '' },
          image: pickImage(node),
          date: node.date ? new Date(node.date).toLocaleDateString('ar-SA', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }) : '',
          category: {
            ar: node.newsCategoryAr || '',
            en: node.newsCategoryEn || '',
          },
          read_time: node.readTimeAr || '',
          read_time_en: node.readTimeEn || '',
        } as NewsArticle));

        return mapped;
      }

      return [];
    } catch (error) {
      reportCMSIssue('getNews', error);
      if (!PREVIEW_MODE) {
        throw error;
      }
      return [];
    }
  },

  async getArticleBySlug(slug: string): Promise<NewsArticle | null> {
    const list = await this.getNews();
    return list.find((item) => item.slug === slug) || null;
  },
};