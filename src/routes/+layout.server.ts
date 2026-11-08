import { getPosts } from '$lib/content/writing';
import { getShowcase } from '$lib/data/showcase';
import { getAllProjects, getPillProjects } from '$lib/data/projects-loader';
import type { MenuPill, MenuPost } from '$lib/components/site-menu.svelte';

export function load() {
	// Metadata only: the `component` of a Post must never be serialised into page data.
	const posts: MenuPost[] = getPosts()
		.slice(0, 3)
		.map(({ slug, title, date, tags, description }) => ({ slug, title, date, tags, description }));
	// The menu only needs names and links; the homepage loads the full pill data itself.
	const pills: MenuPill[] = getPillProjects().map(({ slug, title }) => ({ slug, title }));
	// Slugs that can be morphed into: a case-study page whose top shows a brand field and a
	// composition (the case study only names its showcase then).
	const writeups = getAllProjects()
		.filter((p) => p.html.trim().length > 0 && p.brandColor && getShowcase(p))
		.map((p) => p.slug);
	return { pills, posts, writeups };
}
