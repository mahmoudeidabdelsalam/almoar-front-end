# Project audit

## Workspaces and architecture

- Frontend: `almoar-front-end`, Next.js app with Arabic/English locale support and WPGraphQL client in `src/lib/wordpress/client.ts`.
- CMS: local WordPress at `/Users/mahmoud.eid/Sites/almoar-wp`, active theme `theme-headless`, active plugin `alomar-holding-core`.
- The WordPress root and custom plugin are not Git repositories. The theme is a nested Git repository; the frontend has a separate repository.
- ACF supplies editorial fields; WPGraphQL supplies content reads and the contact mutation. A separate Gravity Forms plugin retains its own REST route.

## Local CMS inventory snapshot

| Record type | Count observed |
|---|---:|
| Native pages | 5 |
| `projects` | 2 |
| `sectors` | 1 |
| `companies` | 1 |
| Native `post` | 2 |
| `investments` | 0 |
| `media-center` | 0 |
| `news` | 1 |

The About Us and Contact pages exist. Contact uses the `page-contact-us.php` template. The About page has a `page-about-us.php` template, but the About editorial fields remain in the global options group. Sectors, Companies, and Board Members are no longer registered by the theme; existing database records are retained. The counts above are a local database snapshot, not a production inventory.

## Key findings

- Custom type and taxonomy registrations were moved into the tracked theme with existing public names and slugs preserved; the duplicate plugin hooks are removed at initialization.
- The core plugin is installed but currently inactive locally. The theme initializes its existing contact mutation class from the plugin source when available. Other plugin-provided GraphQL fields are absent while the plugin is inactive.
- The frontend home composition currently renders hero, a project-fed “companies” carousel, approach copy, and news. It does not render every section visible in the supplied prototype artifact.
- News articles use the `news` custom post type. The listing queries `NewsArticles`, detail pages use database IDs, and related News records are editor-managed.
- About content is option-owned; Invest With Us lacks dedicated page fields; Investments reuses Projects; the `media-center` and `investments` custom types have no observed records.
- The local sector lacks English long-form copy and a featured image. No translation or imagery was invented.
- The supplied Figma source could not be accessed. The prototype artifact could be inspected only qualitatively.

## Current implementation and validation

Implementation details and remaining blockers are tracked in [project status](./PROJECT_STATUS.md), [CMS structure](./CMS_DATA_STRUCTURE.md), [frontend mapping](./FRONTEND_DATA_MAPPING.md), and [API migration](./API_MIGRATION.md).

The frontend lint, TypeScript check, and production build passed in the last frontend validation pass. All theme PHP files passed `php -l`; theme `git diff --check` passed after the contact-mutation wiring change. The contact GraphQL field was schema-validated without submitting a form. A missing article previously rendered localized 404 UI but returned HTTP 200; revalidation is still needed.
