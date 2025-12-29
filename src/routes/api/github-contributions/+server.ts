import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { fetchContributions } from '$lib/integrations/github';

export const GET: RequestHandler = async ({ platform }) => {
	const GITHUB_ACCESS_TOKEN = platform?.env?.GITHUB_ACCESS_TOKEN;

	if (!GITHUB_ACCESS_TOKEN) {
		return json({ error: 'GitHub token not found' }, { status: 500 });
	}

	try {
		const contributionCalendar = await fetchContributions(GITHUB_ACCESS_TOKEN);

		return json(contributionCalendar);
	} catch (error) {
		console.error('Error fetching GitHub contributions:', error);
		return json({ error: 'An unexpected error occurred' }, { status: 500 });
	}
};
