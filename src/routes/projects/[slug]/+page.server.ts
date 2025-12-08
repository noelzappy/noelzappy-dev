import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { fetchPostBySlug } from '$lib/integrations/ghost';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const post = await fetchPostBySlug(params.slug);

		if (post) {
			return {
				project: {
					id: post.id,
					slug: post.slug,
					title: post.title,
					html: post.html,
					publishedAt: post.published_at,
					updatedAt: post.updated_at,
					featureImage: post.feature_image,
					excerpt: post.excerpt,
					tags: post.tags?.map((tag) => tag.name) || [],
					readingTime: post.reading_time || 0
				}
			};
		}
	} catch (err) {
		console.error('Error fetching project:', err);
	}

	error(404, 'Project not found');
};
