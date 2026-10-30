# CMS integration audit

## Integration boundary

The frontend reads content through WPGraphQL. Theme-owned ACF fields and custom type/taxonomy registration provide the Alomar data model; the active core plugin remains responsible for its other GraphQL/business logic. Contact inquiries use the existing GraphQL mutation. No frontend `/wp-json` content reads were identified.

## Findings

- Page banners, section copy, homepage About/Vision/footer content, and hero slides are ACF options rather than page-owned content.
- About uses global options despite an existing About page. Invest With Us has no dedicated field group, and Investments reuses project content.
- The News archive uses the `news` custom post type, exposed as `NewsArticle`; article detail lookups and URLs use the WordPress database ID.
- The local dataset is small and cannot certify production completeness.
- The local sector has no English long-form copy or featured image.
- Direct News ID lookup and editor-selected related News articles are implemented.
- The contact mutation is registered by initializing the existing plugin class from the theme. Its schema was tested without creating an inquiry.
- The supplied Figma source is unavailable; visual comparison is blocked.

## Validation and release constraints

Local executable GraphQL list and ID queries for News, plus PHP syntax checks, passed. Frontend lint and TypeScript passed. A production build without a CMS endpoint passed; a CMS-backed build timed out while collecting local CMS data. The local schema query does not certify production. Do not send an actual contact submission except to an approved test destination.

For exact field groups and record counts, see [CMS data structure](./CMS_DATA_STRUCTURE.md). For write API constraints, see [API migration](./API_MIGRATION.md). For remaining tasks, see [project plan](./PROJECT_PLAN.md).
