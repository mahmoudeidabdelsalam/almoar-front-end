# WPGraphQL integration

## Configuration and request behavior

The frontend reads `WORDPRESS_GRAPHQL_URL`, with `NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL` also supported for browser-side GraphQL operations. Configure these as endpoint URLs, not credentials. The frontend client in `src/lib/wordpress/client.ts` owns read operations and model mapping.

Requests use POST and validate GraphQL/HTTP responses. CMS request failures are logged; production does not silently substitute mock records. Development preview data is available only when no CMS endpoint is configured.

## Read operations

- `alomarSiteContent`: site settings, retained page-banner/section-copy data, homepage/Vision/footer editorial, and About Us page content. `aboutPage` keeps its existing response shape and resolves from the page assigned the `page-about-us.php` template; it includes the chairman/vision/mission/value fields and the About overview, statistics, strategy, portfolio distribution, company, responsibility, board, and related-page-link fields.
- `homePageContent`: hero slides.
- `projects(first: 50)`: project details, taxonomy terms, existing ACF fields, and the exposed `projectDetails` group.
- `newsArticles(first: 10)`: records from the `news` custom post type, including bilingual ACF fields.
- `newsArticle(id: $id, idType: DATABASE_ID)`: direct lookup by WordPress database ID with `relatedArticles`.
- `alomarContactPageContent`: Contact page ACF data, resolved from the page assigned `page-contact-us.php`.
- `alomarInvestWithUsPageContent`: localized Invest With Us page content, process-step repeater, hero image URL, and the selected `investmentFormId` (nullable `String`). The resolver only returns content for a published matching page; it does not expose Gravity Forms settings.
- `headerSettings` and `footerSettings`: shared navigation/footer settings.

The `relatedArticles` resolver returns published News records selected through the `related_articles` ACF field. Local records currently have no related selection.

The `projectDetails` group contains the existing bilingual project fields plus Project Logo and the Stats, Make, Companies, Experience, and Key Projects fields. Project gallery and highlights are legacy fields on the `Project` node (`projectGallery: [String]` and `projectHighlights: [AlomarProjectHighlight]`). ACF image fields resolve as one-to-one media connections and are queried as `fieldName { node { sourceUrl altText } }`; the ACF Link field resolves to `url`, `title`, and `target`. Repeater selections are nullable lists and the frontend treats `null` and empty lists as no section content.

The theme no longer registers the Board Members, Sectors, or Companies content types. Their records are not deleted, but they are not exposed through the current frontend/schema. The full current Projects selection was validated against two local records with no GraphQL errors; legacy repeater values that are not arrays resolve as empty lists.

Verified against the local endpoint with a query selecting the nested bands and media/link fields:

```graphql
projects(first: 1) {
  nodes {
    projectDetails {
      projectLogo { node { sourceUrl altText } }
      statsItems { statHead statHeadEn statText statTextEn }
      companiesItems { companyLogo { node { sourceUrl altText } } companyLink }
      keyProjectsItems {
        keyProjectsImg { node { sourceUrl altText } }
        keyProjectsLink { url title target }
      }
    }
  }
}
```

The query returned the expected `projectDetails` object and nullable empty fields for the existing project. Schema introspection remains disabled; the active selections were validated directly.

## Contact page and Gravity Forms

The Invest With Us page uses the existing public Gravity Forms definition endpoint with the form ID selected in ACF. The selection is not hardcoded in the page or API proxy; the proxy accepts positive integer form IDs, and missing/invalid forms render a localized fallback.

The local WPGraphQL schema does not expose the Contact ACF group as a `Page` field, so the theme registers the typed `alomarContactPageContent` root field. Its full selection was executed against the local schema without GraphQL errors. Contact image and link values resolve to URL strings, and coordinates resolve to nullable floats.

The active `custom-gravity-forms-api` plugin provides:

- `GET /wp-json/custom/v1/gravity-form?formId=1|2`: public form IDs, labels, display field definitions, choices, and conditional rules. It does not expose notification or administrative settings.
- `POST /wp-json/custom/v1/gravity-form`: submissions through `GFAPI::submit_form`, preserving Gravity Forms server-side validation, confirmations, and notifications.

The Next.js `/api/gravity-form` route proxies submissions server-side, and both page forms are rendered from the public form definition rather than hardcoded field lists. Form 1 is used on Contact Us; Form 2 is used on Invest With Us. The existing forms were not modified. Their field configurations currently match, despite their different titles. Both currently have honeypot protection disabled; do not claim captcha or honeypot protection is active.

Both form definitions were read from the local WordPress environment, and invalid empty submissions returned Gravity Forms validation errors (HTTP 422) without creating entries. Successful submissions, notifications, and confirmation delivery were not tested.

## Limits

The `news` custom post type is exposed as `NewsArticle` / `NewsArticles`. Bilingual title, excerpt, body, category, and reading-time fields are registered on that GraphQL type. Article URLs and direct lookups use the WordPress database ID, not the content slug.

Public schema introspection is disabled on the local endpoint; active selections are verified with executable queries. When the `alomar-holding-core` resolver is unavailable, the theme registers `RootQuery.alomarSiteContent` and `RootQuery.homePageContent` from the existing ACF data. The selections used by the shared frontend query were verified against the local endpoint. The current production build proceeds past site-content loading but encounters separate schema mismatches for `Project.statusAr` and `NewsArticle.titleEn`. Project detail still resolves against the first 50 project records. Contact delivery, production endpoint configuration, and production content remain unverified.

The About page extends the existing `AlomarAboutPage` GraphQL object. New image fields resolve to URL strings, and nested ACF repeaters resolve to nullable lists of scalar objects (not ACF image/link connections). The frontend maps missing values to empty strings/lists and conditionally renders the corresponding sections. The exact new response fields were verified with a local `do_graphql_request` selection; all newly registered fields were present, and currently unpopulated repeaters returned `[]`.

Representative About selection:

```graphql
alomarSiteContent {
  aboutPage {
    overviewTitle overviewTitleEn
    overviewDescriptionOne overviewDescriptionOneEn
    overviewDescriptionTwo overviewDescriptionTwoEn
    overviewImageOneUrl overviewImageOneAlt overviewImageOneAltEn
    overviewImageTwoUrl overviewImageTwoAlt overviewImageTwoAltEn
    statistics { value label labelEn }
    strategyTitle strategyTitleEn strategyDescription strategyDescriptionEn
    strategyFocusTitle strategyFocusTitleEn strategyFocusDescription strategyFocusDescriptionEn
    strategyPrinciples { title titleEn description descriptionEn }
    portfolioTitle portfolioTitleEn
    portfolioItems { title titleEn description descriptionEn metric }
    companies { name nameEn description descriptionEn logoUrl imageUrl link }
    responsibilityItems { title titleEn description descriptionEn imageUrl }
    boardMembers { name nameEn role roleEn imageUrl }
    navigationLinks { label labelEn imageUrl url }
  }
}
```

See [API migration](./API_MIGRATION.md) for safe write-endpoint validation and [CMS content verification](./CMS_CONTENT_RESULTS.md) for the local results.
