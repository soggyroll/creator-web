# Soggy Roll creative studio redesign

## Intent and approval

Redesign the public landing page and signed-in creator app, starting with the landing page. The user approved `design-previews/studio-hybrid.html` with “perfect! this ones perfect.” This file records that approved composition and the implementation choices needed to apply it to the existing app.

## Visual design

Use the poster's vertical left brand rail and Barlow Condensed display type, the contact sheet's media strip, a charcoal background, warm white text, and electric yellow actions. Retain generous spacing: earlier dense grids, tiny labels, and multiple competing hero elements were rejected. The primary landing action is a substantial yellow “Find your starting point” link before the media strip. Body text uses Figtree.

## Approaches

Creative studio, minimal product, and art gallery were considered; the user selected creative studio. Open split and centered layouts were too conventional. The poster and contact sheet were both liked, leading to the approved hybrid. Preserve its specific geometry rather than introducing another alternative.

## Scope

- Public landing: approved hero, interactive illustrative media strip, compact process and priority explanations below the hero, final signup action, privacy and terms links.
- Shared presentation: typography, accessible semantic colors, spacing, button treatment, brand rail and page headings.
- App: responsive navigation retaining team selection, account controls, feature-gated workflow creation and credit balance. Apply the design to discovery, workflow details, generation setup/history/detail, billing, workflow creation and team settings through shared layout and targeted presentation edits.
- Existing route destinations, auth flows, API contracts, uploads, batch submission and billing backend remain authoritative.

## Constraints and states

Use existing Next.js 16.2.1, React 19, Tailwind 4, shadcn components and data hooks; no new runtime dependencies. Follow installed Next.js documentation. Public content should render on the server; isolate the media selection interaction in a small client component. Illustrative artwork must be labeled as such; real workflow covers and generation outputs remain API-driven. Never render an empty image source.

At 320px, preserve the narrow brand rail, stack the invitation and CTA before media, and keep navigation/actions reachable without horizontal page overflow. Provide keyboard focus, semantic links/buttons, accessible selection state, loading/error/empty states, responsive image sizes and reduced-motion support. Do not invent prices, customers or performance claims. Retain existing priority descriptions without treating estimates as new guarantees.

## Verification

Baseline TypeScript passes. Run TypeScript, targeted ESLint and production build after changes. Browser preview was initially unavailable in the restricted environment; the implementation was subsequently checked with an authorized headless Edge instance. Review the final source for functional regressions and mobile layout constraints. Authenticated interactions and live upload/billing execution require the user's account and are not covered by the signed-out browser checks.

## Implementation decisions

Work in the supplied checkout with uncommitted changes because branch creation is filesystem-restricted. Existing `example-rn.json` belongs to the user and must not be changed. Retain the design previews for reference. A visual redesign does not require mirrored component unit tests; use compiler/build checks and targeted behavior verification instead.
