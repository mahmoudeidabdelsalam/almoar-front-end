# Implementation checklist

## Completed

- [x] Audit the local frontend, WordPress theme/plugin ownership, page records, custom types, and ACF data.
- [x] Move retained CPT/taxonomy registration into the tracked theme and remove Media Center, Investments, Sectors, and Companies registrations without deleting CMS records.
- [x] Add an About Us WordPress template.
- [x] Add native-post related-article relationship and GraphQL field.
- [x] Resolve native-post articles directly by slug.
- [x] Extend the project ACF group with bilingual content bands and GraphQL exposure.
- [x] Map project details and render conditional localized detail-page sections.
- [x] Display the active project's Stats Band in the homepage project carousel.
- [x] Localize native news article/archive data, links, dates, and metadata.
- [x] Initialize the existing contact GraphQL mutation class and validate its schema without submitting a form.
- [x] Validate frontend lint, type-check, and production build in the last frontend pass.
- [x] Validate PHP syntax and theme whitespace after the latest backend change.
- [x] Document current ownership, mapping, API, SEO, design, plan, and blockers.

## Open

- [ ] Resolve the missing-article HTTP status: localized 404 UI is currently returned with HTTP 200 due to request-time `notFound()` after PPR streaming starts.
- [ ] Obtain Figma/prototype source and complete desktop/mobile comparison.
- [ ] Confirm About/Invest With Us content ownership and define dedicated fields as needed.
- [ ] Populate approved bilingual CMS content and related-article selections.
- [ ] Test contact submission in an approved controlled environment.
- [ ] Populate the new project ACF fields and verify complete/partial content in Arabic and English.
- [ ] Restore the intended local core-plugin activation before CMS-backed frontend build/browser verification.
- [ ] Verify production GraphQL, media domains, CORS/write protections, SEO, and content.

See [project status](./PROJECT_STATUS.md) and [project plan](./PROJECT_PLAN.md) for acceptance gates.
