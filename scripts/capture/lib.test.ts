import { readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
	CONSENT_SELECTORS,
	STATUS_BAR,
	buildHideCss,
	cappedSize,
	cwebpArgs,
	flagString,
	frontmatterSnippet,
	hasMetadata,
	joinUrl,
	outputPath,
	parseArgs,
	parseKind,
	parseSimctlDevices,
	pickDevice,
	pickWebShots,
	pngSize,
	publicPath,
	requireSlug,
	resolveBaseUrl,
	screenshotArgs,
	slugFromFilename,
	slugify,
	sortFilenames,
	statusBarClearArgs,
	statusBarOverrideArgs,
	uniqueNames,
	validateManifest,
	webpChunks
} from './lib';
import { manifest, type ProjectCapture } from './projects';

describe('parseArgs', () => {
	it('separates positionals and flags', () => {
		const a = parseArgs(['susupaa-platform', '--shot', 'dashboard', '--dry-run'], ['dry-run']);
		expect(a.positionals).toEqual(['susupaa-platform']);
		expect(flagString(a, 'shot')).toBe('dashboard');
		expect(a.flags['dry-run']).toBe(true);
	});
	it('supports --key=value and keeps positionals after boolean flags', () => {
		const a = parseArgs(['--device=iPhone 15 Pro', '--auto', 'kekeh-mac'], ['auto']);
		expect(flagString(a, 'device')).toBe('iPhone 15 Pro');
		expect(a.positionals).toEqual(['kekeh-mac']);
	});
	it('treats a trailing valueless flag as true, not a string', () => {
		const a = parseArgs(['x', '--shot']);
		expect(a.flags.shot).toBe(true);
		expect(flagString(a, 'shot')).toBeUndefined();
	});
});

describe('names and paths', () => {
	it('slugifies', () => {
		expect(slugify('IMG_0042 (Final).PNG')).toBe('img-0042-final-png');
		expect(slugify('Café Receipt')).toBe('cafe-receipt');
		expect(slugFromFilename('/tmp/shots/IMG_0042 Home.HEIC')).toBe('img-0042-home');
	});
	it('builds output and public paths', () => {
		expect(outputPath('voltax', 'docs')).toBe('static/portfolio/voltax/docs.webp');
		expect(publicPath('voltax', 'docs')).toBe('/portfolio/voltax/docs.webp');
	});
	it('prints a pasteable frontmatter snippet', () => {
		expect(frontmatterSnippet('kekeh-mac', 'home', 'phone')).toBe(
			"- { src: '/portfolio/kekeh-mac/home.webp', alt: 'TODO describe', kind: 'phone' }"
		);
	});
	it('makes duplicate names unique in order', () => {
		expect(uniqueNames(['a', 'b', 'a', 'a'])).toEqual(['a', 'b', 'a-2', 'a-3']);
	});
	it('sorts naturally', () => {
		expect(sortFilenames(['IMG_10.png', 'img_2.png', 'IMG_1.png'])).toEqual([
			'IMG_1.png',
			'img_2.png',
			'IMG_10.png'
		]);
	});
	it('caps width without upscaling', () => {
		expect(cappedSize(1290, 2796, 1179)).toEqual({ width: 1179, height: 2555 });
		expect(cappedSize(1179, 2556, 1179)).toEqual({ width: 1179, height: 2556 });
		expect(cappedSize(800, 600, 2880)).toEqual({ width: 800, height: 600 });
	});
	it('rejects a slug that slugifies to nothing', () => {
		expect(requireSlug('Kekeh Mac')).toBe('kekeh-mac');
		expect(() => requireSlug('///')).toThrow(/no letters or digits/);
		expect(() => requireSlug('')).toThrow();
	});
	it('parses --kind', () => {
		expect(parseKind(undefined)).toBe('phone');
		expect(parseKind('browser')).toBe('browser');
		expect(() => parseKind('tablet')).toThrow(/phone/);
	});
	it('builds cwebp args', () => {
		expect(cwebpArgs('in.png', 'out.webp')).toEqual([
			'-quiet',
			'-q',
			'90',
			'in.png',
			'-o',
			'out.webp'
		]);
		expect(cwebpArgs('in.png', 'out.webp', 1179)).toEqual([
			'-quiet',
			'-q',
			'90',
			'-resize',
			'1179',
			'0',
			'in.png',
			'-o',
			'out.webp'
		]);
	});
});

describe('image inspection', () => {
	it('reads PNG size from IHDR', () => {
		const b = new Uint8Array(24);
		b.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
		new DataView(b.buffer).setUint32(16, 2880);
		new DataView(b.buffer).setUint32(20, 1800);
		expect(pngSize(b)).toEqual({ width: 2880, height: 1800 });
		expect(pngSize(new Uint8Array(30))).toBeNull();
	});
	function webp(chunks: string[]): Uint8Array {
		const parts = chunks.map((c) => {
			const body = new Uint8Array(10);
			const chunk = new Uint8Array(8 + body.length);
			chunk.set([...c].map((ch) => ch.charCodeAt(0)));
			new DataView(chunk.buffer).setUint32(4, body.length, true);
			return chunk;
		});
		const total = 4 + parts.reduce((n, p) => n + p.length, 0);
		const out = new Uint8Array(8 + total);
		out.set([...'RIFF'].map((c) => c.charCodeAt(0)));
		new DataView(out.buffer).setUint32(4, total, true);
		out.set(
			[...'WEBP'].map((c) => c.charCodeAt(0)),
			8
		);
		let at = 12;
		for (const p of parts) {
			out.set(p, at);
			at += p.length;
		}
		return out;
	}
	it('lists WebP chunks and detects metadata', () => {
		expect(webpChunks(webp(['VP8 ']))).toEqual(['VP8 ']);
		expect(hasMetadata(webp(['VP8 ']))).toBe(false);
		expect(hasMetadata(webp(['VP8X', 'VP8 ', 'EXIF']))).toBe(true);
		expect(hasMetadata(webp(['VP8X', 'XMP ', 'VP8 ']))).toBe(true);
		expect(webpChunks(new Uint8Array(4))).toEqual([]);
	});
});

describe('web helpers', () => {
	it('builds hide CSS with consent banners, scrollbars and custom selectors', () => {
		const css = buildHideCss(['.toast', '  #dev-banner  ', '']);
		for (const s of CONSENT_SELECTORS) expect(css).toContain(s);
		expect(css).toContain('.toast');
		expect(css).toContain('#dev-banner');
		expect(css).toContain('display: none !important');
		expect(css).toContain('::-webkit-scrollbar');
		expect(css).not.toMatch(/,\s*,/);
	});
	it('resolves the base URL from env, then the default', () => {
		expect(resolveBaseUrl('X_URL', { X_URL: 'http://localhost:3000/' })).toBe(
			'http://localhost:3000'
		);
		expect(resolveBaseUrl('X_URL', {}, 'https://a.dev')).toBe('https://a.dev');
	});
	it('fails clearly when the base URL env is missing', () => {
		expect(() => resolveBaseUrl('CAPTURE_SUSUPAA_URL', {})).toThrow(/CAPTURE_SUSUPAA_URL/);
		expect(() => resolveBaseUrl('CAPTURE_SUSUPAA_URL', { CAPTURE_SUSUPAA_URL: ' ' })).toThrow();
	});
	it('joins URLs', () => {
		expect(joinUrl('https://a.dev/', '/x/y')).toBe('https://a.dev/x/y');
		expect(joinUrl('https://a.dev', 'https://b.dev/z')).toBe('https://b.dev/z');
	});
	it('picks shots by name', () => {
		const shots = [
			{ name: 'a', path: '/' },
			{ name: 'b', path: '/b' }
		];
		expect(pickWebShots(shots)).toHaveLength(2);
		expect(pickWebShots(shots, 'b')).toEqual([shots[1]]);
		expect(() => pickWebShots(shots, 'nope')).toThrow(/Available: a, b/);
	});
});

describe('simulator helpers', () => {
	it('builds the status bar override command', () => {
		expect(statusBarOverrideArgs('UDID-1')).toEqual([
			'simctl',
			'status_bar',
			'UDID-1',
			'override',
			'--time',
			'9:41',
			'--batteryState',
			'charged',
			'--batteryLevel',
			'100',
			'--cellularBars',
			'4',
			'--wifiBars',
			'3',
			'--dataNetwork',
			'wifi',
			'--operatorName',
			''
		]);
		expect(STATUS_BAR.time).toBe('9:41');
		expect(statusBarClearArgs('UDID-1')).toEqual(['simctl', 'status_bar', 'UDID-1', 'clear']);
		expect(screenshotArgs('UDID-1', 'a.png')).toEqual([
			'simctl',
			'io',
			'UDID-1',
			'screenshot',
			'--type=png',
			'a.png'
		]);
	});
	const list = {
		devices: {
			'com.apple.CoreSimulator.SimRuntime.iOS-17-5': [
				{ udid: 'A', name: 'iPhone 15 Pro', state: 'Shutdown', isAvailable: true },
				{ udid: 'B', name: 'iPhone 15', state: 'Shutdown', isAvailable: true }
			],
			'com.apple.CoreSimulator.SimRuntime.iOS-18-0': [
				{ udid: 'C', name: 'iPhone 15 Pro', state: 'Shutdown', isAvailable: true },
				{ udid: 'D', name: 'iPhone 15 Pro', state: 'Shutdown', isAvailable: false }
			],
			'com.apple.CoreSimulator.SimRuntime.watchOS-11-0': [
				{ udid: 'W', name: 'iPhone 15 Pro', state: 'Shutdown', isAvailable: true }
			]
		}
	};
	it('parses simctl JSON and drops unavailable devices', () => {
		const devices = parseSimctlDevices(JSON.stringify(list));
		expect(devices.map((d) => d.udid)).toEqual(['A', 'B', 'C', 'W']);
	});
	it('prefers a booted device, then the newest iOS runtime, ignoring non-iOS runtimes', () => {
		const devices = parseSimctlDevices(list);
		expect(pickDevice(devices, 'iPhone 15 Pro')?.udid).toBe('C');
		const booted = devices.map((d) => (d.udid === 'A' ? { ...d, state: 'Booted' } : d));
		expect(pickDevice(booted, 'iPhone 15 Pro')?.udid).toBe('A');
		expect(pickDevice(devices, 'iPhone 99')).toBeUndefined();
	});
});

describe('manifest', () => {
	const slugs = readdirSync('src/content/projects')
		.filter((f) => f.endsWith('.md'))
		.map((f) => f.replace(/\.md$/, ''));

	it('is valid against the real projects', () => {
		expect(validateManifest(manifest, slugs)).toEqual([]);
	});
	it('seeds the expected projects', () => {
		expect(Object.keys(manifest).sort()).toEqual(
			[
				'built-mobile-app',
				'givio-platform',
				'kekeh-mac',
				'rbl-dating-app',
				'susupaa-platform',
				'voltax'
			].sort()
		);
		expect(manifest.voltax.web?.defaultBaseUrl).toBe('https://voltax.noelzappy.dev');
	});
	it('stores env var names, never credential values', () => {
		for (const p of Object.values(manifest)) {
			if (p.web?.login) {
				expect(p.web.login.emailEnv).toMatch(/^CAPTURE_[A-Z]+_EMAIL$/);
				expect(p.web.login.passwordEnv).toMatch(/^CAPTURE_[A-Z]+_PASSWORD$/);
			}
		}
	});
	it('flags unknown slugs, duplicate shot names, bad env names and bad bundle ids', () => {
		const bad: Record<string, ProjectCapture> = {
			nope: { ios: { device: 'iPhone 15 Pro', shots: [{ name: 'a' }, { name: 'a' }] } },
			'kekeh-mac': {
				web: {
					baseUrlEnv: 'lower_case',
					shots: [{ name: 'Bad Name', path: 'no-slash' }],
					login: {
						url: '/login',
						emailEnv: 'SAME',
						passwordEnv: 'SAME',
						emailSelector: 'a',
						passwordSelector: 'b',
						submitSelector: 'c',
						successWaitFor: 'd'
					}
				},
				ios: { device: 'iPhone 15 Pro', bundleId: 'notabundle', shots: [] }
			},
			empty: {}
		};
		const errors = validateManifest(bad, ['kekeh-mac']).join('\n');
		expect(errors).toMatch(/nope: no matching file/);
		expect(errors).toMatch(/duplicate shot name "a"/);
		expect(errors).toMatch(/lower_case/);
		expect(errors).toMatch(/"Bad Name" is not a kebab-case/);
		expect(errors).toMatch(/path must start with/);
		expect(errors).toMatch(/must differ/);
		expect(errors).toMatch(/notabundle/);
		expect(errors).toMatch(/kekeh-mac.ios: no shots/);
		expect(errors).toMatch(/empty: has neither/);
	});
});
