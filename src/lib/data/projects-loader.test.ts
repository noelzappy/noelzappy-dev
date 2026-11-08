import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
	getAllProjects,
	getFeaturedProjects,
	getShowcase,
	getStripScreens,
	resolveShowcase,
	getNextCaseStudy,
	getPillProjects,
	getProjectBySlug
} from './projects-loader';

describe('projects content', () => {
	it('loads every project with a kind and a slug', () => {
		const projects = getAllProjects();
		expect(projects.length).toBe(23);
		for (const p of projects) {
			expect(p.slug).toBeTruthy();
			expect(['case-study', 'open-source']).toContain(p.kind);
		}
	});

	it('open-source entries always carry a repository URL', () => {
		for (const p of getAllProjects().filter((p) => p.kind === 'open-source')) {
			expect(p.github).toMatch(/^https:\/\/github\.com\//);
		}
	});

	it('features the six homepage projects in display order', () => {
		expect(getFeaturedProjects().map((p) => p.slug)).toEqual([
			'kekeh-mac',
			'susupaa-platform',
			'rbl-dating-app',
			'alvi-beauty',
			'built-mobile-app',
			'voltax'
		]);
	});

	it('Voltax carries a real docs screen on its brand field', () => {
		const p = getProjectBySlug('voltax');
		expect(p?.deviceShots?.[0]?.src).toBe('/portfolio/voltax/voltax-docs.webp');
		expect(p?.brandColor).toBe('#3d50f5');
		expect(p?.onBrand).toBe('light');
	});

	it('SusuPaa is tagged TypeScript and PostgreSQL', () => {
		expect(getProjectBySlug('susupaa-platform')?.featuredStack).toEqual([
			'TypeScript',
			'PostgreSQL'
		]);
	});

	it('the homepage pills are Kekeh Mac, SusuPaa and RBL, in order', () => {
		expect(getPillProjects().map((p) => p.slug)).toEqual([
			'kekeh-mac',
			'susupaa-platform',
			'rbl-dating-app'
		]);
	});

	it('every pill project carries what the hero needs', () => {
		for (const p of getPillProjects()) {
			expect(p.brandColor).toMatch(/^#[0-9a-f]{6}$/i);
			expect(['light', 'dark']).toContain(p.onBrand);
			expect(p.oneLine?.length).toBeGreaterThan(0);
			expect(p.oneLine!.length).toBeLessThanOrEqual(90);
			expect(p.built?.length).toBeGreaterThanOrEqual(1);
			expect(p.deviceShots?.length).toBeGreaterThanOrEqual(1);
			for (const shot of p.deviceShots ?? []) {
				expect(shot.alt.trim().length).toBeGreaterThan(0);
				expect(existsSync(join(process.cwd(), 'static', shot.src))).toBe(true);
			}
		}
	});

	it('every project with a writeup uses the new case-study template', () => {
		const writeups = getAllProjects().filter((p) => p.html.trim().length > 0);
		expect(writeups.length).toBeGreaterThanOrEqual(9);
		for (const p of writeups) {
			expect(p.built?.length, `${p.slug} built`).toBeGreaterThanOrEqual(1);
			expect(p.built!.length, `${p.slug} built`).toBeLessThanOrEqual(5);
			expect(p.oneLine?.length, `${p.slug} oneLine`).toBeGreaterThan(0);
			expect(p.oneLine!.length, `${p.slug} oneLine`).toBeLessThanOrEqual(90);
			expect(p.brandColor, `${p.slug} brandColor`).toMatch(/^#[0-9a-f]{6}$/i);
			expect(['light', 'dark'], `${p.slug} onBrand`).toContain(p.onBrand);
		}
	});

	it('case-study rows without a writeup are ready for the work index too', () => {
		for (const slug of ['qargo-delivery-app', 'cocaptain-app']) {
			const p = getProjectBySlug(slug);
			expect(p?.built?.length, slug).toBeGreaterThanOrEqual(1);
			expect(p?.oneLine?.length, slug).toBeGreaterThan(0);
			expect(p!.oneLine!.length, slug).toBeLessThanOrEqual(90);
			expect(p?.brandColor, slug).toMatch(/^#[0-9a-f]{6}$/i);
			expect(['light', 'dark'], slug).toContain(p?.onBrand);
		}
	});

	it('every deviceShot exists on disk and has alt text', () => {
		for (const p of getAllProjects()) {
			for (const shot of p.deviceShots ?? []) {
				expect(shot.alt.trim().length, `${p.slug} alt`).toBeGreaterThan(0);
				expect(['phone', 'browser']).toContain(shot.kind);
				expect(existsSync(join(process.cwd(), 'static', shot.src)), `${p.slug} ${shot.src}`).toBe(
					true
				);
			}
		}
	});

	it('local images only: no project points at a retired CMS host', () => {
		for (const p of getAllProjects()) {
			for (const src of [p.featuredImage, ...(p.gallery ?? [])]) {
				if (!src) continue;
				expect(src, p.slug).toMatch(/^\//);
				expect(existsSync(join(process.cwd(), 'static', src)), `${p.slug} ${src}`).toBe(true);
			}
		}
	});

	it('every open-source entry has a one-liner and a category', () => {
		for (const p of getAllProjects().filter((p) => p.kind === 'open-source')) {
			expect(p.oneLine?.length, `${p.slug} oneLine`).toBeGreaterThan(0);
			expect(p.oneLine!.length, `${p.slug} oneLine`).toBeLessThanOrEqual(90);
			expect(p.categories?.length, `${p.slug} categories`).toBeGreaterThanOrEqual(1);
		}
	});

	it('Kekeh Mac is a pilot case study', () => {
		const p = getProjectBySlug('kekeh-mac');
		expect(p?.status).toBe('Pilot');
		expect(p?.kind).toBe('case-study');
		expect(p?.html.trim().length).toBeGreaterThan(0);
	});
});

describe('getNextCaseStudy', () => {
	const slugs = getAllProjects()
		.filter((p) => p.html.trim().length > 0)
		.map((p) => p.slug);

	it('returns the following case study, never the input', () => {
		for (const slug of slugs) {
			const next = getNextCaseStudy(slug);
			expect(next).not.toBeNull();
			expect(next?.slug).not.toBe(slug);
			expect(next?.title).toBeTruthy();
		}
	});

	it('wraps from the last case study to the first', () => {
		expect(getNextCaseStudy(slugs[slugs.length - 1])?.slug).toBe(slugs[0]);
		expect(getNextCaseStudy(slugs[0])?.slug).toBe(slugs[1]);
	});

	it('returns null for an unknown slug', () => {
		expect(getNextCaseStudy('does-not-exist')).toBeNull();
	});

	it('bodies are HTML, not markdown (they render through {@html})', () => {
		for (const p of getAllProjects()) {
			// Ignore anything inside HTML tags (attributes) by testing line starts and bold pairs only.
			expect(p.html, `${p.slug}: heading`).not.toMatch(/^#{1,6} /m);
			expect(p.html, `${p.slug}: list item`).not.toMatch(/^\s*[-*] /m);
			expect(p.html, `${p.slug}: bold`).not.toMatch(/\*\*[^*\n]+\*\*/);
		}
	});
});

describe('getShowcase', () => {
	const phone = (n: number) => ({ src: `/p${n}.webp`, alt: `Phone ${n}`, kind: 'phone' as const });
	const browser = (n: number) => ({
		src: `/b${n}.webp`,
		alt: `Web ${n}`,
		kind: 'browser' as const
	});

	it('returns null when there are no shots', () => {
		expect(getShowcase({})).toBeNull();
		expect(getShowcase({ deviceShots: [] })).toBeNull();
	});

	it('prefers an explicit showcase', () => {
		const showcase = { layout: 'web' as const, web: { src: '/x.webp', alt: 'X' } };
		expect(getShowcase({ showcase, deviceShots: [phone(1)] })).toEqual(showcase);
	});

	it('derives web-phones from a browser shot plus phones, capped at two phones', () => {
		expect(
			getShowcase({ deviceShots: [phone(1), browser(1), browser(2), phone(2), phone(3)] })
		).toEqual({
			layout: 'web-phones',
			web: { src: '/b1.webp', alt: 'Web 1' },
			phones: [
				{ src: '/p1.webp', alt: 'Phone 1' },
				{ src: '/p2.webp', alt: 'Phone 2' }
			]
		});
	});

	it('derives web from browser shots only and phones from phone shots only', () => {
		expect(getShowcase({ deviceShots: [browser(1)] })).toEqual({
			layout: 'web',
			web: { src: '/b1.webp', alt: 'Web 1' }
		});
		expect(getShowcase({ deviceShots: [phone(1), phone(2), phone(3)] })).toEqual({
			layout: 'phones',
			phones: [
				{ src: '/p1.webp', alt: 'Phone 1' },
				{ src: '/p2.webp', alt: 'Phone 2' }
			]
		});
	});

	it('gives the six case studies with the best screens an explicit showcase', () => {
		const layouts = Object.fromEntries(
			[
				'kekeh-mac',
				'susupaa-platform',
				'rbl-dating-app',
				'built-mobile-app',
				'givio-platform',
				'voltax'
			].map((slug) => [slug, getProjectBySlug(slug)?.showcase?.layout])
		);
		expect(layouts).toEqual({
			'kekeh-mac': 'phones',
			'susupaa-platform': 'web',
			'rbl-dating-app': 'phones',
			'built-mobile-app': 'phones',
			'givio-platform': 'web',
			voltax: 'web'
		});
		expect(getProjectBySlug('kekeh-mac')?.showcase?.phones).toHaveLength(3);
	});

	it('resolves invalid showcase data instead of drawing it', () => {
		const shot = { src: '/a.webp', alt: 'A' };
		expect(getShowcase({ showcase: { layout: 'web' } })).toBeNull();
		expect(getShowcase({ showcase: { layout: 'phones', phones: [] } })).toBeNull();
		expect(getShowcase({ showcase: { layout: 'web-phones', web: shot } })).toEqual({
			layout: 'web',
			web: shot
		});
		expect(getShowcase({ showcase: { layout: 'web-phones', phones: [shot] } })).toEqual({
			layout: 'phones',
			phones: [shot]
		});
		expect(resolveShowcase({ layout: 'web', phones: [shot], web: undefined })).toEqual({
			layout: 'phones',
			phones: [shot]
		});
		expect(
			resolveShowcase({ layout: 'phones', phones: [shot, shot, shot, shot] })?.phones
		).toHaveLength(3);
	});
});

describe('getStripScreens', () => {
	const phone = (n: number) => ({ src: `/p${n}.webp`, alt: '' });
	it('interleaves projects so web screens and phones alternate, without duplicates', () => {
		const screens = getStripScreens([
			{ showcase: { layout: 'phones', phones: [phone(1), phone(2)] } },
			{ showcase: { layout: 'web', web: { src: '/w1.webp', alt: '' } } },
			{ showcase: { layout: 'phones', phones: [phone(1), phone(3)] } }
		]);
		expect(screens).toEqual([
			{ src: '/p1.webp', kind: 'phone' },
			{ src: '/w1.webp', kind: 'web' },
			{ src: '/p2.webp', kind: 'phone' },
			{ src: '/p3.webp', kind: 'phone' }
		]);
	});
	it('skips projects with nothing to show', () => {
		expect(getStripScreens([{}, { deviceShots: [] }])).toEqual([]);
	});
	it('covers the real pill projects', () => {
		const screens = getStripScreens(getPillProjects());
		expect(screens.some((s) => s.kind === 'web')).toBe(true);
		expect(screens.some((s) => s.kind === 'phone')).toBe(true);
	});
});

describe('getStripScreens short names', () => {
	it('prefers shortTitle for the card name', () => {
		const shot = { src: '/a.webp', alt: '' };
		const screens = getStripScreens([
			{ title: 'SusuPaa Platform', shortTitle: 'SusuPaa', showcase: { layout: 'web', web: shot } }
		]);
		expect(screens[0].name).toBe('SusuPaa');
	});
	it('gives every real strip project a name of at most 12 characters', () => {
		for (const s of getStripScreens(getPillProjects())) {
			expect(s.name?.length ?? 0).toBeLessThanOrEqual(12);
		}
	});
});

describe('getStripScreens names and colours', () => {
	it('carries the project title and brand colours onto each screen, omitting absent ones', () => {
		const shot = { src: '/a.webp', alt: '' };
		const screens = getStripScreens([
			{
				title: 'A',
				brandColor: '#112233',
				onBrand: 'light',
				showcase: { layout: 'phones', phones: [shot] }
			},
			{ title: 'B', showcase: { layout: 'phones', phones: [{ src: '/b.webp', alt: '' }] } }
		]);
		expect(screens[0]).toMatchObject({ name: 'A', brandColor: '#112233', onBrand: 'light' });
		expect(screens[1].name).toBe('B');
		expect('brandColor' in screens[1]).toBe(false);
	});
});

describe('getStripScreens links', () => {
	const shot = (n: number) => ({ src: `/p${n}.webp`, alt: '' });
	const phones = { layout: 'phones' as const, phones: [shot(1)] };
	it('links a screen to its case study, else the live site, else the work index', () => {
		const screens = getStripScreens([
			{ slug: 'a', html: '<p>x</p>', showcase: { layout: 'phones', phones: [shot(1)] } },
			{
				slug: 'b',
				html: '  ',
				liveUrl: 'https://b.test',
				showcase: { layout: 'phones', phones: [shot(2)] }
			},
			{ slug: 'c', html: '', showcase: { layout: 'phones', phones: [shot(3)] } }
		]);
		expect(screens.map((s) => s.href)).toEqual(['/projects/a', 'https://b.test', '/projects']);
	});
	it('leaves href off when the project has no slug', () => {
		expect(getStripScreens([{ showcase: phones }])[0].href).toBeUndefined();
	});
});
