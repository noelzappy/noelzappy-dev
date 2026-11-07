import { getPosts } from '$lib/content/writing';
import type { MenuPost } from '$lib/components/site-menu.svelte';

export function load() {
	// Metadata only: the `component` of a Post must never be serialised into page data.
	const posts: MenuPost[] = getPosts()
		.slice(0, 3)
		.map(({ slug, title, date, tags, description }) => ({ slug, title, date, tags, description }));
	// Task 5 swaps this for getPillProjects().
	const pills: { slug: string; title: string }[] = [];
	return { pills, posts };
}
