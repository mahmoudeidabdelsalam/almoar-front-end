import {
  SiteSettings,
  Project,
  NewsArticle,
  HeroSlide,
  SiteContent,
  HeaderContent,
  FooterContent,
  ContactPageContent,
  InvestmentsPageContent,
  InvestWithUsPageContent,
} from '@/types';
import {
  mockSettings,
  mockProjects,
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

type GraphQLMediaConnection = {
  node?: { sourceUrl?: string | null; altText?: string | null } | null;
} | null;

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
  featured?: boolean | null;
  summaryEn?: string | null;
  sectorIcon?: string | null;
  nameEn?: string | null;
  taglineAr?: string | null;
  taglineEn?: string | null;
  descriptionEn?: string | null;
  companyWebsite?: string | null;
  companyYear?: string | null;
  uri?: string;
  sourceUrl?: string;
  name?: string;
  featuredImage?: {
    node?: {
      sourceUrl?: string | null;
      altText?: string | null;
    } | null;
  } | null;
  projectCategories?: {
    nodes?: Array<{ name?: string | null; nameEn?: string | null; slug?: string | null }> | null;
  } | null;
  projectLocations?: {
    nodes?: Array<{ name?: string | null; nameEn?: string | null; slug?: string | null }> | null;
  } | null;
  categories?: {
    nodes?: Array<{ name?: string | null }> | null;
  } | null;
  projectDetails?: {
    titleAr?: string | null;
    titleEn?: string | null;
    excerptAr?: string | null;
    excerptEn?: string | null;
    contentAr?: string | null;
    contentEn?: string | null;
    featured?: boolean | null;
    projectLogo?: GraphQLMediaConnection;
    statsTag?: string | null;
    statsTagEn?: string | null;
    statsHeadline?: string | null;
    statsHeadlineEn?: string | null;
    statsItems?: Array<{
      statHead?: string | null;
      statHeadEn?: string | null;
      statText?: string | null;
      statTextEn?: string | null;
    } | null> | null;
    makeTag?: string | null;
    makeTagEn?: string | null;
    makeHeadline?: string | null;
    makeHeadlineEn?: string | null;
    makeItems?: Array<{
      makeHead?: string | null;
      makeHeadEn?: string | null;
      makeText?: string | null;
      makeTextEn?: string | null;
    } | null> | null;
    companiesTag?: string | null;
    companiesTagEn?: string | null;
    companiesHeadline?: string | null;
    companiesHeadlineEn?: string | null;
    companiesItems?: Array<{
      companyLogo?: GraphQLMediaConnection;
      companyLink?: string | null;
    } | null> | null;
    experienceTag?: string | null;
    experienceTagEn?: string | null;
    experienceHeadline?: string | null;
    experienceHeadlineEn?: string | null;
    experienceItems?: Array<{
      experienceHead?: string | null;
      experienceHeadEn?: string | null;
      experienceText?: string | null;
      experienceTextEn?: string | null;
    } | null> | null;
    keyProjectsTag?: string | null;
    keyProjectsTagEn?: string | null;
    keyProjectsHeadline?: string | null;
    keyProjectsHeadlineEn?: string | null;
    keyProjectsItems?: Array<{
      keyProjectsImg?: GraphQLMediaConnection;
      keyProjectsHead?: string | null;
      keyProjectsHeadEn?: string | null;
      keyProjectsLocation?: string | null;
      keyProjectsLocationEn?: string | null;
      keyProjectsText?: string | null;
      keyProjectsTextEn?: string | null;
      keyProjectsLink?: { url?: string | null; title?: string | null; target?: string | null } | null;
    } | null> | null;
  } | null;
  newsCategoryAr?: string | null;
  newsCategoryEn?: string | null;
  readTimeAr?: string | null;
  readTimeEn?: string | null;
  newsDetails?: {
    statistics?: Array<{
      value?: string | null;
      valueEn?: string | null;
      label?: string | null;
      labelEn?: string | null;
    } | null> | null;
    companyName?: string | null;
    companyNameEn?: string | null;
    companyDescription?: string | null;
    companyDescriptionEn?: string | null;
    companyLogoUrl?: string | null;
    companyLink?: string | null;
  } | null;
  relatedArticles?: GraphQLNode[] | null;
};

type GraphQLResponse<T> = {
  data?: T | null;
  errors?: Array<{ message?: string }>;
};

type GraphQLVariables = Record<string, string | number | boolean | null>;

class GraphQLResponseError extends Error {}

function reportCMSIssue(operation: string, error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  const log = process.env.NODE_ENV === 'development' ? console.warn : console.error;
  log(`[WordPress CMS] ${operation} failed: ${message}`);
}

function stripHtml(value?: string | null): string {
  return (value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function pickImage(node?: GraphQLNode | null): string {
  return node?.featuredImage?.node?.sourceUrl || node?.sourceUrl || '';
}

function mapProjectImage(image?: GraphQLMediaConnection) {
  const url = image?.node?.sourceUrl || '';
  return url ? { url, alt: stripHtml(image?.node?.altText || '') } : undefined;
}

function mapProjectTextBand(
  tag: string | null | undefined,
  tagEn: string | null | undefined,
  headline: string | null | undefined,
  headlineEn: string | null | undefined,
  sourceItems: Array<{
    head?: string | null;
    headEn?: string | null;
    text?: string | null;
    textEn?: string | null;
  } | null> | null | undefined,
): Project['statsBand'] {
  const items = (sourceItems ?? []).filter((item): item is NonNullable<typeof item> => Boolean(item)).map((item) => ({
    head: {
      ar: stripHtml(item.head || ''),
      en: stripHtml(item.headEn || ''),
    },
    text: {
      ar: stripHtml(item.text || ''),
      en: stripHtml(item.textEn || ''),
    },
  }));
  const band = {
    tag: { ar: stripHtml(tag || ''), en: stripHtml(tagEn || '') },
    headline: { ar: stripHtml(headline || ''), en: stripHtml(headlineEn || '') },
    items: items.filter((item) => item.head.ar || item.head.en || item.text.ar || item.text.en),
  };
  return band.tag.ar || band.tag.en || band.headline.ar || band.headline.en || band.items.length ? band : undefined;
}

function mapNewsArticle(node: GraphQLNode): NewsArticle {
  const details = node.newsDetails;
  const statistics = (details?.statistics ?? [])
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .map((item) => ({
      value: { ar: item.value || '', en: item.valueEn || '' },
      label: { ar: item.label || '', en: item.labelEn || '' },
    }))
    .filter((item) => item.value.ar || item.value.en || item.label.ar || item.label.en);

  return {
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
    publishedAt: node.date || '',
    imageAlt: stripHtml(node.featuredImage?.node?.altText || ''),
    category: {
      ar: node.newsCategoryAr || '',
      en: node.newsCategoryEn || '',
    },
    read_time: node.readTimeAr || '',
    read_time_en: node.readTimeEn || '',
    ...(statistics.length ? { statistics } : {}),
    ...(details?.companyName || details?.companyNameEn || details?.companyDescription || details?.companyDescriptionEn
      ? {
          company: {
            name: { ar: details.companyName || '', en: details.companyNameEn || '' },
            description: { ar: details.companyDescription || '', en: details.companyDescriptionEn || '' },
            logo: details.companyLogoUrl || '',
            link: details.companyLink || '',
          },
        }
      : {}),
    relatedNews: (node.relatedArticles ?? []).map(mapNewsArticle),
  };
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

const fetchCachedGraphQLResponse = cache(async (graphqlQuery: string, variables?: GraphQLVariables) => {
  const response = await fetchWithTimeout(WP_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ query: graphqlQuery, ...(variables ? { variables } : {}) }),
    next: { revalidate: 60, tags: ['wordpress-content'] },
  });

  return {
    ok: response.ok,
    status: response.status,
    statusText: response.statusText,
    body: await response.text(),
  };
});

async function fetchGraphQL<T>(query: string, variables?: GraphQLVariables): Promise<T> {
  if (!WP_GRAPHQL_URL) {
    throw new Error('GraphQL endpoint is not configured');
  }

  const result = typeof window === 'undefined'
    ? await fetchCachedGraphQLResponse(query, variables)
    : await (async () => {
        const response = await fetchWithTimeout(WP_GRAPHQL_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ query, ...(variables ? { variables } : {}) }),
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
        overview: {
          heading: { ar: '', en: '' },
          descriptionOne: { ar: '', en: '' },
          descriptionTwo: { ar: '', en: '' },
          imageOne: { url: '', alt: { ar: '', en: '' } },
          imageTwo: { url: '', alt: { ar: '', en: '' } },
        },
        statistics: [],
        strategy: {
          eyebrow: { ar: '', en: '' },
          title: { ar: '', en: '' },
          description: { ar: '', en: '' },
          ctaLabel: { ar: '', en: '' },
          ctaUrl: '',
          focusTitle: { ar: '', en: '' },
          focusDescription: { ar: '', en: '' },
          principles: [],
        },
        portfolio: {
          eyebrow: { ar: '', en: '' },
          title: { ar: '', en: '' },
          ctaLabel: { ar: '', en: '' },
          ctaUrl: '',
          items: [],
        },
        companies: {
          eyebrow: { ar: '', en: '' },
          title: { ar: '', en: '' },
          items: [],
        },
        responsibility: {
          eyebrow: { ar: '', en: '' },
          title: { ar: '', en: '' },
          items: [],
        },
        board: {
          eyebrow: { ar: '', en: '' },
          title: { ar: '', en: '' },
          members: [],
        },
        navigationLinks: [],
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
            overviewTitle?: string | null;
            overviewTitleEn?: string | null;
            overviewDescriptionOne?: string | null;
            overviewDescriptionOneEn?: string | null;
            overviewDescriptionTwo?: string | null;
            overviewDescriptionTwoEn?: string | null;
            overviewImageOneUrl?: string | null;
            overviewImageOneAlt?: string | null;
            overviewImageOneAltEn?: string | null;
            overviewImageTwoUrl?: string | null;
            overviewImageTwoAlt?: string | null;
            overviewImageTwoAltEn?: string | null;
            statistics?: Array<{ value?: string | null; label?: string | null; labelEn?: string | null }> | null;
            strategyEyebrow?: string | null;
            strategyEyebrowEn?: string | null;
            strategyTitle?: string | null;
            strategyTitleEn?: string | null;
            strategyDescription?: string | null;
            strategyDescriptionEn?: string | null;
            strategyCtaLabel?: string | null;
            strategyCtaLabelEn?: string | null;
            strategyCtaUrl?: string | null;
            strategyFocusTitle?: string | null;
            strategyFocusTitleEn?: string | null;
            strategyFocusDescription?: string | null;
            strategyFocusDescriptionEn?: string | null;
            strategyPrinciples?: Array<{ title?: string | null; titleEn?: string | null; description?: string | null; descriptionEn?: string | null }> | null;
            portfolioEyebrow?: string | null;
            portfolioEyebrowEn?: string | null;
            portfolioTitle?: string | null;
            portfolioTitleEn?: string | null;
            portfolioCtaLabel?: string | null;
            portfolioCtaLabelEn?: string | null;
            portfolioCtaUrl?: string | null;
            portfolioItems?: Array<{ title?: string | null; titleEn?: string | null; description?: string | null; descriptionEn?: string | null; metric?: string | null }> | null;
            companiesEyebrow?: string | null;
            companiesEyebrowEn?: string | null;
            companiesTitle?: string | null;
            companiesTitleEn?: string | null;
            companies?: Array<{ name?: string | null; nameEn?: string | null; description?: string | null; descriptionEn?: string | null; logoUrl?: string | null; imageUrl?: string | null; link?: string | null }> | null;
            responsibilityEyebrow?: string | null;
            responsibilityEyebrowEn?: string | null;
            responsibilityTitle?: string | null;
            responsibilityTitleEn?: string | null;
            responsibilityItems?: Array<{ title?: string | null; titleEn?: string | null; description?: string | null; descriptionEn?: string | null; imageUrl?: string | null }> | null;
            boardEyebrow?: string | null;
            boardEyebrowEn?: string | null;
            boardTitle?: string | null;
            boardTitleEn?: string | null;
            boardMembers?: Array<{ name?: string | null; nameEn?: string | null; role?: string | null; roleEn?: string | null; imageUrl?: string | null }> | null;
            navigationLinks?: Array<{ label?: string | null; labelEn?: string | null; imageUrl?: string | null; url?: string | null }> | null;
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
            overviewTitle overviewTitleEn overviewDescriptionOne overviewDescriptionOneEn overviewDescriptionTwo overviewDescriptionTwoEn
            overviewImageOneUrl overviewImageOneAlt overviewImageOneAltEn
            overviewImageTwoUrl overviewImageTwoAlt overviewImageTwoAltEn
            statistics { value label labelEn }
            strategyEyebrow strategyEyebrowEn strategyTitle strategyTitleEn strategyDescription strategyDescriptionEn
            strategyCtaLabel strategyCtaLabelEn strategyCtaUrl strategyFocusTitle strategyFocusTitleEn
            strategyFocusDescription strategyFocusDescriptionEn
            strategyPrinciples { title titleEn description descriptionEn }
            portfolioEyebrow portfolioEyebrowEn portfolioTitle portfolioTitleEn portfolioCtaLabel
            portfolioCtaLabelEn portfolioCtaUrl
            portfolioItems { title titleEn description descriptionEn metric }
            companiesEyebrow companiesEyebrowEn companiesTitle companiesTitleEn
            companies { name nameEn description descriptionEn logoUrl imageUrl link }
            responsibilityEyebrow responsibilityEyebrowEn responsibilityTitle responsibilityTitleEn
            responsibilityItems { title titleEn description descriptionEn imageUrl }
            boardEyebrow boardEyebrowEn boardTitle boardTitleEn
            boardMembers { name nameEn role roleEn imageUrl }
            navigationLinks { label labelEn imageUrl url }
          }
          visionSection {
            badgeAr badgeEn titleAr titleEn descriptionAr descriptionEn
            pillars { icon titleAr titleEn descriptionAr descriptionEn }
            footerLineAr footerLineEn ctaLabelAr ctaLabelEn ctaUrl
          }
          footer { companyDescriptionAr companyDescriptionEn visionBadgeAr visionBadgeEn }
        }
        homePageContent { image badgeAr badgeEn titleAr titleEn descAr descEn primaryLink secondaryLink }
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
      return {
        previewMode: false,
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
          primary_link: slide.primaryLink || '/projects',
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
          overview: {
            heading: {
              ar: cms.aboutPage?.overviewTitle || '',
              en: cms.aboutPage?.overviewTitleEn || '',
            },
            descriptionOne: {
              ar: cms.aboutPage?.overviewDescriptionOne || '',
              en: cms.aboutPage?.overviewDescriptionOneEn || '',
            },
            descriptionTwo: {
              ar: cms.aboutPage?.overviewDescriptionTwo || '',
              en: cms.aboutPage?.overviewDescriptionTwoEn || '',
            },
            imageOne: {
              url: cms.aboutPage?.overviewImageOneUrl || '',
              alt: { ar: cms.aboutPage?.overviewImageOneAlt || '', en: cms.aboutPage?.overviewImageOneAltEn || '' },
            },
            imageTwo: {
              url: cms.aboutPage?.overviewImageTwoUrl || '',
              alt: { ar: cms.aboutPage?.overviewImageTwoAlt || '', en: cms.aboutPage?.overviewImageTwoAltEn || '' },
            },
          },
          statistics: (cms.aboutPage?.statistics || []).filter((item) => item?.value && (item.label || item.labelEn)).map((item) => ({
            value: item.value || '',
            label: { ar: item.label || '', en: item.labelEn || '' },
          })),
          strategy: {
            eyebrow: { ar: cms.aboutPage?.strategyEyebrow || '', en: cms.aboutPage?.strategyEyebrowEn || '' },
            title: { ar: cms.aboutPage?.strategyTitle || '', en: cms.aboutPage?.strategyTitleEn || '' },
            description: { ar: cms.aboutPage?.strategyDescription || '', en: cms.aboutPage?.strategyDescriptionEn || '' },
            ctaLabel: { ar: cms.aboutPage?.strategyCtaLabel || '', en: cms.aboutPage?.strategyCtaLabelEn || '' },
            ctaUrl: cms.aboutPage?.strategyCtaUrl || '',
            focusTitle: { ar: cms.aboutPage?.strategyFocusTitle || '', en: cms.aboutPage?.strategyFocusTitleEn || '' },
            focusDescription: { ar: cms.aboutPage?.strategyFocusDescription || '', en: cms.aboutPage?.strategyFocusDescriptionEn || '' },
            principles: (cms.aboutPage?.strategyPrinciples || []).filter((item) => item && (item.title || item.titleEn)).map((item) => ({
              title: { ar: item.title || '', en: item.titleEn || '' },
              description: { ar: item.description || '', en: item.descriptionEn || '' },
            })),
          },
          portfolio: {
            eyebrow: { ar: cms.aboutPage?.portfolioEyebrow || '', en: cms.aboutPage?.portfolioEyebrowEn || '' },
            title: { ar: cms.aboutPage?.portfolioTitle || '', en: cms.aboutPage?.portfolioTitleEn || '' },
            ctaLabel: { ar: cms.aboutPage?.portfolioCtaLabel || '', en: cms.aboutPage?.portfolioCtaLabelEn || '' },
            ctaUrl: cms.aboutPage?.portfolioCtaUrl || '',
            items: (cms.aboutPage?.portfolioItems || []).filter((item) => item && (item.title || item.titleEn || item.description || item.descriptionEn || item.metric)).map((item) => ({
              title: { ar: item.title || '', en: item.titleEn || '' },
              description: { ar: item.description || '', en: item.descriptionEn || '' },
              metric: item.metric || '',
            })),
          },
          companies: {
            eyebrow: { ar: cms.aboutPage?.companiesEyebrow || '', en: cms.aboutPage?.companiesEyebrowEn || '' },
            title: { ar: cms.aboutPage?.companiesTitle || '', en: cms.aboutPage?.companiesTitleEn || '' },
            items: (cms.aboutPage?.companies || []).filter((item) => item && (item.name || item.nameEn || item.logoUrl || item.imageUrl)).map((item) => ({
              name: { ar: item.name || '', en: item.nameEn || '' },
              description: { ar: item.description || '', en: item.descriptionEn || '' },
              logo: item.logoUrl || '',
              image: item.imageUrl || '',
              link: item.link || '',
            })),
          },
          responsibility: {
            eyebrow: { ar: cms.aboutPage?.responsibilityEyebrow || '', en: cms.aboutPage?.responsibilityEyebrowEn || '' },
            title: { ar: cms.aboutPage?.responsibilityTitle || '', en: cms.aboutPage?.responsibilityTitleEn || '' },
            items: (cms.aboutPage?.responsibilityItems || []).filter((item) => item && (item.title || item.titleEn || item.description || item.descriptionEn || item.imageUrl)).map((item) => ({
              title: { ar: item.title || '', en: item.titleEn || '' },
              description: { ar: item.description || '', en: item.descriptionEn || '' },
              image: item.imageUrl || '',
            })),
          },
          board: {
            eyebrow: { ar: cms.aboutPage?.boardEyebrow || '', en: cms.aboutPage?.boardEyebrowEn || '' },
            title: { ar: cms.aboutPage?.boardTitle || '', en: cms.aboutPage?.boardTitleEn || '' },
            members: (cms.aboutPage?.boardMembers || []).filter((member) => member && (member.name || member.nameEn || member.imageUrl)).map((member) => ({
              name: { ar: member.name || '', en: member.nameEn || '' },
              role: { ar: member.role || '', en: member.roleEn || '' },
              image: member.imageUrl || '',
            })),
          },
          navigationLinks: (cms.aboutPage?.navigationLinks || []).filter((item) => item && (item.label || item.labelEn) && item.url).map((item) => ({
            label: { ar: item.label || '', en: item.labelEn || '' },
            image: item.imageUrl || '',
            url: item.url || '',
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
        email?: string | null; phone?: string | null; website?: string | null;
        addressAr?: string | null; addressEn?: string | null;
        workingHoursAr?: string | null; workingHoursEn?: string | null;
        locationAr?: string | null; locationEn?: string | null;
        mapLat?: number | null; mapLng?: number | null; mapUrl?: string | null;
        linkedinUrl?: string | null; twitterUrl?: string | null;
        formTitleAr?: string | null; formTitleEn?: string | null;
      } | null }>(`{
        alomarContactPageContent {
          badgeAr badgeEn titleAr titleEn descriptionAr descriptionEn bannerImage
          headingAr headingEn email phone website addressAr addressEn
          workingHoursAr workingHoursEn locationAr locationEn mapLat mapLng mapUrl
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
        website: content.website || '',
        address: { ar: content.addressAr || '', en: content.addressEn || '' },
        workingHours: { ar: content.workingHoursAr || '', en: content.workingHoursEn || '' },
        location: { ar: content.locationAr || '', en: content.locationEn || '' },
        coordinates: { lat: content.mapLat || 0, lng: content.mapLng || 0 },
        mapUrl: content.mapUrl || '',
        linkedinUrl: content.linkedinUrl || '',
        twitterUrl: content.twitterUrl || '',
        formTitle: { ar: content.formTitleAr || '', en: content.formTitleEn || '' },
      };
    } catch (error) {
      reportCMSIssue('getContactPageContent', error);
      return null;
    }
  },

  async getInvestWithUsPageContent(): Promise<InvestWithUsPageContent | null> {
    if (!WP_GRAPHQL_URL) return null;
    const data = await fetchGraphQL<{
      alomarInvestWithUsPageContent?: {
        heroBadgeAr?: string | null;
        heroBadgeEn?: string | null;
        heroTitleAr?: string | null;
        heroTitleEn?: string | null;
        heroDescriptionAr?: string | null;
        heroDescriptionEn?: string | null;
        heroImage?: string | null;
        opportunityHeadingAr?: string | null;
        opportunityHeadingEn?: string | null;
        opportunityDescriptionAr?: string | null;
        opportunityDescriptionEn?: string | null;
        processHeadingAr?: string | null;
        processHeadingEn?: string | null;
        processItems?: Array<{
          titleAr?: string | null;
          titleEn?: string | null;
          descriptionAr?: string | null;
          descriptionEn?: string | null;
        }> | null;
        contactHeadingAr?: string | null;
        contactHeadingEn?: string | null;
        contactDescriptionAr?: string | null;
        contactDescriptionEn?: string | null;
        inquiryFormTitleAr?: string | null;
        inquiryFormTitleEn?: string | null;
        inquiryFormSubmitLabelAr?: string | null;
        inquiryFormSubmitLabelEn?: string | null;
        investmentFormId?: string | null;
      } | null;
    }>(`{
      alomarInvestWithUsPageContent {
        heroBadgeAr heroBadgeEn heroTitleAr heroTitleEn heroDescriptionAr heroDescriptionEn heroImage
        opportunityHeadingAr opportunityHeadingEn opportunityDescriptionAr opportunityDescriptionEn
        processHeadingAr processHeadingEn processItems { titleAr titleEn descriptionAr descriptionEn }
        contactHeadingAr contactHeadingEn contactDescriptionAr contactDescriptionEn
        inquiryFormTitleAr inquiryFormTitleEn inquiryFormSubmitLabelAr inquiryFormSubmitLabelEn
        investmentFormId
      }
    }`);
    const content = data.alomarInvestWithUsPageContent;
    if (!content) return null;

    const formId = content.investmentFormId && /^\d+$/.test(content.investmentFormId)
      ? Number(content.investmentFormId)
      : null;
    return {
      heroBadge: { ar: content.heroBadgeAr || '', en: content.heroBadgeEn || '' },
      heroTitle: { ar: content.heroTitleAr || '', en: content.heroTitleEn || '' },
      heroDescription: { ar: content.heroDescriptionAr || '', en: content.heroDescriptionEn || '' },
      heroImage: content.heroImage || '',
      opportunityHeading: { ar: content.opportunityHeadingAr || '', en: content.opportunityHeadingEn || '' },
      opportunityDescription: { ar: content.opportunityDescriptionAr || '', en: content.opportunityDescriptionEn || '' },
      processHeading: { ar: content.processHeadingAr || '', en: content.processHeadingEn || '' },
      processItems: (content.processItems || []).map((item) => ({
        title: { ar: item.titleAr || '', en: item.titleEn || '' },
        description: { ar: item.descriptionAr || '', en: item.descriptionEn || '' },
      })),
      contactHeading: { ar: content.contactHeadingAr || '', en: content.contactHeadingEn || '' },
      contactDescription: { ar: content.contactDescriptionAr || '', en: content.contactDescriptionEn || '' },
      formTitle: { ar: content.inquiryFormTitleAr || '', en: content.inquiryFormTitleEn || '' },
      formSubmitLabel: { ar: content.inquiryFormSubmitLabelAr || '', en: content.inquiryFormSubmitLabelEn || '' },
      investmentFormId: formId && Number.isSafeInteger(formId) && formId > 0 ? formId : null,
    };
  },

  async getInvestmentsPageContent(): Promise<InvestmentsPageContent | null> {
    if (!WP_GRAPHQL_URL) return null;
    try {
      const data = await fetchGraphQL<{
        alomarInvestmentsPageContent?: {
          heroBadgeAr?: string | null; heroBadgeEn?: string | null;
          heroTitleAr?: string | null; heroTitleEn?: string | null;
          heroDescriptionAr?: string | null; heroDescriptionEn?: string | null;
          seoTitleAr?: string | null; seoTitleEn?: string | null;
          seoDescriptionAr?: string | null; seoDescriptionEn?: string | null;
          introEyebrowAr?: string | null; introEyebrowEn?: string | null;
          introHeadingAr?: string | null; introHeadingEn?: string | null;
          introDescriptionAr?: string | null; introDescriptionEn?: string | null;
          introImage?: string | null;
          statistics?: Array<{ value?: string | null; labelAr?: string | null; labelEn?: string | null } | null> | null;
          portfolioEyebrowAr?: string | null; portfolioEyebrowEn?: string | null;
          portfolioHeadingAr?: string | null; portfolioHeadingEn?: string | null;
          portfolioDescriptionAr?: string | null; portfolioDescriptionEn?: string | null;
          ctaEyebrowAr?: string | null; ctaEyebrowEn?: string | null;
          ctaHeadingAr?: string | null; ctaHeadingEn?: string | null;
          ctaDescriptionAr?: string | null; ctaDescriptionEn?: string | null;
          ctaButtonLabelAr?: string | null; ctaButtonLabelEn?: string | null;
          ctaUrl?: string | null;
          navigationLinks?: Array<{
            labelAr?: string | null; labelEn?: string | null;
            descriptionAr?: string | null; descriptionEn?: string | null;
            imageUrl?: string | null; url?: string | null;
          } | null> | null;
        } | null;
      }>(`{
        alomarInvestmentsPageContent {
          heroBadgeAr heroBadgeEn heroTitleAr heroTitleEn heroDescriptionAr heroDescriptionEn
          seoTitleAr seoTitleEn seoDescriptionAr seoDescriptionEn
          introEyebrowAr introEyebrowEn introHeadingAr introHeadingEn
          introDescriptionAr introDescriptionEn introImage
          statistics { value labelAr labelEn }
          portfolioEyebrowAr portfolioEyebrowEn portfolioHeadingAr portfolioHeadingEn
          portfolioDescriptionAr portfolioDescriptionEn
          ctaEyebrowAr ctaEyebrowEn ctaHeadingAr ctaHeadingEn
          ctaDescriptionAr ctaDescriptionEn ctaButtonLabelAr ctaButtonLabelEn ctaUrl
          navigationLinks { labelAr labelEn descriptionAr descriptionEn imageUrl url }
        }
      }`);
      const content = data.alomarInvestmentsPageContent;
      if (!content) return null;
      return {
        heroBadge: { ar: content.heroBadgeAr || '', en: content.heroBadgeEn || '' },
        heroTitle: { ar: content.heroTitleAr || '', en: content.heroTitleEn || '' },
        heroDescription: { ar: content.heroDescriptionAr || '', en: content.heroDescriptionEn || '' },
        seoTitle: { ar: content.seoTitleAr || '', en: content.seoTitleEn || '' },
        seoDescription: { ar: content.seoDescriptionAr || '', en: content.seoDescriptionEn || '' },
        introEyebrow: { ar: content.introEyebrowAr || '', en: content.introEyebrowEn || '' },
        introHeading: { ar: content.introHeadingAr || '', en: content.introHeadingEn || '' },
        introDescription: { ar: content.introDescriptionAr || '', en: content.introDescriptionEn || '' },
        introImage: content.introImage || '',
        statistics: (content.statistics || []).filter((item) => item?.value).map((item) => ({
          value: item?.value || '',
          label: { ar: item?.labelAr || '', en: item?.labelEn || '' },
        })),
        portfolioEyebrow: { ar: content.portfolioEyebrowAr || '', en: content.portfolioEyebrowEn || '' },
        portfolioHeading: { ar: content.portfolioHeadingAr || '', en: content.portfolioHeadingEn || '' },
        portfolioDescription: { ar: content.portfolioDescriptionAr || '', en: content.portfolioDescriptionEn || '' },
        ctaEyebrow: { ar: content.ctaEyebrowAr || '', en: content.ctaEyebrowEn || '' },
        ctaHeading: { ar: content.ctaHeadingAr || '', en: content.ctaHeadingEn || '' },
        ctaDescription: { ar: content.ctaDescriptionAr || '', en: content.ctaDescriptionEn || '' },
        ctaButtonLabel: { ar: content.ctaButtonLabelAr || '', en: content.ctaButtonLabelEn || '' },
        ctaUrl: content.ctaUrl || '',
        navigationLinks: (content.navigationLinks || []).filter((item) => item?.url && (item.labelAr || item.labelEn)).map((item) => ({
          label: { ar: item?.labelAr || '', en: item?.labelEn || '' },
          description: { ar: item?.descriptionAr || '', en: item?.descriptionEn || '' },
          image: item?.imageUrl || '',
          url: item?.url || '',
        })),
      };
    } catch (error) {
      reportCMSIssue('getInvestmentsPageContent', error);
      throw error;
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
              platform?: string | string[] | null;
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
          platform: (Array.isArray(item.platform) ? item.platform[0] : item.platform) || '',
          url: item.socialLink?.url || '',
        })).filter((item) => Boolean(item.url && item.url !== '/')),
      };
    } catch (error) {
      reportCMSIssue('getFooter', error);
      return null;
    }
  },

  async getProjects(
    category?: string,
    { usePreviewData = true }: { usePreviewData?: boolean } = {},
  ): Promise<Project[]> {
    if (!WP_GRAPHQL_URL) {
      if (PREVIEW_MODE && usePreviewData && (!category || category === 'all')) return mockProjects;
      if (PREVIEW_MODE && usePreviewData) return mockProjects.filter((p) => p.category.includes(category || ''));
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
              featuredImage { node { sourceUrl } }
              projectDetails {
                titleAr titleEn
                excerptAr excerptEn
                contentAr contentEn
                featured
                projectLogo { node { sourceUrl altText } }
                statsTag statsTagEn statsHeadline statsHeadlineEn
                statsItems { statHead statHeadEn statText statTextEn }
                makeTag makeTagEn makeHeadline makeHeadlineEn
                makeItems { makeHead makeHeadEn makeText makeTextEn }
                companiesTag companiesTagEn companiesHeadline companiesHeadlineEn
                companiesItems { companyLogo { node { sourceUrl altText } } companyLink }
                experienceTag experienceTagEn experienceHeadline experienceHeadlineEn
                experienceItems { experienceHead experienceHeadEn experienceText experienceTextEn }
                keyProjectsTag keyProjectsTagEn keyProjectsHeadline keyProjectsHeadlineEn
                keyProjectsItems {
                  keyProjectsImg { node { sourceUrl altText } }
                  keyProjectsHead keyProjectsHeadEn
                  keyProjectsLocation keyProjectsLocationEn
                  keyProjectsText keyProjectsTextEn
                  keyProjectsLink { url title target }
                }
              }
              projectCategories { nodes { name nameEn slug } }
              projectLocations { nodes { name nameEn slug } }
            }
          }
        }`);

        const mapped = (data.projects?.nodes ?? []).map((node) => {
          const details = node.projectDetails;
          const title = stripHtml(details?.titleAr || node.title || '');
          const excerpt = stripHtml(details?.excerptAr || node.excerpt || '');
          const content = stripHtml(details?.contentAr || node.content || '');
          const categoryName = node.projectCategories?.nodes?.[0]?.name || '';
          const locationName = node.projectLocations?.nodes?.[0]?.name || '';
          const categoryNameEn = node.projectCategories?.nodes?.[0]?.nameEn || '';
          const locationNameEn = node.projectLocations?.nodes?.[0]?.nameEn || '';
          const categoryTerms = (node.projectCategories?.nodes || []).map((term) => ({
            slug: term.slug || term.name || '',
            name: {
              ar: stripHtml(term.name || ''),
              en: stripHtml(term.nameEn || term.name || ''),
            },
          }));

          return {
            id: node.databaseId ?? 0,
            slug: node.slug || node.uri || title.toLowerCase().replace(/\s+/g, '-'),
            title: {
              ar: title,
              en: stripHtml(details?.titleEn || ''),
            },
            excerpt: {
              ar: excerpt,
              en: stripHtml(details?.excerptEn || ''),
            },
            content: {
              ar: content,
              en: stripHtml(details?.contentEn || ''),
            },
            image: pickImage(node),
            gallery: [],
            category: categoryName,
            category_en: categoryNameEn,
            categoryTerms,
            location: locationName,
            location_en: locationNameEn || locationName,
            status: '',
            status_en: '',
            completion_year: '',
            featured: details?.featured ?? false,
            highlights: [],
            logo: (() => {
              const logo = mapProjectImage(details?.projectLogo);
              return logo ? { ...logo, alt: logo.alt || `${title} logo` } : undefined;
            })(),
            statsBand: details ? mapProjectTextBand(
              details.statsTag,
              details.statsTagEn,
              details.statsHeadline,
              details.statsHeadlineEn,
              details.statsItems?.map((item) => item && ({
                head: item.statHead, headEn: item.statHeadEn, text: item.statText, textEn: item.statTextEn,
              })),
            ) : undefined,
            makeBand: details ? mapProjectTextBand(
              details.makeTag,
              details.makeTagEn,
              details.makeHeadline,
              details.makeHeadlineEn,
              details.makeItems?.map((item) => item && ({
                head: item.makeHead, headEn: item.makeHeadEn, text: item.makeText, textEn: item.makeTextEn,
              })),
            ) : undefined,
            experienceBand: details ? mapProjectTextBand(
              details.experienceTag,
              details.experienceTagEn,
              details.experienceHeadline,
              details.experienceHeadlineEn,
              details.experienceItems?.map((item) => item && ({
                head: item.experienceHead,
                headEn: item.experienceHeadEn,
                text: item.experienceText,
                textEn: item.experienceTextEn,
              })),
            ) : undefined,
            companiesBand: details ? (() => {
              const items = (details.companiesItems ?? []).filter((item): item is NonNullable<typeof item> => Boolean(item))
                .map((item) => ({
                  logo: (() => {
                    const logo = mapProjectImage(item.companyLogo);
                    return logo ? { ...logo, alt: logo.alt || `Company logo for ${title}` } : undefined;
                  })(),
                  link: item.companyLink || '',
                }))
                .filter((item): item is { logo: { url: string; alt: string }; link: string } => Boolean(item.logo));
              const band = {
                tag: { ar: stripHtml(details.companiesTag || ''), en: stripHtml(details.companiesTagEn || '') },
                headline: { ar: stripHtml(details.companiesHeadline || ''), en: stripHtml(details.companiesHeadlineEn || '') },
                items,
              };
              return band.tag.ar || band.tag.en || band.headline.ar || band.headline.en || items.length ? band : undefined;
            })() : undefined,
            keyProjectsBand: details ? (() => {
              const items = (details.keyProjectsItems ?? []).filter((item): item is NonNullable<typeof item> => Boolean(item))
                .map((item) => ({
                  image: mapProjectImage(item.keyProjectsImg),
                  head: { ar: stripHtml(item.keyProjectsHead || ''), en: stripHtml(item.keyProjectsHeadEn || '') },
                  location: { ar: stripHtml(item.keyProjectsLocation || ''), en: stripHtml(item.keyProjectsLocationEn || '') },
                  text: { ar: stripHtml(item.keyProjectsText || ''), en: stripHtml(item.keyProjectsTextEn || '') },
                  link: {
                    url: item.keyProjectsLink?.url || '',
                    title: item.keyProjectsLink?.title || '',
                    target: item.keyProjectsLink?.target || '',
                  },
                }))
                .map((item) => ({
                  ...item,
                  image: item.image ? { ...item.image, alt: item.image.alt || item.head.en || item.head.ar || title } : undefined,
                }))
                .filter((item) => item.head.ar || item.head.en || item.text.ar || item.text.en || item.image);
              const band = {
                tag: { ar: stripHtml(details.keyProjectsTag || ''), en: stripHtml(details.keyProjectsTagEn || '') },
                headline: { ar: stripHtml(details.keyProjectsHeadline || ''), en: stripHtml(details.keyProjectsHeadlineEn || '') },
                items,
              };
              return band.tag.ar || band.tag.en || band.headline.ar || band.headline.en || items.length ? band : undefined;
            })() : undefined,
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
      throw error;
    }
  },

  async getProjectBySlug(slug: string): Promise<Project | null> {
    const list = await this.getProjects('all');
    return list.find((p) => p.slug === slug) || null;
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
        cta_label: { ar: '', en: '' },
        cta_url: '',
      };
    } catch (error) {
      reportCMSIssue('getHeader', error);
      return null;
    }
  },

  async getNews(): Promise<NewsArticle[]> {
    if (!WP_GRAPHQL_URL) return PREVIEW_MODE ? mockNews : [];

    try {
      if (WP_GRAPHQL_URL) {
        const data = await fetchGraphQL<{
          newsArticles?: { nodes?: GraphQLNode[] | null };
        }>(`{
          newsArticles(first: 50) {
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
              featuredImage { node { sourceUrl altText } }
            }
          }
        }`);

        const mapped = (data.newsArticles?.nodes ?? []).map(mapNewsArticle);

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

  async getArticleById(id: number): Promise<NewsArticle | null> {
    if (!WP_GRAPHQL_URL) {
      return PREVIEW_MODE ? mockNews.find((article) => article.id === id) || null : null;
    }

    if (!Number.isSafeInteger(id) || id <= 0) return null;

    try {
      const data = await fetchGraphQL<{ newsArticle?: GraphQLNode | null }>(`query ArticleById($id: ID!) {
        newsArticle(id: $id, idType: DATABASE_ID) {
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
          featuredImage { node { sourceUrl altText } }
          newsDetails {
            statistics { value valueEn label labelEn }
            companyName
            companyNameEn
            companyDescription
            companyDescriptionEn
            companyLogoUrl
            companyLink
          }
          relatedArticles {
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
            featuredImage { node { sourceUrl altText } }
          }
        }
      }`, { id });

      return data.newsArticle ? mapNewsArticle(data.newsArticle) : null;
    } catch (error) {
      reportCMSIssue('getArticleById', error);
      if (!PREVIEW_MODE) {
        throw error;
      }
      return null;
    }
  },
};