# Project plan

## Completed in this implementation pass

- Audited the local WordPress theme/plugin ownership, page records, custom types, ACF groups, and GraphQL usage.
- Moved custom post type and taxonomy registrations into the active theme while preserving their names and slugs and removing duplicate plugin hooks.
- Added the About Us WordPress template and a native-post `related_articles` ACF relationship exposed through GraphQL.
- Wired the existing contact mutation class into the active schema without duplicating its business logic.
- Added direct post-by-slug news loading, relationship-based related articles, localized article/archive routes, metadata, links, and dates.
- Updated the 404 page to use localized UI and fixed the client boundary required by the locale hook.
- Documented the verified CMS structure, data mapping, design gaps, API behavior, SEO findings, and status.

## Remaining work, ordered by dependency

1. **Resolve content ownership.** Decide page-vs-options ownership for About and define dedicated models for Invest With Us and Investments. Confirm whether News/Media Center use native posts or their currently empty custom types.
2. **Complete CMS editorial data.** Enter approved bilingual copy, sector long description and image, page SEO, and populated related-article relationships.
3. **Restore design-source access.** Provide the original Figma and prototype source, then complete visual and responsive comparisons.
4. **Finish route and SEO verification.** Add a pre-stream request gate or equivalent deployment solution so missing slugs return HTTP 404; verify metadata, canonical/alternate links, sitemap/robots, and production host settings.
5. **Validate write integration in an approved environment.** Test the contact mutation using a controlled destination and confirm validation, spam controls, delivery, and deployment CORS policy.
6. **Production readiness.** Verify production WPGraphQL, media domains, translations, approved content, and deployment configuration.

## Dependencies and acceptance gates

- Design acceptance depends on Figma/prototype access and agreed viewport sizes.
- CMS page ownership depends on editorial/product decisions; do not move or duplicate live content without approval.
- Contact acceptance depends on a controlled test target and operations approval.
- Production acceptance depends on production credentials/configuration and editorial sign-off; local query/build results are not production certification.

## Definition of done

All required routes render correct locale-specific CMS data; missing records return correct HTTP status; writes are tested safely; design differences are measured against source files; SEO and accessibility checks pass; and operational/editorial owners approve production content and configuration.
