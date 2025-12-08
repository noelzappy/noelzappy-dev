# Noel Zappy Portfolio

My personal portfolio and blog - showcasing my projects, technical notes, and professional experience.

**Live Site:** [https://noelzappy.dev](https://noelzappy.dev)

## Tech Stack

### Frontend

- **SvelteKit 2.x** with **Svelte 5** (runes syntax)
- **TailwindCSS 4.x** with Typography plugin
- **TypeScript** for type safety
- **Vite 7** for blazing fast development

### Backend & Content

- **Ghost CMS** (headless) at `cms.noelzappy.dev`
- **@tryghost/content-api** for fetching posts and projects
- **Marked** for additional markdown processing

### Deployment

- **Cloudflare Pages** for edge hosting
- **@sveltejs/adapter-cloudflare** for optimal edge performance

### Developer Experience

- **ESLint** + **Prettier** for code quality
- **Vitest** + **Playwright** for testing
- **svelte-check** for type checking

## Features

✅ **SEO Optimized**

- Comprehensive meta tags (Open Graph, Twitter Cards)
- JSON-LD structured data (Person, BlogPosting, Article, ContactPage)
- Dynamic sitemap generation
- LLM-friendly indexing (`/llm-full.txt`)

✅ **Performance**

- SSR with SvelteKit
- Edge deployment on Cloudflare
- Resource hints (preconnect, dns-prefetch)
- Optimized font loading

✅ **Content**

- Featured projects showcase
- Technical blog/notes with Ghost CMS
- Newsletter integration
- Tag-based filtering

✅ **UX Polish**

- Fixed navbar with scroll detection
- Active page highlighting
- Responsive design
- Smooth transitions

## Getting Started

### Prerequisites

- **Bun** (or Node.js 18+)
- Ghost CMS instance (or use the existing one)

### Installation

```sh
# Clone the repository
git clone https://github.com/noelzappy/noelzappy-dev.git
cd noelzappy-dev

# Install dependencies
bun install

# Start development server
bun run dev
```

The site will be available at `http://localhost:5173`

### Environment Variables

Create a `.env` file (optional - defaults are configured):

```env
GHOST_URL=https://cms.noelzappy.dev
GHOST_KEY=your_ghost_content_api_key
```

## Available Scripts

```sh
bun run dev          # Start development server
bun run build        # Build for production
bun run preview      # Preview production build locally
bun run check        # Type check with svelte-check
bun run format       # Format code with Prettier
bun run lint         # Lint code with ESLint + Prettier
bun run test         # Run unit tests
bun run test:unit    # Run tests in watch mode
```

## Project Structure

```
src/
├── lib/
│   ├── components/        # Reusable Svelte components
│   │   ├── seo-head.svelte
│   │   ├── navbar.svelte
│   │   ├── footer.svelte
│   │   └── newsletter.svelte
│   ├── integrations/      # External API clients
│   │   └── ghost.ts
│   ├── pages/             # Page-specific components
│   └── shared/            # Constants and utilities
├── routes/                # SvelteKit file-based routing
│   ├── +layout.svelte     # App shell
│   ├── +page.svelte       # Homepage
│   ├── projects/          # Projects showcase
│   ├── notes/             # Blog/notes
│   ├── contact/           # Contact page
│   └── sitemap.xml/       # Dynamic sitemap
└── app.html               # HTML template
```

## Deployment

The site auto-deploys to Cloudflare Pages on push to `main`:

```sh
# Manual deployment
bun run build
# Upload .svelte-kit/cloudflare to Cloudflare Pages
```

Configuration is in `wrangler.toml`.

## Ghost CMS Setup

The portfolio uses Ghost CMS for content management:

1. Create posts in Ghost with tag `projects` for projects
2. Use `featured` flag to showcase on homepage
3. Featured images display on project/note detail pages
4. Markdown content is rendered with `@tailwindcss/typography`

## License

MIT © Emmanuel Noel Zappy Yeboah

## Contact

- **Website:** [noelzappy.dev](https://noelzappy.dev)
- **Email:** noelzappy@gmail.com
- **GitHub:** [@noelzappy](https://github.com/noelzappy)
- **LinkedIn:** [/in/noelzappy](https://linkedin.com/in/noelzappy)
- **Twitter/X:** [@noelzappy](https://twitter.com/noelzappy)
