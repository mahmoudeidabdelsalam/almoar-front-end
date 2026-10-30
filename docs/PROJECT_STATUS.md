# Project status

## Current status

**Implementation is in progress; production and visual acceptance are not complete.**

## Completed and verified

- Local CMS audit and frontend-to-CMS mapping.
- Added the theme-owned Project Details logo, Stats/Make/Companies/Experience/Key Projects fields and preserved existing gallery/highlight fields.
- Exposed the `projectDetails` ACF group through WPGraphQL for ACF. The full project query, including nullable repeaters, media connections, and the ACF link, passed against the local schema.
- Mapped the new project data into the existing detail template and selected-project homepage carousel, with locale fallback and conditional section rendering.
- Theme-owned CPT/taxonomy registration and preserved plugin business logic.
- Removed Board Members from the registered content types, About page, frontend types, and GraphQL schema without deleting its stored CMS record.
- Corrected the project GraphQL selection to query legacy project status/location/specification fields at the `Project` node and added safe normalization for malformed legacy gallery/highlight values.
- Project cards now fall back to the other locale for missing title, summary, category, status, and location translations.
- About page template and native-post related-article GraphQL field.
- Direct native-post lookup by slug and localized news/media-center behavior.
- Contact mutation schema registration, validated without executing a write.
- Frontend lint and TypeScript check passed with no diagnostics.
- Production build with GraphQL endpoint variables unset passed in the latest validation. The CMS-backed build still reports `Cannot query field "titleEn" on type "Post"` in `getNews`, although a standalone local GraphQL query accepts the field; that discrepancy is unresolved.
- PHP syntax checks for all theme PHP files and both repository diff checks passed.

## Outstanding

- Browser verification confirmed the English news archive/article and Arabic media-center article render with HTTP 200; the article canonical and Arabic/English alternates were correct.
- A missing English article renders the localized 404 UI but returns HTTP 200. The route is partially prerendered with Cache Components enabled, so its request-time `notFound()` occurs after streaming begins. This remains an open release blocker.
- No real contact submission has been made; production mutation delivery is unverified.
- Figma and prototype source are unavailable, so pixel-level desktop/mobile acceptance is blocked.
- About and Invest With Us content ownership is incomplete; Investments reuses Projects.
- Local CMS inventory is small; production content and configuration are unverified.
- `alomar-holding-core` is installed but inactive locally. The new project ACF group is queryable, but the missing plugin also removes unrelated CMS root fields and prevents a CMS-backed frontend build until the local plugin configuration is restored.
- Local `.env.local` causes Node to warn that TLS certificate verification is disabled. Do not carry that override into production; use a trusted certificate chain.

## Validation record

| Check | Result |
|---|---|
| `npm run lint` | Passed with no warnings or errors. |
| `npx tsc --noEmit` | Passed. |
| `NODE_OPTIONS=--use-system-ca npm run build` | Passed after correcting the 404 client boundary. |
| Production build with CMS endpoint unset | Passed after this project-fields change. |
| Production build against configured local CMS | Failed in `getNews` with `Cannot query field "titleEn" on type "Post"`; standalone local schema query accepts the field, so the build/request discrepancy remains unresolved. |
| PHP syntax for all PHP files in `theme-headless` | Passed after the latest backend change. |
| Theme `git diff --check` | Passed after the latest backend change. |
| Local WPGraphQL full project query (2 records; legacy fields, all project bands, images and links) | Passed without GraphQL errors. |
| Local WPGraphQL `boardMembers` field query | Correctly rejected because the removed content type is not in the schema. |
| Full `Project.projectDetails` schema selection | Passed; current record returns null for unpopulated new fields. |
| Contact mutation schema validation | Passed; incomplete input was rejected before resolver execution. |
| Localized archive/article route status and article metadata | Valid routes returned 200; canonical and alternate links were correct. |
| Missing article route status | Failed acceptance: localized 404 UI, HTTP 200. |
| Real contact submission | Not run. |
| Figma pixel/interaction comparison | Blocked: source unavailable. |

The WordPress install root and plugin directory are not Git repositories; the custom theme is a nested Git repository. The frontend has its own repository. Do not infer repository-wide clean state from either nested repository.
