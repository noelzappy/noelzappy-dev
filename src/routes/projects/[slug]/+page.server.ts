import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getProjectBySlug } from '$lib/data/projects-loader';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const project = getProjectBySlug(params.slug);

		if (project) {
			return {
				project: {
					id: project.slug,
					slug: project.slug,
					title: project.title,
					html: project.html,
					publishedAt: project.published_at,
					updatedAt: project.published_at,
					featureImage: project.feature_image || '',
					excerpt: project.excerpt,
					tags: [],
					readingTime: 0
				}
			};
		}
	} catch (err) {
		console.error('Error fetching project:', err);
	}

	error(404, 'Project not found');
};
