# Productos y Sobre Luna — Desktop

Implementation: COMPLETE

Visual status: AWAITING_VISUAL_APPROVAL

## Scope

Apply the home composition limit of 90rem (1440px at the default font size)
to `/productos/`, all nine published product detail pages and `/sobre-luna/`.
The shared layout opts into a centered main through `boundedContent`.
`--container-page` centralizes the limit used by these pages and the home hero;
`--page-unit` caps the product desktop viewport-based dimensions and offsets.
The product index title has enough line width for “personalizados”.

No editorial content, routes or client JavaScript changed. Compact widths retain
their existing layout; they were checked for regressions.

## Verification

- Build: PASS, 35 pages.
- Typecheck: PASS, 206 files, no errors, warnings or hints.
- Format and `git diff --check`: PASS.
- Responsive and accessibility artifact audits: PASS, 35 HTML files.
- Edge browser: PASS, 88 page/viewport combinations across all 11 affected
  pages at 320, 390, 768, 1024, 1440, 1920, 2560 and 3840px. Main is centered
  and capped at 1440px, with no document or heading/paragraph overflow.
  Hero and title geometry remains identical at 1440px and all larger widths.
- Screenshots inspected for the product index, a product detail and Sobre Luna
  at 2560px. Local results and screenshots are in ignored `.cache/`.
- Full unit suite: FAIL, 303 PASS and one preexisting failure at
  `tests/site-shell.test.ts:148`, which expects a single-line header expression
  that is already multiline in HEAD. Header and test are unchanged from HEAD.

Manual review: compare against the home width behavior and approve the visual
result explicitly before marking this task DONE.

## Browser correction: right edge of the product hero

Removed the desktop image's end inset so it reaches the hero's right boundary
without the empty vertical strip. The 1440px frame remains unchanged.
At the reported 2242px viewport, image and hero both end at x=1841 (gap: 0px).
Build, responsive artifact audit, all 88 width checks and `git diff --check`
pass after the correction. Screenshot inspected at 2242px. The preexisting
unit-suite failure above remains outside this correction.

## Browser correction: About process connector

Replaced the desktop dashed border with three decorative SVG connectors using
the home process path, pink stroke, 1.5px thickness and 4/6 dash spacing.
Each curve joins adjacent icon centres without end tails; the connectors stay
hidden in the existing compact layout. No editorial content changed.

Build, typecheck (206 files), format, responsive/accessibility artifact audits
and `git diff --check`: PASS. Browser inspection at 2242px confirms all three
connections align within 0.01px of the icon centres. Screenshot inspected at
`.cache/about-process-wave.png`; at 390px no desktop connectors are visible.
Visual approval remains pending.

## Browser correction: home lateral backdrop

Bound the desktop `.home-composition` background to the shared 1440px frame,
revealing the existing global cloud, hearts and watercolor backdrop in the
outer margins, as requested. The central canvas stays opaque.

Build, responsive artifact audit and `git diff --check`: PASS. Browser checks
at 390, 768, 1440, 2242 and 3840px confirm a centered frame with no horizontal
overflow. Screenshot inspected at `.cache/home-backdrop-2242.png`.
Visual status: AWAITING_VISUAL_APPROVAL.
