# noelzappy.dev — product engineer redesign

Date: 2026-11-07. Status: draft for Emmanuel's review.
Supersedes: `2026-09-12-content-first-redesign-design.md` (goals and visual direction) and
`docs/briefs/2026-11-07-consulting-repositioning.md` (positioning). Research behind this spec:
`~/workspace/handover/research/2026-11-07-profile.md`.

## 1. Why

The September redesign positioned Emmanuel for senior backend roles: a narrow, text-only site
read by hiring managers. He now sells his own work to people buying a product, and the evidence
(GitHub + workspace survey) shows he ships whole products: mobile apps, web platforms, APIs,
admin consoles and deployment, often alone and fast. "Backend engineer" and a text-only site
undersell that.

**Success:** a founder or operations lead who lands on the site (often from a cold email) can tell
within ten seconds what Emmanuel builds, see real products he shipped, and book a call. Every
claim on the site is true and approved by Emmanuel.

## 2. Positioning and voice

- **Who:** independent product engineer. Designs and builds software products end to end, and
  ships them. Depth: products that move money (ledgers, mobile money, payment providers, KYC).
- **Title (default meta):** "Emmanuel Yeboah — Product Engineer · Mobile, Web & Backend".
- **Description:** "I design and build software products end to end — mobile apps, web platforms
  and the backends behind them — and ship them to production. Best at products that move money."
- **Voice:** first person ("I"), plain, specific, no superlatives. Each sentence must survive the
  question "says who?" — numbers only where Emmanuel has confirmed them.
- **Not mentioned:** AppStract Labs. Interview exercises (ADL, Zof) and the STC crawler.
- **Named freely:** every client and product he worked on (confirmed by Emmanuel).
- **Pavex:** shown as "Co-founder & CTO, Pavex" (credibility), not the headline.

All copy in this spec is direction, not final. Final copy is written with Emmanuel in the
vertical slice (§9, phase 1) and is not filled with plausible-sounding placeholders.

## 3. Visual direction

Modelled on **Metalab's structure** (metalab.com), personalised. We take the patterns, not the
content: no copied copy, art, logos or brand marks.

Patterns taken:

1. One-screen hero: large display headline, short intro paragraph, a vertical list of project
   pills. Hovering a pill turns the hero into that project (name, one line, what was built, image).
2. Minimal chrome: "Menu" button left, wordmark centre, local time + theme toggle right.
3. Full-screen menu overlay: large display nav links, project pills, and recent items (writing, news).
4. Work index as rows: name, one line, deliverables, image, with type filters.
5. Case study: huge display title, a meta row, a full-bleed hero image, narrative sections, an
   impact row of 2–3 numbers, "next case study".
6. "What I do" page: four offer statements, capability groups, numbered principles, testimonials.

Personalised:

- Wordmark is "Emmanuel Yeboah". Header right shows **Accra local time · availability**
  (e.g. "Booking Q1 projects"), driven by one config value.
- First-person copy throughout.
- **No decorative gradients, blobs, grain or 3D.** The hero's visual is the work itself.
  Default hero state: a single strong image of current work (or a calm solid field with the
  headline if no image is good enough). Hover state: the project's brand colour as a **flat** field
  plus its studio device shot.
- Warm, restrained palette (below); each project carries its own brand colour for its hover and
  case-study hero.

### 3.1 Type

- Display: Inter (light weights, tight tracking) — Emmanuel chose a sans over the serif shortlist on 2026-11-07.
- **Sans** for UI and body: keep self-hosted Inter (already in `static/fonts`).
- Defined scale (display XL/L/M, heading, body, small, caption) with tracking and line-height per
  step, max line length ~68ch for body. Tested at 375px and 1440px.
- No monospace decoration except for code in writing.

### 3.2 Colour

- Dark-first: ink background (~~#0E0E0D), warm off-white text (~~#F3EFE6), muted (~#9A988F).
- Light theme and the menu overlay: warm paper (~#F3EFE6) with ink text (Metalab's light overlay).
- One accent, warm gold (~#E9C98F on dark; a darker, AA-contrast variant on light), used for
  links, focus rings and availability.
- Per-project `brandColor` for hover fields and case-study heroes.
- Exact values set in the slice and checked for WCAG AA contrast.

### 3.3 Imagery

- **Launch: studio device shots.** Real app screens from Emmanuel's repos placed in clean,
  consistent device frames (phone, laptop/browser) on a flat project-colour background. One
  pipeline, same lighting and angles for every project, so the set looks like one body of work.
  Source screens: `tripli/design/tripli-v7/screens`, `paylte/.walk-logs/screens`,
  `kekehmac/docs/design/current-screens`, `static/portfolio/*`, plus fresh captures of live sites.
- **Later: real photography**, swapped in per project with no layout change (the hero and case
  study image slots accept a photo or a device shot).
- No AI-generated lifestyle images.
- Images exported as AVIF/WebP with responsive sizes; every image has alt text.

### 3.4 Motion

- Hero pill hover: cross-fade background + content (~350–450ms ease-out), image rises slightly.
- Menu overlay: fade/slide.
- **Page reveal (Emmanuel, 2026-11-07):** every client-side navigation shows a reveal: an ink
  panel wipes up off the screen (~600–700ms, ease-in-out) uncovering the new page, whose first
  heading rises ~24px into place. Built on the View Transitions API (`onNavigate` +
  `document.startViewTransition`), no dependency; browsers without it navigate instantly.
  Disabled under `prefers-reduced-motion`. Never delays navigation beyond the animation.
- No scroll-jacking, no custom cursor. Everything respects `prefers-reduced-motion`.

### 3.5 Mobile

- Hero: headline + intro + pills as a horizontal scroller; tapping a pill opens the case study
  (no hover on touch).
- Work rows stack: image, name, line, deliverables.
- Menu overlay full screen. Tested at 375px.

## 4. Information architecture

| Route                                      | Purpose                                                                  | Status                   |
| ------------------------------------------ | ------------------------------------------------------------------------ | ------------------------ |
| `/`                                        | Hero with project pills; selected work; offers summary; writing; contact | redesigned               |
| `/projects`                                | Work index (all projects as rows, filters); nav label "Work"             | redesigned               |
| `/projects/[slug]`                         | Case study                                                               | redesigned               |
| `/work-with-me`                            | "What I do": offers, capabilities, principles, testimonials, call        | redesigned               |
| `/about`                                   | Story, portrait, timeline, how I work                                    | redesigned               |
| `/writing`, `/writing/[slug]`, tags        | Writing                                                                  | restyled, unchanged URLs |
| `/contact`                                 | Booking + email                                                          | restyled                 |
| `/rss.xml`, `/sitemap.xml`, `llm-full.txt` | Feeds                                                                    | updated                  |

URLs: `/projects` stays canonical (it became canonical in September; moving it again would cost
search ranking for no gain). The nav simply labels it "Work". Existing `/work…` → `/projects…`
redirects stay.

**Dropped-slug revival:** `src/lib/redirects.ts` `DROPPED_PROJECTS` and `_redirects` currently
send these slugs back to `/projects`: built-lite-app, built-africa-website, built-website,
ejuma-platform, drone-inspection-software, tipme-mobile-app, ashasie-travel-website,
owl-studios-website, reeno-group-website, getall-handyman, brif-platform, qargo-delivery-app,
cocaptain-app. Qargo and Cocaptain have content files but are unreachable today (bug). Any
project revived by this redesign reuses its old slug (e.g. Brif → `brif-platform`, Ashasie and
Owl inside the Websites case study get anchors or their own pages at the old slugs) and is
removed from both redirect lists, so old links land on content again. Tests updated to match.

**Nav (menu overlay):** Work · What I do (`/work-with-me`) · About · Writing · Get in touch.

## 5. Pages

### 5.1 Home

1. **Hero** (one screen): headline, intro paragraph (first person), project pills (7–8 products +
   "All work"), header with time/availability. Pills, in order (editable): Kekeh Mac, PayLTE,
   SusuPaa, Tripli, Hakanow, RBL, Alvi Beauty.
2. **Selected work:** 4–6 large case-study tiles (image + name + one line + deliverables).
3. **What I do (summary):** the four offers in one line each, link to `/work-with-me`.
4. **Track record strip:** "Co-founder & CTO, Pavex" + past teams (Hubtel, Built, Fetch Agent,
   RBL) as text, not logos, unless Emmanuel has logo permission.
5. **Writing:** latest 3 posts.
6. **Contact block:** "Have something to build?" + book a call + email.

### 5.2 Work index (`/projects`)

Display headline; filter chips (All, Mobile, Web, Backend, Fintech, Websites, Open source); rows
(name, one line, deliverables, thumbnail, "View case study"). Open-source projects appear as a
compact second list (name, one line, stars/npm, repo link).

### 5.3 Case study (`/projects/[slug]`)

Title; meta row **Engagement** (Full build / Team augment / Rescue / Website) · **Stage**
(Startup / Business / NGO / Own venture) · **What I built** (e.g. Driver app, Passenger app, API,
Admin); full-bleed hero image; sections: Introduction, The goal (one large line), 2–4 narrative
sections with images, **Impact** (2–3 confirmed numbers, or omitted), Stack, links (live, stores,
repo); Next case study. Existing case-study bodies are kept and restyled; new ones are written.

### 5.4 What I do (`/work-with-me`)

1. Headline in Emmanuel's voice.
2. Four offers (statement + "usually when…" + proof links):
   **Build the whole product** · **Lead or join your team** · **Fix, rescue or migrate** ·
   **Websites with a real admin**.
3. Capabilities: Mobile (Expo/React Native) · Web (Next.js, SvelteKit, TanStack) · Backend
   (Go, NestJS, Node) · Payments & fintech (ledgers, MoMo, Paystack, Hubtel, KYC) · Infra
   (Dokploy, Cloudflare, DigitalOcean) · AI (agents, LLM guardrails).
4. Principles 01–05, Emmanuel's own (drafted with him; e.g. "One person, whole product",
   "Money-grade by default", "Shipped, not slideware").
5. Testimonials (only real ones Emmanuel supplies; section hidden if none).
6. Engagements: fixed-scope build, weekly-billed work, monthly retainer; architecture review
   with price when set (`TODO(Emmanuel)` stays a code comment).
7. Call to action: book a call (existing Cal.com `noelzappy/15min`) or email.

### 5.5 About

Portrait (`static/zappy-face.jpg` or new photo), short story, timeline (Now: independent +
Pavex CTO; past roles), how I work. Existing "How I work" text kept unless Emmanuel changes it.

## 6. Content model

Extend `ProjectFrontmatter` (`src/lib/data/projects.ts`); all new fields optional so the 20
existing files keep building:

- `engagement`: 'full-build' | 'team' | 'rescue' | 'website' | 'open-source'
- `stage`: 'startup' | 'business' | 'ngo' | 'own-venture'
- `built`: string[] (deliverables, e.g. ["Driver app", "Passenger app", "API", "Admin"])
- `brandColor`: string (hex) ; `heroImage`: string ; `deviceShots`: string[]
- `pill`: boolean (appears in the homepage hero) ; `pillOrder`: number
- `oneLine`: string (≤ 90 chars, hero/rows)
- `impact`: { value, label }[] (confirmed numbers only)
- `categories` gains 'Backend' and 'Fintech'.

**Projects:** keep all 20 existing entries and slugs. Add: Tripli, PayLTE, Kekeh Mac, Hakanow,
Brif, Edromart, a grouped "Websites" case study (KAS Foundation, Smiling Hour, Ashasie Tour,
Owl Studios, Agbawe Archives), and open-source fleet and tripwire. Featured: SusuPaa, Kekeh Mac,
PayLTE, Tripli, RBL, Alvi Beauty, Voltax.

## 7. Carried over from the 2026-11-07 branch

On `feat/consulting-repositioning` (uncommitted): meta/structured-data changes, nav item, footer
CTA, `/work-with-me` page, timeline and About edits, draft-post mechanism and the mobile-money
draft post, llm-full.txt, sitemap entry, Fetch Agent title fix. Keep: the draft mechanism and
draft post, redirects, sitemap/llm-full plumbing, Fetch Agent fix. Replace: payments-only copy,
title/description, and the `/work-with-me` content (restructured per §5.4).

## 8. Quality bar (gate before any page is called done)

- Screenshots of every page at 375px and 1440px, light and dark, reviewed side by side with the
  equivalent Metalab page for craft (type, spacing, image quality). Anything that looks generic is
  redone.
- No decorative gradients/blobs/grain; every image is a real product image.
- Lighthouse (mobile): Performance ≥ 90, Accessibility ≥ 95, SEO 100. LCP < 2.5s.
- WCAG AA contrast; keyboard navigation for pills and menu; reduced-motion respected.
- `bun run lint`, `test`, `build` pass; the existing `check` error is fixed or documented.
- All pre-existing URLs resolve (scripted check). No job-seeking or payments-only phrasing left
  (grep build output).
- Nothing deployed without Emmanuel's approval.

## 9. Phases

Update 2026-11-07: Emmanuel approved the slice's look and directed that every page be
redesigned now; phases 3–4 run as one plan (`plans/2026-11-07-redesign-phase2-all-pages.md`).
New case studies (Tripli, PayLTE, Hakanow, Brif, Edromart, Websites) remain a separate content
plan.

1. **Vertical slice (approval gate):** design tokens, fonts, header/menu, homepage hero with
   working pills (3 projects), and the full Kekeh Mac case study with studio device shots and
   final copy. Emmanuel approves the look before anything else is built.
2. Studio device-shot pipeline for all featured projects.
3. Work index, remaining case studies (new + restyled existing), dropped-slug revival.
4. What I do, About, Writing/contact restyle.
5. Quality gate (§8), then hand over for deploy.

## 10. Inputs needed from Emmanuel

- Headline and principles (written together in phase 1).
- Confirmed numbers per project (users, trips, deposits, launch dates, store links).
- Testimonials (name, role, quote) from any client willing.
- Ownership wording for Hakanow and Vemphy (own venture or partner).
- A current portrait if `zappy-face.jpg` is outdated.
- Architecture-review price (optional).
- Later: real photography per project.

## 11. Non-goals

Framework change, a CMS, 3D/WebGL art, AI-generated imagery, blog redesign beyond restyle,
analytics changes, the lead engine (its spec is updated separately in `~/workspace/handover`).

## 12. Phase 3 — presentation and motion (Emmanuel, 2026-11-08)

Reviewed on a 2000px-wide screen. Decisions:

- **Homepage = hero + footer only.** Selected work, What I do, Track record and Writing sections
  are removed from the homepage; they live behind Menu/Work. (Replaces §5.1 items 2–5.)
- **No exposed dead space.** The default hero gets a visual anchor: the headline scales with the
  viewport width (Metalab-style) with the intro beside it, and a slow, continuous strip of real
  product screens drifts through the open band. The hover state centres one full, uncropped
  composition in the right half. Checked at 1280, 1440, 2000 and 2560px wide.
- **Frameless composed screens everywhere.** No browser chrome. Screens use the site radius and one
  soft shadow; phones get a thin bezel only. Each project has one fixed composition (e.g. one web
  screen with two phones overlapping, same scale, fully visible) reused by the hero, work rows and
  the case-study top. Replaces `DeviceFrame` browser chrome.
- **Motion: signature + subtle.** Signature: clicking a project pill or work row morphs that
  project's composition into the case-study top via View Transitions shared elements (the curtain
  is skipped for that navigation). Subtle: headline words rise on load, hover screens stagger in,
  sections fade up once on scroll. All off under `prefers-reduced-motion`.
- **Performance:** Google Analytics loads after the window `load` event; hidden hero images are
  not eager-loaded; layout data no longer ships every project's screens to every route.
- **Testimonials placeholders render only in dev builds**; production hides the section until real
  quotes exist (spec §5.4).
