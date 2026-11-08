import { afterEach, describe, expect, it, vi } from 'vitest';
import { shouldReveal, setupPageReveal, morphSlug } from './page-reveal';

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

describe('morphSlug', () => {
	const writeups = new Set(['kekeh-mac', 'susupaa']);
	const rootWith = (name: string | null) =>
		({
			querySelector: (sel: string) =>
				name && sel === `[data-showcase-name="${name}"]` ? ({} as Element) : null
		}) as unknown as ParentNode;

	it('morphs when the target has a writeup and the source carries that name', () => {
		expect(
			morphSlug(new URL('https://x/projects/kekeh-mac'), writeups, rootWith('project-kekeh-mac'))
		).toBe('kekeh-mac');
	});

	it('uses the curtain when the source has no matching named element', () => {
		expect(morphSlug(new URL('https://x/projects/kekeh-mac'), writeups, rootWith(null))).toBeNull();
		expect(
			morphSlug(new URL('https://x/projects/kekeh-mac'), writeups, rootWith('project-susupaa'))
		).toBeNull();
	});

	it('uses the curtain when the project has no writeup', () => {
		expect(
			morphSlug(new URL('https://x/projects/other'), writeups, rootWith('project-other'))
		).toBeNull();
	});

	it('uses the curtain for non-case-study targets', () => {
		for (const path of ['/projects', '/about', '/projects/kekeh-mac/extra']) {
			expect(
				morphSlug(new URL(`https://x${path}`), writeups, rootWith('project-kekeh-mac'))
			).toBeNull();
		}
		expect(morphSlug(null, writeups, rootWith('project-kekeh-mac'))).toBeNull();
	});
});

describe('setupPageReveal mode', () => {
	function run(rootHasName: boolean, target: string) {
		const classes = new Set<string>();
		const seen: string[] = [];
		vi.stubGlobal('matchMedia', () => ({ matches: false }));
		vi.stubGlobal('document', {
			documentElement: {
				classList: {
					add: (c: string) => (classes.add(c), seen.push(c)),
					remove: (c: string) => classes.delete(c)
				}
			},
			querySelector: () => (rootHasName ? {} : null),
			startViewTransition: (cb: () => Promise<void>) => {
				void cb();
				return { finished: new Promise<void>(() => {}) };
			}
		});
		setupPageReveal(() => new Set(['kekeh-mac']));
		void nav.cb!({
			from: { url: new URL('https://x/') },
			to: { url: new URL(`https://x${target}`) },
			type: 'link',
			complete: Promise.resolve()
		});
		return seen;
	}

	it('adds morph-active instead of reveal-active for a matching pill/row click', () => {
		expect(run(true, '/projects/kekeh-mac')).toEqual(['morph-active']);
	});

	it('keeps the curtain otherwise', () => {
		expect(run(false, '/projects/kekeh-mac')).toEqual(['reveal-active']);
		expect(run(true, '/about')).toEqual(['reveal-active']);
	});
});
