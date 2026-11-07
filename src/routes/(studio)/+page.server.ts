import { getPosts } from '$lib/content/writing';
import { toPostItem } from '$lib/content/posts-view';
import { getFeaturedProjects, getPillProjects } from '$lib/data/projects-loader';
import { toProjectItem } from '$lib/content/projects-view';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load: PageServerLoad = async () => ({
	pills: getPillProjects(),
	posts: getPosts().slice(0, 5).map(toPostItem),
	projects: getFeaturedProjects(5).map(toProjectItem)
});
