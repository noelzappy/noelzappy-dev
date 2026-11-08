import { getAllProjects, getPillProjects, getStripScreens } from '$lib/data/projects-loader';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load: PageServerLoad = async () => {
	const pills = getPillProjects();
	const pillSlugs = new Set(pills.map((p) => p.slug));
	// The drifting strip shows the pill projects first, then the rest of the work for variety.
	const others = getAllProjects().filter((p) => !pillSlugs.has(p.slug));
	return { pills, screens: getStripScreens([...pills, ...others]) };
};
