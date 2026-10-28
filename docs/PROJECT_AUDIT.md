# Project Audit

## 1. Projects discovered

### Frontend: `almoar-front-end`
- Role: Next.js 16 marketing/portfolio frontend for Alomar Holding.
- Key files:
  - `src/app/*` for app routes (`/`, `/about`, `/projects`, `/sectors`, `/news`, `/contact`)
  - `src/components/sections/*` for landing-page sections
  - `src/lib/wordpress/client.ts` for WordPress API integration with mock fallback
  - `src/context/LanguageContext.tsx` for RTL/LTR locale management

### WordPress backend: `almoar-wp`
- Role: local WordPress install used as CMS/backend.
- Key files:
  - `wp-content/themes/erbify-headless/functions.php`
  - `wp-content/themes/erbify-headless/inc/acf/*.php`
  - plugin directories under `wp-content/plugins/*` including ACF Pro, CPT UI, WPGraphQL, Gravity Forms, etc.

## 2. What was already complete before changes

- Multi-page Next.js app is already in place with core routes.
- Strong visual design language: navy + gold palette, luxury editorial styling, layered cards, RTL/LTR support, and responsive landing-page layout.
- Core sections completed on the home page:
  - hero slider
  - stats section
  - about section
  - sectors
  - featured projects
  - Vision 2030 banner
  - companies/subsidiaries
  - leadership team
  - news feed
  - contact form
- Header/footer/navigation are implemented.
- Contact form validation and mock API flow are present.
- Locale switching and translations exist for Arabic and English.
- Development-only mock data exists for local rendering without a configured WordPress backend; production does not fall back to mock records.

## 3. What remains incomplete

- The WordPress theme remains a headless presentation shell; Alomar-specific post types and ACF/GraphQL content registration live in the `alomar-holding-core` plugin.
- Editorial fields now cover localized route banners and SEO, homepage section copy, homepage about content, chairman message and values, Vision 2030, and footer content. The local CMS seed and live query verification are documented in [CMS content integration results](./CMS_CONTENT_RESULTS.md).
- The `Figma` and prototype references were not available as source files inside the workspace, so pixel-perfect verification remains pending the original design assets.
- The local sector still lacks English long-form copy and a featured image; it is not supplemented with invented translation or unrelated photography.
- Browser visual verification against those design references remains outstanding.

## 4. What was implemented in this pass

- Created the audit/checklist/gap docs in `docs/`.
- Connected Alomar-specific page and section content to the frontend through WPGraphQL and populated missing local CMS copy with an idempotent seed command.
- Added a route-by-route CMS mapping, query contract, integration audit, and explicit local-versus-production verification notes in the [CMS documentation](./CMS_INTEGRATION_AUDIT.md).
- Constrained editorial/mock fallbacks to development preview, surfaced CMS/contact failures, reused site-content data for sectors and companies, and avoided empty-image URLs or unrelated record photos.
- Fixed React state initialization/effect issues in:
  - `src/context/LanguageContext.tsx`
  - `src/components/ui/SplashIntro.tsx`
- Removed invalid use of `setState` in effect bodies and moved user-session initialization into lazy state initialization.
- Tightened typing in `src/lib/wordpress/client.ts` for WP post payload mapping.
- Corrected an escaped-quote issue in the about page.
- Validated the project through a production build and lint run.

## 5. Current state

The project has an Alomar-specific editorial content model exposed through WPGraphQL, repeatably seeded and verified local CMS data, a successful CMS-backed build, and a no-CMS production build without development-only mock copy. Remaining readiness work includes entering/approving complete production bilingual content, configuring and testing the production contact endpoint, and comparing against the original design assets.
