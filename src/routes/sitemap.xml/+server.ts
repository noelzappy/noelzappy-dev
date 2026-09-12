import { getPosts, getTags } from '$lib/content/writing';
import { getAllProjects } from '$lib/data/projects-loader';
import type { RequestHandler } from './$types';

export const prerender = true;

const SITE = 'https://noelzappy.dev';

type Entry = { loc: string; lastmod?: string; priority: string };

const url = ({ loc, lastmod, priority }: Entry) => `
  <url>
    <loc>${SITE}${loc}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}
    <priority>${priority}</priority>
  </url>`;

export const GET: RequestHandler = async () => {
	const posts = getPosts();
	const projects = getAllProjects().filter((p) => p.html.trim().length > 0);
	const latestPost = posts[0]?.date;

	const entries: Entry[] = [
		{ loc: '/', lastmod: latestPost, priority: '1.0' },
		{ loc: '/writing', lastmod: latestPost, priority: '0.9' },
		{ loc: '/projects', priority: '0.9' },
		{ loc: '/about', priority: '0.8' },
		...posts.map((p) => ({ loc: `/writing/${p.slug}`, lastmod: p.date, priority: '0.8' })),
		...getTags().map(({ tag }) => ({ loc: `/writing/tag/${tag}`, priority: '0.4' })),
		...projects.map((p) => ({
			loc: `/projects/${p.slug}`,
			lastmod: p.publishedAt?.slice(0, 10),
			priority: '0.7'
		}))
	];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.map(url).join('')}
</urlset>`;

	return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
};
