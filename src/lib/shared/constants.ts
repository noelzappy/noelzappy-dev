export const SITE_URL = 'https://noelzappy.dev';

export const SITE_TITLE = 'Emmanuel Yeboah — Backend & Payments Engineer for African Fintech';

export const SITE_DESCRIPTION =
	'Independent backend engineer for companies moving money in Africa. I build and fix payment integrations, ledgers and zero-downtime migrations — MoMo, Paystack, Flutterwave, Hubtel.';

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
	'systems reliability',
	'payments engineer',
	'mobile money',
	'Paystack',
	'Flutterwave',
	'Hubtel',
	'fintech consultant',
	'Ghana',
	'Africa'
];

export const HomepageStructuredData = {
	'@context': 'https://schema.org',
	'@type': 'Person',
	name: 'Emmanuel Yeboah',
	alternateName: 'Noel Zappy',
	url: SITE_URL,
	image: `${SITE_URL}/zappy-face.jpg`,
	email: 'me@noelzappy.dev',
	sameAs: [
		'https://github.com/noelzappy',
		'https://x.com/noelzappy',
		'https://linkedin.com/in/noelzappy'
	],
	jobTitle: 'Backend & Payments Engineer',
	description: SITE_DESCRIPTION,
	address: { '@type': 'PostalAddress', addressLocality: 'Accra', addressCountry: 'GH' },
	knowsAbout: [
		'Payment integrations',
		'Mobile money',
		'Ledgers',
		'Database migrations',
		'Go',
		'TypeScript'
	]
};
