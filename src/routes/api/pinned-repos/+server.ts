import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { fetchPinnedRepos } from '$lib/integrations/github';

export const GET: RequestHandler = async ({ platform }) => {
	const GITHUB_ACCESS_TOKEN = platform?.env?.GITHUB_ACCESS_TOKEN;

	if (!GITHUB_ACCESS_TOKEN) {
		return json({ error: 'GitHub token not found' }, { status: 500 });
	}

	try {
		const pinnedItems = await fetchPinnedRepos(GITHUB_ACCESS_TOKEN);

		return json(pinnedItems);
	} catch (error) {
		console.error('Error fetching pinned repositories:', error);
		return json({ error: 'An unexpected error occurred' }, { status: 500 });
	}
};
