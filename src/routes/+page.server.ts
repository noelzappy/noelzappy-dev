import { getFeaturedProjects as getMarkdownFeaturedProjects } from '$lib/data/projects-loader';
import { getFeaturedNotes } from '$lib/integrations/ghost';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const markdownProjects = getMarkdownFeaturedProjects();
		const notes = getFeaturedNotes().catch(() => []);

		// Transform markdown projects to match Ghost API format
		const projects = markdownProjects.map((project) => ({
			id: project.slug,
			slug: project.slug,
			title: project.title,
			excerpt: project.excerpt,
			published_at: project.published_at,
			feature_image: project.feature_image || '',
			tags: []
		}));

		return {
			streamed: {
				posts: Promise.resolve(projects),
				notes: notes
			}
		};
	} catch {
		return {
			streamed: {
				posts: Promise.resolve([]),
				notes: Promise.resolve([])
			}
		};
	}
};
