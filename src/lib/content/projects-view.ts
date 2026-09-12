import type { ProjectData } from '$lib/data/projects';

/** Serialisable shape shared by the homepage and /projects list. */
export function toProjectItem(p: ProjectData) {
	return {
		slug: p.slug,
		title: p.title,
		excerpt: p.excerpt ?? '',
		kind: p.kind,
		liveUrl: p.liveUrl,
		github: p.github,
		hasWriteup: p.html.trim().length > 0,
		featuredStack: p.featuredStack ?? []
	};
}
export type ProjectItem = ReturnType<typeof toProjectItem>;
