# CMS content verification results

## Local data snapshot

The local WordPress audit observed two projects, one sector, one company, one board member, one News CPT record, and two native posts. The custom `investments` and `media-center` types have no records. These counts describe the local database only.

## Verified behavior

- WPGraphQL accepted the frontend's project query, `newsArticles` listing, and `newsArticle(id:, idType: DATABASE_ID)` detail query, including the News ACF fields.
- The direct News query returned the requested published News record and the `relatedArticles` field.
- The related-article connection returned an empty list for the audited News record, as no relationship was selected.
- The contact mutation field is registered. An intentionally incomplete mutation failed validation for the required `input` argument before resolver execution.
- The `projectDetails` ACF group query returned all existing and newly added field names without schema errors. Image fields use `node { sourceUrl altText }`, galleries use `edges { node { sourceUrl altText } }`, repeaters are nullable lists, and the ACF link returns `url`, `title`, and `target`.
- The existing project returned both its Arabic and English title/content fields. The new project logo and bands are empty on the current record and returned `null`; no CMS content was changed.
- Theme PHP syntax checks and the theme diff whitespace check passed after the latest backend change.
- Frontend lint, TypeScript, and production build passed in the preceding validation pass.

No contact form mutation with user data was executed. Production database contents, media rights, delivery, and deployment settings remain unverified. For the structural inventory and ownership gaps see [CMS data structure](./CMS_DATA_STRUCTURE.md); for endpoint behavior see [GraphQL integration](./GRAPHQL_INTEGRATION.md).

During this pass, the CMS-backed frontend build timed out while fetching News and Projects during page-data collection. The exact News queries succeed directly against the local endpoint. A no-CMS frontend production build passed; the plugin was not activated or otherwise changed.
