# ArtLanguage SEO audit

**Audit date:** 2026-11-01  
**Scope:** `artlanguage.co`, the Next.js frontend, and the local headless WordPress theme.

## Summary

The production frontend currently serves the important tested pages and its existing sitemap URLs successfully, but several SEO tags were missing or inherited from the wrong route. The implementation now gives localized pages page-specific titles, descriptions, canonicals, Open Graph/Twitter tags, and language alternates; corrects stale investment redirects; adds accurate organization/site structured data; and fixes a missing projects H1. The WordPress theme now marks WordPress-rendered pages `noindex` and keeps its backend sitemap reference out of `robots.txt`.

The frontend production build and local route checks pass. **Neither repository was deployed as part of this audit.** Live production checks describe the pre-deployment state and therefore do not demonstrate that the fixes are active on production.

## Findings and fixes

| Issue | Severity | Evidence and root cause | Fix / verification |
|---|---|---|---|
| Homepage title and description missing; wrong social URL | High | Live `/ar` and `/en` returned 200 but had no title or description. The root metadata relied on optional CMS SEO values and set `og:url` to `alomarholding.sa`. | Added localized, CMS-first metadata with unique fallbacks and fixed the canonical base to `https://artlanguage.co`. Confirmed title, description, canonical, and `og:url` in the local production build. |
| Canonical metadata inherited by unrelated pages | High | Live `/en/about`, contact, project, and article routes inherited `/ar` as canonical; the shared root layout declared the homepage canonical globally. | Removed the global canonical and added route-level canonical/alternate/OG metadata. Verified localized page canonicals against route paths in local production output. |
| Investments canonical and legacy redirects pointed to 404s | High | Live `/ar/our-investments` and `/en/our-investments` canonicalized to `/ar/investments` and `/en/investments`, which returned 404. `/projects` and `/investments` redirected to `/ar/investments` (404). | Canonical now uses `/our-investments`; redirects now target `/ar/our-investments` and `/ar/projects[:slug]`. Local production smoke tests verified the redirects and 200 destinations. |
| Contact, investment, project, and article metadata was incomplete | Medium | Some localized routes had no route-level metadata; localized wrappers did not inherit metadata from imported page components. Project detail metadata lacked canonical and language alternates. | Added metadata to the localized routes/wrappers, using the existing ACF page-banner fields and page-specific fallbacks. Dynamic article/project alternates are limited to languages with localized titles. |
| Sitemap omitted a route and generated misleading dates | Medium | Live sitemap was valid and had 22 unique HTTPS URLs, all returning 200, but omitted `/our-investments`. Source assigned the current time as `lastModified` on every request and emitted both language variants without checking translations. | Added the real investments route, translation-aware dynamic entries, deduplication, and removed fabricated modification dates. Local output was valid XML with 24 unique public URLs; all 24 returned 200. |
| Projects archive could have no page-level H1 | Medium | Live `/ar/projects` had no H1 when the CMS banner/section copy was empty; `PageBanner` and `ProjectsSection` both hid their fallback copy outside preview mode. | The archive section now uses a localized static title fallback and exposes its existing visual heading as H1. Local production output has one H1 for Arabic and English. |
| WordPress content was indexable on the admin hostname; Yoast sitemap advertised backend URLs | High | Live `admin.artlanguage.co/about-us/` returned 200 with `index, follow` and a self-canonical on the admin host. Yoast `robots.txt` referenced `http://admin.artlanguage.co/sitemap_index.xml`; its sitemap index listed eight HTTP admin-host sitemap files. | The theme emits `X-Robots-Tag: noindex, follow` for public WordPress-rendered pages, removes sitemap references from WordPress `robots.txt`, and disallows `/wp-admin/` while allowing `admin-ajax.php`. `wp eval` confirmed the resulting robots rules locally; PHP lint passed. The backend change is present in commit `6800d76` and still requires deployment. |
| WPGraphQL header query failed against the live schema | Medium | The production build repeatedly logged `Cannot query field "labelButtonRight" on type "HeaderFields"`; the frontend asked for three unsupported CTA fields, causing the whole header query to fall back. | Removed only the unsupported fields. A read-only live GraphQL query returned the logo and six menu items with no errors; the final build produced no header-query errors. |
| Structured data absent | Low | Representative live frontend pages had no JSON-LD. | Added `Organization` and `WebSite` data using the actual public name, domain, and logo. The logo URL returned 200; local JSON-LD parsed successfully. No article authors/ratings/business claims were fabricated. |
| English document language in raw server HTML | Medium | Raw `/en` HTML currently has `lang="ar"`; the existing `LanguageProvider` changes it to `lang="en" dir="ltr"` after hydration (confirmed in a browser). Root layouts cannot read a descendant `[lang]` param; using request headers in the root layout failed the Cache Components build. | Not changed to avoid disabling existing partial prerendering or introducing a client-only workaround. Consider a localized root-layout architecture if server-source `lang` correctness is required. |

## Other checks

- Frontend `robots.txt` and `sitemap.xml` both returned 200. The frontend robots response allows public routes, disallows `/api/`, and references `https://artlanguage.co/sitemap.xml`.
- The existing live sitemap had no duplicate or non-production locations; every listed URL returned 200.
- A nonexistent localized URL returned a real 404. The root URL redirects to `/ar`.
- Representative production HTML had one H1 on the tested pages where content was available and included server-rendered primary page content.
- The frontend already maps bilingual ACF page-banner SEO fields through WPGraphQL. Yoast is active on WordPress, but its SEO fields are not used by the frontend; no new plugin or duplicate SEO fields were added.
- Sample article publication dates were valid and emitted in Open Graph. WordPress-hosted article images use the frontend image optimizer for social metadata; the resulting public image URL returned 200.
- The final Next.js production build succeeded with partial prerendering enabled. TypeScript passed. ESLint reported no errors and two existing unused-variable warnings (`news/[id]/page.tsx`, `AboutPageSections.tsx`). PHP syntax and both repositories' diff checks passed.
- No Lighthouse/PageSpeed or Search Console data was collected. This audit cannot establish Google indexing, ranking changes, or search-performance improvements.

## Deployment and follow-up

1. Deploy the frontend branch and verify the live metadata, sitemap, and redirects.
2. Deploy the WordPress theme commit `6800d76`; then verify `X-Robots-Tag` on a public backend page and that the backend `robots.txt` no longer advertises the Yoast sitemap.
3. Submit `https://artlanguage.co/sitemap.xml` in Google Search Console and inspect indexing/canonical reports after Google recrawls the site.
4. Consider restructuring the localized root layout if the English `lang` attribute must be correct before client hydration.
5. Capture comparable Lighthouse measurements and monitor Search Console separately; no before/after score is claimed here.
