# Implementation Checklist

## Frontend
- [x] Project structure exists and app routes are scaffolded.
- [x] Home page sections are present.
- [x] Header and footer are implemented.
- [x] Language toggle and RTL/LTR logic are implemented.
- [x] Contact form validation exists.
- [x] WordPress API client with mock fallback exists.
- [x] Production build succeeds.
- [x] Lint passes aside from pre-existing warnings.
- [ ] Replace generic/boilerplate copy with deeper Alomar-specific content model where needed.
- [ ] Align visual details more closely to the supplied Figma and prototype assets once those sources are available to the workspace.

## WordPress / ACF
- [x] WordPress project is present and includes ACF Pro.
- [x] WPGraphQL-related plugins are installed.
- [x] Theme structure for headless ACF registration is in place.
- [x] Theme loads custom ACF files.
- [x] Validated live GraphQL endpoint and activated the Alomar core plugin so custom post types are exposed.
- [x] Replace the active Erbify field-group loading with Alomar-specific ACF groups for projects, sectors, companies, and leadership.
- [x] Add an ACF options page and WPGraphQL query for homepage hero slides.
- [ ] Add page/section-specific fields for remaining Alomar landing-page copy and section content.
- [x] Expose structured project, sector, company, leadership, and news content through the WPGraphQL contract consumed by the frontend.

## Quality and validation
- [x] Build executed successfully.
- [x] Lint executed successfully with only warnings.
- [x] Unhandled React state issues in locale and splash flow fixed.
- [ ] Browser visual verification against Figma is pending access to the actual design/prototype assets.
