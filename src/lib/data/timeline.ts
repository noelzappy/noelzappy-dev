export interface TimelineEntry {
	years: string;
	org: string;
	url?: string;
	writeup?: string;
	line: string;
}

/** Dates are from the previous about page; wording approved in the 2026-09-12 design spec. */
export const TIMELINE: TimelineEntry[] = [
	{
		years: 'Now',
		org: 'Consulting',
		line: 'Backend and platform work for hire. Writing about systems.'
	},
	{
		years: '2025–present',
		org: 'SusuPaa',
		url: 'https://susupaa.com',
		writeup: '/projects/susupaa-platform',
		line: 'Co-founded and led the platform: custom append-only ledger with strict consistency guarantees, 339 organizations, 28 API modules in production. Cut p99 latency from 1.6s to 500ms.'
	},
	{
		years: '2024–present',
		org: 'Brif Africa',
		url: 'https://brif.africa',
		line: 'Co-founder. Editorial platform and a text-to-speech microservice.'
	},
	{
		years: '2024–2025',
		org: 'Fetch Agent',
		url: 'https://fetchagent.com',
		writeup: '/projects/fetch-agent-real-estate-platform',
		line: 'Senior backend engineer. APIs at 50,000+ daily requests under 200ms.'
	},
	{
		years: '2024–2025',
		org: 'RBL Matchmaking',
		url: 'https://rbl-app.com',
		writeup: '/projects/rbl-dating-app',
		line: 'Lead engineer. Zero-downtime migration of 170,000 live users from PHP/MySQL to Node.js/PostgreSQL; real-time messaging for 200,000 monthly actives.'
	},
	{
		years: '2024',
		org: 'Hubtel',
		url: 'https://hubtel.com',
		line: 'Software engineer. Led frontend for Hubtel for Hospitals; contributed to GHQR.'
	},
	{
		years: '2021–2024',
		org: 'Built Financial Technologies',
		url: 'https://built.africa',
		writeup: '/projects/built-mobile-app',
		line: 'Lead mobile and web engineer. Shipped the web platform, two React Native apps, one offline-first, and an HR platform.'
	},
	{
		years: '2019–2021',
		org: 'Wordnox',
		line: 'Frontend engineer. First professional role.'
	}
];
