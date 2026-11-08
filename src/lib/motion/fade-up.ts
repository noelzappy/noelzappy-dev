/**
 * Fades an element up (12px, 500ms) the first time it scrolls into view, once. Nothing is hidden
 * until this runs after hydration, so prerendered HTML and no-JS visitors always see the content.
 * Elements already in view at mount are left visible (no flash above the fold). Reduced motion:
 * never hidden. The hidden state itself lives in CSS (`.fade-up`, inside motion-OK).
 */
export function fadeUp(node: HTMLElement) {
	if (
		typeof IntersectionObserver === 'undefined' ||
		matchMedia('(prefers-reduced-motion: reduce)').matches
	) {
		return;
	}
	const rect = node.getBoundingClientRect();
	if (rect.top < innerHeight && rect.bottom > 0) return;

	node.classList.add('fade-up');
	const io = new IntersectionObserver(
		(entries) => {
			if (!entries.some((e) => e.isIntersecting)) return;
			node.classList.add('fade-up-in');
			io.disconnect();
		},
		{ rootMargin: '0px 0px -6% 0px' }
	);
	io.observe(node);
	return { destroy: () => io.disconnect() };
}
