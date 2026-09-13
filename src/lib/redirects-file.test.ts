import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { resolveRedirect } from './redirects';

/** _redirects (project root, copied by adapter-cloudflare) must agree with resolveRedirect for every literal rule. */
describe('_redirects', () => {
	const rules = readFileSync('_redirects', 'utf8')
		.split('\n')
		.map((l) => l.trim())
		.filter((l) => l && !l.startsWith('#'))
		.map((l) => l.split(/\s+/));

	it('has only 301 rules with three fields', () => {
		for (const r of rules) expect(r).toHaveLength(3);
		for (const r of rules) expect(r[2]).toBe('301');
	});

	it('matches resolveRedirect for literal (non-splat) rules', () => {
		for (const [from, to] of rules.filter((r) => !r[0].includes('*'))) {
			expect(resolveRedirect(from), from).toBe(to);
		}
	});

	it('splat rules agree on a sample path', () => {
		expect(resolveRedirect('/notes/some-post')).toBe('/writing/some-post');
		expect(resolveRedirect('/work/rbl-dating-app')).toBe('/projects/rbl-dating-app');
	});
});
