export const SITE_URL = 'https://noelzappy.dev';

export const SITE_TITLE =
	'Emmanuel Yeboah — Backend Engineer | Distributed Systems & Platform Infrastructure';

export const SITE_DESCRIPTION =
	'Backend engineer building high-reliability distributed systems. Six years on correctness-critical infrastructure: transactional datastores, multi-tenant platforms, and zero-downtime migrations at scale. Open to senior remote backend and platform roles.';

export const SITE_KEYWORDS = [
	'Emmanuel Yeboah',
	'Noel Zappy',
	'backend engineer',
	'distributed systems',
	'Go',
	'platform engineering',
	'API design',
	'event-driven architecture',
	'database migrations',
	'systems reliability'
];

export const HomepageStructuredData = {
	'@context': 'https://schema.org',
	'@type': 'Person',
	name: 'Emmanuel Yeboah',
	alternateName: 'Noel Zappy',
	url: SITE_URL,
	image: `${SITE_URL}/zappy-face.jpg`,
	email: 'me@noelzappy.dev',
	sameAs: ['https://github.com/noelzappy', 'https://x.com/noelzappy', 'https://linkedin.com/in/noelzappy'],
	jobTitle: 'Backend Engineer',
	description: SITE_DESCRIPTION,
	address: { '@type': 'PostalAddress', addressLocality: 'Accra', addressCountry: 'GH' },
	knowsAbout: [
		'distributed systems',
		'platform engineering',
		'API design',
		'event-driven architecture',
		'database migrations',
		'systems reliability',
		'Go',
		'PostgreSQL',
		'TypeScript',
		'Node.js'
	]
};
