# noelzappy.dev — content-first redesign and repositioning

Date: 2026-09-12. Status: approved.

## Goals

1. Reposition the site for senior backend and platform engineering roles. Fintech work stays as history but is no longer the headline.
2. Replace the marketing-style landing page with a content-first personal site: typography-driven, narrow single column, light/dark toggle, fast and static.

Non-goals: switching frameworks, adding sections that cannot be filled today, inventing dates or figures.

## Stack decisions

- Keep SvelteKit 2 / Svelte 5 / Tailwind 4 / adapter-cloudflare.
- Remove the Ghost CMS runtime dependency. Writing becomes local markdown rendered with mdsvex.
- Remove runtime GitHub API calls. Open-source entries become static project files.
- Every content page is prerendered. The server bundle exists only for redirects.
- One typeface: self-hosted Inter (already in `static/fonts`). System monospace for code. Drop Syne, DM Sans, JetBrains Mono, Material Symbols, and the global Cal.com embed (Cal loads only on `/contact` and `/services`).

## Routes

| Route                   | Content                                                    | Notes                                                   |
| ----------------------- | ---------------------------------------------------------- | ------------------------------------------------------- |
| `/`                     | intro, timeline, latest 5 posts, selected projects, footer | no hero, stats, or CTAs                                 |
| `/writing`              | all posts, newest first, tags                              |                                                         |
| `/writing/[slug]`       | post                                                       |                                                         |
| `/writing/tag/[tag]`    | posts by tag                                               | only if a tag has ≥1 post (always true by construction) |
| `/projects`             | case studies and open-source repos in one list             | live, repo, writeup links per entry                     |
| `/projects/[slug]`      | case study                                                 |                                                         |
| `/about`                | rewritten, architecture-first                              |                                                         |
| `/rss.xml`              | feed of posts                                              |                                                         |
| `/sitemap.xml`          | home, writing, projects, about, posts, projects            |                                                         |
| `/contact`, `/services` | kept, unlinked from nav and footer                         |                                                         |

Redirects (301): `/notes` → `/writing`, `/notes/[slug]` → `/writing/[slug]`, `/work` → `/projects`, `/work/[slug]` → `/projects/[slug]`, `/open-source` → `/projects`. Old `/projects/[slug]` slugs are the same as `/work/[slug]`, so no change.

Removed: `/api/github-contributions`, `/api/github-repos`, `/api/pinned-repos`, `static/.well-known/api-catalog`, the `/projects` duplicate implementation, unused components (`experiences`, `expertise`, `pinned-repos`, `gh-contributions`, `newsletter`, `cta-band`, `session-card` stays for `/services`).

## Content model

### Writing: `src/content/writing/<slug>.md`

```yaml
title: string
date: YYYY-MM-DD
tags: [string]
description: string
```

Body is markdown, compiled by mdsvex. The nine Ghost posts are exported once by a script (`scripts/export-ghost.ts`) using `node-html-markdown`, then committed. Slugs are preserved.

Tags (approved as proposal, confirmed at diff review):

- are-we-now-just-bystanders-while-ai-takes-over: ai, opinion
- software-engineering-is-just-advanced-damage-control: engineering, opinion
- the-shipping-anxiety-of-ai-generated-code: ai, engineering
- how-i-migrated-170k-users-from-php-to-node-js-without-stopping-the-world: systems, migrations
- why-i-built-voltax-unifying-the-african-payment-stack: open-source, api-design
- im-leaving-react-for-svelte: frontend, opinion
- why-developer-experience-is-now-a-product-priority: developer-experience
- why-every-ghanaian-tech-professional-should-take-the-2025-ghana-tech-ecosystem-survey: community
- estimating-project-timelines-as-a-freelancer-a-developers-guide: process

### Projects: `src/content/projects/<slug>.md`

Existing 20 files move from `src/lib/data/projects/` with the same frontmatter schema, plus new optional fields `repo` (GitHub URL) and `kind: case-study | open-source`. Open-source entries: voltax, remotepad, vaulx, chatalog, tts-generator, chatgpt-whatsapp, gptalks. No star counts.

Fixes: SusuPaa `featuredStack`/`stack` become Go, PostgreSQL (plus Redis, multi-tenant). Role labels normalized: "Full Stack Developer" variants → "Software Engineer"; "Lead Full Stack Developer" / "Lead Full-Stack Engineer" → "Lead Engineer".

Homepage selection (`featured: true` after normalization): susupaa-platform, rbl-dating-app, fetch-agent-real-estate-platform, voltax, remotepad.

## Homepage copy (approved)

Intro:

> Hey, I'm Emmanuel.
> Backend engineer. I build systems that can't afford to be wrong.

Timeline (dates from the existing about page; wording approved as draft, editable at diff review):

- 2019–2021 Wordnox. Frontend engineer. First professional role.
- 2021–2024 Built Financial Technologies. Lead mobile and web engineer. Shipped the web platform, two React Native apps, one offline-first, and an HR platform.
- 2024 Hubtel. Software engineer. Led frontend for Hubtel for Hospitals; contributed to GHQR.
- 2024–2025 RBL Matchmaking. Lead engineer. Zero-downtime migration of 170,000 live users from PHP/MySQL to Node.js/PostgreSQL; real-time messaging for 200,000 monthly actives.
- 2024–2025 Fetch Agent. Senior backend engineer. APIs at 50,000+ daily requests under 200ms.
- 2024–present Brif Africa. Co-founder. Editorial platform and a text-to-speech microservice.
- 2025–present SusuPaa. Co-founded and led the platform: custom append-only ledger with strict consistency guarantees, 339 organizations onboarded, 28 API modules in production. Cut p99 latency from 1.6s to 500ms.
- Now. Consulting on backend and platform work. Writing about systems.

Footer: me@noelzappy.dev, GitHub, LinkedIn, X, RSS. No closing personal line.

## Visual system

- Measure 68ch, body 17px, line-height 1.7, vertical rhythm on a 0.5rem grid.
- Tokens on `:root` (light) and `[data-theme="dark"]`; default follows `prefers-color-scheme`; toggle persists to `localStorage`; inline head script applies the stored theme before paint.
- One accent colour, used for links and the active nav item only. No cards, gradients, badges, or scroll animations.

## Metadata

- Title: "Emmanuel Yeboah — Backend Engineer | Distributed Systems & Platform Infrastructure"
- Description (meta, OG, Twitter): "Backend engineer building high-reliability distributed systems. Six years on correctness-critical infrastructure: transactional datastores, multi-tenant platforms, and zero-downtime migrations at scale. Open to senior remote backend and platform roles."
- Keywords removed: African Fintech, SusuPaa, Mobile Money Integration, Fintech Architecture, Web Developer Ghana, Full-Stack Engineer. Added: distributed systems, backend engineer, Go, platform engineering, API design, event-driven architecture, database migrations, systems reliability.
- JSON-LD Person: drop `worksFor`, `knowsAbout` = new keyword set, description = new description. Fix `image` to an existing file.
- `static/llm-full.txt` and `README.md` rewritten to match.

## Copy rewrites requiring diff review before apply

`/projects` intro, `/about`, `src/content/projects/susupaa-platform.md`. Each opens on architecture and systems, not payments or savings groups.

## Process

Branch `redesign/content-first`. One commit per step. `npm run build` green before every commit. Copy diffs shown before applying. Final pass: grep for the original term list and report anything still fintech-first.

## Testing

- `npm run build` and `npm run check` green (fixing the four pre-existing check errors).
- Existing homepage render test updated to the new data shape.
- Unit test for the content loader (frontmatter parse, sort, tag index) and the redirect map.
