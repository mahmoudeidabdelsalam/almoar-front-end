# CMS content mapping

The canonical route-to-record and field mapping is maintained in [FRONTEND_DATA_MAPPING.md](./FRONTEND_DATA_MAPPING.md). WordPress field ownership, options groups, custom types, taxonomies, and the local record inventory are in [CMS_DATA_STRUCTURE.md](./CMS_DATA_STRUCTURE.md).

Important caveats:

- About editorial content is stored in shared ACF options, not on the About page.
- `CompaniesSection` currently consumes `Project[]`, despite its name.
- News articles resolve from the `news` custom post type; article detail uses a database-ID lookup.
- Project detail still resolves from the first 50 projects.
- Missing translations and images remain empty rather than being fabricated.

See [project audit](./PROJECT_AUDIT.md) for the workspace and CMS inventory snapshot.
