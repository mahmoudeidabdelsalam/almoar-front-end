# Figma and prototype implementation map

## Reference availability

The supplied Figma reference was not accessible through the available tools, and its source is not present in the workspace. The Claude Artifact rendered, so an accessibility snapshot and screenshot could be inspected, but its source and interaction specifications were unavailable. This is a qualitative implementation map, not a pixel-accuracy sign-off.

## Observed prototype sections and current implementation

| Prototype observation | Frontend implementation | Status |
|---|---|---|
| Hero with brand heading and slide controls | `HeroSlider` | Component exists and reads editable CMS slides. Exact image crop, typography, and animation timing were not compared with Figma. |
| Company tabs and previous/next controls | `CompaniesSection` | Similar controls exist, but the component is fed project records rather than company records. Content parity is not established. |
| Approach / corporate narrative | `ApproachSection` | Component exists and reads homepage About content. No source-level reference was available for spacing or visual comparison. |
| Six sector accordion controls | No sector accordion is rendered by the current `HomeContent` composition | Not implemented on the homepage. |
| News cards and controls | `NewsSection` | Component exists; links and dates are locale-aware. Exact card layout and interaction parity remain unverified. |
| Shared footer | `Footer` | Component exists and consumes shared/footer settings. Exact column, typography, and responsive parity remain unverified. |

The accessible prototype snapshot showed company selection controls, an approach section, six sector accordion controls, news cards, and a footer. An interaction attempt on a company tab timed out, so tab behavior in the source artifact was not verified. These observations do not replace the original design spec.

## Required follow-up

1. Provide access to the actual Figma file and the authoritative prototype source.
2. Record target viewport sizes and compare desktop, tablet, and mobile layouts.
3. Verify typography, spacing, crop positions, overlays, transition timing, focus states, and RTL/LTR behavior against the reference.
4. Decide whether the six-sector accordion belongs on the homepage and whether the current project-fed company carousel is intentional.
5. Capture before/after screenshots and resolve any remaining design gaps.

Do not mark visual acceptance complete until those references and checks are available.
