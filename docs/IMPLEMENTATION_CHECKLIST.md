# Implementation Checklist

## Frontend
- [x] Project structure exists and app routes are scaffolded.
- [x] Home page sections are present.
- [x] Header and footer are implemented.
- [x] Language toggle and RTL/LTR logic are implemented.
- [x] Contact form validation exists.
- [x] WordPress content client uses development-only mock preview data; production does not fall back to mock records.
- [x] Production build succeeds.
- [x] Lint passes aside from pre-existing warnings.
- [ ] Replace generic/boilerplate copy with deeper Alomar-specific content model where needed.
- [ ] Align visual details more closely to the supplied Figma and prototype assets once those sources are available to the workspace.

## WordPress / ACF
- [x] WordPress project is present and includes ACF Pro.
- [x] WPGraphQL-related plugins are installed.
- [x] Theme structure for headless ACF registration is in place.
- [x] Theme loads custom ACF files.
- [x] Validated the local GraphQL endpoint and activated the Alomar core plugin so custom post types are exposed.
- [x] Replace the active Erbify field-group loading with Alomar-specific ACF groups for projects, sectors, companies, and leadership.
- [x] Add an ACF options page and WPGraphQL query for homepage hero slides.
- [x] Add page/section-specific fields for Alomar landing-page copy, localized page banners and SEO, homepage sections, Vision 2030, and footer content.
- [x] Expose structured project, sector, company, leadership, and news content through the WPGraphQL contract consumed by the frontend.

## Quality and validation
- [x] Production build executed successfully both without a CMS endpoint and against the local CMS (`NODE_OPTIONS=--use-system-ca npm run build`).
- [x] Lint executed successfully with 6 unused-import warnings and no errors.
- [x] Local CMS content seeded and verified over WPGraphQL; see [CMS content integration results](./CMS_CONTENT_RESULTS.md).
- [x] CMS route mapping, query contract, production fallback policy, and verification limits documented in [CMS_INTEGRATION_AUDIT.md](./CMS_INTEGRATION_AUDIT.md), [CONTENT_MAPPING.md](./CONTENT_MAPPING.md), and [GRAPHQL_INTEGRATION.md](./GRAPHQL_INTEGRATION.md).
- [x] Unhandled React state issues in locale and splash flow fixed.
- [ ] Browser visual verification against Figma is pending access to the actual design/prototype assets.
