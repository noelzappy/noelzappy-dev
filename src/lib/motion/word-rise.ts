const RISE = '0.4em';
const STAGGER_MS = 40;
const DURATION_MS = 600;

/** The page-reveal / morph already animates the title; do not stack a second animation on it. */
function transitionRunning(): boolean {
	const cl = document.documentElement.classList;
	return cl.contains('reveal-active') || cl.contains('morph-active');
}

/**
 * Splits a plain-text heading into word spans that rise 0.4em and fade in, 40ms apart, once on
 * mount. The heading keeps its accessible name through `aria-label` (spans are aria-hidden), and
 * the spans are inline-block (needed for transform) separated by real spaces, so `text-wrap:
 * balance` still balances. Skipped for reduced motion, while a page transition is running, and
 * for headings that contain markup (nothing to split safely).
 */
export function wordRise(node: HTMLElement) {
	const text = node.textContent?.trim() ?? '';
	if (
		!text ||
		node.children.length > 0 ||
		typeof node.animate !== 'function' ||
		matchMedia('(prefers-reduced-motion: reduce)').matches ||
		transitionRunning()
	) {
		return;
	}

	node.setAttribute('aria-label', text);
	const frag = document.createDocumentFragment();
	const spans: HTMLSpanElement[] = [];
	text.split(/\s+/).forEach((word, i) => {
		if (i > 0) frag.append(' ');
		const span = document.createElement('span');
		span.setAttribute('aria-hidden', 'true');
		span.className = 'word-rise';
		span.style.display = 'inline-block';
		span.textContent = word;
		spans.push(span);
		frag.append(span);
	});
	node.replaceChildren(frag);

	spans.forEach((span, i) => {
		span.animate(
			[
				{ opacity: 0, transform: `translateY(${RISE})` },
				{ opacity: 1, transform: 'none' }
			],
			{
				duration: DURATION_MS,
				delay: i * STAGGER_MS,
				easing: 'cubic-bezier(0.22, 0.8, 0.2, 1)',
				fill: 'backwards'
			}
		);
	});
}
