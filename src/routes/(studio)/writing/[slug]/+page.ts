import { error } from '@sveltejs/kit';
import { getPost, getPosts } from '$lib/content/writing';
import type { EntryGenerator, PageLoad } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => getPosts().map((p) => ({ slug: p.slug }));

export const load: PageLoad = async ({ params }) => {
	const post = getPost(params.slug);
	if (!post) error(404, 'Post not found');
	// Posts are newest first: the previous index is the newer post.
	const all = getPosts();
	const i = all.findIndex((p) => p.slug === post.slug);
	const link = (p?: { slug: string; title: string }) =>
		p ? { slug: p.slug, title: p.title } : null;
	return {
		slug: post.slug,
		title: post.title,
		date: post.date,
		tags: post.tags,
		description: post.description,
		component: post.component,
		newer: link(all[i - 1]),
		older: link(all[i + 1])
	};
};
