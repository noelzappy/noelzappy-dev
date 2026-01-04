import type { PageServerLoad } from './$types';
import { GITHUB_ACCESS_TOKEN } from '$env/static/private';
import { fetchSelectedGithubRepos, fetchContributions } from '$lib/integrations/github';
import { GITHUB_USERNAME } from '$lib/shared/constants';

export const load: PageServerLoad = async () => {
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
