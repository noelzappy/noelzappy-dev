import { fetchProjectPosts } from '$lib/integrations/ghost';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const page = Number(url.searchParams.get('page')) || 1;
	const limit = 10;

	try {
		const posts = await fetchProjectPosts(page, limit);

		return {
			projects: posts.map((post) => ({
				id: post.id,
				slug: post.slug,
				title: post.title,
				excerpt: post.excerpt,
				publishedAt: post.published_at,
				featureImage: post.feature_image,
				tags: post.tags?.map((tag) => tag.name) || []
			})),
			pagination: posts.meta?.pagination || {
				page: 1,
				limit,
				pages: 1,
				total: 0,
				prev: null,
				next: null
			}
		};
	} catch {
		return {
			projects: [],
			pagination: {
				page: 1,
				limit,
				pages: 1,
				total: 0,
				prev: null,
				next: null
			}
		};
	}
};
