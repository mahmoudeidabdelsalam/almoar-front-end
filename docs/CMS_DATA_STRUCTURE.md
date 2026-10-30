# CMS data structure

## Source of truth and ownership

The local WordPress installation at `/Users/mahmoud.eid/Sites/almoar-wp` is the CMS. The active theme is `theme-headless`. The `alomar-holding-core` plugin source is absent from this local installation; the theme provides the `alomarSiteContent` and `homePageContent` GraphQL fields from its registered ACF groups when the plugin resolver is unavailable. Theme-owned custom post type and taxonomy registrations retain their public names and rewrite slugs.

Homepage and shared editorial copy is held in ACF options. About page content is stored on the WordPress page assigned the `page-about-us.php` template.

## Options and page field groups

| ACF group / source | Main fields | Current use and limitation |
|---|---|---|
| `group_alomar_homepage` / `alomar-homepage-content` | Localized hero slides: image, badge, title, description, and links | Drives the frontend hero. |
| `group_alomar_editorial_content` / `alomar-homepage-content` | `home_about`, `vision_section`, `footer_content` and legacy hidden fields | Shared editorial options. Page Banners, Homepage Section Headings and CTAs, the Homepage About Section image, and Investment Pillars are hidden from the editor; their stored values and GraphQL output are retained for existing frontend behavior. |
| `group_alomar_about_page_content` / `page-about-us.php` | `about_page` | About Us page-specific content. Existing option values are copied to the page once without deleting the original option data. |
| `group_wp_contact_page` / page template `page-contact-us.php` | Localized contact badge/title/description, banner image, heading, contact details, website, hours, map coordinates/link, social links, form title | Contact page-specific fields; the page template is assigned to the existing Contact page. |
| `group_alomar_investments_page` / page slug `our-investments` | Localized page header, SEO, introduction, portfolio, and CTA copy; intro image; statistics and related-page repeaters | Drives the localized Investments page; the portfolio itself is queried from published `projects`. |
| `group_wp_home` / front page | Legacy generic fields such as hero, benefits, about, and pricing sections | Boilerplate group; not the source of the current Alomar homepage data. |

The hidden legacy `page_banners` field carries a page key, localized badge/title/description and SEO title/description; `section_copy` carries a section key, localized badge/title/description and CTA fields. `home_about`, `vision_section`, and `footer_content` hold their corresponding localized editorial groups and repeaters.

The About Us page has a `page-about-us.php` template; its Next.js route reads the existing `aboutPage` GraphQL object, now resolved from that page. The existing Invest With Us page uses the `group_alomar_invest_with_us` field group, matched by its page slug or title. Its localized content is queried through `alomarInvestWithUsPageContent`, and `investment_form_id` selects the Gravity Form. The existing `our-investments` page has a separate localized Next.js route and an ACF field group registered by page slug. Its copy, SEO, statistics, image, CTA, and related links are queried through `alomarInvestmentsPageContent`; its portfolio cards and filters use published `projects` and their project-category terms.

### Contact page fields and forms

The existing Contact ACF group is organized into **Page Header**, **Contact Information**, and **Contact Form** tabs. Two fields were added: `contact_website` (URL) and `contact_map_url` (URL). Existing field names and values are retained. The theme exposes these fields via `alomarContactPageContent` in WPGraphQL; the query resolves the page assigned `page-contact-us.php`.

Gravity Forms 1 (`contact us`) and 2 (`Invest with us`) are unchanged. Both currently have the same ten configured fields, including required name, email, and comments; phone and best-time fields are conditional on choosing Phone. Form 1 is rendered on Contact Us. The Invest With Us page selects its form in WordPress through `investment_form_id`; the ACF choices are populated from Gravity Forms at edit time and display the form title and ID. Active and inactive forms are listed, and an unavailable saved ID is retained in the selector rather than silently cleared. The frontend fetches only the selected form’s public display schema; a missing/invalid selection shows a localized fallback instead of another form. The public schema endpoint omits notifications and administrative settings. Existing `custom/v1/gravity-form` submissions continue through `GFAPI::submit_form`, so Gravity Forms performs server-side validation and runs its configured confirmations and notifications. Honeypot protection is currently disabled on both forms.

The Invest With Us ACF group has **Page Header**, **Partnership Opportunity**, and **Investment Inquiry** tabs:

- Page Header: `hero_badge` / `hero_badge_en`, `hero_title` / `hero_title_en`, `hero_description` / `hero_description_en`, and `hero_image`.
- Partnership Opportunity: `opportunity_heading` / `_en`, `opportunity_description` / `_en`, `process_heading` / `_en`, and the `process_items` repeater (`process_title` / `_en`, `process_description` / `_en`).
- Investment Inquiry: `contact_heading` / `_en`, `contact_description` / `_en`, `inquiry_form_title` / `_en`, `inquiry_form_submit_label` / `_en`, and `investment_form_id`.

The Our Investments ACF group is matched to the published page with slug `our-investments` and has these tabs:

- Page Header: localized `hero_badge`, `hero_title`, `hero_description`, `seo_title`, and `seo_description`.
- Investment Introduction: localized `intro_eyebrow`, `intro_heading`, and `intro_description`; `intro_image`.
- Investment Portfolio: localized `portfolio_eyebrow`, `portfolio_heading`, and `portfolio_description`.
- Investment Call to Action: localized `cta_eyebrow`, `cta_heading`, `cta_description`, and `cta_button_label`; `cta_url`.
- Related Pages: `navigation_links` repeater with localized labels/descriptions, `link_url`, and `link_image`.
- Investment Statistics: `investment_statistics` repeater with `stat_value`, `stat_label`, and `stat_label_en`.

The page fields are exposed by `alomarInvestmentsPageContent`. Portfolio membership is currently all published `projects`; the page uses their existing category terms and preserves WPGraphQL order.

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
| `projects` | Localized title, excerpt, body, featured flag and project details; featured image; project category/location terms | 2 |
| `news` | Native title/excerpt/body, bilingual ACF fields, category and reading time, publication date, featured image, `related_articles` relationship | 1 |
| Native `post` | Standard WordPress posts; not used by the frontend News listing | 2 |
| `sectors`, `companies`, `investments`, `media-center` | Removed from theme CPT registration and frontend queries/routes; existing CMS records, if any, are not deleted | — |
| `board_members` | Removed from theme CPT registration, GraphQL schema, and frontend; existing CMS record is not deleted | 1 |

The frontend News archive queries the `news` custom post type and resolves detail pages by WordPress database ID. Counts are a local audit snapshot, not production inventory.

### Project details field group

The theme-owned `Alomar Project Details` group is exposed through WPGraphQL for ACF as the `projectDetails` object on `Project`. Existing project fields and stored names remain unchanged. The local WPGraphQL schema does not expose project status/specification, gallery, or highlight fields from the former query shape, so the frontend now selects schema-verified project data rather than failing the entire project query.

| ACF field name | Type / nested fields |
|---|---|
| `project_logo` | Image, Image Array return |
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

### Content ownership decision still needed

- Decide whether About editorial should move from the global options page onto the About page.

## GraphQL entry points

- `alomarSiteContent`: shared settings, page banners, section copy, About/Vision/footer options and related site content.
- `homePageContent`: hero-slide options.
- `projects`: project records and exposed ACF fields.
- `newsArticles` and `newsArticle(id:, idType: DATABASE_ID)`: News CPT entries and ID-based article lookup.
- `alomarContactPageContent`: Contact page template fields.
- `alomarInvestmentsPageContent`: Our Investments page ACF fields and repeaters.
- `submitAlomarContact`: contact write mutation from the existing core plugin class, now initialized by the theme.

Public schema introspection is disabled on the local endpoint. The full project selection (including nested ACF repeaters, images, and links) and the absence of the removed `boardMembers` field were validated by executable GraphQL requests.
