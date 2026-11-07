export const SITE_URL = 'https://noelzappy.dev';

export const SITE_TITLE = 'Emmanuel Yeboah — Product Engineer · Mobile, Web & Backend';

export const SITE_DESCRIPTION =
	'I design and build software products end to end — mobile apps, web platforms and the backends behind them — and ship them to production. Best at products that move money.';

export const SITE_KEYWORDS = [
	'Emmanuel Yeboah',
	'Noel Zappy',
	'product engineer',
	'mobile app development',
	'web app development',
	'React Native',
	'Expo',
	'distributed systems',
	'Go',
	'platform engineering',
	'API design',
	'event-driven architecture',
	'database migrations',
	'systems reliability',
	'mobile money',
	'Paystack',
	'Flutterwave',
	'Hubtel',
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
	jobTitle: 'Product Engineer',
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
