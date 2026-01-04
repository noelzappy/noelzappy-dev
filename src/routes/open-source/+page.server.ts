import type { PageServerLoad } from './$types';
import { fetchSelectedGithubRepos, fetchContributions } from '$lib/integrations/github';
import { GITHUB_USERNAME } from '$lib/shared/constants';

export const load: PageServerLoad = async ({ platform }) => {
	const GITHUB_ACCESS_TOKEN = platform?.env?.GITHUB_ACCESS_TOKEN;
	try {
		const [repos, contributions] = await Promise.all([
			fetchSelectedGithubRepos(GITHUB_ACCESS_TOKEN),
			fetchContributions(GITHUB_ACCESS_TOKEN)
		]);

		return {
			repos,
			contributions,
			githubUsername: GITHUB_USERNAME
		};
	} catch (error) {
		console.error('Error loading open source data:', error);
		return {
			repos: [],
			contributions: null,
			githubUsername: GITHUB_USERNAME
		};
	}
};
