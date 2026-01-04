type Repo = {
	name: string;
	description: string | null;
	url: string;
	stargazerCount: number;
	forkCount: number;
	primaryLanguage: {
		name: string;
		color: string;
	} | null;
};

export const load = async () => {
	try {
		const response = await fetch('https://noelzappy.dev/api/github-repos');
		if (response.ok) {
			const data: { repos: Repo[] } = await response.json();
			return {
				repos: data.repos
			};
		} else {
			console.error('Failed to fetch GitHub repos:', response.statusText);
			return {
				repos: []
			};
		}
	} catch (error) {
		console.error('Error loading open source projects:', error);
	}
};
