import { describe, expect, it } from 'vitest';
import { getAllProjects, getFeaturedProjects, getProjectBySlug } from './projects-loader';

describe('projects content', () => {
	it('loads every project with a kind and a slug', () => {
		const projects = getAllProjects();
		expect(projects.length).toBe(29);
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

	it('SusuPaa is tagged Go and PostgreSQL', () => {
		expect(getProjectBySlug('susupaa-platform')?.featuredStack).toEqual(['Go', 'PostgreSQL']);
	});
});
