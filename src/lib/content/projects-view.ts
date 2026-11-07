import type { ProjectData } from '$lib/data/projects';

/** Serialisable shape shared by the homepage and /projects list. */
export function toProjectItem(p: ProjectData) {
	return {
		slug: p.slug,
		title: p.title,
		excerpt: p.excerpt ?? '',
		kind: p.kind,
		status: p.status ?? '',
		liveUrl: p.liveUrl,
		github: p.github,
		hasWriteup: p.html.trim().length > 0,
		featuredStack: p.featuredStack ?? []
	};
}
export type ProjectItem = ReturnType<typeof toProjectItem>;

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
