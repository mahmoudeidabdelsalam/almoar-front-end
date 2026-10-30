# SEO audit

## Implemented

- Localized news/media-center archive metadata uses route-aware title, description, canonical, and alternate-language URLs.
- Article metadata and article content use the requested slug directly, rather than relying on the first page of the archive.
- Article title, description, publication date, and related links are localized where CMS values exist.
- Shared page-banner SEO fields are selected by page key and locale through `getPageMetadata()`.
- News cards use localized internal links and locale-aware dates.

## Findings and caveats

- Page-banner SEO is stored in the shared editorial options group, not on each WordPress page.
- Missing CMS SEO values can leave metadata unset in production rather than using invented editorial text.
- The non-localized and other non-news routes have not received a full metadata/canonical audit in this pass.
- No complete audit of sitemap, robots directives, social preview tags, structured data, redirects, or image metadata was performed.
- Valid English news archive/article and Arabic media-center article requests returned HTTP 200. The invalid English article rendered the localized 404 UI but also returned HTTP 200.
- The production build marks article routes as partially prerendered (PPR) with Cache Components enabled. The article lookup and `notFound()` run after the static shell can start streaming; Next.js documents that a `notFound()` reached after streaming starts retains HTTP 200 and adds `noindex`. Moving the missing-article check into `generateMetadata()` did not change the status, so that ineffective change was reverted.
- A correct HTTP 404 requires a pre-render/request gate before streaming (or an equivalent deployment-level solution). This remains an open release blocker; do not treat the localized 404 UI alone as sufficient.
- Production canonical host, language alternates, and trailing-slash policy have not been verified against deployment configuration.

## Follow-up acceptance

- Confirm unique localized title and description for each indexable route.
- Verify canonical and `hreflang` targets on both English and Arabic pages in the deployed environment.
- Confirm missing article routes return 404, not 200.
- Audit sitemap/robots, Open Graph/Twitter metadata, structured data, image alt text, redirects, and duplicate URL handling.
- Re-test generated metadata after production CMS SEO fields are approved.

The checks in this document are implementation observations, not a full SEO certification.
