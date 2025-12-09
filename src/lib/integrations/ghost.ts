import GhostContentAPI from '@tryghost/content-api';

const api = new GhostContentAPI({
	url: 'https://cms.noelzappy.dev',
	key: '2eb51bfb14a886e3ade9604e72', // process.env.GHOST_CONTENT_API_KEY || '',
	version: 'v6.10'
});

export async function getFeaturedProjects() {
	const posts = await api.posts.browse({
		limit: 3,
		filter: 'featured:true+tag:projects',
		order: 'published_at DESC'
	});
	return posts;
}

export async function getFeaturedNotes() {
	const posts = await api.posts.browse({
		limit: 10,
		filter: 'featured:true+tag:-projects',
		order: 'published_at DESC'
	});
	return posts;
}

export async function fetchPosts(page: number = 1, limit: number = 10) {
	const posts = await api.posts.browse({
		page,
		limit,
		filter: 'tag:-projects',
		order: 'published_at DESC'
	});
	return posts;
}

export async function fetchPostBySlug(slug: string) {
	const post = await api.posts.read({ slug });
	return post;
}

export async function fetchProjectPosts(page: number = 1, limit: number = 10) {
	const posts = await api.posts.browse({
		page,
		limit,
		filter: 'tag:projects',
		order: 'published_at DESC'
	});
	return posts;
}
