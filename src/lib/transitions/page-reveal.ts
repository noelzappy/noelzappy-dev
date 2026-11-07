import { onNavigate } from '$app/navigation';

const REVEAL_CLASS = 'reveal-active';

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
 * Wraps client-side navigations in a View Transition. The transition starts only once the
 * navigation has completed (data loaded), so the screen is never covered while waiting.
 * Browsers without `document.startViewTransition` navigate instantly.
 */
export function setupPageReveal(): void {
	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
		if (!shouldReveal(navigation.from?.url ?? null, navigation.to?.url ?? null, navigation.type)) {
			return;
		}

		const root = document.documentElement;
		// The ink panel is only painted in the "old" snapshot; CSS then wipes it upward.
		root.classList.add(REVEAL_CLASS);

		return new Promise<void>((resolve) => {
			const transition = document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
			// `finished` rejects if the navigation fails or is aborted; swallow it so cleanup always runs
			// and nothing is reported as an unhandled rejection.
			transition.finished.catch(() => {}).finally(() => root.classList.remove(REVEAL_CLASS));
		});
	});
}
