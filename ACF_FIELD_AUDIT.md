# Alomar Holding ACF and GraphQL Audit

## Scope and conclusion

The audit covered the theme-owned ACF PHP registrations, plugin GraphQL/CPT/taxonomy registrations, frontend GraphQL operations, adapters, types, routes, and live WordPress endpoint.

Public GraphQL introspection is disabled, so verification used direct queries. Live custom homepage, header, footer, project, sector, company, and contact fields were probed successfully after the plugin GraphQL modules were enabled.

## Ownership model

- Theme: `/Users/mahmoud.eid/Sites/almoar-wp/wp-content/themes/theme-headless/inc/acf/`
- GraphQL schema and resolvers: `/Users/mahmoud.eid/Sites/almoar-wp/wp-content/plugins/alomar-holding-core/includes/class-acf-content.php`
- GraphQL site/header/footer resolvers: `/Users/mahmoud.eid/Sites/almoar-wp/wp-content/plugins/alomar-holding-core/includes/class-site-content.php`
- Central frontend CMS adapter: `/Users/mahmoud.eid/Sites/almoar-front-end/src/lib/wordpress/client.ts`

The plugin REST, settings, seed, and business modules remain disabled or unchanged. WP REST itself is not disabled.

## Verified field groups

| Field group / group key | Location / storage | ACF names | GraphQL exposure | Frontend consumer |
|---|---|---|---|---|
| WP Home / `group_wp_home` | Front page | `hero`, `hero_title`, `hero_title_en`, `benefits_section`, `how_it_works`, `about_section`, `story`, `pricing`, `contact` and nested subfields | Native ACF GraphQL exposure was intended; fields are also retained as legacy compatibility definitions | Mostly legacy/home migration content; custom root fields are used by current homepage |
| WP Contact Page / `group_wp_contact_page` | Template `page-contact-us.php` | `contact_badge`, `contact_page_title`, `contact_page_description`, `contact_page_banner_image`, `contact_heading`, `contact_email`, `contact_phone`, addresses, hours, coordinates, socials, form copy and `_en` variants | Custom `alomarContactPageContent` root resolver | `getContactPageContent()` and `ContactSection` |
| WP Header / `group_wp_header` | Header options page | `logo`, `menu`, nested `label`, `label_en`, `link`, `image`, `submenu`, right-button fields | Custom `alomarHeaderContent` root resolver | `getHeader()` and Header navigation |
| WP Footer / `group_wp_footer` | Footer options page | `footer_logo`, `social_links`, `columns`, `copyright_text`, `_en` variants | Custom `alomarSiteContent.footer` data | `getFooter()` and Footer |
| Alomar Homepage Hero / `group_alomar_homepage` | `alomar-homepage-content` options | `home_hero_slides` with `image`, `badge_ar/en`, `title_ar/en`, `desc_ar/en`, links | Custom `homePageContent` root resolver | `getSiteContent().heroSlides` |
| Alomar Website Site Content / `field_alomar_content_*` | Options | `page_banners`, `section_copy`, `home_about`, `about_page`, `vision_section`, `footer_content` and nested localized fields | Custom `alomarSiteContent` root resolver | `getSiteContent()`, About and Editorial components |
| Alomar Project Details / `group_alomar_project_details` plus project gallery group | Projects CPT | `title_en`, `excerpt_en`, `content_en`, `status_*`, `location_*`, units, areas, year, brochure, featured, gallery and highlights | Custom GraphQL fields on `Project` | `getProjects()`, project archive/detail pages |
| Alomar Sector Details / `group_alomar_sector_details` | Sectors CPT | `title_en`, `summary_en`, `content_en`, `icon` | Custom GraphQL fields on `Sector` | `getSectors()` and sector views |
| Alomar Company Details / `group_alomar_company_details` | Companies CPT | `name_en`, `tagline_ar/en`, `description_en`, `website`, `founded_year` | Custom GraphQL fields on `Company` | `getCompanies()` and company views |
| Alomar Leadership Details / `group_alomar_board_members` | Board members CPT | `name_en`, `role_ar/en`, `bio_en`, `display_order` | Custom GraphQL fields on `BoardMember` | `getTeam()` and Leadership section |
| Alomar News Details / `group_alomar_post` | Posts/news | `title_en`, `excerpt_en`, `content_en`, category/read-time fields | Custom GraphQL fields on `Post` | `getNews()` and news pages |
| Alomar Investment Details / `group_alomar_investment_entails_v2` | Investments CPT | `investment_summary`, `_en`, `investment_description`, `_en`, logo, sector, location, status, website, gallery, statistics, related investments | Native/custom content fields where registered | Investment archive/detail adapters |
| Alomar Media Center Item / `group_alomar_media_center_item` | Media Center CPT | `media_summary`, `_en`, `media_content`, `_en`, media type, publication date, video/document URL, gallery, related media | Native/custom content fields where registered | Media Center archive/detail adapters |

## Rename and compatibility map

| Scope | Old ACF name | Target ACF name | GraphQL/React impact | Migration |
|---|---|---|---|---|
| Investment description | `investment_enscription` / `investment_enscription_en` | `investment_description` / `investment_description_en` | Corrected WYSIWYG registration; frontend currently receives this data through WP native/custom mapping, not the misspelled name | Reversible admin migration copies values via `update_field()` and marks migration complete in WordPress options |
| Page banner SEO description | `seo_enscription_ar/en` | `seo_description_ar/en` | `AlomarPageBanner.seoDescriptionAr/En` | Reversible nested options migration copies old values into new row keys |
| About vision description | `vision_enscription_ar/en` | `vision_description_ar/en` | `AlomarAboutPage.visionDescriptionAr/En` | Reversible nested options migration |
| About mission description | `mission_enscription_ar/en` | `mission_description_ar/en` | `AlomarAboutPage.missionDescriptionAr/En` | Reversible nested options migration |
| Footer company description | `company_enscription_ar/en` | `company_description_ar/en` | `AlomarFooterContent.companyDescriptionAr/En` | Reversible nested options migration |

Existing field keys for the corrected content fields are preserved; migrations copy values without deleting old metadata, allowing rollback.

## Safe corrections implemented

1. Enabled only `Alomar_ACF_Content` and `Alomar_Site_Content` GraphQL modules in the core plugin. REST and seed modules remain disabled as before.
2. Corrected the investment description typo while preserving its old stable field key.
3. Corrected four nested site-content typo names.
4. Added idempotent WordPress admin migrations for corrected content names.
5. Changed production GraphQL CMS failures to fail clearly instead of returning silent empty CMS content; development preview fallback remains endpoint-free only.
6. Removed frontend CMS-client unused imports and eliminated new lint warnings.

## Remaining inventory findings

- `enscription` remains in legacy `acf-fields.php` top-level/nested groups (`hero_enscription`, `benefit_enscription`, `step_enscription`, `mission_enscription`, `story_enscription`). These are explicitly retained for backward compatibility and stored data. They are Potentially unused by the current custom GraphQL client.
- `acf-fields.php` should remain registered as a compatibility group until a database inventory confirms the values are migrated elsewhere. It must not be deleted blindly.
- `alomar_acf_content` plugin/theme implementations contain duplicate source ownership. ACF registration now belongs to the theme; plugin custom-field modules register GraphQL only.
- Contact page values currently contain default heading fields live, while email/phone/address fields are not populated.
- Header live menu data and footer live data verify successfully.
- The live settings object was empty for `siteNameAr/En` because settings module registration remains disabled/commented; that is a confirmed configuration blocker to populate global settings through that module.
- Public GraphQL introspection remains disabled. That is a WPGraphQL administration setting, not an application-code field failure.

## Database migration result

- Investment migration: copies Arabic/base and English values to standardized names via `update_field()`, without deleting old values.
- Site-content migration: copies nested option row values by raw option key, without deleting old nested keys.
- Both migrations are guarded by versioned WordPress options and are safe to rerun.
- No database content was deleted.

## Modified files

### Backend

- `/Users/mahmoud.eid/Sites/almoar-wp/wp-content/plugins/alomar-holding-core/alomar-holding-core.php`
- `/Users/mahmoud.eid/Sites/almoar-wp/wp-content/themes/theme-headless/inc/acf/alomar-content-model.php`
- `/Users/mahmoud.eid/Sites/almoar-wp/wp-content/themes/theme-headless/inc/acf/alomar-site-content.php`

### Frontend

- `/Users/mahmoud.eid/Sites/almoar-front-end/src/lib/wordpress/client.ts`

## Verification

- PHP syntax: all theme/plugin PHP files passed `php -l`.
- Frontend TypeScript: passed `tsc --noEmit`.
- Frontend ESLint: no errors; pre-existing optimization and warning cleanup completed for the CMS client.
- Production build: passed with live GraphQL endpoint and local TLS bypass.
- Live direct GraphQL:
  - `homePageContent`: passed with populated hero slides.
  - `alomarSiteContent.pageBanners/homeAbout/footer`: passed with live values.
  - `alomarHeaderContent`: passed with live logo/menu.
  - `alomarContactPageContent`: passed; returns live heading defaults and empty unpopulated contact fields.
  - Projects, sectors, and companies: passed with live records.
- REST search: no frontend `wp-json`, REST route, or REST client usage found.

## Blockers and approval items

- Public GraphQL introspection remains disabled by WordPress configuration.
- Legacy `acf-fields.php` typo fields require database-confirmed migration if they are to be renamed, because nested repeater rows may contain stored values.
- The settings module remains disabled in the plugin; approval is not required for enabling it if global settings data should be GraphQL-managed, but live values and dependencies should then be verified.
