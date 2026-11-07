import { error } from '@sveltejs/kit';
import { getPostsByTag, getTags } from '$lib/content/writing';
import { toPostItem } from '$lib/content/posts-view';
import type { EntryGenerator, PageServerLoad } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => getTags().map(({ tag }) => ({ tag }));

export const load: PageServerLoad = async ({ params }) => {
	const posts = getPostsByTag(params.tag).map(toPostItem);
	if (!posts.length) error(404, 'No posts with that tag');
	return { tag: params.tag, posts };
};
