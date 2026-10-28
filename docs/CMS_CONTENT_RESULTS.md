# CMS content integration results

## Completed work

- Connected the frontend to the Alomar WPGraphQL contract for shared settings, localized route banners and SEO, homepage section copy, hero slides, homepage/about/Vision 2030/footer editorial, projects, sectors, companies, leadership, and news.
- Added the `wp alomar seed-content` command to fill missing bilingual route banners, homepage section copy, Vision 2030 copy, and footer copy without replacing existing non-empty values.
- Ran the seed command twice against the local WordPress site. Both runs completed; the second run confirmed it is safe to repeat.
- Constrained mock content and editorial fallback copy to development without a configured CMS endpoint. A production no-CMS build was verified to omit the development hero copy.
- Changed missing featured images to use neutral branded surfaces instead of unrelated record imagery. CMS title/name fields provide image alternative text; separate CMS media-alt fields are not currently available.
- Documented the audit, content mapping, query contract, and verification limits in [CMS_INTEGRATION_AUDIT.md](./CMS_INTEGRATION_AUDIT.md), [CONTENT_MAPPING.md](./CONTENT_MAPPING.md), and [GRAPHQL_INTEGRATION.md](./GRAPHQL_INTEGRATION.md).

## CMS verification

The local `https://almoar-wp.test/graphql` endpoint returned HTTP 200 without GraphQL errors for the selected frontend fields. Assertions confirmed:

- 7 bilingual page banners and 6 bilingual homepage section-copy records.
- Homepage about content and pillars, chairman/about-page content and values, Vision 2030 copy and pillars, and bilingual footer copy.
- 1 hero slide, 1 sector, 1 company, 1 board member, 1 project, and 1 non-default news post.
- All seven page banners contain Arabic and English titles. The sector's English long description (`contentEn`) is a valid query field but has no value in the local record; the sector also has no featured image. No translation or imagery was fabricated.

The post-seed production build rendered 10 CMS titles into generated HTML across the main routes and the local project/news detail routes. The no-CMS production build generated successfully and its homepage HTML did not contain development-only hero preview copy.

## Checks

| Check | Result |
|---|---|
| `wp core is-installed` | Passed |
| `wp alomar seed-content` (run twice) | Passed; second run is repeatable |
| Executable WPGraphQL query, including `sectors.contentEn` | Passed; HTTP 200, no GraphQL errors |
| `php -l` on `class-acf-content.php`, `class-seed-data.php`, and `class-site-content.php` | Passed |
| `npm run lint` | Passed with 0 errors and 6 unused-import warnings |
| Production build with CMS endpoint unset | Passed; no development preview copy in generated homepage HTML |
| `NODE_OPTIONS=--use-system-ca npm run build` with local CMS | Passed; 10 seeded CMS titles verified in generated route HTML |

The lint warnings are unused imports in `src/app/news/[slug]/page.tsx`, `src/app/not-found.tsx`, and `src/app/projects/[slug]/page.tsx`. The local WordPress certificate is trusted through Node's system CA store; certificate verification was not disabled.

## Limits and remaining validation

- This validates the local CMS and its current small dataset, not production content or production deployment configuration.
- Public GraphQL schema introspection is disabled; the active query selections were verified by execution.
- The contact REST endpoint was not submitted during this check to avoid creating a test inquiry. Configure and verify its production URL and CORS policy before launch.
- Visual comparison with the source Figma/prototype remains pending because those assets are not in the workspace.
- The project has no dedicated frontend unit-test suite; lint, TypeScript (through `next build`), PHP syntax, GraphQL queries, and generated HTML assertions are the configured/available checks.
