# Design Gaps

This project includes a polished luxury-brand frontend, but the actual design references from Figma and Claude remain external to the local workspace, which prevents a true pixel-close audit against the supplied source of truth.

## Gaps currently observed

- The codebase is not paired with the actual Figma file contents in the workspace.
- The prototype interaction sequences are not directly inspectable from local files.
- The WordPress backend is generic and not yet fully mapped to the Alomar brand content structure.
- The headless theme still contains unused Erbify ACF files, but no longer loads them; Alomar-specific ACF groups now live in the active core plugin.
- Some brand and asset references (logos, photography, exact imagery crop ratios, and section-level spacing) may still differ from the prototype even though the base design language is present.

## Remaining work for full fidelity

1. Import or access the actual Figma pages and component specs.
2. Compare the working frontend against those specs at desktop/tablet/mobile breakpoints.
3. Fine-tune spacing, typography, image cropping, and animation timing.
4. Replace generic WordPress field groups with Alomar content models.
5. Configure the live REST/WPGraphQL output to reflect the fields the frontend expects.

Status note: the local core plugin is active, custom project/sector/company/team GraphQL types are exposed, and the frontend client consumes the GraphQL contract when configured. Homepage hero slides are editable through ACF; remaining landing-page editorial copy and section content still need page-level fields before all visible copy is CMS-managed. The local CMS has no published Alomar entries yet, so the existing frontend dataset remains the empty-collection fallback.
