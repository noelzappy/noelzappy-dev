import { getFeaturedProjects as getMarkdownFeaturedProjects } from '$lib/data/projects-loader';
import { getFeaturedNotes } from '$lib/integrations/ghost';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const markdownProjects = getMarkdownFeaturedProjects();
		const notes = getFeaturedNotes().catch(() => []);

		return {
			streamed: {
				projects: Promise.resolve(markdownProjects),
				notes: notes
			}
		};
	} catch {
		return {
			streamed: {
				projects: Promise.resolve([]),
				notes: Promise.resolve([])
			}
		};
	}
};
