# noelzappy.dev

Personal site of Emmanuel Yeboah — product engineer. Content-first, static, deployed to Cloudflare Pages.

**Live:** https://noelzappy.dev

## Stack

- SvelteKit 2 / Svelte 5, TypeScript, Vite 7
- Tailwind 4 with the typography plugin; one self-hosted typeface (Inter)
- mdsvex + shiki for writing; a YAML-frontmatter loader for projects
- `@sveltejs/adapter-cloudflare`; every content page is prerendered
- Vitest (node + Playwright browser projects)

## Content

| What          | Where                            | Notes                                                                                                                                                        |
| ------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Posts         | `src/content/writing/<slug>.md`  | frontmatter: `title`, `date` (quoted `'YYYY-MM-DD'`), `tags`, `description`. Body is markdown; code blocks are highlighted at build time.                    |
| Projects      | `src/content/projects/<slug>.md` | frontmatter per `src/lib/data/projects.ts`; `kind: case-study` or `open-source`; `github` for the repo URL; a non-empty body gets a `/projects/<slug>` page. |
| Timeline      | `src/lib/data/timeline.ts`       | homepage entries                                                                                                                                             |
| Site metadata | `src/lib/shared/constants.ts`    | title, description, keywords, JSON-LD                                                                                                                        |

Adding a post: create the markdown file, commit, deploy. It appears on `/`, `/writing`, its tag pages, `/rss.xml`, and `/sitemap.xml` automatically.

## Routes

`/`, `/projects`, `/projects/[slug]`, `/work-with-me`, `/about`, `/writing`, `/writing/[slug]`, `/writing/tag/[tag]`, `/contact`, `/rss.xml`, `/sitemap.xml`. Old `/notes/*`, `/work/*` and `/open-source` URLs redirect permanently (`src/lib/redirects.ts`).

## Develop

```sh
bun install
bun run dev        # http://localhost:30034
bun run build      # production build (prerenders all content)
bun run preview
bun run check      # svelte-check
bun run test       # vitest (first run: npx playwright install chromium)
bun run lint
```

## Before deploying

```sh
bun run build
bun scripts/deploy-check.ts
```

Exits non-zero while placeholder testimonials (`src/lib/data/testimonials.ts`) or `TODO(Emmanuel)` text are still on the rendered site. It is deliberately not part of `bun run test`, so placeholders stay visible during development without failing CI.

## Deploy

Cloudflare Pages builds from `main` (`wrangler.toml`). No runtime environment variables are required. `PUBLIC_TURNSTILE_SITE_KEY` and `PUBLIC_FORGE_INQUIRY_URL` (see `env.example`) are build-time variables: set both in the Pages project's build environment, then redeploy. Left unset, the inquiry form shows the email fallback on submit.

## License

MIT © Emmanuel Yeboah
