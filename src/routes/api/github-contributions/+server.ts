import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

const GITHUB_USERNAME = 'noelzappy';
const GITHUB_API_URL = 'https://api.github.com/graphql';

type ContributionDay = {
	contributionCount: number;
	date: string;
};

type Week = {
	contributionDays: ContributionDay[];
};

type ContributionCalendar = {
	totalContributions: number;
	weeks: Week[];
};

export const GET: RequestHandler = async ({ platform }) => {
	const GITHUB_ACCESS_TOKEN = platform?.env?.GITHUB_ACCESS_TOKEN;

	if (!GITHUB_ACCESS_TOKEN) {
		return json({ error: 'GitHub token not found' }, { status: 500 });
	}

	const headers = {
		Authorization: `bearer ${GITHUB_ACCESS_TOKEN}`,
		'Content-Type': 'application/json',
		'User-Agent': 'SvelteKit-GitHub-Contributions-Fetcher'
	};

	const body = {
		query: `
      query($userName: String!) {
        user(login: $userName) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                  contributionLevel
                }
              }
            }
          }
        }
      }
    `,
		variables: {
			userName: GITHUB_USERNAME
		}
	};

	try {
		const response = await fetch(GITHUB_API_URL, {
			method: 'POST',
			headers,
			body: JSON.stringify(body)
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error('GitHub API error:', errorText);
			return json(
				{ error: 'Failed to fetch data from GitHub', details: errorText },
				{ status: response.status }
			);
		}

		const githubData = await response.json();

		if (githubData.errors) {
			console.error('GitHub API GraphQL errors:', githubData.errors);
			return json(
				{ error: 'GitHub API returned errors', details: githubData.errors },
				{ status: 400 }
			);
		}

		const contributionCalendar: ContributionCalendar =
			githubData.data.user.contributionsCollection.contributionCalendar;

		return json({
			totalContributions: contributionCalendar.totalContributions,
			weeks: contributionCalendar.weeks
		});
	} catch (error) {
		console.error('Error fetching GitHub contributions:', error);
		return json({ error: 'An unexpected error occurred' }, { status: 500 });
	}
};
