import { getPillProjects } from '$lib/data/projects-loader';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load: PageServerLoad = async () => ({
	pills: getPillProjects()
});
