# Frontend data mapping

The frontend is a Next.js application. CMS reads use WPGraphQL through `src/lib/wordpress/client.ts`; Arabic and English rendering is selected through the locale context. CMS preview records are limited to development without a configured endpoint.

## Route-to-data mapping

| Route / surface | Data source | Current behavior |
|---|---|---|
| `/` and localized home | `getSiteContent()`, `getNews()`, `getProjects('all')` | Renders `HeroSlider`, `CompaniesSection`, `ApproachSection`, and `NewsSection`. `CompaniesSection` is currently fed `Project[]`, so its tabs and detail link show projects despite the component name. |
| About | `alomarSiteContent` (`pageBanners`, `aboutPage`, `visionSection`) | About editorial is read from global options, not the WordPress About page. |
| Projects | `pageBanners` and `projects(first: 50)` | Project cards and filters are mapped from project fields and taxonomy terms. |
| Investments | `alomarInvestmentsPageContent` and published `projects(first: 50)` | Localized copy and editable statistics come from the existing `our-investments` page; cards and category filters use the CMS project order and terms. Preview mock projects are disabled on this route. |
| Project detail | `getProjects('all')` | Resolves the slug from the first 50 mapped projects and includes the schema-verified `projectDetails` branding and content bands. |
| News archive | `/news`, `/ar/news`, `/en/news` and the `news` custom post type | `getNews()` requests the first 50 `NewsArticle` records. The archive searches article text, filters by bilingual category values, and paginates the filtered list. |
| News article | `newsArticle(id: $id, idType: DATABASE_ID)` | Fetches the requested News record by WordPress database ID. Related articles, optional initiative statistics, and company details are editor-managed ACF fields. |
| Contact | `alomarContactPageContent` and `submitAlomarContact` | Contact copy is queried from GraphQL. Submission invokes the GraphQL mutation; no real inquiry was created during validation. |
| Shared header/footer | Header settings and `footerSettings.footerFields` | Shared navigation and footer content are queried separately from the editorial site-content root. |

## Data normalization

| WPGraphQL fields | Frontend model |
|---|---|
| `homePageContent` localized slide fields | `HeroSlide` |
| `alomarSiteContent.settings` | `SiteSettings` |
| `pageBanners` keyed by `pageKey` | `PageBannerContent` |
| `sectionCopy` keyed by `sectionKey` | `SectionCopy` |
| Schema-verified `projects` core fields, terms, featured image, and nested `projectDetails` fields | `Project` |
| `alomarInvestmentsPageContent` and its localized fields/repeaters | `InvestmentsPageContent` |
| `projectDetails` logo, stats/make/experience bands, company logos/URLs, and key-project repeater | `Project.logo`, `statsBand`, `makeBand`, `companiesBand`, `experienceBand`, `keyProjectsBand` |
| `NewsArticle` core fields, bilingual ACF fields, date, image, optional `newsDetails`, and `relatedArticles` | `NewsArticle` |
| `alomarContactPageContent` | `ContactPageContent` |

Presentation text is stripped of HTML when mapped to card/metadata fields. News body HTML is sanitized with an allowlist before rendering, retaining editorial formatting and approved video embeds. Project cards fall back to the other locale when a translation is missing. Cards use their own image or a neutral branded surface, not another record's photograph.

## Known mismatches and limits

- The homepage's current four-section composition does not consume every existing ACF group or every section visible in the supplied prototype artifact.
- The home company carousel currently consumes projects rather than `companies`.
- That existing homepage carousel displays the Stats Band for its currently selected project only, preventing duplicate statistics across projects.
- About content is option-owned; Invest With Us and Investments now have page-specific ACF groups. The Investments portfolio remains backed by the existing `projects` post type.
- Project detail lookup is list-bound to 50 records. News detail lookup is by database ID; archive category terms are not used because the local News posts have no taxonomy terms assigned.
- The local CMS has two published project records and two distinct category terms. Portfolio counts therefore reflect the CMS dataset; screenshot-only metrics are not fabricated. A populated local query does not certify production content, image rights, translations, or deployment configuration.

See [CMS data structure](./CMS_DATA_STRUCTURE.md) for WordPress ownership and [GraphQL integration](./GRAPHQL_INTEGRATION.md) for endpoint behavior.
