import type { DeviceShot, Showcase } from './projects';

/**
 * Normalises a showcase to what can actually be drawn, or `null` when nothing can: a layout that
 * needs a web screen without one falls back to phones (or vice versa), phones are capped at 2
 * beside a web screen and 3 alone, and empty `src`s are dropped.
 */
export function resolveShowcase(showcase: Showcase | undefined | null): Showcase | null {
	if (!showcase) return null;
	const web = showcase.web?.src ? showcase.web : undefined;
	const all = (showcase.phones ?? []).filter((p) => p?.src);
	if (showcase.layout === 'web-phones' && web && all.length) {
		return { layout: 'web-phones', web, phones: all.slice(0, 2) };
	}
	if (showcase.layout === 'phones' && all.length)
		return { layout: 'phones', phones: all.slice(0, 3) };
	if (web) return { layout: 'web', web };
	if (all.length) return { layout: 'phones', phones: all.slice(0, 3) };
	return null;
}

/**
 * The composition for a project: its explicit `showcase`, otherwise derived from `deviceShots`
 * (first browser shot becomes the web screen, up to two phone shots become the phones). `null`
 * when the project has nothing to show, or its explicit showcase is unusable.
 */
export function getShowcase(project: {
	showcase?: Showcase;
	deviceShots?: DeviceShot[];
}): Showcase | null {
	if (project.showcase) return resolveShowcase(project.showcase);
	const shots = project.deviceShots ?? [];
	const browser = shots.find((shot) => shot.kind === 'browser');
	const phones = shots
		.filter((shot) => shot.kind === 'phone')
		.slice(0, 2)
		.map(({ src, alt }) => ({ src, alt }));
	const web = browser ? { src: browser.src, alt: browser.alt } : undefined;
	if (web && phones.length) return { layout: 'web-phones', web, phones };
	if (web) return { layout: 'web', web };
	if (phones.length) return { layout: 'phones', phones };
	return null;
}
