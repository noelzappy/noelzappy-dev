import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { GITHUB_ACCESS_TOKEN } from '$env/static/private';
import { fetchSelectedGithubRepos } from '$lib/integrations/github';

export const GET: RequestHandler = async () => {
	try {
		const repos = await fetchSelectedGithubRepos(GITHUB_ACCESS_TOKEN);
		return json({ repos });
	} catch (error) {
		console.error('Error fetching GitHub repos:', error);
		return json({ error: 'Failed to fetch repositories' }, { status: 500 });
	}
};
