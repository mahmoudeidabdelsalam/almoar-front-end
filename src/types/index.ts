export type Locale = 'ar' | 'en';

export interface LocalizedString {
  ar: string;
  en: string;
}

export interface StatisticItem {
  key: string;
  number: string;
  label_ar: string;
  label_en: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address_ar: string;
  address_en: string;
  working_hours_ar: string;
  working_hours_en: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface SocialLinks {
  x: string;
  linkedin: string;
  instagram: string;
}

export interface SiteSettings {
  site_name: LocalizedString;
  tagline: LocalizedString;
  contact: ContactInfo;
  statistics: StatisticItem[];
  social_links: SocialLinks;
}

export interface HeroSlide {
  id: number;
  image: string;
  badge_ar: string;
  badge_en: string;
  title_ar: string;
  title_en: string;
  desc_ar: string;
  desc_en: string;
  primary_link: string;
  secondary_link: string;
}

export interface PageBannerContent {
  pageKey: string;
  badge: LocalizedString;
  title: LocalizedString;
  description: LocalizedString;
  image: string;
  seoTitle: LocalizedString;
  seoDescription: LocalizedString;
}

export interface SectionCopy {
  sectionKey: string;
  badge: LocalizedString;
  title: LocalizedString;
  description: LocalizedString;
  ctaLabel: LocalizedString;
  ctaUrl: string;
}

export interface ContentPillar {
  icon: string;
  title: LocalizedString;
  description: LocalizedString;
}

export interface HomeAboutContent {
  badge: LocalizedString;
  title: LocalizedString;
  descriptionOne: LocalizedString;
  descriptionTwo: LocalizedString;
  image: string;
  pillars: ContentPillar[];
}

export interface AboutPageContent {
  chairmanImage: string;
  chairmanName: LocalizedString;
  chairmanRole: LocalizedString;
  messageHeading: LocalizedString;
  quote: LocalizedString;
  messageOne: LocalizedString;
  messageTwo: LocalizedString;
  visionTitle: LocalizedString;
  visionDescription: LocalizedString;
  missionTitle: LocalizedString;
  missionDescription: LocalizedString;
  values: Array<{ title: LocalizedString; description: LocalizedString }>;
  overview: {
    heading: LocalizedString;
    descriptionOne: LocalizedString;
    descriptionTwo: LocalizedString;
    imageOne: { url: string; alt: LocalizedString };
    imageTwo: { url: string; alt: LocalizedString };
  };
  statistics: Array<{ value: string; label: LocalizedString }>;
  strategy: {
    eyebrow: LocalizedString;
    title: LocalizedString;
    description: LocalizedString;
    ctaLabel: LocalizedString;
    ctaUrl: string;
    focusTitle: LocalizedString;
    focusDescription: LocalizedString;
    principles: Array<{ title: LocalizedString; description: LocalizedString }>;
  };
  portfolio: {
    eyebrow: LocalizedString;
    title: LocalizedString;
    ctaLabel: LocalizedString;
    ctaUrl: string;
    items: Array<{ title: LocalizedString; description: LocalizedString; metric: string }>;
  };
  companies: {
    eyebrow: LocalizedString;
    title: LocalizedString;
    items: Array<{
      name: LocalizedString;
      description: LocalizedString;
      logo: string;
      image: string;
      link: string;
    }>;
  };
  responsibility: {
    eyebrow: LocalizedString;
    title: LocalizedString;
    items: Array<{ title: LocalizedString; description: LocalizedString; image: string }>;
  };
  board: {
    eyebrow: LocalizedString;
    title: LocalizedString;
    members: Array<{ name: LocalizedString; role: LocalizedString; image: string }>;
  };
  navigationLinks: Array<{ label: LocalizedString; image: string; url: string }>;
}

export interface VisionSectionContent {
  badge: LocalizedString;
  title: LocalizedString;
  description: LocalizedString;
  pillars: ContentPillar[];
  footerLine: LocalizedString;
  ctaLabel: LocalizedString;
  ctaUrl: string;
}

export interface FooterLink {
  label: LocalizedString;
  url: string;
  icon?: string;
}

export interface FooterColumn {
  title: LocalizedString;
  links: FooterLink[];
}

export interface FooterContent {
  companyDescription: LocalizedString;
  visionBadge: LocalizedString;
  logo: string;
  logoAlt: string;
  columns: FooterColumn[];
  newsletterTitle: LocalizedString;
  newsletterDescription: LocalizedString;
  newsletterPlaceholder: LocalizedString;
  newsletterButton: LocalizedString;
  copyright: LocalizedString;
  socialLinks: Array<{ platform: string; url: string }>;
}

export interface HeaderMenuItem {
  label: LocalizedString;
  url: string;
  image: string;
  children: HeaderMenuItem[];
  category?: LocalizedString;
}

export interface HeaderContent {
  logo: string;
  logo_en: string;
  menu: HeaderMenuItem[];
  cta_label: LocalizedString;
  cta_url: string;
}

export interface ContactPageContent {
  badge: LocalizedString;
  title: LocalizedString;
  description: LocalizedString;
  bannerImage: string;
  heading: LocalizedString;
  email: string;
  phone: string;
  website: string;
  address: LocalizedString;
  workingHours: LocalizedString;
  location: LocalizedString;
  coordinates: { lat: number; lng: number };
  mapUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  formTitle: LocalizedString;
}

export interface InvestWithUsPageContent {
  heroBadge: LocalizedString;
  heroTitle: LocalizedString;
  heroDescription: LocalizedString;
  heroImage: string;
  opportunityHeading: LocalizedString;
  opportunityDescription: LocalizedString;
  processHeading: LocalizedString;
  processItems: Array<{ title: LocalizedString; description: LocalizedString }>;
  contactHeading: LocalizedString;
  contactDescription: LocalizedString;
  formTitle: LocalizedString;
  formSubmitLabel: LocalizedString;
  investmentFormId: number | null;
}

export interface GravityFormInput {
  id: string;
  label: string;
  type: string;
  isHidden: boolean;
}

export interface GravityFormChoice {
  text: string;
  value: string;
}

export interface GravityFormCondition {
  fieldId: string;
  operator: string;
  value: string;
}

export interface GravityFormConditionalLogic {
  actionType?: 'show' | 'hide';
  logicType?: 'all' | 'any';
  rules?: GravityFormCondition[];
}

export interface GravityFormField {
  id: string;
  type: string;
  label: string;
  description: string;
  placeholder: string;
  isRequired: boolean;
  inputs: GravityFormInput[];
  choices: GravityFormChoice[];
  conditionalLogic: GravityFormConditionalLogic | null;
}

export interface GravityFormDefinition {
  id: number;
  title: string;
  fields: GravityFormField[];
  buttonText: string;
}

export interface SiteContent {
  previewMode: boolean;
  settings: SiteSettings;
  heroSlides: HeroSlide[];
  pageBanners: Record<string, PageBannerContent>;
  sectionCopy: Record<string, SectionCopy>;
  homeAbout: HomeAboutContent;
  aboutPage: AboutPageContent;
  visionSection: VisionSectionContent;
  footer: FooterContent;
}

export interface Project {
  id: number;
  slug: string;
  title: LocalizedString;
  excerpt: LocalizedString;
  content?: LocalizedString;
  image: string;
  gallery?: string[];
  category: string;
  category_en?: string;
  location: string;
  location_en?: string;
  status: string;
  status_en: string;
  units_count?: string;
  land_area?: string;
  built_area?: string;
  completion_year: string;
  brochure_url?: string;
  featured?: boolean;
  highlights?: LocalizedString[];
  logo?: { url: string; alt: string };
  statsBand?: ProjectTextBand;
  makeBand?: ProjectTextBand;
  companiesBand?: ProjectCompaniesBand;
  experienceBand?: ProjectTextBand;
  keyProjectsBand?: ProjectKeyProjectsBand;
}

export interface ProjectTextBand {
  tag: LocalizedString;
  headline: LocalizedString;
  items: Array<{ head: LocalizedString; text: LocalizedString }>;
}

export interface ProjectCompaniesBand {
  tag: LocalizedString;
  headline: LocalizedString;
  items: Array<{ logo: { url: string; alt: string }; link: string }>;
}

export interface ProjectKeyProjectsBand {
  tag: LocalizedString;
  headline: LocalizedString;
  items: Array<{
    image?: { url: string; alt: string };
    head: LocalizedString;
    location: LocalizedString;
    text: LocalizedString;
    link: { url: string; title: string; target: string };
  }>;
}

export interface Sector {
  id: number;
  slug: string;
  title: LocalizedString;
  summary: LocalizedString;
  content?: LocalizedString;
  icon: string;
  image: string;
  stats?: { label: LocalizedString; value: string }[];
}

export interface SubsidiaryCompany {
  id: number;
  slug: string;
  name: LocalizedString;
  tagline: LocalizedString;
  description: LocalizedString;
  logo: string;
  website?: string;
  year?: string;
  sector_slug?: string;
}

export interface NewsArticle {
  id: number;
  slug: string;
  title: LocalizedString;
  excerpt: LocalizedString;
  content: LocalizedString;
  image: string;
  date: string;
  publishedAt?: string;
  category: LocalizedString;
  read_time: string;
  read_time_en?: string;
  relatedNews?: NewsArticle[];
}

export interface InvestmentArticle {
  id: number;
  slug: string;
  title: LocalizedString;
  summary: LocalizedString;
  description: LocalizedString;
  image: string;
  gallery?: string[];
  location: LocalizedString;
  status: LocalizedString;
  website?: string;
  statistics?: Array<{ label: LocalizedString; value: string }>;
}

export interface MediaCenterItem {
  id: number;
  slug: string;
  title: LocalizedString;
  summary: LocalizedString;
  content: LocalizedString;
  image: string;
  date: string;
  mediaType: string;
  videoUrl?: string;
  documentUrl?: string;
  externalUrl?: string;
  gallery?: string[];
}

export interface ContactFormPayload {
  full_name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
  sector_interest?: string;
  lang?: Locale;
  website?: string;
  _wpnonce?: string;
}
