/**
 * Pure helpers for the capture scripts (argument parsing, manifest validation, paths, command
 * construction, CSS). No I/O beyond reading a byte array, so everything here is unit-tested.
 */
import { webpSize } from '../../src/lib/server/image-size';
import type { IosShot, ProjectCapture, WebShot } from './projects';

export { webpSize };

// ---------- arguments ----------

export interface ParsedArgs {
	positionals: string[];
	flags: Record<string, string | true>;
}

/**
 * Minimal argv parser: `--flag`, `--key value`, `--key=value`. Names in `booleans` never take a
 * value, so `--auto home` keeps `home` as a positional.
 */
export function parseArgs(argv: string[], booleans: string[] = []): ParsedArgs {
	const positionals: string[] = [];
	const flags: Record<string, string | true> = {};
	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];
		if (!arg.startsWith('--')) {
			positionals.push(arg);
			continue;
		}
		const eq = arg.indexOf('=');
		const key = arg.slice(2, eq === -1 ? undefined : eq);
		if (eq !== -1) flags[key] = arg.slice(eq + 1);
		else if (booleans.includes(key)) flags[key] = true;
		else if (i + 1 < argv.length && !argv[i + 1].startsWith('--')) flags[key] = argv[++i];
		else flags[key] = true;
	}
	return { positionals, flags };
}

/** String value of a flag, or undefined when absent or given without a value. */
export function flagString(args: ParsedArgs, key: string): string | undefined {
	const value = args.flags[key];
	return typeof value === 'string' ? value : undefined;
}

// ---------- names and paths ----------

export function slugify(input: string): string {
	return input
		.normalize('NFKD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

/** Slugified base name of a file, extension removed. */
export function slugFromFilename(filename: string): string {
	const base = filename.replace(/^.*[\\/]/, '').replace(/\.[^.]+$/, '');
	return slugify(base);
}

export const PORTFOLIO_DIR = 'static/portfolio';

export function outputPath(slug: string, name: string): string {
	return `${PORTFOLIO_DIR}/${slug}/${name}.webp`;
}

/** The public path a frontmatter `src` uses. */
export function publicPath(slug: string, name: string): string {
	return `/portfolio/${slug}/${name}.webp`;
}

export type ShotKind = 'phone' | 'browser';

export function frontmatterSnippet(slug: string, name: string, kind: ShotKind): string {
	return `- { src: '${publicPath(slug, name)}', alt: 'TODO describe', kind: '${kind}' }`;
}

/** Unique names, in order, with duplicates made unique by a numeric suffix (-2, -3, ...). */
export function uniqueNames(names: string[]): string[] {
	const seen = new Map<string, number>();
	return names.map((name) => {
		const count = (seen.get(name) ?? 0) + 1;
		seen.set(name, count);
		return count === 1 ? name : `${name}-${count}`;
	});
}

/** Natural, case-insensitive sort so IMG_2 comes before IMG_10. */
export function sortFilenames(names: string[]): string[] {
	return [...names].sort((a, b) =>
		a.localeCompare(b, 'en', { numeric: true, sensitivity: 'base' })
	);
}

export const MAX_WIDTH: Record<ShotKind, number> = { phone: 1179, browser: 2880 };

/** Resulting size when a width-capped image is scaled down (never up). */
export function cappedSize(
	width: number,
	height: number,
	maxWidth: number
): { width: number; height: number } {
	if (width <= maxWidth) return { width, height };
	return { width: maxWidth, height: Math.round((height * maxWidth) / width) };
}

export function parseKind(value: string | undefined): ShotKind {
	if (value === undefined) return 'phone';
	if (value === 'phone' || value === 'browser') return value;
	throw new Error(`--kind must be "phone" or "browser", got "${value}"`);
}

// ---------- cwebp ----------

export function cwebpArgs(input: string, output: string, maxWidth?: number): string[] {
	const args = ['-quiet', '-q', '90'];
	if (maxWidth) args.push('-resize', String(maxWidth), '0');
	args.push(input, '-o', output);
	return args;
}

// ---------- PNG / WebP inspection ----------

/** Pixel size from a PNG's IHDR chunk, or null if the bytes are not a PNG. */
export function pngSize(bytes: Uint8Array): { width: number; height: number } | null {
	const sig = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
	if (bytes.length < 24 || sig.some((b, i) => bytes[i] !== b)) return null;
	const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	return { width: view.getUint32(16), height: view.getUint32(20) };
}

/** FourCC of every top-level chunk in a WebP file (e.g. VP8X, ICCP, EXIF, XMP , VP8 ). */
export function webpChunks(bytes: Uint8Array): string[] {
	const tag = (at: number) => String.fromCharCode(...bytes.subarray(at, at + 4));
	if (bytes.length < 12 || tag(0) !== 'RIFF' || tag(8) !== 'WEBP') return [];
	const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	const chunks: string[] = [];
	let at = 12;
	while (at + 8 <= bytes.length) {
		chunks.push(tag(at));
		const size = view.getUint32(at + 4, true);
		at += 8 + size + (size % 2);
	}
	return chunks;
}

/** True when a WebP carries EXIF or XMP metadata. */
export function hasMetadata(bytes: Uint8Array): boolean {
	return webpChunks(bytes).some((c) => c === 'EXIF' || c === 'XMP ');
}

// ---------- web capture ----------

export const VIEWPORT = { width: 1440, height: 900 } as const;
export const DEVICE_SCALE_FACTOR = 2;

/** Cookie and consent banners from common vendors, hidden on every web shot. */
export const CONSENT_SELECTORS = [
	'#onetrust-consent-sdk',
	'#CybotCookiebotDialog',
	'.cc-window',
	'.cookie-banner',
	'.cookie-consent',
	'.cookie-notice',
	'[id*="cookie-banner" i]',
	'[id*="cookie-consent" i]',
	'[class*="cookie-banner" i]',
	'[class*="cookie-consent" i]',
	'[aria-label*="cookie" i][role="dialog"]',
	'[data-testid="cookie-banner"]'
];

/** CSS that hides the given selectors, the consent banners, and scrollbars. */
export function buildHideCss(hide: string[] = []): string {
	const selectors = [...CONSENT_SELECTORS, ...hide.map((s) => s.trim()).filter(Boolean)];
	return [
		`${selectors.join(',\n')} { display: none !important; visibility: hidden !important; }`,
		'html, body { scrollbar-width: none !important; }',
		'::-webkit-scrollbar { display: none !important; width: 0 !important; height: 0 !important; }'
	].join('\n');
}

/**
 * Resolves a manifest base URL from an env var name. Throws a clear error when neither the
 * variable nor a default is set.
 */
export function resolveBaseUrl(
	envName: string,
	env: Record<string, string | undefined>,
	fallback?: string
): string {
	const value = env[envName]?.trim() || fallback;
	if (!value) {
		throw new Error(
			`Missing base URL: set ${envName} (for example ${envName}=http://localhost:3000) and re-run.`
		);
	}
	return value.replace(/\/+$/, '');
}

export function requireEnv(name: string, env: Record<string, string | undefined>): string {
	const value = env[name];
	if (!value) throw new Error(`Missing credential: set the ${name} environment variable.`);
	return value;
}

/** Joins a base URL and a path; absolute URLs pass through. */
export function joinUrl(base: string, path: string): string {
	if (/^https?:\/\//i.test(path)) return path;
	return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}

export function pickWebShots(shots: WebShot[], only?: string): WebShot[] {
	return pickShots(shots, only);
}

export function pickIosShots(shots: IosShot[], only?: string): IosShot[] {
	return pickShots(shots, only);
}

function pickShots<T extends { name: string }>(shots: T[], only?: string): T[] {
	if (!only) return shots;
	const found = shots.filter((s) => s.name === only);
	if (!found.length) {
		throw new Error(`No shot named "${only}". Available: ${shots.map((s) => s.name).join(', ')}`);
	}
	return found;
}

// ---------- iOS ----------

export const STATUS_BAR = {
	time: '9:41',
	batteryState: 'charged',
	batteryLevel: '100',
	cellularBars: '4',
	wifiBars: '3',
	dataNetwork: 'wifi'
} as const;

/** Arguments (after `xcrun`) that set the clean marketing status bar. */
export function statusBarOverrideArgs(): string[] {
	return [
		'simctl',
		'status_bar',
		'booted',
		'override',
		'--time',
		STATUS_BAR.time,
		'--batteryState',
		STATUS_BAR.batteryState,
		'--batteryLevel',
		STATUS_BAR.batteryLevel,
		'--cellularBars',
		STATUS_BAR.cellularBars,
		'--wifiBars',
		STATUS_BAR.wifiBars,
		'--dataNetwork',
		STATUS_BAR.dataNetwork
	];
}

export function statusBarClearArgs(): string[] {
	return ['simctl', 'status_bar', 'booted', 'clear'];
}

export function screenshotArgs(output: string): string[] {
	return ['simctl', 'io', 'booted', 'screenshot', '--type=png', output];
}

export interface SimDevice {
	udid: string;
	name: string;
	state: string;
	isAvailable?: boolean;
	runtime: string;
}

interface SimctlList {
	devices?: Record<string, { udid: string; name: string; state: string; isAvailable?: boolean }[]>;
}

/** Flattens `xcrun simctl list -j devices` output; unavailable devices are dropped. */
export function parseSimctlDevices(json: string | SimctlList): SimDevice[] {
	const data: SimctlList = typeof json === 'string' ? JSON.parse(json) : json;
	const out: SimDevice[] = [];
	for (const [runtime, devices] of Object.entries(data.devices ?? {})) {
		for (const d of devices) {
			if (d.isAvailable === false) continue;
			out.push({ ...d, runtime });
		}
	}
	return out;
}

/** Numeric iOS version from a runtime id like com.apple.CoreSimulator.SimRuntime.iOS-17-5. */
export function runtimeVersion(runtime: string): number[] | null {
	const m = /\.iOS-([\d-]+)$/.exec(runtime);
	return m ? m[1].split('-').map(Number) : null;
}

function compareVersions(a: number[], b: number[]): number {
	for (let i = 0; i < Math.max(a.length, b.length); i++) {
		const d = (a[i] ?? 0) - (b[i] ?? 0);
		if (d) return d;
	}
	return 0;
}

/** Booted match first, otherwise the match on the newest iOS runtime. iOS runtimes only. */
export function pickDevice(devices: SimDevice[], name: string): SimDevice | undefined {
	const matches = devices.filter((d) => d.name === name && runtimeVersion(d.runtime));
	const booted = matches.find((d) => d.state === 'Booted');
	if (booted) return booted;
	return matches.sort((a, b) =>
		compareVersions(runtimeVersion(b.runtime)!, runtimeVersion(a.runtime)!)
	)[0];
}

// ---------- manifest validation ----------

const ENV_NAME = /^[A-Z][A-Z0-9_]*$/;
const SHOT_NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Problems with a manifest, as human-readable strings. Empty means valid. `knownSlugs` are the
 * project slugs that exist in src/content/projects.
 */
export function validateManifest(
	manifest: Record<string, ProjectCapture>,
	knownSlugs: string[]
): string[] {
	const errors: string[] = [];
	const checkNames = (where: string, names: string[]) => {
		const seen = new Set<string>();
		for (const name of names) {
			if (!SHOT_NAME.test(name))
				errors.push(`${where}: shot name "${name}" is not a kebab-case slug`);
			if (seen.has(name)) errors.push(`${where}: duplicate shot name "${name}"`);
			seen.add(name);
		}
		if (!names.length) errors.push(`${where}: no shots`);
	};
	const checkEnv = (where: string, name: string) => {
		if (!ENV_NAME.test(name))
			errors.push(`${where}: env var name "${name}" is not UPPER_SNAKE_CASE`);
	};

	for (const [slug, project] of Object.entries(manifest)) {
		if (!knownSlugs.includes(slug))
			errors.push(`${slug}: no matching file in src/content/projects`);
		if (!project.web && !project.ios) errors.push(`${slug}: has neither web nor ios`);
		const { web, ios } = project;
		if (web) {
			checkEnv(`${slug}.web.baseUrlEnv`, web.baseUrlEnv);
			checkNames(
				`${slug}.web`,
				web.shots.map((s) => s.name)
			);
			for (const s of web.shots) {
				if (!s.path.startsWith('/') && !/^https?:\/\//.test(s.path))
					errors.push(
						`${slug}.web: shot "${s.name}" path must start with "/" or be an absolute URL`
					);
			}
			if (web.defaultBaseUrl && !/^https?:\/\//.test(web.defaultBaseUrl))
				errors.push(`${slug}.web: defaultBaseUrl must be http(s)`);
			if (web.login) {
				checkEnv(`${slug}.web.login.emailEnv`, web.login.emailEnv);
				checkEnv(`${slug}.web.login.passwordEnv`, web.login.passwordEnv);
				if (web.login.emailEnv === web.login.passwordEnv)
					errors.push(`${slug}.web.login: emailEnv and passwordEnv must differ`);
			}
		}
		if (ios) {
			if (!ios.device.trim()) errors.push(`${slug}.ios: device is empty`);
			checkNames(
				`${slug}.ios`,
				ios.shots.map((s) => s.name)
			);
			if (ios.bundleId !== undefined && !/^[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/.test(ios.bundleId))
				errors.push(`${slug}.ios: bundleId "${ios.bundleId}" is not a reverse-DNS id`);
		}
	}
	return errors;
}
