import { getPosts } from '$lib/content/writing';
import { toPostItem } from '$lib/content/posts-view';
import { getFeaturedProjects, getPillProjects } from '$lib/data/projects-loader';
import { toWorkItem } from '$lib/content/projects-view';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load: PageServerLoad = async () => ({
	pills: getPillProjects(),
	posts: getPosts().slice(0, 3).map(toPostItem),
	// Display order comes from each project's `featuredOrder` frontmatter.
	projects: getFeaturedProjects(6).map(toWorkItem)
});
