export type Project = {
	id: string;
	slug: string;
	title: string;
	tagline: string;
	metadata: {
		type: string;
		status: string;
		timeline: string;
		roles: string[];
	};
	teamSize: number;
	stack: {
		featured: string[];
		full: string[];
	};
	links: {
		live: string | null;
		repo: string | null;
		demoVideo: string | null;
	};
	assets: {
		logo: string;
		thumbnail: string;
		hero: string;
		gallery: string[];
	};
	metrics: {
		label: string;
		value: string;
	}[];
	content: {
		problem: string;
		solution: string;
		technicalChallenge: string;
	};
};
