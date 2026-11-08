const SELECTOR = 'meta[name="theme-color"]';

// Original content of each theme-color meta while an override is active.
let saved: Map<Element, string> | null = null;

const metas = () => [...document.querySelectorAll(SELECTOR)];

/**
 * Set every theme-color meta to `color` until the returned function is called, which restores the
 * exact previous values (the media-qualified light and dark tags each get their own back).
 */
export function overrideThemeColor(color: string): () => void {
	const mine = new Map<Element, string>();
	for (const m of metas()) mine.set(m, m.getAttribute('content') ?? '');
	// Nested overrides keep the outermost snapshot.
	saved ??= mine;
	for (const m of mine.keys()) m.setAttribute('content', color);
	const own = saved;
	return () => {
		if (saved !== own) return;
		for (const [m, value] of own) m.setAttribute('content', value);
		saved = null;
	};
}

/**
 * After an explicit theme change, point both media-qualified metas at the new --bg (an explicit
 * theme overrides the OS scheme). If an override is active, only its restore values change.
 */
export function syncThemeColor(): void {
	const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
	if (!bg) return;
	for (const m of metas()) {
		if (saved) saved.set(m, bg);
		else m.setAttribute('content', bg);
	}
}
