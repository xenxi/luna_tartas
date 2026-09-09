# Sobre Luna — Desktop

Implementation: COMPLETE

Visual status: AWAITING_VISUAL_APPROVAL

## Scope

Adapt `/sobre-luna/` to the desktop reference supplied on 2026-09-09:
gift hero, four value cards, three alternating oval photographs, four process
steps, six gallery photographs and the contact banner. Editorial text stays in
`src/content/about.ts`. Existing page and section URLs are preserved.

The shared header, footer, layout, navigation and home source files were not
modified. The desktop presentation is scoped to `.about-page` and `.about-cta`,
from 64rem. The subsequent user comments explicitly requested the mobile hero
background behind the menu; that targeted correction is included below.

Existing photographs of Luna products are used. They are not all the exact
photographs in the supplied mockup. The hero background is generated; text,
navigation, ornaments and page content are rendered separately in HTML/CSS.

## Verification

- `npm run build`: PASS, 35 pages.
- `npm run typecheck`: PASS, 206 files, no errors, warnings or hints.
- `npm run verify:responsive`: PASS, 35 HTML files.
- `npm run verify:accessibility`: PASS, 35 HTML files.
- `npm run verify:links`: PASS, no broken links, orphaned pages or breadcrumb issues.
- `npm run verify:seo`: PASS, 34 HTML pages.
- `npm test`: 303 PASS, 1 FAIL. The existing test at
  `tests/site-shell.test.ts:148` expects the literal single-line text
  `'site-header--overlay': currentPath === '/'`; the existing header uses a
  multiline expression including category and product indexes. Both files are
  unchanged from HEAD, verified with `git diff --quiet HEAD`.
- Browser review: hero and stories reviewed at desktop size; process, gallery
  and contact artwork visibly loaded in the production preview at 1280px.
  No broken images or horizontal page overflow. Additional overflow checks at
  1024px and approximately 390px passed; no overflowing mobile headings.
- `git diff --check`: PASS.

The full test suite remains FAIL due to the preexisting shell assertion.
Automated checks do not establish visual fidelity. Compare the desktop view
against the supplied reference; explicit user approval is still required.

## Corrections requested in browser comments

- Hero transition now uses the same SVG contour and subtle pink edge as the
  home, replacing repeated semicircles and the old mobile heart divider.
- The shared footer wave overlaps the desktop contact banner more visibly.
  Extra height within the banner reserves room below its copy and button.
  The footer's existing wave, links and decoration are unchanged.
- A page-scoped header positioning rule overlays the shared menu on the hero.
  The photograph starts at the top of the document on desktop and mobile;
  reserved header space keeps breadcrumbs and text below the menu. Mobile uses
  a pale gradient over the photograph for readability. No additional client JS.

Correction checks: build, typecheck, responsive audit, accessibility audit,
Prettier and `git diff --check` PASS. Browser checks at 2242, 1024, 523 and
320px found no horizontal overflow. At 523 and 320px the image begins at y=0
and breadcrumbs begin at the header's bottom (108px). The mobile menu opens
and closes normally over the image. At 2242 and 1024px the contact button's
bottom remains above the entire footer-wave box, including its highest crest.
The previously recorded full-suite failure is unchanged; the full suite was
not rerun for these CSS/SVG corrections.

Visual status remains AWAITING_VISUAL_APPROVAL for these corrections.

## Generated asset

Tool: built-in `image_gen.imagegen` (no CLI fallback).

Saved asset: `src/assets/about/about-hero-reference.png`.

Input: user-supplied screenshot
`codex-clipboard-22160361-391e-47a3-8cb3-2ddd1c8093b0.png`, used as a visual
composition reference.

Final prompt:

> Create a single landscape background photograph asset for a website hero, approx 2.15:1 ratio. Reference image is a webpage mockup ONLY as composition reference: replicate exclusively the top hero's photographic background with kraft gift, pink satin bow, cream tag reading 'Hecho con amor' and small pink heart, abundant tiny white gypsophila flowers, pink knitted blanket, little knitted pink heart. No webpage, no header, no logo, no paragraphs, no titles, no UI, no moon illustrations. Gift large on right centered x70%, pink blanket covers entire right and bottom; flowers behind and left of gift around x50%. Left 36% is a very soft pale near-white pink photographic blur, empty for HTML text overlay. Close-up frontal slightly overhead cozy editorial photograph, warm natural diffuse light, blush pink tones, very close to supplied hero photo composition. Image fills entire rectangular canvas without borders or scallops.
