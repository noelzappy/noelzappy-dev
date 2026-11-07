# Redesign Phase 2 — All Pages + Page Reveal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring every page of noelzappy.dev into the new visual language established by the phase-1 slice, and add a reveal transition on every navigation.

**Architecture:** All pages move into the full-bleed `(studio)` route group and are built from a few shared primitives (page header, section, work row, footer) on the existing tokens. The `(classic)` group and `.classic` CSS are deleted at the end. The reveal uses the View Transitions API from the root layout.

**Tech Stack:** SvelteKit 2, Svelte 5 runes, Tailwind 4 tokens in `src/routes/layout.css`, Vitest (browser + node), bun.

**Spec:** `docs/superpowers/specs/2026-11-07-product-engineer-redesign-design.md` (§3.4 page reveal, §4–§5 pages, §8 quality bar). Builds on `plans/2026-11-07-redesign-phase1-vertical-slice.md` (tasks 1–7 done).

## Global Constraints

- Display type is Inter via `var(--font-display)` and the `--step-display-*`, `--lh-*`, `--tracking-*`, `--weight-display-*` tokens. No serif.
- No decorative gradients, blobs, grain, glow, 3D or AI imagery. Flat fields, real screenshots only, `DeviceFrame` for phone/browser screens.
- First person, plain copy, no superlatives, numbers only if Emmanuel confirmed them. Never mention AppStract Labs.
- Every URL that exists today keeps resolving (scripted check in Task 9). `/projects` stays canonical; nav label "Work".
- All motion respects `prefers-reduced-motion: reduce`.
- No horizontal page overflow at 375px; WCAG AA contrast; keyboard reachable.
- Overlay header (transparent, absolute) on every page once it is in `(studio)`; page tops leave room for it via one shared token `--header-h` (introduce in Task 2, replace the `6rem` magic numbers).
- No new npm dependencies. Commits on `feat/redesign-slice`, no AI attribution trailers, never push or deploy. Every task ends with `bun run lint && bun run check && bun run test && bun run build` green and clean test output.

## Review Focus

1. **Reveal on slow navigations:** a navigation whose data takes long must not leave the screen covered — the transition starts only when the new page is ready (`onNavigate` returns after `navigation.complete`). Test in Task 1.
2. **Back/forward and hash links:** history navigation and same-page `#call` anchors must not play a full-page wipe; the menu must close on any navigation (deferred Task 4 minor). Tests in Task 1.
3. **Projects without screenshots:** work rows and case studies for projects with no images must still look intentional (brand-colour field + title), never a broken image. Test in Task 3.
4. **Draft posts:** the draft post must not appear in any production page, list, feed or sitemap after the writing restyle. Test in Task 8.
5. **Old URLs:** `/work/*`, `/notes/*`, dropped project slugs and every current page still resolve after files move groups. Scripted in Task 9.

---

### Task 1: Page reveal transition (+ menu closes on navigation)

**Files:**

- Create: `src/lib/transitions/page-reveal.ts` — `shouldReveal(from: URL | null, to: URL | null, type: string): boolean` (false when either is null, when only the hash differs, when `type === 'popstate'`, or when `matchMedia('(prefers-reduced-motion: reduce)')` matches) and `setupPageReveal(): void` which calls SvelteKit `onNavigate` and, when `shouldReveal` and `document.startViewTransition` exist, returns a promise that starts the transition and resolves after `navigation.complete`.
- Modify: `src/routes/+layout.svelte` — call `setupPageReveal()`.
- Modify: `src/routes/layout.css` — `::view-transition-old(root)` / `::view-transition-new(root)` and a `::view-transition-group(reveal-panel)` (or equivalent pseudo-element approach) giving: ink panel (`--bg`) wipes upward off-screen over ~650ms ease-in-out, new page's `h1` rises 24px → 0 with fade (use `view-transition-name: page-title` on page h1s via a shared class `.page-title`). All inside `@media (prefers-reduced-motion: no-preference)`.
- Modify: `src/lib/components/site-header.svelte` — `afterNavigate` closes the menu (Task 4 deferred minor); drop per-link `onclick` closers in `site-menu.svelte` if now redundant.
- Test: `src/lib/transitions/page-reveal.test.ts` (node), `src/lib/components/site-menu.svelte.spec.ts` (extend)

**Interfaces:**

- Produces: `shouldReveal`, `setupPageReveal`, CSS class `.page-title` (pages put it on their h1 so the title rises).

- [ ] **Step 1: Failing tests** — `shouldReveal(new URL('https://x/a'), new URL('https://x/b'), 'link') === true`; same path different hash → false; `'popstate'` → false; `from === null` → false; with `matchMedia` stubbed to reduce → false. Menu spec: open menu, trigger a navigation (call the `afterNavigate` callback path via `goto` in the test or by clicking a nav link) → dialog closed and `document.body.style.overflow === ''`.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement; reveal must not block when `startViewTransition` is absent.
- [ ] **Step 4:** Run → PASS. Manual: in Chrome at the dev server, click Menu → Work → a case study → back; the wipe plays on link navigation, not on back; with reduced motion emulated, nothing animates.
- [ ] **Step 5:** Commit `feat: page reveal transition on navigation`.

---

### Task 2: Shared page primitives and footer

**Files:**

- Create: `src/lib/components/page-header.svelte` — props `eyebrow?: string`, `title: string`, `intro?: string`; renders eyebrow (small caps, muted), `h1.page-title` in display-xl, intro (body-l, max ~52ch). Top padding uses `var(--header-h)`.
- Create: `src/lib/components/section.svelte` — props `label?: string`, `id?: string`; children; consistent section rhythm and a top hairline (`--border`) like Metalab's index rows.
- Modify: `src/routes/layout.css` — add `--header-h`, `--page-gutter` (clamp ~16px→48px), `--page-max` (~1440px); replace `6rem` header magic numbers in case-study and legacy padding.
- Modify: `src/lib/components/footer.svelte` — Metalab-style footer, personal: large display line "Have something to build?" with two big links "Book a 15-minute call" (→ `/work-with-me#call`) and "me@noelzappy.dev" (mailto), then a row of small links (GitHub, LinkedIn, X, RSS), © line, and the Accra `LocalTime`. Full width (`--page-max`, `--page-gutter`), no `wide` prop needed once all pages are studio.
- Test: `src/lib/components/page-header.svelte.spec.ts`, `src/lib/components/footer.svelte.spec.ts`

**Interfaces:**

- Produces: `<PageHeader eyebrow? title intro? />`, `<Section label? id?>`, tokens `--header-h`, `--page-gutter`, `--page-max`.

- [ ] **Step 1: Failing tests** — PageHeader renders an `h1` with class `page-title` and the title text; omits eyebrow/intro elements when not given. Footer has a heading "Have something to build?", links named "Book a 15-minute call" → `/work-with-me#call` and "me@noelzappy.dev" → `mailto:me@noelzappy.dev`, and links GitHub/LinkedIn/X/RSS with the current hrefs.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement. **Step 4:** Run → PASS; check footer at 375px and 1440px in the dev server.
- [ ] **Step 5:** Commit `feat: page header, section primitive and footer`.

---

### Task 3: Work index (`/projects`)

**Files:**

- Move: `src/routes/(classic)/projects/+page.*` → `src/routes/(studio)/projects/` (same URL).
- Create: `src/lib/components/work-row.svelte` — props: `project` (`slug, title, oneLine ?? excerpt, built ?? featuredStack, brandColor?, deviceShots?, featuredImage?, hasWriteup, liveUrl?, github?`). Row: name (display-m), one line, deliverables (small, muted), thumbnail on the right (first deviceShot in `DeviceFrame`, else `featuredImage` in a browser frame, else a brand-colour/`--border` swatch with the project initial — never a broken image), "View case study →" when `hasWriteup` else the live/repo link.
- Modify: `src/routes/(studio)/projects/+page.svelte` + `+page.server.ts` — `PageHeader` (eyebrow "Work", title "Selected work — from first app to production.", intro one line), filter chips All · Mobile · Web · Backend · Fintech · Websites · Open source (client-side, `?type=` query param so filtered views are linkable; chips are buttons with `aria-pressed`), case-study rows, then a compact "Open source" list (name, one line, repo link, `stars` if present in frontmatter).
- Delete: `src/lib/components/project-list.svelte` if no longer used (check the homepage legacy section; it is replaced in Task 5 — if still used, delete in Task 5).
- Test: `src/lib/components/work-row.svelte.spec.ts`, `src/routes/(studio)/projects/page.svelte.spec.ts`

- [ ] **Step 1: Failing tests** — work-row: with deviceShots renders an `img` with the shot's alt; with neither shots nor featuredImage renders no `img` and shows the initial; `hasWriteup` false → no "View case study" link, live link instead. Page: renders all case-study rows from data; clicking "Mobile" sets `aria-pressed="true"` and hides a row whose categories lack "Mobile App"; visiting with `?type=open-source` shows only open-source entries.
- [ ] **Step 2:** FAIL. **Step 3:** Implement. **Step 4:** PASS; `/projects` builds and every existing project link on it resolves.
- [ ] **Step 5:** Commit `feat: work index with rows and filters`.

---

### Task 4: Upgrade remaining case studies to the new template

**Files:**

- Modify: every `src/content/projects/*.md` that has a body (writeup) but no `built` — add `oneLine` (≤ 90 chars), `built`, `engagement`, `stage`, `brandColor`, `onBrand`, `deviceShots` (from existing `featuredImage`/`gallery` files in `static/portfolio`; crop composed mockups to real screens with `sips` as done for SusuPaa/RBL, never fake screens). Derive every value **only from that project's own frontmatter and body** — no new facts. Do not edit bodies.
- Modify: open-source entries — add `oneLine` and `categories` where missing (Chatalog, tts-generator: Backend).
- Test: `src/lib/data/projects-loader.test.ts` (extend)

- [ ] **Step 1: Failing tests** — every project with a writeup has `built.length >= 1`, `oneLine.length <= 90`, `brandColor` hex, `onBrand` set; every `deviceShots[].src` exists on disk; every open-source entry has `oneLine`.
- [ ] **Step 2:** FAIL. **Step 3:** Fill the data; record each brand colour + contrast ratio in the report. **Step 4:** PASS; open each case study in the dev server at 1280×720 and 375px.
- [ ] **Step 5:** Commit `content: move all case studies to the new template`.

---

### Task 5: Homepage sections below the hero

**Files:**

- Modify: `src/routes/(studio)/+page.svelte` + `+page.server.ts` — replace the legacy `.classic` wrapper with (in order, spec §5.1): **Selected work** (4–6 featured projects as large tiles: device shot on brand field, name, one line, deliverables; link to case study), **What I do** (four offers, one line each, link "How I work with teams →" `/work-with-me`), **Track record** (text: "Co-founder & CTO, Pavex" + "Before: Hubtel · Built Financial Technologies · Fetch Agent · RBL"), **Writing** (latest 3 posts, rows with date), contact handled by the footer.
- Modify: `src/lib/data/projects-loader.test.ts` featured test → featured set becomes `kekeh-mac, susupaa-platform, rbl-dating-app, alvi-beauty, voltax` plus any others Task 4 made v2-ready, max 6 (update frontmatter `featured` flags; spec §6 list minus projects without pages yet).
- Modify: `src/routes/(studio)/page.svelte.spec.ts` — drop legacy assertions, assert the four section headings and that Selected work links point to `/projects/<slug>`.
- Delete: unused legacy components (`project-list.svelte`, timeline markup on the homepage — timeline moves to About in Task 7).

- [ ] Steps: failing spec → implement → pass → visual check 1280×720, 800×556, 375px → commit `feat: homepage sections in the new design`.

---

### Task 6: What I do (`/work-with-me`)

**Files:**

- Move to `(studio)`; rewrite `src/routes/(studio)/work-with-me/+page.svelte` per spec §5.4 with `PageHeader` (title "Work with me"), then:
  1. Four offers as large numbered statements (display-m title + "Usually when…" paragraph + proof links to **existing** case studies only):
     **Build the whole product** — proof: Kekeh Mac, Alvi Beauty, Qargo. **Lead or join your team** — proof: RBL (lead engineer), Fetch Agent; plus "Co-founder & CTO at Pavex". **Fix, rescue or migrate** — proof: RBL migration, SusuPaa ledger, Voltax. **Websites with a real admin** — text only (clients named: KAS Foundation, Smiling Hour Foundation, Ashasie Tour, Owl Studios, Agbawe Archives).
  2. Capabilities grid (spec §5.4 item 3, exact groups).
  3. Principles 01–05 — **blocking human step:** present the draft to Emmanuel: "One person, the whole product." / "Money-grade by default." / "Shipped, not slideware." / "Plain updates, every week." / "You own everything I build." (each with one supporting sentence); he edits/approves.
  4. Testimonials — **blocking human step:** ask Emmanuel for any (name, role, quote). Section not rendered when the list is empty.
  5. Engagements (fixed-scope build · weekly-billed work · monthly retainer · architecture review without price, `TODO(Emmanuel)` code comment kept).
  6. `#call` section: `CalButton` (existing `CAL_EVENTS.intro`) + email. Keep `id="call"`.
- Test: `src/routes/(studio)/work-with-me/page.svelte.spec.ts`

- [ ] Steps: failing spec (h1 "Work with me"; four offer headings in order; every proof link href matches `/projects/<slug>` of an existing writeup — assert against `getAllProjects()`; `#call` exists; testimonials heading absent when none) → implement → pass → commit `feat: what I do page`.

---

### Task 7: About

**Files:**

- Move to `(studio)`; rewrite `src/routes/(studio)/about/+page.svelte` per §5.5: `PageHeader` (eyebrow "About", title "Emmanuel Yeboah", intro = current first paragraph as aligned in phase 1), portrait (`static/zappy-face.jpg`, `width`/`height` set, real alt), story (existing paragraphs, unchanged wording apart from phase-1 alignment), **Timeline** from `src/lib/data/timeline.ts` as Metalab-style index rows (years · org · line · writeup link), "How I work" (existing text), work history (existing data).
- Test: `src/routes/(studio)/about/page.svelte.spec.ts`

- [ ] Steps: failing spec (h1; portrait img with non-empty alt; every TIMELINE org present; JSON-LD jobTitle "Product Engineer") → implement → pass → commit `feat: about page in the new design`.

---

### Task 8: Writing, tags, post, contact, 404

**Files:**

- Move `writing/**` and `contact` to `(studio)`. Restyle: writing index (`PageHeader` "Writing", posts as rows: title display-m, date, tags), tag page (same rows, `PageHeader` eyebrow "Tag"), post page (title display-l `.page-title`, date + tags meta row, body in `--measure` prose with display headings, next/previous post links), contact (`PageHeader` "Get in touch", booking + email, same Cal embed), `src/routes/+error.svelte` (`PageHeader` with status as eyebrow, one line, link home + Work).
- Delete: `post-list.svelte` if replaced.
- Test: extend/replace existing writing specs; `src/routes/+error.svelte.spec.ts`.

- [ ] Steps: failing specs (draft post absent from index/tag page data in a production-mode check — assert via `getPosts()` with `import.meta.env.DEV` false path already covered, plus build-output grep in Step 4; post page has h1 `.page-title`; error page shows status) → implement → pass → `bun run build` then `grep -r "five-things-that-break" .svelte-kit/cloudflare` → 0 → commit `feat: writing, contact and error pages in the new design`.

---

### Task 9: Remove classic shell + full-site quality gate

**Files:**

- Delete: `src/routes/(classic)/` (should be empty), `.classic`/`.legacy` CSS and any now-unused components; `SiteHeader` `overlay` becomes always-on (remove the flag if trivial).
- Create: `scripts/check-urls.ts` (or a Vitest node test `src/lib/urls.test.ts`) — builds the list of every pre-redesign URL (from `git show ec37b83:src/routes` structure, `_redirects`, sitemap of `ec37b83`, all project and post slugs) and asserts each resolves in the built output or via redirects.

- [ ] **Step 1:** URL test written and passing.
- [ ] **Step 2:** Headless screenshots (Playwright, not the browser pane — it freezes frames when hidden) of every page at 375×812, 800×556, 1280×720, 1440×900, dark and light; save under `.superpowers/sdd/<plan>/screens/`. Review against Metalab for craft; fix anything generic in the owning file (own commit each).
- [ ] **Step 3:** Lighthouse mobile on `bun run preview` for `/`, `/projects`, `/projects/kekeh-mac`, `/work-with-me`, `/about`, `/writing`: Performance ≥ 90, Accessibility ≥ 95, SEO 100, LCP < 2.5s.
- [ ] **Step 4:** Reveal check in Chrome: link navigations wipe; back/forward and `#call` don't; reduced motion → none.
- [ ] **Step 5:** `bun run lint && bun run check && bun run test && bun run build` clean; grep build output for "AppStract", "payments engineer", "fintech consultant", "open to senior" → 0.
- [ ] **Step 6:** Commit `chore: remove classic shell` (and fix commits); present screenshots + Lighthouse to Emmanuel for approval. **Blocking human step.**
