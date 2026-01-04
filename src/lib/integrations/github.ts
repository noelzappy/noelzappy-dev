import { GITHUB_USERNAME, GITHUB_API_URL } from '$lib/shared/constants';

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

const GH_REPOS = [
	'voltax',
	'gptalks',
	'chatgpt-whatsapp',
	'react-picture-annotation',
	'gptalks-api',
	'vi-upper',
	'noelzappy-dev',
	'plant-chat-mobile',
	'gama-lms-backend',
	'remora-landing-website',
	'Zappy.codes',
	'vaporshop'
];
export const fetchSelectedGithubRepos = async (accessToken: string) => {
	const headers = {
		Authorization: `bearer ${accessToken}`,
		'Content-Type': 'application/json',
		'User-Agent': 'SvelteKit-Selected-Repos-Fetcher'
	};

	// Build dynamic query to fetch only specific repositories
	const repoQueries = GH_REPOS.map(
		(repo, index) => `
        repo${index}: repository(owner: $userName, name: "${repo}") {
            name
            description
            url
            stargazerCount
            forkCount
            primaryLanguage {
                name
                color
            }
        }`
	).join('\n');

	const body = {
		query: `
        query($userName: String!) {
            ${repoQueries}
        }
        `,
		variables: {
			userName: GITHUB_USERNAME
		}
	};

	const response = await fetch(GITHUB_API_URL, {
		method: 'POST',
		headers,
		body: JSON.stringify(body)
	});

	if (!response.ok) {
		const errorText = await response.text();
		console.error('GitHub API error:', errorText);
		throw new Error(errorText);
	}

	const githubData = await response.json();

	if (githubData.errors) {
		console.error('GitHub API GraphQL errors:', githubData.errors);
		throw new Error(JSON.stringify(githubData.errors));
	}

	const selectedRepos = Object.values(githubData.data).filter(Boolean);

	return selectedRepos;
};

export const fetchPinnedRepos = async (accessToken: string) => {
	const headers = {
		Authorization: `bearer ${accessToken}`,
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

	const response = await fetch(GITHUB_API_URL, {
		method: 'POST',
		headers,
		body: JSON.stringify(body)
	});

	if (!response.ok) {
		const errorText = await response.text();
		console.error('GitHub API error:', errorText);
		throw new Error(errorText);
	}

	const githubData = await response.json();

	if (githubData.errors) {
		console.error('GitHub API GraphQL errors:', githubData.errors);
		throw new Error(JSON.stringify(githubData.errors));
	}

	return githubData?.data?.user?.pinnedItems?.nodes;
};

export const fetchContributions = async (accessToken: string) => {
	const headers = {
		Authorization: `bearer ${accessToken}`,
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

	const response = await fetch(GITHUB_API_URL, {
		method: 'POST',
		headers,
		body: JSON.stringify(body)
	});

	if (!response.ok) {
		const errorText = await response.text();
		console.error('GitHub API error:', errorText);
		throw new Error(errorText);
	}

	const githubData = await response.json();

	if (githubData.errors) {
		console.error('GitHub API GraphQL errors:', githubData.errors);
		throw new Error(JSON.stringify(githubData.errors));
	}

	const contributionCalendar: ContributionCalendar =
		githubData.data.user.contributionsCollection.contributionCalendar;

	return {
		totalContributions: contributionCalendar.totalContributions,
		weeks: contributionCalendar.weeks
	};
};
