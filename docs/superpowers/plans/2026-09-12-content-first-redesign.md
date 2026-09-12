# Content-First Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild noelzappy.dev as a static, content-first personal site positioned for senior backend and platform roles, per `docs/superpowers/specs/2026-09-12-content-first-redesign-design.md`.

**Architecture:** Two local content collections (`src/content/writing` via mdsvex, `src/content/projects` via the existing frontmatter loader) feed prerendered SvelteKit routes. A single `layout.css` holds the type scale and light/dark tokens. Old routes 301 to new ones.

**Tech Stack:** SvelteKit 2, Svelte 5, Tailwind 4, mdsvex 0.12, shiki 4, adapter-cloudflare, vitest.

## Global Constraints

- Run tooling with `npm` (bun is not on PATH). `npm run build` must pass before every commit.
- Never invent dates or figures. Copy for `/projects` intro, `/about`, and `susupaa-platform.md` is shown as a diff to the user before it is applied.
- No section may render empty. Lists are built from content that exists in the repo.
- Commit messages have no attribution trailers.
- Title, description and keyword strings are copied verbatim from the spec.

---

### Task 1: Writing content pipeline (mdsvex + Ghost export)

**Files:**
- Create: `scripts/export-ghost.mjs`, `src/content/writing/*.md` (9 files), `src/lib/content/writing.ts`, `src/lib/content/writing.test.ts`
- Modify: `svelte.config.js` (mdsvex preprocess, `.md` extension), `package.json` (add mdsvex, shiki)

**Interfaces:**
- Produces: `getPosts(): Post[]` sorted newest first; `getPost(slug): Post | undefined`; `getTags(): {tag: string; count: number}[]`; `type Post = { slug; title; date; tags: string[]; description; component: Component }`.

- [ ] Install `mdsvex` and `shiki`; configure `mdsvex({ extensions: ['.md'], highlight: shiki })` in `svelte.config.js` and add `.md` to `extensions`.
- [ ] Write `scripts/export-ghost.mjs`: fetch `https://ghost.noelzappy.dev/ghost/api/content/posts/?key=…&limit=50&formats=html`, convert `html` with `node-html-markdown`, write frontmatter (title, date, tags from spec table, description = excerpt) to `src/content/writing/<slug>.md`. Run once; commit the output, not the key.
- [ ] Write `writing.test.ts`: posts are sorted by date desc, every post has ≥1 tag, `getTags()` counts match. Run, fail, implement `writing.ts` with `import.meta.glob('/src/content/writing/*.md', { eager: true })`. Run, pass.
- [ ] Commit `feat(writing): local markdown posts via mdsvex, export Ghost archive`.

### Task 2: Projects content collection

**Files:**
- Move: `src/lib/data/projects/*.md` → `src/content/projects/`
- Create: `src/content/projects/{voltax,remotepad,vaulx,chatalog,tts-generator,chatgpt-whatsapp,gptalks}.md`
- Modify: `src/lib/data/projects.ts` (add `repo?`, `kind`), `src/lib/data/projects-loader.ts` (new glob path), role normalization and SusuPaa stack in frontmatter.

**Interfaces:**
- Produces: `getAllProjects()`, `getProjectBySlug()`, `getFeaturedProjects()` unchanged signatures; `ProjectFrontmatter.kind: 'case-study' | 'open-source'`, `repo?: string`.

- [ ] Move files, update glob, add fields, add `kind: case-study` to all existing files.
- [ ] Normalize roles: `Full Stack Developer|Fullstack Developer|Full-Stack Developer` → `Software Engineer`; `Lead Full Stack Developer|Lead Full-Stack Engineer` → `Lead Engineer`. Fix SusuPaa `featuredStack: [Go, PostgreSQL]`, `stack: [Go, PostgreSQL, Redis, Multi-tenant Architecture]`, remove `Mobile Money Integration`.
- [ ] Add seven open-source entries with `kind: open-source`, `repo`, `excerpt`, `featuredStack`, `status`, `publishedAt` = last push date from GitHub, `featured: true` for voltax and remotepad only. Set `featured: false` on all case studies except susupaa-platform, rbl-dating-app, fetch-agent-real-estate-platform.
- [ ] Add loader test: 27 projects parse, exactly 5 featured, no project lacks `kind`. Commit `feat(projects): merge open-source repos into projects collection, fix SusuPaa stack`.

### Task 3: Layout, typography, theme

**Files:**
- Modify: `src/routes/layout.css` (rewrite), `src/routes/+layout.svelte`, `src/app.html` (theme bootstrap script, drop Cal + Google Fonts), `src/lib/components/navbar.svelte` (rewrite), `src/lib/components/footer.svelte` (rewrite)
- Create: `src/lib/components/theme-toggle.svelte`, `src/lib/components/cal-embed.svelte` (moved from app.html, used by `/contact` and `/services`)

- [ ] `layout.css`: tokens `--bg --fg --muted --border --accent --code-bg` on `:root` and `[data-theme=dark]`, `@media (prefers-color-scheme: dark) :root:not([data-theme=light])`. Body 17px/1.7 Inter, `.measure { max-width: 68ch }`, heading scale 1.25 ratio, `.prose` overrides for typography plugin.
- [ ] `app.html`: inline `<script>` reading `localStorage.theme` and setting `data-theme` before paint. Remove Cal.com and Google Fonts. Keep GA.
- [ ] Navbar: site name left, `Writing · Projects · About` + toggle right, no fixed positioning, no logo animation.
- [ ] Footer: `me@noelzappy.dev · GitHub · LinkedIn · X · RSS` one line, © line.
- [ ] Build, commit `feat(layout): single-typeface content layout with light/dark toggle`.

### Task 4: Homepage

**Files:**
- Rewrite: `src/routes/+page.svelte`, `src/routes/+page.server.ts` → `+page.ts` with `prerender = true`
- Create: `src/lib/data/timeline.ts` (approved entries), `src/lib/components/post-list.svelte`, `src/lib/components/project-list.svelte`
- Modify: `src/routes/page.svelte.spec.ts`

- [ ] `timeline.ts` exports `TIMELINE: { years: string; org: string; url?: string; line: string }[]` with the spec's eight entries verbatim.
- [ ] Homepage sections in order: intro, timeline, Writing (5 latest via `getPosts()`), Projects (`getFeaturedProjects()`), footer from layout. Section headings link to `/writing` and `/projects`.
- [ ] Update spec test to new data shape; run `npm test`. Commit `feat(home): content-first homepage`.

### Task 5: Writing routes and RSS

**Files:**
- Create: `src/routes/writing/+page.ts|+page.svelte`, `src/routes/writing/[slug]/+page.ts|+page.svelte`, `src/routes/writing/tag/[tag]/+page.ts|+page.svelte`, `src/routes/rss.xml/+server.ts`
- Delete: `src/routes/notes/**`, `src/lib/integrations/ghost.ts`, `src/lib/components/newsletter.svelte`, `src/lib/components/note-card.svelte`
- Create: `src/routes/notes/+page.ts` and `src/routes/notes/[slug]/+page.ts` with `redirect(301, …)` and `prerender = false` is not needed: use `entries` + redirects in `hooks.server.ts` map instead (single place). Add `src/lib/redirects.ts` + test.

- [ ] `redirects.ts`: `resolveRedirect(pathname): string | null` mapping `/notes`, `/notes/:slug`, `/work`, `/work/:slug`, `/open-source`. Test four cases. Wire into `hooks.server.ts` before `resolve`.
- [ ] Post page renders `<svelte:component this={post.component}>` inside `.prose.measure`, with date, tags, SEOHead (`ogType="article"`, `publishedTime`, `tags`).
- [ ] RSS: render each post with `render()` from `svelte/server`, emit RSS 2.0 with `content:encoded`. `prerender = true`.
- [ ] Commit `feat(writing): writing routes, tag pages, RSS, redirects from /notes`.

### Task 6: Projects routes

**Files:**
- Create: `src/routes/projects/+page.ts|+page.svelte` (plain list: title, one-line excerpt, links live / repo / writeup), `src/routes/projects/[slug]/+page.ts|+page.svelte` (simplified case study: header, links, stack, body, problem, lessons; no gallery hover, no CTA, no stats grid)
- Delete: `src/routes/work/**`, old `src/routes/projects/**`, `src/routes/open-source/**`, `src/routes/api/**`, `src/lib/integrations/github.ts`, `src/lib/components/{gh-contributions,pinned-repos,experiences,expertise,cta-band,project-card}.svelte`, `static/.well-known/api-catalog`
- Modify: `hooks.server.ts` (drop api-catalog Link header)

- [ ] Open-source entries without a body link straight to `repo` and have no `[slug]` page (`writeup` link only when body is non-empty).
- [ ] `/projects` intro copy: show diff to user before applying.
- [ ] Commit `feat(projects): unified projects list and case study pages`.

### Task 7: Metadata and SEO

**Files:**
- Modify: `src/lib/shared/constants.ts`, `src/lib/components/seo-head.svelte` (default title/description/og image = `/zappy-face.jpg`), `src/routes/sitemap.xml/+server.ts`, `static/llm-full.txt`, `README.md`, `src/routes/contact/+page.svelte` and `src/routes/services/+page.svelte` (meta only)

- [ ] Apply spec strings verbatim. Sitemap: `/`, `/writing`, `/projects`, `/about`, posts, projects with bodies. Drop `/services`, `/contact`.
- [ ] Commit `feat(seo): repositioned metadata, JSON-LD, sitemap, llm-full`.

### Task 8: Copy rewrites (diff review required)

- [ ] Draft `/about` and `susupaa-platform.md`; present diffs; apply on approval. Commit `content: rewrite about and SusuPaa case study around architecture`.

### Task 9: Cleanup and green check

- [ ] Add `@types/js-yaml`; delete the `platform.env` API routes (already gone in Task 6). `npm run check` → 0 errors. `npm run lint`.
- [ ] Final grep for the original term list; report remaining hits.
- [ ] Commit `chore: fix type check, remove dead code`.
