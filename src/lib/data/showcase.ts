import type { DeviceShot, Showcase } from './projects';

/**
 * The composition for a project: its explicit `showcase`, otherwise derived from `deviceShots`
 * (first browser shot becomes the web screen, up to two phone shots become the phones). `null`
 * when the project has no shots at all.
 */
export function getShowcase(project: {
	showcase?: Showcase;
	deviceShots?: DeviceShot[];
}): Showcase | null {
	if (project.showcase) return project.showcase;
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
