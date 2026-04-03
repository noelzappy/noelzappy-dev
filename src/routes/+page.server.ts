import { getFeaturedProjects } from '$lib/data/projects-loader';
import { getFeaturedNotes } from '$lib/integrations/ghost';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const featuredProjects = getFeaturedProjects(2);
		const featuredNotes = getFeaturedNotes()
			.then((notes) => notes.slice(0, 3))
			.catch(() => []);

		return {
			projects: featuredProjects.map((p) => ({
				slug: p.slug,
				title: p.title,
				excerpt: p.excerpt,
				featuredImage: p.featuredImage || '',
				status: p.status || '',
				role: p.role || '',
				client: p.client || '',
				featuredStack: p.featuredStack || [],
				stats: p.stats || []
			})),
			streamed: {
				featuredNotes
			}
		};
	} catch {
		return {
			projects: [],
			streamed: {
				featuredNotes: Promise.resolve([])
			}
		};
	}
};
