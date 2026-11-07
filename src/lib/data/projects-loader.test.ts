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
