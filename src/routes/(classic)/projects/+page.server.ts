import { getAllProjects } from '$lib/data/projects-loader';
import { toProjectItem } from '$lib/content/projects-view';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load: PageServerLoad = async () => {
	const all = getAllProjects();
	return {
		caseStudies: all.filter((p) => p.kind === 'case-study').map(toProjectItem),
		openSource: all.filter((p) => p.kind === 'open-source').map(toProjectItem)
	};
};
