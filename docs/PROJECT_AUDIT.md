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
- Fallback mock data exists to allow frontend rendering without a live WordPress backend.

## 3. What was missing or incomplete

- The WordPress theme is generic `erbify-headless` and not yet tailored to the Alomar brand/content model.
- ACF fields are not aligned to the actual Alomar content structure; they are mostly generic Erbify boilerplate.
- There is no project-specific Alomar field group or structured content model in the backend yet.
- The `Figma` and `Claude prototype` references were not available as source files inside the workspace, so the repo cannot be matched pixel-perfect against those references without the original design assets.
- The frontend has a few brittle state patterns that could trigger React issues; these were fixed during implementation.
- The repo contains no direct audit documentation for the actual code state before this change.

## 4. What was implemented in this pass

- Created the audit/checklist/gap docs in `docs/`.
- Fixed React state initialization/effect issues in:
  - `src/context/LanguageContext.tsx`
  - `src/components/ui/SplashIntro.tsx`
- Removed invalid use of `setState` in effect bodies and moved user-session initialization into lazy state initialization.
- Tightened typing in `src/lib/wordpress/client.ts` for WP post payload mapping.
- Corrected an escaped-quote issue in the about page.
- Validated the project through a production build and lint run.

## 5. Current state

The project is in a functional, buildable condition and includes the expected brand structure, but the backend ACF/content model remains a generic template rather than an Alomar-specific CMS setup. The next step for full delivery would be to create a project-specific ACF model and hook it into the connected WordPress REST/GraphQL flow.
