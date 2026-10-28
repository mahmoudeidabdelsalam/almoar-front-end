# CMS Content Mapping

## Route and section mapping

| Frontend route | WordPress source | Frontend usage |
|---|---|---|
| `/` | `alomarSiteContent.settings`, `pageBanners`, `sectionCopy`, `homeAbout`, `visionSection`, `footer`; `homePageContent`; `projects`; `sectors`; `companies`; `boardMembers`; `posts` | Hero, statistics, about, sectors, featured projects, Vision 2030, subsidiaries, leadership, news, contact details, and shared footer. Homepage data requests run together and share the site-content query for sectors/companies. |
| `/about` | `pageBanners[about]`, `aboutPage`, `visionSection`, `boardMembers` | Route banner/SEO, chairman message and portrait, corporate vision/mission/values, Vision 2030, and leadership. |
| `/sectors` | `pageBanners[sectors]`, `sectors` | Route banner/SEO and sector title, summary, long description, icon key, and featured image. |
| `/companies` | `pageBanners[companies]`, `companies` | Route banner/SEO and company name, bilingual tagline/description, logo, website, and year. |
| `/projects` | `pageBanners[projects]`, `projects` | Route banner/SEO and project cards, categories, locations, status, image, specs, and filters. |
| `/projects/[slug]` | `projects` | Project detail and related projects. The current client resolves a slug from the cached projects list rather than issuing a separate object query. |
| `/news` | `pageBanners[news]`, `posts` | Route banner/SEO and article cards. The current list query requests the first 10 posts. |
| `/news/[slug]` | `posts` | Article body, metadata, featured image, and related articles, resolved from the same first-10-post list. |
| `/contact` | `pageBanners[contact]`, shared settings, `sectors`; `POST /wp-json/alomar/v1/contact` | Contact copy/details, sector-interest options, validation, and inquiry submission. |

The header and footer use shared settings and footer editorial fields on all routes. The homepage section-copy keys are `sectors`, `projects`, `companies`, `leadership`, `news`, and `contact`.

## Record field mapping

| CMS fields | Frontend model |
|---|---|
| `homePageContent.image`, `badgeAr/En`, `titleAr/En`, `descAr/En`, `primaryLink`, `secondaryLink` | `HeroSlide` |
| `settings.siteNameAr/En`, `taglineAr/En`, contact fields, map coordinates, statistics, social links | `SiteSettings` |
| `pageBanners.pageKey`, localized badge/title/description, `imageUrl`, localized SEO title/description | `PageBannerContent`, indexed by `pageKey` |
| `sectionCopy.sectionKey`, localized badge/title/description/CTA, `ctaUrl` | `SectionCopy`, indexed by `sectionKey` |
| Project title/excerpt/content and English ACF counterparts, status, location, specs, category/location terms, `featured`, gallery, highlights, `featuredImage` | `Project` |
| Sector title/excerpt, `titleEn`, `summaryEn`, `contentEn`, `sectorIcon`, `featuredImage` | `Sector` |
| Company title, `nameEn`, bilingual tagline, `descriptionEn`, website, year, `featuredImage` | `SubsidiaryCompany` |
| Board member title, `nameEn`, bilingual roles, English bio, display order, `featuredImage` | `TeamMember` |
| Post title/excerpt/content and English counterparts, news category, reading time, publication date, `featuredImage` | `NewsArticle` |

Plain-text presentation values are stripped of HTML. Article body content remains HTML for the article renderer. The normalized model preserves missing translations as empty; locale-aware list and editorial sections omit records or text without the active language rather than substituting Arabic. The project and news detail routes currently render Arabic-first and need a separate locale-aware detail-page enhancement.

## Images and alternative text

Content records map `featuredImage.node.sourceUrl` to the normalized image URL. Hero slides without both-language titles or an image are omitted. Missing project, sector, news, or leadership images render a neutral branded surface rather than borrowing an unrelated photograph. Company cards may use the group logo mark when no company logo is set.

Image alternative text is currently derived from the localized record title/name for hero slides, project/sector/news cards, company logos, and leader portraits. Page-banner alternative text is supplied by the route component; ACF page-banner records do not currently expose a separate alt-text field. CMS editors should use meaningful featured images and titles; a dedicated media-alt field remains a possible content-model enhancement.
