import { getFeaturedProjects } from '$lib/integrations/ghost';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const posts = await getFeaturedProjects();

		return {
			posts: posts.map((post) => ({
				id: post.id,
				slug: post.slug,
				title: post.title,
				excerpt: post.excerpt,
				publishedAt: post.published_at,
				featureImage: post.feature_image,
				tags: post.tags?.map((tag) => tag.name) || []
			}))
		};
	} catch {
		return {
			posts: []
		};
	}
};
