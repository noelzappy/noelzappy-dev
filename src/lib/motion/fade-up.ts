/**
 * Fades an element up (12px, 500ms) the first time it scrolls into view, once. Nothing is hidden
 * until after hydration, so prerendered HTML and no-JS visitors always see the content.
 *
 * Whether the element starts hidden is decided on the observer's FIRST callback, not at mount:
 * after a client navigation SvelteKit resets scroll after mount, so an element that ends up above
 * the fold must not be hidden. If the first entry intersects, the element stays visible untouched;
 * otherwise it is hidden (`.fade-up`, CSS, motion-OK only) and revealed once on intersect. Reduced
 * motion: never hidden.
 */
export function fadeUp(node: HTMLElement) {
	if (
		typeof IntersectionObserver === 'undefined' ||
		matchMedia('(prefers-reduced-motion: reduce)').matches
	) {
		return;
	}
	let first = true;
	const io = new IntersectionObserver(
		(entries) => {
			const visible = entries.some((e) => e.isIntersecting);
			if (first) {
				first = false;
				if (visible) return io.disconnect();
				node.classList.add('fade-up');
				return;
			}
			if (!visible) return;
			node.classList.add('fade-up-in');
			io.disconnect();
		},
		{ rootMargin: '0px 0px -6% 0px' }
	);
	io.observe(node);
	return { destroy: () => io.disconnect() };
}
