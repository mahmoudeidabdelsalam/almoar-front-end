# CMS Integration Audit

## Scope and result

The Next.js frontend is connected to the Alomar WordPress content model through WPGraphQL for public, read-only site content. The local CMS schema and seeded records were exercised through the configured endpoint, and the frontend production build was checked against that CMS. Content failures do not switch to sample records in production.

The current local data verifies the contract, not production readiness. Production content, media rights, translations, and deployment endpoint configuration still require editorial and operations sign-off.

## Content ownership and routes

- Shared settings, route banners/SEO, homepage section copy, homepage/about editorial content, Vision 2030, and footer copy are stored in the **Website Content** ACF options page.
- `wp alomar seed-content` fills missing local banner and section rows without overwriting existing non-empty values. Treat its seeded copy as local starter content, not approved production editorial.
- Projects, sectors, companies, and board members are WordPress content records with ACF fields. News uses WordPress posts with Alomar news fields.
- The frontend consumes published content; it does not create duplicate native WordPress pages for each route. Route banners are keyed rows in the shared options page.
- The route-by-route field mapping is in [CONTENT_MAPPING.md](./CONTENT_MAPPING.md); query selections and environment setup are in [GRAPHQL_INTEGRATION.md](./GRAPHQL_INTEGRATION.md).

## Placeholder and error policy

- Mock datasets are available only in development when no CMS endpoint is configured. The frontend emits a warning when this preview mode is active.
- Production with no endpoint returns empty CMS data rather than mock records. Production request or GraphQL errors are logged and surfaced as empty content; optional sections hide themselves when no content exists.
- Editorial page/section defaults and mock records are gated to preview mode. CMS-backed production metadata uses CMS SEO values rather than static copy fallbacks.
- When a production build has no published project/news records, the dynamic routes use a reserved static-param sentinel that immediately resolves to `notFound()`; it is not user-facing CMS content.
- Contact-form validation and transport failures return an explicit failure response. A missing REST origin no longer produces a success-shaped response.
- Missing content images no longer borrow a different record's image. Cards use a neutral branded background when their own featured image is absent; the company logo can use the group brand mark.

## Verification against local WordPress

The endpoint returned HTTP 200 without GraphQL errors for the frontend-selected fields, including `sectors.contentEn`. Public introspection is disabled on this local endpoint, so verification is based on executable queries rather than `__schema`.

The repeatable seed command was run twice. The follow-up query confirmed 7 page banners, 6 homepage section-copy records, 1 hero slide, 1 sector, 1 company, 1 board member, 1 project, and 1 non-default news post. All seven page banners have both Arabic and English titles.

### Content gaps observed

- The local sector has a valid English title and summary, but `contentEn` is empty and its featured image is absent. No translation or image was fabricated. Its detail view therefore omits the long description and uses a neutral visual placeholder until editorial data is entered.
- The local record counts are small and should not be interpreted as a complete production content inventory.
- Figma/prototype source files were not present in the workspace; pixel-level visual comparison remains outstanding.

## Readiness and follow-up

Before production launch, configure the public WPGraphQL URL and contact REST origin, enter and approve complete bilingual records and image alternatives, test the contact endpoint/CORS from the production domain, and verify production media host configuration. WPGraphQL introspection can remain disabled; the query contract is validated by the active frontend selections.

Configured automated checks are ESLint and the Next.js production build. There is no dedicated frontend unit-test suite in this project.
