# Creative Studio Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement these tasks in this session, then request one fresh review of the final changes.

**Goal:** Implement the approved hybrid landing page and carry the same design language through the creator app.

**Architecture:** Shared brand rail, page heading and semantic theme tokens support both public and app layouts. Landing content is server-rendered with an isolated illustrative media selector; app pages continue using their existing hooks and mutation flows.

**Tech Stack:** Next.js 16.2.1, React 19, TypeScript, Tailwind 4, existing shadcn components.

**Spec:** `docs/superpowers/specs/2026-11-16-creative-studio-design.md`

## Global constraints

- No new runtime dependencies or changes to API/auth/upload contracts.
- Keep the approved vertical rail, condensed display typography, contact strip, and primary action above the media.
- Preserve 320px usability, focus states, image fallbacks, and reduced-motion support.
- Leave the user's `example-rn.json` unchanged; retain uncommitted changes in the supplied checkout.

## Review focus

- Missing cover/output URLs must show a usable fallback rather than an empty `Image` source.
- Workflow/API failures and empty lists must not remain indefinite skeletons.
- Mobile navigation, account controls, billing records and generation forms must fit and remain operable.
- Feature-gated creation, team switching and credit links must retain their existing behavior.
- Landing actions must navigate to real discovery/auth routes; illustrations must be identified honestly.

### Task 1: Shared design and approved landing

**Files:** `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`, `src/components/ui/button.tsx`; new `src/components/studio/brand-rail.tsx`, `page-heading.tsx`, `media-reel.tsx`.

**Interfaces:** `BrandRail({ href?, note? })`, `PageHeading({ eyebrow?, title, description?, children? })`, `MediaReel()` are presentation components. Existing route URLs and `--font-display` remain stable.

- [x] Install Barlow Condensed through `next/font`, retain Figtree, set the approved semantic theme.
- [x] Create reusable rail/headings and the approved landing hero and media selector.
- [x] Add restrained below-hero process/priority sections and real CTA/footer links.
- [x] Verify TypeScript and targeted ESLint.

### Task 2: Creator app shell and pages

**Files:** `src/components/app-nav.tsx`, `src/app/(app)/layout.tsx`, app discover, workflows, generations, generate, billing and settings page presentation; new shared workflow card if useful.

**Interfaces:** Existing data hooks and mutations keep their signatures; existing team/auth/credit controls remain in `AppNav`.

- [x] Add the persistent rail and responsive account/navigation shell.
- [x] Apply poster headings, real workflow media, generous spacing and clear actions to discovery and workflow details.
- [x] Align generation, billing, creation and settings presentation, preserving form/mutation behavior.
- [x] Check loading, error, empty and missing-media states; verify TypeScript and targeted ESLint.

### Task 3: Verification and final review

- [x] Run production build and inspect any errors before making completion claims.
- [x] Request an independent source review against the spec and fix material regressions.
- [x] Attempt local preview/readiness checks and report limits accurately.
- [x] Update this checklist and summarize delivered behavior and validation.

## Execution record

- Baseline: `node node_modules/typescript/bin/tsc --noEmit` passed.
- Workspace: branch creation failed with filesystem permissions; use the supplied checkout without commits.
- Visual-only presentation changes use source/compiler/build checks rather than unit tests that mirror markup.

## Final validation

- Production build passed after review fixes (14 prerendered pages; all app routes compiled). Google font downloads required authorized network access.
- TypeScript passed. Targeted ESLint passed for the redesigned pages/components and shared UI changes. The generation form retains two existing `react-hooks/set-state-in-effect` errors, independently reproduced against HEAD; new form presentation/error UI adds no lint errors.
- Browser checked the landing page at 1280, 768, 390 and 320 pixels: no horizontal overflow, loaded display font, primary CTA before media and within the initial 1000px viewport. Media selection correctly updates the caption and leaves exactly one selection.
- Browser checked discovery, generation history, billing and workflow creation at 320px: no horizontal page overflow. Signed-in team/account actions, real uploads and checkout were not exercised. Existing billing checkout remains its original coming-soon handler.
- Independent source review completed. Fixed focused Select option contrast, mobile billing loading widths and skip-link scope. No outstanding material review findings.
- Inspected desktop/mobile screenshots in `design-previews/implemented-1280.png` and `implemented-320.png`.
- Existing user preview on http://localhost:3000 returns HTTP 200 and the redesigned heading. Temporary QA browser and production server were shut down; user-owned preview was left running.
- Changes remain uncommitted in the original checkout because Git ref writes are restricted.
