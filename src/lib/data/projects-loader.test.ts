import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
	getAllProjects,
	getFeaturedProjects,
	getNextCaseStudy,
	getPillProjects,
	getProjectBySlug
} from './projects-loader';

describe('projects content', () => {
	it('loads every project with a kind and a slug', () => {
		const projects = getAllProjects();
		expect(projects.length).toBe(21);
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

	it('features exactly the five homepage projects', () => {
		expect(
			getFeaturedProjects()
				.map((p) => p.slug)
				.sort()
		).toEqual([
			'fetch-agent-real-estate-platform',
			'rbl-dating-app',
			'remotepad',
			'susupaa-platform',
			'voltax'
		]);
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

	it('Kekeh Mac is a pilot case study that is not featured yet', () => {
		const p = getProjectBySlug('kekeh-mac');
		expect(p?.status).toBe('Pilot');
		expect(p?.featured).toBe(false);
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
});
