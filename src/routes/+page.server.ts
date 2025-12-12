import { getFeaturedProjects, getFeaturedNotes } from '$lib/integrations/ghost';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const projects = getFeaturedProjects().catch(() => []),
			notes = getFeaturedNotes().catch(() => []);

		return {
			streamed: {
				posts: projects,
				notes: notes
			}
		};
	} catch {
		return {
			streamed: {
				posts: [],
				notes: []
			}
		};
	}
};
