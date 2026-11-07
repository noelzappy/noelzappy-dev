# Redesign Phase 1 — Vertical Slice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the homepage hero (with three working project pills) and the full Kekeh Mac case study at final quality, so Emmanuel can approve the look before the rest of the redesign is built.

**Architecture:** New design tokens and a global header + menu overlay replace the old narrow shell. Pages split into two route groups: `(studio)` for full-bleed redesigned pages and `(classic)` for not-yet-redesigned pages (which keep the narrow column). Project frontmatter gains optional v2 fields; the case-study route renders the new template only for projects that have them. Device "studio shots" are a CSS/SVG frame component around real screenshots — no image pipeline dependency.

**Tech Stack:** SvelteKit 2, Svelte 5 runes, Tailwind 4 (tokens in `src/routes/layout.css`), adapter-cloudflare, Vitest (server + browser/Playwright projects), bun.

**Spec:** `docs/superpowers/specs/2026-11-07-product-engineer-redesign-design.md` (approved). Phases 2–5 get their own plans after this slice is approved.

## Global Constraints

- No new npm dependencies without Emmanuel's approval (fonts are self-hosted woff2 files in `static/fonts`, not packages).
- No decorative gradients, blobs, grain, 3D, or AI-generated imagery. Every image is a real product screen.
- Copy is first person; no superlatives; numbers only if Emmanuel confirms them. Never mention AppStract Labs.
- Dark-first tokens: ink bg ~`#0E0E0D`, text ~`#F3EFE6`, muted ~`#9A988F`; light/menu paper ~`#F3EFE6` with ink text; accent warm gold ~`#E9C98F` (dark) with an AA-contrast darker variant on light. Final values must pass WCAG AA.
- Sans: existing self-hosted Inter. Display serif: chosen in Task 2 from Instrument Serif / Fraunces.
- All motion respects `prefers-reduced-motion: reduce` (no transitions/animations then).
- `/projects` stays canonical; nav label is "Work". No URL changes in this phase.
- Header right: Accra local time (`Africa/Accra`) + availability string from one config constant.
- Booking link stays `CAL_USERNAME`/`CAL_EVENTS.intro` from `src/lib/cal.js`.
- Commits: only after Emmanuel says commits are OK; on branch `feat/redesign-slice` (cut from `feat/consulting-repositioning`). **No `Co-Authored-By` or any AI attribution trailer** (Emmanuel's global rule). Never push or deploy.
- Every task ends green: `bun run lint`, `bun run test`, `bun run build`.

## Review Focus

1. **Prerendered clock:** pages are prerendered, so a server-rendered time would be frozen at build time → render the time only after mount (empty, fixed-width slot before). Test in Task 3.
2. **Touch devices:** no hover on phones → tapping a pill must navigate to the case study, never get stuck in a "hovered" state; pills scroll horizontally at 375px without page overflow. Test in Task 5 + slice gate (Task 8).
3. **Keyboard users:** pills must activate the hero preview on focus (not only hover), the menu must trap/return focus and close on Escape. Tests in Tasks 4 and 5.
4. **Projects without v2 fields:** the other 19 existing case studies must still render with the classic template — no crash on missing `built`/`brandColor`. Test in Task 6.
5. **Brand colour contrast:** a pill's hover field uses the project's `brandColor`; text on it must stay readable → each pill project declares `onBrand: 'light' | 'dark'` text and the test asserts it is present. Test in Task 5.

---

### Task 0: Baseline and branch

**Files:** none (git only)

- [ ] **Step 1:** Ask Emmanuel whether to commit the uncommitted `feat/consulting-repositioning` work as a baseline (spec §7 keeps parts of it). Do nothing until he answers.
- [ ] **Step 2:** If yes: commit it on `feat/consulting-repositioning` (message: `content: repositioning baseline before redesign`), then `git switch -c feat/redesign-slice`. If no: `git stash` is NOT acceptable — stop and ask how he wants to proceed.
- [ ] **Step 3:** Verify: `git status --short` is empty; `bun run test` passes (17 tests).

---

### Task 1: Route groups and layout shell

Split pages so redesigned ones can be full-bleed while the rest keep the narrow column.

**Files:**
- Modify: `src/routes/+layout.svelte` — keep `<svelte:head>` and CSS import; render `<SiteHeader />`, `{@render children()}`, `<Footer />` with no width constraint.
- Create: `src/routes/(classic)/+layout.svelte` — wraps children in `<div class="classic">` (the old `.site` column: `max-width: var(--measure)`, inline padding, vertical rhythm).
- Create: `src/routes/(studio)/+layout.svelte` — renders children full-bleed.
- Move with `git mv`: `about`, `contact`, `writing`, `work-with-me`, `projects/+page.*` (index) → `(classic)/`; `+page.svelte`, `+page.server.ts`, `page.svelte.spec.ts` → `(studio)/`; `projects/[slug]` → `(studio)/projects/[slug]`. `rss.xml`, `sitemap.xml`, `+error.svelte` stay at root.
- Modify: `src/routes/layout.css` — rename `.site` rules to `.classic`.
- Delete: `src/lib/components/navbar.svelte` (replaced in Task 4; until then `+layout.svelte` imports a temporary minimal `SiteHeader` stub that renders the wordmark link only).

**Interfaces:**
- Produces: route groups `(classic)` and `(studio)`; `SiteHeader` component path `src/lib/components/site-header.svelte` (stub now, real in Task 4).

- [ ] **Step 1:** Make the moves and layouts.
- [ ] **Step 2:** Verify no URL changed: `bun run build`, then confirm `.svelte-kit/cloudflare` contains `index.html`, `about.html`, `contact.html`, `work-with-me.html`, `projects.html`, `projects/susupaa-platform.html`, `writing.html`. Run `bun run test` — all pass (homepage test still passes; it is moved, not changed).
- [ ] **Step 3:** Commit `refactor: split routes into studio and classic layout groups`.

---

### Task 2: Design tokens and display serif

**Files:**
- Modify: `src/routes/layout.css` — replace token block with the new palette (Global Constraints), add `--font-display`, add a type scale as custom properties: `--step-display-xl`, `--step-display-l`, `--step-display-m`, `--step-heading`, `--step-body`, `--step-small`, `--step-caption` (each with a clamp() size and a matching `--lh-*` and `--tracking-*`). Dark is default (`:root`), light under `[data-theme='light']` and `prefers-color-scheme: light` without explicit theme. Keep variable names the classic pages already use (`--bg`, `--fg`, `--muted`, `--border`, `--accent`, `--accent-soft`, `--code-bg`).
- Create: `static/fonts/<chosen-serif>.woff2` (+ italic) and an `@font-face` with `font-display: swap`; preload it in `src/routes/+layout.svelte`.
- Create (temporary, deleted in Step 4): `static/specimen.html` — the two candidate serifs setting the real hero headline candidates (Task 5 Step 1) at 120px/72px/40px on the ink background, plus "Kekeh Mac" at display-xl.

- [ ] **Step 1:** Download Instrument Serif (regular + italic) and Fraunces (variable, opsz) woff2 from Google Fonts into `static/fonts/`; build `static/specimen.html`.
- [ ] **Step 2:** Screenshot `specimen.html` at 1440px and 375px (`bun run dev`, browser pane). Show Emmanuel; he picks one. **Blocking human step.**
- [ ] **Step 3:** Keep only the chosen font files; set `--font-display`; tune the scale so display-xl reads like Metalab's hero (light weight, tight leading ~0.95, slight negative tracking) and body stays at ~68ch.
- [ ] **Step 4:** Delete `static/specimen.html`. Verify contrast: muted on bg and accent on bg ≥ 4.5:1 in both themes (compute with any contrast checker; record the four ratios in the commit message body). `bun run lint && bun run test && bun run build` pass.
- [ ] **Step 5:** Commit `style: new tokens, type scale and display serif`.

---

### Task 3: Site config and Accra clock

**Files:**
- Create: `src/lib/shared/site.ts` — `export const SITE_TZ = 'Africa/Accra'`, `export const SITE_CITY = 'Accra'`, `export const AVAILABILITY = 'Booking Q1 projects'`.
- Create: `src/lib/shared/time.ts` — `formatLocalTime(date: Date, timeZone: string): string` using `Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone })`.
- Create: `src/lib/components/local-time.svelte` — renders `{SITE_CITY} <time>…</time>`; time string is `''` until `onMount`, then updates every 30s (clear interval on destroy). Fixed min-width so nothing shifts.
- Test: `src/lib/shared/time.test.ts`, `src/lib/components/local-time.svelte.spec.ts`

**Interfaces:**
- Produces: `formatLocalTime`, `SITE_TZ`, `SITE_CITY`, `AVAILABILITY`, `<LocalTime />`.

- [ ] **Step 1: Failing tests**

```ts
// time.test.ts
expect(formatLocalTime(new Date('2026-11-07T16:54:00Z'), 'Africa/Accra')).toBe('4:54 PM');
expect(formatLocalTime(new Date('2026-11-07T00:05:00Z'), 'Africa/Accra')).toBe('12:05 AM');
```
```ts
// local-time.svelte.spec.ts — after render, a <time> element exists and its text matches /^\d{1,2}:\d{2} (AM|PM)$/
```
- [ ] **Step 2:** Run `bun run test -- time local-time` → FAIL (modules missing).
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run → PASS. Also `bun run build` and confirm the prerendered `index.html` contains no `AM`/`PM` time string inside the header (`grep -c 'AM</time>\|PM</time>'` → 0).
- [ ] **Step 5:** Commit `feat: Accra local time and availability config`.

---

### Task 4: Site header and menu overlay

**Files:**
- Modify: `src/lib/components/site-header.svelte` — left: "Menu" pill button (`aria-expanded`, `aria-controls="site-menu"`); centre: wordmark "Emmanuel Yeboah" (display serif) linking `/`; right: `<LocalTime />` · `AVAILABILITY` (accent colour) · `<ThemeToggle />`. Transparent over full-bleed pages, sits in normal flow on classic pages (prop `overlay: boolean`, set by the `(studio)` layout via context or a page-level flag — implementer's choice, documented in the component).
- Create: `src/lib/components/site-menu.svelte` — full-screen paper-coloured overlay (`id="site-menu"`, `role="dialog"`, `aria-modal="true"`, labelled "Menu"). Left column: serif links **Work** `/projects` · **What I do** `/work-with-me` · **About** `/about` · **Writing** `/writing` · **Get in touch** `/contact`; under them a "Projects" label and the pill list (same data as Task 5). Right column: latest 3 writing posts as small cards (title + date) from `getPosts()`.
- Modify: `src/lib/components/theme-toggle.svelte` — styling only, to match the header.
- Create: `src/routes/+layout.server.ts` — `load` returns `{ pills: PillProject[], posts: PostMeta[] }`: `posts` = first 3 of `getPosts()` mapped to metadata only (no `component`); `pills` = `[]` in this task, switched to `getPillProjects()` in Task 5. `src/routes/+layout.svelte` passes both to `<SiteHeader>`.
- Test: `src/lib/components/site-menu.svelte.spec.ts`

**Interfaces:**
- Consumes: `LocalTime`, `AVAILABILITY` (Task 3); `getPillProjects()` (Task 5 — until Task 5 lands, pass `pills` as a prop; the header passes them in).
- Produces: `<SiteHeader overlay={boolean} />`, `<SiteMenu open={boolean} onclose={() => void} pills={PillProject[]} posts={PostMeta[]} />`.

- [ ] **Step 1: Failing tests** (`site-menu.svelte.spec.ts`)
  - clicking "Menu" sets `aria-expanded="true"` and shows a dialog named "Menu";
  - the dialog has links with exact names/hrefs: Work→`/projects`, What I do→`/work-with-me`, About→`/about`, Writing→`/writing`, Get in touch→`/contact`;
  - pressing Escape closes it and focus returns to the "Menu" button;
  - Tab from the last focusable element wraps to the first (focus trap).
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement. Body scroll locked while open. Overlay fades/slides in ~300ms; no transition under reduced motion.
- [ ] **Step 4:** Run → PASS; `bun run build`.
- [ ] **Step 5:** Commit `feat: site header with Accra time and menu overlay`.

---

### Task 5: Project v2 fields, Kekeh Mac content, and the homepage hero

**Files:**
- Modify: `src/lib/data/projects.ts` — add optional fields to `ProjectFrontmatter`:
  `engagement?: 'full-build' | 'team' | 'rescue' | 'website' | 'open-source'`,
  `stage?: 'startup' | 'business' | 'ngo' | 'own-venture'`, `built?: string[]`, `oneLine?: string`,
  `brandColor?: string`, `onBrand?: 'light' | 'dark'`, `heroImage?: string`, `deviceShots?: { src: string; alt: string; kind: 'phone' | 'browser' }[]`,
  `pill?: boolean`, `pillOrder?: number`, `impact?: { value: string; label: string }[]`.
  Add `'Backend' | 'Fintech'` to `ProjectCategory`. Export `type PillProject = Pick<ProjectData, 'slug' | 'title' | 'oneLine' | 'built' | 'brandColor' | 'onBrand' | 'deviceShots'>`.
- Modify: `src/lib/data/projects-loader.ts` — add `getPillProjects(): PillProject[]` (pill === true, sorted by `pillOrder`).
- Create: `src/content/projects/kekeh-mac.md` — slug `kekeh-mac`, kind `case-study`, role `Lead engineer`, client `Kekeh Mac`, status per Emmanuel, categories `[Mobile App, Web App, Backend, Fintech]`, engagement `full-build`, stage `startup`, built `[Driver app, Passenger app, API, Admin, Real-time dispatch]`, pill true, pillOrder 1, brandColor sampled from the app's primary green, onBrand chosen for AA, deviceShots (Task 5 Step 2), body written in Task 7.
- Modify: `src/content/projects/susupaa-platform.md` (pillOrder 2) and `src/content/projects/rbl-dating-app.md` (pillOrder 3) — add `oneLine`, `built`, `brandColor`, `onBrand`, `deviceShots`, `pill: true`. Do not change their bodies.
- Create: `static/portfolio/kekeh-mac/` — screens copied from `~/workspace/kekehmac/docs/design/current-screens/`: driver `03-home-online.png`, `05-heading-to-pickup.png`, `11-wallet.png`; passenger `03-home.png`, `11-tracking-driver-on-the-way.png`, `12-trip-complete.png`; resized to 1080px tall max (`sips -Z 1080`).
- Create: `src/lib/components/device-frame.svelte` — `kind: 'phone' | 'browser'`, `src`, `alt`, optional `width`. Phone: accurate modern-iPhone proportions (19.5:9 screen, ~12% corner radius, dynamic island, thin bezel with subtle edge highlight, soft realistic shadow). Browser: minimal chrome bar. Pure CSS/SVG; `<img loading>` and `decoding="async"`; `alt` required.
- Create: `src/lib/components/hero.svelte` — props `pills: PillProject[]`, `headline` (snippet or string), `intro: string`. Default state: headline (display-xl serif) bottom-centre-left, intro top-right, pill column bottom-left ending with "All work" → `/projects`. Active state (pill hovered **or focused**): background becomes the pill's flat `brandColor`, text colour from `onBrand`, project title in display-l, `oneLine`, `built.join(' · ')`, and up to two `DeviceFrame`s rising from bottom-right. Leaving (mouseleave of the pill list / blur) returns to default. Each pill is an `<a href="/projects/{slug}">`. Root carries `data-active={slug | ''}`. Cross-fade ~400ms ease-out; none under reduced motion. At ≤ 640px: pills become a horizontal scroll row under the intro, active state disabled (taps navigate).
- Modify: `src/routes/+layout.server.ts` — `pills: getPillProjects()` (menu now lists them).
- Modify: `src/routes/(studio)/+page.svelte` and `+page.server.ts` — render `<Hero>` first (load `pills: getPillProjects()`), then the existing sections inside a `.classic`-width wrapper (replaced in phase 3).
- Modify: `src/routes/(studio)/page.svelte.spec.ts` — update to the new hero; keep the existing list-section assertions.
- Test: `src/lib/data/projects-loader.test.ts`, `src/lib/components/hero.svelte.spec.ts`

**Interfaces:**
- Consumes: tokens (Task 2), `SiteHeader overlay` (Task 4).
- Produces: `getPillProjects()`, `PillProject`, `<DeviceFrame kind src alt width? />`, `<Hero pills headline intro />`, project slug `kekeh-mac`.

- [ ] **Step 1:** Draft 3 headline + intro candidates in Emmanuel's voice (no formula lines, no italic-second-line trick unless he wants it). Starting points: "I design and build software products, end to end." / "Apps, platforms and the systems behind them." / "From first screen to production." Emmanuel picks or rewrites. **Blocking human step.** Also ask him to confirm Kekeh Mac's live status.
- [ ] **Step 2: Failing tests**
  - `projects-loader.test.ts`: count becomes **21**; `getPillProjects().map(p => p.slug)` equals `['kekeh-mac', 'susupaa-platform', 'rbl-dating-app']`; each has `brandColor` matching `/^#[0-9a-f]{6}$/i`, `onBrand` in `['light','dark']`, `oneLine.length <= 90`, `built.length >= 1`, `deviceShots.length >= 1` with non-empty `alt`; every `deviceShots[].src` exists under `static/` (`fs.existsSync`). Featured-projects test unchanged (Kekeh Mac `featured: false` in this phase).
  - `hero.svelte.spec.ts`: renders an `h1` with the chosen headline; three pill links + "All work" with hrefs `/projects/kekeh-mac`, `/projects/susupaa-platform`, `/projects/rbl-dating-app`, `/projects`; hovering the Kekeh Mac pill sets root `data-active="kekeh-mac"` and shows its `oneLine` and `"Driver app · Passenger app · API · Admin · Real-time dispatch"`; **focusing** the SusuPaa pill (keyboard) sets `data-active="susupaa-platform"`; moving the pointer out of the pill list resets `data-active=""`; at viewport 375×812 (`page.viewport(375, 812)`) hovering a pill leaves `data-active=""` and the pill list's `scrollWidth` may exceed its `clientWidth` while `document.documentElement.scrollWidth === 375`.
- [ ] **Step 3:** Run → FAIL.
- [ ] **Step 4:** Implement data, assets, `DeviceFrame`, `Hero`, homepage wiring.
- [ ] **Step 5:** Run → PASS; `bun run lint && bun run build`.
- [ ] **Step 6:** Commit `feat: homepage hero with project pills and device frames`.

---

### Task 6: Case-study template

**Files:**
- Create: `src/lib/components/case-study.svelte` — props: the case-study data below. Layout: title in display-xl; meta row with labels **Engagement** · **Stage** · **What I built** (human labels: full-build→"Full build", team→"Team augmentation", rescue→"Fix & rescue", website→"Website", startup→"Startup", business→"Business", ngo→"Non-profit", own-venture→"Own venture"); full-bleed hero (`heroImage` if set, else a `brandColor` field with 2–3 `DeviceFrame`s); body HTML in a ~68ch column with the display serif for `h2`; inline images full-width-of-column; **Impact** row only when `impact.length > 0`; Stack; links (live / App Store / Google Play / repo, each only if present); "Next case study" with title link.
- Modify: `src/routes/(studio)/projects/[slug]/+page.server.ts` — also return `engagement`, `stage`, `built`, `brandColor`, `onBrand`, `heroImage`, `deviceShots`, `impact` (defaults `''`/`[]`), and `next: { slug, title } | null`.
- Modify: `src/lib/data/projects-loader.ts` — `getNextCaseStudy(slug: string): { slug: string; title: string } | null`: next among case studies that have a writeup, ordered as `getAllProjects()`, wrapping to the first; `null` if fewer than two.
- Modify: `src/routes/(studio)/projects/[slug]/+page.svelte` — if `data.built.length > 0` render `<CaseStudy>`, else render the existing template unchanged inside a `.classic` wrapper.
- Test: `src/lib/components/case-study.svelte.spec.ts`, `src/lib/data/projects-loader.test.ts` (extend)

**Interfaces:**
- Consumes: `DeviceFrame` (Task 5), v2 fields (Task 5).
- Produces: `<CaseStudy {...data} />`, `getNextCaseStudy`.

- [ ] **Step 1: Failing tests**
  - `case-study.svelte.spec.ts` with a fixture (title "Kekeh Mac", engagement `full-build`, stage `startup`, built `['Driver app','API']`, impact `[]`, next `{slug:'susupaa-platform', title:'SusuPaa Platform'}`): `h1` "Kekeh Mac"; text "Full build", "Startup", "Driver app · API" present; no element with text "Impact"; link "SusuPaa Platform" → `/projects/susupaa-platform`. Second render with `impact: [{value:'12k', label:'trips'}]` shows "Impact" and "12k".
  - `projects-loader.test.ts`: `getNextCaseStudy` of the last case study wraps to the first; result never equals the input slug.
  - Route-level: `bun run build` produces both `projects/kekeh-mac.html` (contains "What I built") and `projects/susupaa-platform.html` (classic template still renders; contains its existing title).
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run → PASS; check every one of the 20 existing project pages still builds (`ls .svelte-kit/cloudflare/projects/*.html | wc -l` equals the number before this task).
- [ ] **Step 5:** Commit `feat: case-study template with engagement, stage and what I built`.

---

### Task 7: Kekeh Mac case-study copy

**Files:**
- Modify: `src/content/projects/kekeh-mac.md` (body + `excerpt` + `oneLine`), sources: `~/workspace/kekehmac/README.md`, `docs/deployment/production-do-app-platform.md`, `docs/superpowers/specs/2026-06-24-driver-financial-services-design.md`, and Emmanuel's answers.

- [ ] **Step 1:** Draft sections: Introduction · The goal (one line) · Real-time dispatch (Socket.IO + Redis geo, corridor trips) · Two apps, one platform (driver + passenger Expo apps, admin, shared packages) · Money for drivers (wallet, savings, loans, insurance, Monime) · Built for Freetown (Krio, safety features) · Stack. Plain, specific, first person, no superlatives, no unconfirmed numbers. Inline images: passenger tracking, driver wallet, trip complete (DeviceFrame-styled via markdown image class or component — implementer's choice, consistent with Task 6).
- [ ] **Step 2:** Emmanuel reviews and edits; add `impact` only with numbers he confirms. **Blocking human step.**
- [ ] **Step 3:** `bun run build`; grep build output for "AppStract" → 0 matches.
- [ ] **Step 4:** Commit `content: Kekeh Mac case study`.

---

### Task 8: Slice quality gate and approval

**Files:** none unless fixes are needed (fixes go in the file that owns them, with their own commit).

- [ ] **Step 1:** `bun run build && bun run preview`. Screenshot `/` (default + each pill active) and `/projects/kekeh-mac` at 375px and 1440px, dark and light (16+ shots). Open the matching Metalab pages (homepage, a case study) at the same widths.
- [ ] **Step 2:** Self-review against spec §8: anything generic (spacing, type rhythm, image crispness, frame realism, alignment) gets fixed before Emmanuel sees it. No horizontal page scroll at 375px (`document.documentElement.scrollWidth === clientWidth`). Keyboard pass: Tab through pills and menu. Reduced-motion pass (emulate `prefers-reduced-motion: reduce`): no transitions.
- [ ] **Step 3:** Lighthouse mobile on the preview for `/` and `/projects/kekeh-mac`: Performance ≥ 90, Accessibility ≥ 95, SEO 100, LCP < 2.5s. Fix and re-run until met.
- [ ] **Step 4:** `bun run lint && bun run test && bun run build` pass; the existing `bun run check` error (`page.svelte.spec.ts` mock missing `status`) is fixed.
- [ ] **Step 5:** Present to Emmanuel: preview link, the screenshots side by side with Metalab, Lighthouse numbers. **Blocking human approval.** Phases 2–5 are planned only after this approval.

---

## Later phases (outline only; each gets its own plan)

- **Phase 2 — studio shots for all featured projects:** pill/device data for PayLTE, Tripli, Hakanow, Alvi Beauty; screens from repos and live-site captures.
- **Phase 3 — work index and case studies:** `/projects` rows + filters; new case studies (Tripli, PayLTE, Hakanow, Brif, Edromart, Websites; fleet, tripwire); restyle all existing ones; featured set per spec §6; dropped-slug revival in `redirects.ts` + `_redirects` + tests; homepage sections 2–6.
- **Phase 4 — What I do, About, Writing, Contact:** spec §5.4–5.5; principles and testimonials with Emmanuel.
- **Phase 5 — full quality gate** (spec §8) across every page, then hand over for deploy.
