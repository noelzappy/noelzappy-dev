import { getAllProjects, getPillProjects, getStripScreens } from '$lib/data/projects-loader';
import { staticImageRatio } from '$lib/server/image-size';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load: PageServerLoad = async () => {
	const pills = getPillProjects();
	const pillSlugs = new Set(pills.map((p) => p.slug));
	// The drifting strip shows the pill projects first, then the rest of the work for variety.
	const all = getAllProjects();
	// Full records (not the pill subset) so each screen knows its project's writeup and live URL.
	const pillProjects = pills.flatMap((pill) => all.filter((p) => p.slug === pill.slug));
	const others = all.filter((p) => !pillSlugs.has(p.slug));
	return {
		pills,
		screens: getStripScreens([...pillProjects, ...others]).map((s) => ({
			...s,
			ratio: staticImageRatio(s.src)
		}))
	};
};
