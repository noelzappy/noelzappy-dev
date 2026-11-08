/**
 * Cal.com booking. The embed script is loaded once from the root layout
 * (scheduleCalEmbed, after window load so it never competes with LCP).
 * Booking controls (CalButton) call openCal(), which queues the call on the
 * Cal stub, so a click works before, during and after the script loads and
 * across client-side navigations.
 */
export const CAL_USERNAME = 'noelzappy';

export const CAL_EVENTS = {
	intro: '15min' // free 15-minute intro call
};

const CAL_ORIGIN = 'https://cal.com';
const CAL_SCRIPT = 'https://app.cal.com/embed/embed.js';

type CalFn = ((...args: unknown[]) => void) & {
	loaded?: boolean;
	q?: unknown[];
	ns?: Record<string, unknown>;
};

declare global {
	interface Window {
		Cal?: CalFn;
	}
}

/** Installs the Cal queue stub (the official snippet) and injects embed.js once. */
export function loadCalEmbed(): void {
	if (typeof window === 'undefined') return;
	if (window.Cal?.loaded) return;

	// The snippet's `p`: queue a call on a target (the stub or a namespace api).
	const push = (target: { q?: unknown[] }, args: unknown) => {
		(target.q ??= []).push(args);
	};

	const stub: CalFn =
		window.Cal ??
		(function (...args: unknown[]) {
			const cal = window.Cal as CalFn;
			if (args[0] === 'init') {
				const namespace = args[1];
				if (typeof namespace === 'string') {
					const api: CalFn & { q?: unknown[] } = (...a: unknown[]) => push(api, a);
					cal.ns ??= {};
					cal.ns[namespace] ??= api;
					push(cal.ns[namespace] as { q?: unknown[] }, args);
					push(cal, ['-queue', namespace, args]);
					return;
				}
			}
			push(cal, args);
		} as CalFn);

	window.Cal = stub;
	stub.ns ??= {};
	stub.q ??= [];
	stub.loaded = true;
	document.head.appendChild(document.createElement('script')).src = CAL_SCRIPT;
	stub('init', { origin: CAL_ORIGIN });
}

/** Loads the embed after the page has finished loading (and the browser is idle). */
export function scheduleCalEmbed(): void {
	if (typeof window === 'undefined') return;
	const start = () => {
		if ('requestIdleCallback' in window) window.requestIdleCallback(() => loadCalEmbed());
		else setTimeout(loadCalEmbed, 1);
	};
	if (document.readyState === 'complete') start();
	else window.addEventListener('load', start, { once: true });
}

/** Opens the Cal popup for an event. Safe to call before the embed has loaded. */
export function openCal(calLink: string, config: Record<string, unknown>): void {
	loadCalEmbed();
	window.Cal!('modal', { calLink, config });
}
