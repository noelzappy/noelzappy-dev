import { getPosts, getTags } from '$lib/content/writing';
import { toPostItem } from '$lib/content/posts-view';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load: PageServerLoad = async () => ({
	posts: getPosts().map(toPostItem),
	tags: getTags()
});
