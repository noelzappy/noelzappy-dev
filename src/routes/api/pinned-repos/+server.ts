import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

const GITHUB_USERNAME = 'noelzappy';
const GITHUB_API_URL = 'https://api.github.com/graphql';

export const GET: RequestHandler = async ({ platform }) => {
	const GITHUB_ACCESS_TOKEN = platform?.env?.GITHUB_ACCESS_TOKEN;

	if (!GITHUB_ACCESS_TOKEN) {
		return json({ error: 'GitHub token not found' }, { status: 500 });
	}

	const headers = {
		Authorization: `bearer ${GITHUB_ACCESS_TOKEN}`,
		'Content-Type': 'application/json',
		'User-Agent': 'SvelteKit-Pinned-Repos-Fetcher'
	};

	const body = {
		query: `
      query($userName: String!) {
        user(login: $userName) {
          pinnedItems(first: 6, types: [REPOSITORY]) {
            nodes {
              ... on Repository {
                name
                description
                url
                stargazerCount
                forkCount
                primaryLanguage {
                  name
                  color
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
				{ error: 'Failed to fetch pinned repositories', details: errorText },
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

		const pinnedItems = githubData.data.user.pinnedItems.nodes;

		return json(pinnedItems);
	} catch (error) {
		console.error('Error fetching pinned repositories:', error);
		return json({ error: 'An unexpected error occurred' }, { status: 500 });
	}
};
