# WPGraphQL Integration

## Endpoint configuration

Set `WORDPRESS_GRAPHQL_URL` to the absolute public GraphQL endpoint (normally `https://cms.example.com/graphql`). The optional `NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL` is supported for deployments that intentionally expose the endpoint variable to client bundles; content requests themselves run in the server data layer.

The contact form is a separate write operation and currently posts directly from the browser to the Alomar REST endpoint. Set `NEXT_PUBLIC_WORDPRESS_API_URL` to the public WordPress origin so the browser can call `/wp-json/alomar/v1/contact`. Configure the matching CORS policy in WordPress. These values are public URLs, not credentials. The example environment file contains placeholders only.

## Read query groups

`src/lib/wordpress/client.ts` owns the GraphQL client and typed mappings:

- `getSiteContent()` fetches one `alomarSiteContent` selection for shared settings, route banners, section copy, homepage about, about-page editorial, Vision 2030, and footer; it also selects `homePageContent`, sectors, and companies.
- `getProjects()` fetches up to 50 projects and their editorial fields, terms, specs, gallery, highlights, and featured image. Optional category filtering currently occurs after the response is mapped.
- `getTeam()` selects up to 20 board members and their bilingual display fields.
- `getNews()` selects up to 10 posts and Alomar news fields; the default `hello-world` post is excluded.
- Project and article detail lookups currently reuse the corresponding list methods and resolve the slug in the cached results. This avoids extra endpoint calls on current data but means records outside those list limits are not addressable by these helpers.

All selections are fields consumed by the frontend, rather than schema introspection or an unbounded request. The `contentEn` sector selection was specifically exercised against the local endpoint and is accepted by the active schema.

## Caching and failure behavior

GraphQL requests use POST, JSON response validation, a three-second request timeout, Next.js cached data with a one-minute revalidation interval, and `cacheLife('minutes')`. GraphQL errors, missing data, HTTP failures, and transport failures are logged with the operation name. In production the affected content method returns an empty normalized result; it does not return mock records or pretend the request succeeded. Components hide optional empty lists or fields.

In development only, when no CMS endpoint is configured, local preview datasets and editorial fallbacks are enabled with a startup warning. This preview mode is disabled in production builds.

## Schema and data validation

WPGraphQL is the read API for the public site. The plugin registers the `alomarSiteContent` root field and its nested types; ACF fields on projects, sectors, companies, board members, and posts are exposed for the selections above. `homePageContent` resolves editable hero-slide options.

The local WordPress endpoint accepted the content queries with HTTP 200 and no GraphQL errors. Public schema introspection is disabled, so no introspection result is claimed. Runtime validation covers the actual fields selected by the frontend and the local records returned by those queries.

Contact submissions remain on REST because they create inquiries and the existing Alomar endpoint validates and records them. This is intentionally separate from the read-only GraphQL content contract.
