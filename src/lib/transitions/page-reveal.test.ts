import { afterEach, describe, expect, it, vi } from 'vitest';
import { shouldReveal, setupPageReveal } from './page-reveal';

const nav = vi.hoisted(() => ({ cb: null as null | ((n: unknown) => unknown) }));
vi.mock('$app/navigation', () => ({
	onNavigate: (cb: (n: unknown) => unknown) => {
		nav.cb = cb;
	}
}));

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

	it('does not reveal on a query-only change of the same path', () => {
		stubReducedMotion(false);
		expect(shouldReveal(new URL('https://x/a'), new URL('https://x/a?page=2'), 'link')).toBe(false);
	});
});

describe('setupPageReveal', () => {
	function stubDocument(finished: Promise<void>) {
		const classes = new Set<string>();
		vi.stubGlobal('matchMedia', () => ({ matches: false }));
		vi.stubGlobal('document', {
			documentElement: {
				classList: {
					add: (c: string) => classes.add(c),
					remove: (c: string) => classes.delete(c)
				}
			},
			startViewTransition: (cb: () => Promise<void>) => {
				void cb();
				return { finished };
			}
		});
		return classes;
	}
	const navigation = {
		from: { url: a },
		to: { url: b },
		type: 'link',
		complete: Promise.resolve()
	};

	it('clears the reveal class and leaves no unhandled rejection when the transition fails', async () => {
		const unhandled = vi.fn();
		process.on('unhandledRejection', unhandled);
		const classes = stubDocument(Promise.reject(new Error('aborted')));
		setupPageReveal();
		await nav.cb!(navigation);
		await new Promise((r) => setTimeout(r, 10));
		process.off('unhandledRejection', unhandled);
		expect(classes.has('reveal-active')).toBe(false);
		expect(unhandled).not.toHaveBeenCalled();
	});

	it('navigates instantly when startViewTransition is unavailable', () => {
		vi.stubGlobal('document', { documentElement: { classList: { add() {}, remove() {} } } });
		setupPageReveal();
		expect(nav.cb!(navigation)).toBeUndefined();
	});
});
