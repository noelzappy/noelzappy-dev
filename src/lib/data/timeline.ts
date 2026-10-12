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
		line: 'Backend and platform work for hire.'
	},
	{
		years: '2025–present',
		org: 'SusuPaa',
		url: 'https://susupaa.com',
		writeup: '/projects/susupaa-platform',
		line: 'Co-founder and CTO (Pavex Technologies). Built the platform and its custom append-only ledger, the system of record for ₵12.5M+ in successful deposits. Cut p99 API latency from 1.6s to 500ms.'
	},
	{
		years: '2024–2025',
		org: 'Fetch Agent',
		url: 'https://fetchagent.com',
		writeup: '/projects/fetch-agent-real-estate-platform',
		line: 'Web developer (contract). Built the agent-ranking and filtering engine that matches buyers to agents, and the APIs behind the app and admin dashboard, held under 200ms.'
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
		line: 'Frontend engineer. Led frontend for Hubtel for Hospitals; contributed to GHQR.'
	},
	{
		years: '2023–present',
		org: 'The Brifcast Ltd. (Brif)',
		line: 'Co-founder & Managing Partner. Media company telling the stories of African founders, with an editorial side and a small production studio. I run the business side (partnerships, client work, operations) and built the internal tools we use.'
	},
	{
		years: '2021–2024',
		org: 'Built Financial Technologies',
		url: 'https://built.africa',
		writeup: '/projects/built-mobile-app',
		line: 'Mobile app developer. Shipped the web platform, two React Native apps, one offline-first, and an HR platform.'
	},
	{
		years: '2019–2021',
		org: 'Wordnox',
		line: 'Founder (company closed). WordPress sites for clients.'
	}
];
