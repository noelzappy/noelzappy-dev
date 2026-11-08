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

/** One screen in the homepage's drifting work strip. */
/** `ratio` is height / width when known, so the strip can size a screen before its image loads. */
export type StripScreen = {
	src: string;
	kind: 'phone' | 'web';
	ratio?: number;
	/** Where a click on the screen leads; absent when the project has nowhere to send it. */
	href?: string;
	/** The project's name, shown under its card. */
	name?: string;
	/** The card's background; absent projects fall back to a neutral surface token. */
	brandColor?: string;
	onBrand?: 'light' | 'dark';
};

/** The case study when there is a writeup, else the live site, else the work index. */
function stripHref(project: {
	slug?: string;
	html?: string;
	liveUrl?: string;
}): string | undefined {
	if (!project.slug) return undefined;
	if (project.html?.trim()) return `/projects/${project.slug}`;
	return project.liveUrl || '/projects';
}

/**
 * The screens for the drifting strip, interleaved across projects so web screens and phones
 * alternate and no project clumps together: every project's first screen (web first, then its
 * phones), then the second screens, and so on, in the order the projects are given. Duplicate
 * sources are dropped.
 */
export function getStripScreens(
	projects: {
		slug?: string;
		title?: string;
		shortTitle?: string;
		brandColor?: string;
		onBrand?: 'light' | 'dark';
		html?: string;
		liveUrl?: string;
		showcase?: Showcase;
		deviceShots?: DeviceShot[];
	}[]
): StripScreen[] {
	const lanes = projects.map((project) => {
		const showcase = getShowcase(project);
		const href = stripHref(project);
		const screens: StripScreen[] = [];
		const meta = {
			...(href && { href }),
			...((project.shortTitle ?? project.title) && { name: project.shortTitle ?? project.title }),
			...(project.brandColor && { brandColor: project.brandColor }),
			...(project.onBrand && { onBrand: project.onBrand })
		};
		if (showcase?.web) screens.push({ src: showcase.web.src, kind: 'web', ...meta });
		for (const phone of showcase?.phones ?? [])
			screens.push({ src: phone.src, kind: 'phone', ...meta });
		return screens;
	});
	const out: StripScreen[] = [];
	const seen = new Set<string>();
	for (let round = 0; lanes.some((lane) => round < lane.length); round++) {
		for (const lane of lanes) {
			const screen = lane[round];
			if (screen && !seen.has(screen.src)) {
				seen.add(screen.src);
				out.push(screen);
			}
		}
	}
	return out;
}
