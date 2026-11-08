# Redesign Phase 3 — Presentation, Motion and Pre-merge Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make product screens and the hero feel native to the site (no dead space, frameless composed screens), add signature + subtle motion, and clear every pre-merge finding from the phase-2 final review.

**Architecture:** One `ProjectShowcase` component renders each project's fixed screen composition from data and replaces `DeviceFrame`/`work-thumb` everywhere. The hero is rebuilt around a width-scaled headline, a drifting screen strip and centred showcase compositions. Motion is a small `src/lib/motion/` module (shared-element names, word-rise, scroll fade-up) layered on the existing page-reveal. Content/a11y/perf fixes from the final review land first so later tasks build on correct data.

**Tech Stack:** SvelteKit 2, Svelte 5 runes, Tailwind 4 tokens (`src/routes/layout.css`), View Transitions API, IntersectionObserver, Vitest (browser + node), bun.

**Spec:** `docs/superpowers/specs/2026-11-07-product-engineer-redesign-design.md` (§12 Phase 3 is binding; §2, §5.4, §8 still apply). Final-review findings: `.superpowers/sdd/2026-11-07-redesign-phase2-all-pages/` (final review summarised in Task 1).

## Global Constraints

- Display type Inter tokens; no serif; no decorative gradients, blobs, grain, glow, 3D, AI imagery.
- Screens are real product screenshots only; frameless (site radius `--radius-screen`, one soft shadow); phones get a thin bezel only; never cropped by their container; same scale within a composition.
- No exposed dead space at 1280, 1440, 2000 and 2560px widths (checked by screenshots in Task 7).
- All motion off under `prefers-reduced-motion: reduce`; no scroll-jacking; motion never delays navigation beyond the existing reveal.
- First person, no invented facts; never mention AppStract Labs.
- Every pre-existing URL keeps resolving (`src/lib/urls.test.ts` stays green).
- No new npm dependencies. Commits on `feat/redesign-slice`, no AI attribution trailers, never push or deploy.
- Every task ends with `bun run lint && bun run check && bun run test && bun run build` green and pristine, run serially.

## Review Focus

1. **Shared-element morph with lists:** `view-transition-name` values must be unique per page — a project shown twice on one page (hero pill + work row) must not duplicate a name. Test in Task 5.
2. **Morph to a project without a case study:** navigation from a row that links off-site or to a project with no writeup must fall back to the normal curtain/none. Test in Task 5.
3. **Drifting strip and focus:** the ambient strip must be `aria-hidden`, pause on hover/focus within, and never trap or receive focus. Test in Task 4.
4. **Very wide and very short screens:** hero at 2560×1440 and 1280×600 — no dead band, no clipped composition, pills reachable. Test in Task 4.
5. **Production vs dev testimonials:** placeholders visible in `bun run dev`, absent in the production build. Test in Task 1.

---

### Task 1: Final-review fixes (content, a11y, perf, test stability)

**Files (all modify unless noted):**

- `src/lib/components/testimonials.svelte` — render entries with `placeholder: true` only when `dev` (`$app/environment`); section hidden when nothing renders.
- `src/routes/(studio)/work-with-me/+page.svelte` — "Build the whole product" proof → Kekeh Mac, Givio (`/projects/givio-platform`), GrowingGift (`/projects/growinggift-platform`); keep other proofs. Nav label in `site-menu.svelte` becomes "Work with me" (matches the h1 and URL).
- `static/llm-full.txt` — rewrite the Site map lines to the current pages (homepage = hero; `/work-with-me` = "how I work with teams: whole-product builds, team augmentation, rescues and migrations, websites"; `/about` = story + timeline).
- `src/content/projects/*.md` — add `Backend` to categories of SusuPaa, RBL, Fetch Agent, Alvi Beauty (bodies support it) and `Fintech` to SusuPaa; `src/routes/(studio)/projects/+page.svelte` hides any filter chip whose result set is empty.
- `src/routes/(studio)/contact/+page.svelte` meta description → "Get in touch about a product you need built, a team that needs a senior engineer, or a system that needs fixing."; `src/routes/(studio)/writing/+page.svelte` description + intro → "Notes on building software products: engineering, AI, tools and freelancing."
- `/projects` a11y: visually hidden `<h2>Case studies</h2>` before the rows; `work-row` CTA gets `<span class="sr-only"> {title}</span>`; add a global `.sr-only` utility in `layout.css` if missing.
- `src/routes/+error.svelte` wrap content in `<main>`; `src/routes/sitemap.xml/+server.ts` add `/contact`.
- `src/lib/shared/constants.ts` `SITE_KEYWORDS` → product-engineer set (keep names, Ghana, Africa, mobile money, React Native, Expo, Next.js, SvelteKit, Go, TypeScript, payments); `knowsAbout` → "Mobile apps", "Web platforms", "Backend systems", "Payment integrations", "Ledgers", "Database migrations", "React Native", "Go", "TypeScript". `README.md` first line → product engineer.
- `src/content/writing/how-i-migrated-170k-users-from-php-to-node-js-without-stopping-the-world.md` — add alt to the image (describe it), fix the empty heading.
- `src/app.html` — load gtag after `window` `load` (inject the script element in a load listener; keep `dataLayer`/`gtag` config identical).
- `src/routes/(studio)/projects/[slug]/+page.svelte` — delete the dead legacy (non-v2) branch.
- Skip link "Skip to content" as the first focusable element in `src/routes/+layout.svelte` targeting `#main` (give every page's `<main>` `id="main"` via the layout).
- `vite.config.ts` browser project: `optimizeDeps: { include: ['js-yaml'] }`.
- `src/lib/components/hero.svelte.spec.ts` — replace timing-sensitive waits with `expect.poll` or emulate reduced motion so transitions are instant.
- Tests: `testimonials.svelte.spec.ts` (dev flag mocked false → no placeholder rendered, section absent), work-with-me spec (new proof hrefs, each a writeup with `engagement: 'full-build'`), projects spec (h2 present; CTA accessible names unique; Websites chip hidden while empty), error spec (`main` landmark), sitemap test (`/contact` present).

- [ ] Step 1: failing tests above → Step 2: run → FAIL → Step 3: implement → Step 4: run → PASS; `bun run build` then `grep -c "Client quote goes here" .svelte-kit/cloudflare/work-with-me.html` → 0 → Step 5: commit `fix: pre-merge content, a11y and perf findings`.

---

### Task 2: ProjectShowcase — one frameless composition per project

**Files:**

- Modify `src/lib/data/projects.ts` — add `showcase?: { layout: 'web-phones' | 'phones' | 'web'; web?: Shot; phones?: Shot[] }` where `Shot = { src: string; alt: string }` (phones 1–3). Keep `deviceShots` for now; a loader helper `getShowcase(project): Showcase | null` derives a showcase from `deviceShots` when `showcase` is absent (first browser shot → web, up to 2 phone shots → phones; layout from what exists).
- Create `src/lib/components/project-showcase.svelte` — props `showcase: Showcase`, `brandColor?: string`, `size: 'hero' | 'row' | 'case'`, `name?: string` (view-transition-name, Task 5). Renders frameless screens: web screen with `--radius-screen` and one soft shadow; phones with a thin (≈1.5% width) bezel in near-black, radius matched to the screen, same soft shadow. Layout presets: `web-phones` — web screen large, two phones overlapping its lower-right/left edges at a consistent scale; `phones` — 2–3 phones in a slight stagger; `web` — web screen alone. The composition scales to its container (container query units), is always fully visible (`object-fit: contain` semantics on the group), never cropped.
- Add `--radius-screen` and `--shadow-screen` tokens to `src/routes/layout.css` (one shadow definition used everywhere).
- Replace usages: hero (Task 4 rebuilds it; for now swap its shot rendering to `ProjectShowcase size="hero"`), `work-thumb.svelte` → `ProjectShowcase size="row"` on the brand field, `case-study.svelte` top → `ProjectShowcase size="case"`. Delete `device-frame.svelte` once unused.
- Data: add explicit `showcase` to the six case studies with the best screens (kekeh-mac: web? none → `phones` with passenger tracking, driver heading-to-pickup, passenger home; susupaa: `web` dashboard; rbl: `phones`; built: `phones`; givio: `web`; voltax: `web`; others derive).
- Test: `project-showcase.svelte.spec.ts`, loader test for `getShowcase`.

- [ ] Steps: failing tests (renders one `img` per shot with alt; `web-phones` renders web + 2 phones; no element with class `browser-chrome`; root has no overflow — every img's rect inside the root's rect at 3 container widths; `getShowcase` derives from deviceShots and returns null when no shots) → implement → pass → screenshots of /projects and /projects/susupaa-platform at 1440 and 2000 → commit `feat: frameless project showcase compositions`.

---

### Task 3: Homepage = hero + footer

**Files:**

- Modify `src/routes/(studio)/+page.svelte` + `+page.server.ts` — remove Selected work, What I do, Track record, Writing sections and their data loading. Delete `work-tile.svelte` (+ spec) if unused. Keep `getFeaturedProjects` if used elsewhere (grep), else leave it (data API).
- Modify `src/routes/(studio)/page.svelte.spec.ts` — assert the hero exists and none of the removed section headings render.

- [ ] Steps: failing spec → implement → pass → commit `feat: homepage is the hero`.

---

### Task 4: Hero rebuild — no dead space

**Files:**

- Modify `src/lib/components/hero.svelte`:
  - Headline sized by viewport width (e.g. `font-size: clamp(var(--step-display-l), 7.2vw, 11rem)`, tuned so "I design and build software products, end to end." fills ~70–80% of the content width at 1440–2560) with the existing short-height caps; intro sits beside the headline's top line on wide screens (grid: headline spans, intro in the right column aligned to the headline cap height), stacked on narrow.
  - **Ambient strip (default state):** a horizontal band between the header and the headline showing real screens (from all pill projects' showcases, frameless, `size="row"` scale) drifting slowly leftwards in a seamless loop (CSS animation on a duplicated track, ~60–90s per loop), `aria-hidden="true"`, `inert`, pauses while the pill list is hovered/focused and when the tab is hidden; static (no animation, first N screens) under reduced motion. Images `loading="lazy"` except the first two.
  - **Active state:** `ProjectShowcase size="hero"` centred vertically in the right half (fills ~45–55% of the hero width, fully visible); text column (title, oneLine, built) on the left above the pills. Hidden project layers' images get `fetchpriority="low"` and `loading="lazy"`.
  - Remove any now-unused stage/shot-set code.
- Modify `src/routes/+layout.server.ts` — stop shipping `deviceShots`/showcases for every route: layout returns only `{slug, title}` pills for the menu; the homepage `+page.server.ts` loads full pill data.
- Test: extend `hero.svelte.spec.ts` — strip root `aria-hidden="true"` and contains no focusable elements; at 2560×1440 and 1440×900 the vertical gap between the strip's bottom and the headline's top is ≤ 12vh and the strip is non-empty; at 1280×600 and 375×812 all pills are within the viewport or the pill row scrolls without page overflow; active state: showcase root rect fully inside the hero rect; reduced motion: strip track has `animation-name: none`.

- [ ] Steps: failing tests → implement → pass → headless screenshots default + each pill active at 1280×720, 1440×900, 2000×1200, 2560×1440, 375×812 → commit `feat: hero without dead space, drifting work strip`.

---

### Task 5: Motion — shared-element morph + subtle motion

**Files:**

- Create `src/lib/motion/shared.ts` — `showcaseName(slug: string): string` → `project-${slug}` (CSS-ident-safe); only ONE element per page may carry a given name at a time.
- Modify `src/lib/transitions/page-reveal.ts` — when the navigation target is `/projects/<slug>` with a writeup AND the source page currently has an element with `view-transition-name: project-<slug>` (the clicked pill's active showcase or the clicked row's showcase), run a **morph transition** instead of the curtain: the root cross-fades (≈350ms), the named showcase group animates from source to target geometry (≈550ms, ease-in-out), and the case-study title rises after it. Otherwise keep the curtain. Reduced motion → no transition. `shouldReveal` rules unchanged.
- Apply names: hero active project's showcase (only the active one), work-row showcase (each row its own slug; hero isn't on /projects so no duplicates), case-study top showcase.
- Create `src/lib/motion/word-rise.ts` — action `use:wordRise` splitting a heading's text into word spans (preserving the accessible name via the original text on `aria-label` and `aria-hidden` spans) that rise 0.4em → 0 with 40ms stagger on first mount; apply to the hero headline and `PageHeader` h1 (not when the page-reveal title rise already runs — skip if `html.reveal-active`).
- Create `src/lib/motion/fade-up.ts` — action `use:fadeUp` using IntersectionObserver, once per element, 12px rise + fade over 500ms; apply to `Section` bodies and work rows.
- Hero: active showcase screens stagger in (web first, then phones 80ms apart).
- Tests: `shared.test.ts` (name format/escaping), `page-reveal.test.ts` (morph chosen only when a matching named element exists and the target has a writeup; external/no-writeup → curtain/none), `word-rise` spec (accessible name equals original text; reduced motion → no spans animated), `fade-up` spec (class added on intersect; reduced motion → visible immediately), and a uniqueness check: rendering /projects never has two elements with the same `view-transition-name`.

- [ ] Steps: failing tests → implement → pass → headless sampling of a pill→case-study morph (frames at 100/300/550ms show the showcase moving, not the curtain) → commit `feat: shared-element morph into case studies and subtle motion`.

---

### Task 6: Case-study layout on the site grid

**Files:**

- Modify `src/lib/components/case-study.svelte` — narrative prose on the `Section` grid (label column + content column, like posts), not a centred column; top uses `ProjectShowcase size="case"` on the brand field, fully visible, no dead band above/below at 2000px.
- Modify `src/content/projects/kekeh-mac.md` — add `featuredImage` (a WebP of its showcase screen) so og:image isn't the portrait.
- Test: case-study spec — prose left edge equals a Section body's left edge at ≥768px; showcase rect inside the hero field rect.

- [ ] Steps: failing test → implement → pass → screenshots 1440/2000/375 → commit `fix: case-study narrative on the site grid`.

---

### Task 6b: Site email + Forge intake form

Emmanuel (2026-11-08): the site's email becomes `emmanuel@noelzappy.com` everywhere (Cloudflare Email Routing will forward `me@noelzappy.dev` later). Add the inquiry form from `~/workspace/forge/docs/handover/ADDENDUM_INTAKE_FORM.md` to `/work-with-me`.

**Files:**

- Replace every `me@noelzappy.dev` in `src/**` and `static/llm-full.txt` (footer, contact, about, work-with-me, JSON-LD `email`, constants) with `emmanuel@noelzappy.com`; keep a test that no `me@noelzappy.dev` remains in the build output.
- Create `src/lib/components/inquiry-form.svelte` per the addendum: fields Name*, Work email* (`type=email`), Company, "What's going on?"* (20–2000 chars), hidden honeypot `website` (off-screen, `tabindex=-1`, `autocomplete=off`, `aria-hidden`), Cloudflare Turnstile widget (site key from `PUBLIC_TURNSTILE_SITE_KEY`; script loaded only on this page, only when the key is set). POST JSON `{name,email,company,message,website,turnstile_token}` to `PUBLIC_FORGE_INQUIRY_URL` (from `$env/dynamic/public`). Client validation with errors tied to fields (`aria-describedby`), submit disabled while sending, success replaces the form with "Thanks — I'll get back to you within one working day.", failure/network/URL unset shows "Something went wrong. Email me directly at emmanuel@noelzappy.com." and keeps the text. Focus moves to the success or error message. No analytics.
- Place it in the `#call` section of `src/routes/(studio)/work-with-me/+page.svelte` under the booking button with the line "Prefer to write it down? Tell me what's breaking and I'll reply within one working day."; styled in the site's language (labels small caps eyebrow style, inputs with hairline borders, accent focus ring), works at 375px.
- `env.example`: add `PUBLIC_TURNSTILE_SITE_KEY` and `PUBLIC_FORGE_INQUIRY_URL`.
- Tests: `inquiry-form.svelte.spec.ts` — required/length/email validation messages tied to fields; honeypot not focusable and not in the accessibility tree; with the URL unset, submit shows the email fallback and keeps the message; mocked fetch `{ok:true}` shows the thanks message and focuses it; failure keeps text; button disabled while pending.

- [ ] Steps: failing tests → implement → pass → screenshot /work-with-me#call at 1440 and 375 → commit `feat: site email and Forge inquiry form`.

---

### Task 7: Gate and sign-off package

**Mobile pass (Emmanuel asked 2026-11-08 — required, not optional):**

- Widths 360×780, 375×812, 414×896, 430×932 (portrait), 844×390 (landscape), 768×1024 and 1024×1366 (tablet): every page, dark + light — no horizontal scroll, no clipped text or screens, no header overlap, comfortable reading measure.
- Tap targets ≥ 44×44 CSS px for pills, Menu, theme toggle, filter chips, footer links, form fields and buttons (automated check in a spec that measures every interactive element at 375px).
- Real WebKit: run the site in Mobile Safari on the iOS Simulator (Xcode simulator on this Mac) against the dev/preview server — hero (svh units, strip animation, tap on pill navigates), menu overlay (scroll lock, focus), page reveal + morph (View Transitions in Safari; graceful fallback if unsupported), inquiry form (keyboard, Turnstile, autofill), case-study scroll and fade-up. Screenshots into the plan workspace; fix issues in owning files.
- Reduced motion on iOS (Settings → Accessibility → Reduce Motion) → no animation.

- [ ] Step 1: Headless screenshots of every page at 375×812, 1280×720, 1440×900, 2000×1200, 2560×1440, dark + light → `.superpowers/sdd/<this plan>/screens/`. Review each for exposed dead space, clipped screens, misalignment, header overlap; fix in owning files (own commits).
- [ ] Step 2: Lighthouse mobile on `bun run preview` for `/`, `/projects`, `/projects/kekeh-mac`, `/work-with-me`, `/about`, `/writing` — targets Perf ≥ 90, A11y ≥ 95, SEO 100, LCP < 2.5s; table in report.
- [ ] Step 3: Motion check in headless Chromium: curtain on normal links; morph on pill/row → case study; none on back/forward and reduced motion; strip pauses on hover.
- [ ] Step 4: `bun scripts/deploy-check.ts` (expected: passes the testimonial check in production build now; prints TODO warnings), full suite green, build greps → 0.
- [ ] Step 5: Present screenshots (2000px set first), Lighthouse table and the rulings list to Emmanuel. **Blocking human sign-off.**
