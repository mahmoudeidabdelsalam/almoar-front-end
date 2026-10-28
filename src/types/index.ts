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

export interface FooterContent {
  companyDescription: LocalizedString;
  visionBadge: LocalizedString;
}

export interface SiteContent {
  previewMode: boolean;
  settings: SiteSettings;
  sectors: Sector[];
  companies: SubsidiaryCompany[];
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

export interface TeamMember {
  id: number;
  name: LocalizedString;
  role: LocalizedString;
  bio: LocalizedString;
  image: string;
  order: number;
}

export interface NewsArticle {
  id: number;
  slug: string;
  title: LocalizedString;
  excerpt: LocalizedString;
  content: LocalizedString;
  image: string;
  date: string;
  category: LocalizedString;
  read_time: string;
  read_time_en?: string;
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
