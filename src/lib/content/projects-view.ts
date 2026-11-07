import type { ProjectData } from '$lib/data/projects';

/** Everything a /projects row needs, serialisable. */
export function toWorkItem(p: ProjectData) {
	return {
		slug: p.slug,
		title: p.title,
		oneLine: p.oneLine || p.excerpt || '',
		built: p.built?.length ? p.built : (p.featuredStack ?? []),
		brandColor: p.brandColor,
		onBrand: p.onBrand,
		deviceShots: p.deviceShots,
		featuredImage: p.featuredImage,
		hasWriteup: p.html.trim().length > 0,
		liveUrl: p.liveUrl,
		github: p.github,
		kind: p.kind,
		categories: p.categories ?? [],
		stars: p.stars
	};
}
export type WorkItem = ReturnType<typeof toWorkItem>;
