import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { fetchSelectedGithubRepos } from '$lib/integrations/github';

export const GET: RequestHandler = async ({ platform }) => {
	const GITHUB_ACCESS_TOKEN = platform?.env?.GITHUB_ACCESS_TOKEN;

	if (!GITHUB_ACCESS_TOKEN) {
		return json({ error: 'GitHub token not found' }, { status: 500 });
	}

	try {
		const repos = await fetchSelectedGithubRepos(GITHUB_ACCESS_TOKEN);
		return json({ repos });
	} catch (error) {
		console.error('Error fetching GitHub repos:', error);
		return json({ error: 'Failed to fetch repositories' }, { status: 500 });
	}
};
