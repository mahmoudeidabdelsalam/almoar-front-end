# Implementation decisions

| Decision | Rationale / consequence |
|---|---|
| Register retained custom post types and taxonomies in the active theme, removing the matching plugin registration hooks. | Media Center, Investments, Sectors, and Companies CPTs and their frontend queries/routes were removed as requested. Existing WordPress records were not deleted. |
| Keep existing About/editorial fields in the global ACF options group for now. | Moving data into page fields would change CMS ownership and risk existing editorial content; it needs an explicit content-owner decision. |
| Add related articles as an ACF relationship on News records and expose `relatedArticles` on `NewsArticle`. | This gives editors explicit control and avoids selecting unrelated items by array position. Resolver returns only published News records. |
| Resolve a news article by WordPress database ID. | Archive queries are limited to ten records; a direct ID lookup prevents older articles from appearing missing. |
| Use the `news` custom post type as the source for `/news`. | News content is managed as a dedicated CPT; its GraphQL type is `NewsArticle`. |
| Reuse the existing contact mutation implementation instead of creating a second endpoint. | The frontend already consumes `submitAlomarContact`; the theme now loads the existing plugin class. Mutation registration was validated without submitting a form. |
| Do not fabricate translations, imagery, or missing CMS content. | Empty localized fields and missing images remain visible data gaps rather than being replaced with unrelated content. |
| Treat design comparison as blocked until source files are accessible. | The prototype artifact could be inspected qualitatively, but Figma source and exact specs were not available. |
| Preserve the observed missing-route status as an open issue. | Localized 404 UI is not sufficient if streaming/PPR returns HTTP 200; route status must be corrected and reverified. |
