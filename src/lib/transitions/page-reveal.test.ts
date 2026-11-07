import { afterEach, describe, expect, it, vi } from 'vitest';
import { shouldReveal } from './page-reveal';

const a = new URL('https://x/a');
const b = new URL('https://x/b');

function stubReducedMotion(matches: boolean) {
	vi.stubGlobal('matchMedia', () => ({ matches }));
}

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('shouldReveal', () => {
	it('reveals on a link navigation to another path', () => {
		stubReducedMotion(false);
		expect(shouldReveal(a, b, 'link')).toBe(true);
	});

	it('does not reveal when only the hash differs', () => {
		stubReducedMotion(false);
		expect(shouldReveal(new URL('https://x/a'), new URL('https://x/a#top'), 'link')).toBe(false);
	});

	it('does not reveal on back/forward', () => {
		stubReducedMotion(false);
		expect(shouldReveal(a, b, 'popstate')).toBe(false);
	});

	it('does not reveal when either URL is null', () => {
		stubReducedMotion(false);
		expect(shouldReveal(null, b, 'link')).toBe(false);
		expect(shouldReveal(a, null, 'link')).toBe(false);
	});

	it('does not reveal under prefers-reduced-motion', () => {
		stubReducedMotion(true);
		expect(shouldReveal(a, b, 'link')).toBe(false);
	});
});
