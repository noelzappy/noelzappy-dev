import { describe, expect, it } from 'vitest';
import { resolveRedirect } from './redirects';

describe('resolveRedirect', () => {
	it('maps old listing routes', () => {
		expect(resolveRedirect('/notes')).toBe('/writing');
		expect(resolveRedirect('/work')).toBe('/projects');
		expect(resolveRedirect('/open-source')).toBe('/projects');
		expect(resolveRedirect('/services')).toBe('/contact');
	});
	it('maps old detail routes and tolerates trailing slashes', () => {
		expect(resolveRedirect('/notes/im-leaving-react-for-svelte/')).toBe(
			'/writing/im-leaving-react-for-svelte'
		);
		expect(resolveRedirect('/work/susupaa-platform')).toBe('/projects/susupaa-platform');
	});
	it('sends removed case studies to the projects list', () => {
		expect(resolveRedirect('/work/owl-studios-website')).toBe('/projects');
		expect(resolveRedirect('/projects/ejuma-platform')).toBe('/projects');
		expect(resolveRedirect('/projects/rbl-dating-app')).toBeNull();
	});
	it('leaves current routes alone', () => {
		expect(resolveRedirect('/')).toBeNull();
		expect(resolveRedirect('/writing/x')).toBeNull();
		expect(resolveRedirect('/projects')).toBeNull();
	});
});
