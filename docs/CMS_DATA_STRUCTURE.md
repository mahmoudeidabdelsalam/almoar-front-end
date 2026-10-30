# CMS data structure

## Source of truth and ownership

The local WordPress installation at `/Users/mahmoud.eid/Sites/almoar-wp` is the CMS. The active theme is `theme-headless`; `alomar-holding-core` is installed but currently inactive in the local WordPress environment. This implementation moved custom post type and taxonomy registration into the theme without changing the existing public names, GraphQL names, or rewrite slugs. Its contact mutation class is loaded by the theme where available.

Homepage and shared editorial copy is held in ACF options. About page content is stored on the WordPress page assigned the `page-about-us.php` template.

## Options and page field groups

| ACF group / source | Main fields | Current use and limitation |
|---|---|---|
| `group_alomar_homepage` / `alomar-homepage-content` | Localized hero slides: image, badge, title, description, and links | Drives the frontend hero. |
| `group_alomar_editorial_content` / `alomar-homepage-content` | `home_about`, `vision_section`, `footer_content` and legacy hidden fields | Shared editorial options. Page Banners, Homepage Section Headings and CTAs, the Homepage About Section image, and Investment Pillars are hidden from the editor; their stored values and GraphQL output are retained for existing frontend behavior. |
| `group_alomar_about_page_content` / `page-about-us.php` | `about_page` | About Us page-specific content. Existing option values are copied to the page once without deleting the original option data. |
| `group_wp_contact_page` / page template `page-contact-us.php` | Localized contact badge/title/description, banner image, heading, contact details, hours, map coordinates, social links, form title | Contact page-specific fields; the page template is assigned to the existing Contact page. |
| `group_wp_home` / front page | Legacy generic fields such as hero, benefits, about, and pricing sections | Boilerplate group; not the source of the current Alomar homepage data. |

The hidden legacy `page_banners` field carries a page key, localized badge/title/description and SEO title/description; `section_copy` carries a section key, localized badge/title/description and CTA fields. `home_about`, `vision_section`, and `footer_content` hold their corresponding localized editorial groups and repeaters.

The About Us page has a `page-about-us.php` template; its Next.js route reads the existing `aboutPage` GraphQL object, now resolved from that page. Invest With Us has no dedicated page field group and reuses contact-form content. The former Investments alias was removed; projects are served through the Projects routes.

### About page field group

The existing `about_page` field group is shown on pages assigned the About Us template. A one-time, non-destructive copy preserves the current About/vision/mission/value content on that page while retaining the original options data.

| ACF tab | Fields |
|---|---|
| Overview and Statistics | `overview_title`, `overview_title_en`, `overview_description_one`, `overview_description_one_en`, `overview_description_two`, `overview_description_two_en`; `overview_image_one`, `overview_image_one_alt`, `overview_image_one_alt_en`, `overview_image_two`, `overview_image_two_alt`, `overview_image_two_alt_en`; `statistics` repeater (`value`, `label`, `label_en`) |
| Clarity and Strategy | Localized `strategy_eyebrow`, `strategy_title`, `strategy_description`, `strategy_cta_label`, `strategy_focus_title`, and `strategy_focus_description`; `strategy_cta_url`; `strategy_principles` repeater (`title`, `title_en`, `description`, `description_en`) |
| Portfolio Distribution | Localized `portfolio_eyebrow`, `portfolio_title`, and `portfolio_cta_label`; `portfolio_cta_url`; `portfolio_items` repeater (`title`, `title_en`, `description`, `description_en`, `metric`) |
| Portfolio Companies | Localized `companies_eyebrow` and `companies_title`; `companies` repeater (`name`, `name_en`, `description`, `description_en`, `logo`, `image`, `link`) |
| Social Responsibility | Localized `responsibility_eyebrow` and `responsibility_title`; `responsibility_items` repeater (`title`, `title_en`, `description`, `description_en`, `image`) |
| Board of Directors | Localized `board_eyebrow` and `board_title`; `board_members` repeater (`name`, `name_en`, `role`, `role_en`, `image`) |
| Related Page Links | `navigation_links` repeater (`label`, `label_en`, `image`, `url`) |

For these new fields Arabic uses the base name and English uses `_en`. Existing fields keep their original names. New image fields return URLs; separate bilingual alt-text fields are provided for the two overview images. Empty repeaters are returned as empty GraphQL lists and corresponding frontend sections remain hidden until meaningful data is entered. Existing About options were copied to the About Us page without deleting the options. Board Members CPT records were not migrated or deleted.

## Content types and observed fields

| WordPress type | ACF / taxonomy data used by the frontend | Local record snapshot |
|---|---|---:|
| `projects` | Localized title, excerpt, body, status and location; specs, completion year, brochure URL, featured flag, gallery, highlights, featured image; project category/location terms | 2 |
| `news` | Native title/excerpt/body, bilingual ACF fields, category and reading time, publication date, featured image, `related_articles` relationship | 1 |
| Native `post` | Standard WordPress posts; not used by the frontend News listing | 2 |
| `sectors`, `companies`, `investments`, `media-center` | Removed from theme CPT registration and frontend queries/routes; existing CMS records, if any, are not deleted | — |
| `board_members` | Removed from theme CPT registration, GraphQL schema, and frontend; existing CMS record is not deleted | 1 |

The frontend News archive queries the `news` custom post type and resolves detail pages by WordPress database ID. Counts are a local audit snapshot, not production inventory.

### Project details field group

The theme-owned `Alomar Project Details` group is exposed through WPGraphQL for ACF as the `projectDetails` object on `Project`. Existing project fields and stored names remain unchanged; existing project gallery/highlight fields were kept in the same group so their content remains queryable.

| ACF field name | Type / nested fields |
|---|---|
| `project_logo` | Image, Image Array return |
| `project_gallery` | Existing Gallery field |
| `project_highlights` | Existing repeater: `highlight_ar`, `highlight_en` |
| `stats_tag`, `stats_tag_en`, `stats_headline`, `stats_headline_en` | Text |
| `stats_items` | Repeater: `stat_head`, `stat_head_en`, `stat_text`, `stat_text_en` |
| `make_tag`, `make_tag_en`, `make_headline`, `make_headline_en` | Text |
| `make_items` | Repeater: `make_head`, `make_head_en`, `make_text`, `make_text_en` |
| `companies_tag`, `companies_tag_en`, `companies_headline`, `companies_headline_en` | Text |
| `companies_items` | Repeater: `company_logo` (Image Array), `company_link` (URL) |
| `experience_tag`, `experience_tag_en`, `experience_headline`, `experience_headline_en` | Text |
| `experience_items` | Repeater: `experience_head`, `experience_head_en`, `experience_text`, `experience_text_en` |
| `key_projects_tag`, `key_projects_tag_en`, `key_projects_headline`, `key_projects_headline_en` | Text |
| `key_projects_items` | Repeater: `key_projects_img` (Image Array), `key_projects_head`, `key_projects_head_en`, `key_projects_location`, `key_projects_location_en`, `key_projects_text`, `key_projects_text_en`, `key_projects_link` (ACF Link) |

Arabic is stored in the base field name and English in the `_en` field. The local project record has no values for these added fields; empty image/repeater values are returned as `null` by GraphQL and are treated as optional by the frontend. No content was added to the existing record.

### News relationships

News records expose the ACF `related_articles` relationship as the GraphQL field `relatedArticles`. The resolver returns only published related News records. The frontend detail page uses those relationships and does not infer related articles from arbitrary list positions. Existing records currently have no populated related-article selection.

### Content ownership decisions still needed

- Decide whether About editorial should move from the global options page onto the About page.
- Define page-specific content for Invest With Us instead of reusing Contact content.

## GraphQL entry points

- `alomarSiteContent`: shared settings, page banners, section copy, About/Vision/footer options and related site content.
- `homePageContent`: hero-slide options.
- `projects`: project records and exposed ACF fields.
- `newsArticles` and `newsArticle(id:, idType: DATABASE_ID)`: News CPT entries and ID-based article lookup.
- `alomarContactPageContent`: Contact page template fields.
- `submitAlomarContact`: contact write mutation from the existing core plugin class, now initialized by the theme.

Public schema introspection is disabled on the local endpoint. The full project selection (including nested ACF repeaters, images, and links) and the absence of the removed `boardMembers` field were validated by executable GraphQL requests.
