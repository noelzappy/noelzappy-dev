import { onNavigate } from '$app/navigation';
import { showcaseName } from '$lib/motion/shared';

const REVEAL_CLASS = 'reveal-active';
const MORPH_CLASS = 'morph-active';
const CASE_STUDY_PATH = /^\/projects\/([a-z0-9][a-z0-9-]*)\/?$/;

/**
 * Whether a navigation should play the page reveal. Back/forward, same-page hash changes,
 * unknown endpoints and reduced-motion users all get an instant swap.
 */
export function shouldReveal(from: URL | null, to: URL | null, type: string): boolean {
	if (!from || !to) return false;
	if (type === 'popstate') return false;
	// Same path means a hash-only or query-only change on the same page: no curtain.
	if (from.pathname === to.pathname) return false;
	if (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches) {
		return false;
	}
	return true;
}

/**
 * The slug to morph into, or null for the curtain. A morph needs all three: the target is a
 * case-study URL, that project has a writeup (so the page really carries the matching showcase),
 * and the page being left currently has an element named for it (the hero's active showcase or the
 * work row's showcase, marked with `data-showcase-name`).
 */
export function morphSlug(
	to: URL | null,
	writeups: ReadonlySet<string>,
	root: ParentNode
): string | null {
	const slug = to ? CASE_STUDY_PATH.exec(to.pathname)?.[1] : undefined;
	if (!slug || !writeups.has(slug)) return null;
	return root.querySelector(`[data-showcase-name="${showcaseName(slug)}"]`) ? slug : null;
}

/**
 * Wraps client-side navigations in a View Transition. The transition starts only once the
 * navigation has completed (data loaded), so the screen is never covered while waiting.
 * Browsers without `document.startViewTransition` navigate instantly.
 */
export function setupPageReveal(getWriteups: () => ReadonlySet<string> = () => new Set()): void {
	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
		if (!shouldReveal(navigation.from?.url ?? null, navigation.to?.url ?? null, navigation.type)) {
			return;
		}

		const root = document.documentElement;
		// A project's screens morph into its case study; every other navigation gets the curtain.
		// The ink panel is only painted when `reveal-active` is set; CSS then wipes it upward.
		const mode = morphSlug(navigation.to?.url ?? null, getWriteups(), document)
			? MORPH_CLASS
			: REVEAL_CLASS;
		root.classList.add(mode);

		return new Promise<void>((resolve) => {
			const transition = document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
			// `finished` rejects if the navigation fails or is aborted; swallow it so cleanup always runs
			// and nothing is reported as an unhandled rejection.
			transition.finished.catch(() => {}).finally(() => root.classList.remove(mode));
		});
	});
}
