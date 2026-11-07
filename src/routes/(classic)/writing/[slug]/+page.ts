import { error } from '@sveltejs/kit';
import { getPost, getPosts } from '$lib/content/writing';
import type { EntryGenerator, PageLoad } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => getPosts().map((p) => ({ slug: p.slug }));

export const load: PageLoad = async ({ params }) => {
	const post = getPost(params.slug);
	if (!post) error(404, 'Post not found');
	return {
		slug: post.slug,
		title: post.title,
		date: post.date,
		tags: post.tags,
		description: post.description,
		component: post.component
	};
};
