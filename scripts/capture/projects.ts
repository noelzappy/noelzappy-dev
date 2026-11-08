/**
 * Capture manifest: which screens to capture for which project.
 * Slugs must match a file in src/content/projects. Validated by lib.test.ts.
 *
 * Nothing secret lives here. Base URLs and logins are read from the environment variables NAMED
 * below (never their values), so a missing variable fails loudly at capture time.
 */

export type ColorScheme = 'light' | 'dark';

export interface WebShot {
	/** Output file name, without extension: static/portfolio/<slug>/<name>.webp */
	name: string;
	/** Path (or absolute URL) opened after login, relative to the base URL. */
	path: string;
	/** Selector to wait for before capturing. Falls back to network idle. */
	waitFor?: string;
	/** Selectors hidden before capture (toasts, dev banners, personal data). */
	hide?: string[];
	/** Selector scrolled into view before capture. */
	scrollTo?: string;
	/** Crop in CSS pixels instead of the full viewport. */
	clip?: { x: number; y: number; width: number; height: number };
	/** Defaults to light. */
	colorScheme?: ColorScheme;
}

export interface WebLogin {
	/** Login page, relative to the base URL. */
	url: string;
	/** Names of env vars holding the credentials. */
	emailEnv: string;
	passwordEnv: string;
	emailSelector: string;
	passwordSelector: string;
	submitSelector: string;
	/** Selector that only exists once signed in. */
	successWaitFor: string;
}

export interface WebTarget {
	/** Name of the env var holding the base URL, e.g. CAPTURE_SUSUPAA_URL. */
	baseUrlEnv: string;
	/** Used when the env var is unset. Only for public sites. */
	defaultBaseUrl?: string;
	shots: WebShot[];
	login?: WebLogin;
}

export interface IosShot {
	name: string;
	/** Opened with `xcrun simctl openurl` before the shot. */
	deepLink?: string;
	/** Shown in the terminal as a prompt for what to set up on screen. */
	note?: string;
}

export interface IosTarget {
	/** Simulator device name, e.g. 'iPhone 17 Pro'. */
	device: string;
	/** Launched with `xcrun simctl launch` when set. */
	bundleId?: string;
	shots: IosShot[];
}

export interface ProjectCapture {
	web?: WebTarget;
	ios?: IosTarget;
}

const PHONE_SHOTS = (key: string): IosShot[] => [
	{ name: 'home', note: 'Landing screen after sign-in, populated with believable demo data' },
	{ name: 'key-action', note: key },
	{ name: 'success', note: 'Confirmation or result screen' }
];

const DEVICE = 'iPhone 17 Pro';

export const manifest: Record<string, ProjectCapture> = {
	'kekeh-mac': {
		ios: {
			device: DEVICE,
			// TODO: Kekeh Mac bundle ID
			bundleId: undefined,
			shots: PHONE_SHOTS('The core ride/order flow, mid-action')
		}
	},
	'susupaa-platform': {
		web: {
			// TODO: SusuPaa staging or local URL, e.g. https://staging.example.com
			baseUrlEnv: 'CAPTURE_SUSUPAA_URL',
			login: {
				// TODO: confirm login URL and selectors
				url: '/login',
				emailEnv: 'CAPTURE_SUSUPAA_EMAIL',
				passwordEnv: 'CAPTURE_SUSUPAA_PASSWORD',
				emailSelector: 'input[type="email"]',
				passwordSelector: 'input[type="password"]',
				submitSelector: 'button[type="submit"]',
				// TODO: a selector that only appears when signed in
				successWaitFor: 'nav'
			},
			shots: [
				// TODO: confirm dashboard path
				{ name: 'dashboard', path: '/dashboard', waitFor: 'main' }
			]
		},
		ios: {
			device: DEVICE,
			// TODO: SusuPaa bundle ID
			bundleId: undefined,
			shots: PHONE_SHOTS('Making a contribution or viewing a susu group')
		}
	},
	'rbl-dating-app': {
		ios: {
			device: DEVICE,
			// TODO: RBL bundle ID
			bundleId: undefined,
			shots: PHONE_SHOTS('Browsing or swiping profiles')
		}
	},
	'built-mobile-app': {
		ios: {
			device: DEVICE,
			// TODO: Built bundle ID
			bundleId: undefined,
			shots: PHONE_SHOTS('Creating an invoice or sending money')
		}
	},
	'givio-platform': {
		web: {
			// TODO: Givio staging or local URL
			baseUrlEnv: 'CAPTURE_GIVIO_URL',
			login: {
				// TODO: confirm login URL and selectors
				url: '/login',
				emailEnv: 'CAPTURE_GIVIO_EMAIL',
				passwordEnv: 'CAPTURE_GIVIO_PASSWORD',
				emailSelector: 'input[type="email"]',
				passwordSelector: 'input[type="password"]',
				submitSelector: 'button[type="submit"]',
				// TODO: a selector that only appears when signed in
				successWaitFor: 'nav'
			},
			shots: [
				// TODO: confirm dashboard path
				{ name: 'dashboard', path: '/dashboard', waitFor: 'main' }
			]
		},
		ios: {
			device: DEVICE,
			// TODO: Givio bundle ID
			bundleId: undefined,
			shots: PHONE_SHOTS('Giving flow, mid-action')
		}
	},
	vemphy: {
		web: {
			baseUrlEnv: 'CAPTURE_VEMPHY_URL',
			defaultBaseUrl: 'https://vemphy.com',
			shots: [{ name: 'verify-desktop', path: '/', waitFor: 'input' }]
		}
	},
	voltax: {
		web: {
			baseUrlEnv: 'CAPTURE_VOLTAX_URL',
			defaultBaseUrl: 'https://voltax.noelzappy.dev',
			shots: [{ name: 'docs', path: '/', waitFor: 'h1' }]
		}
	}
};
