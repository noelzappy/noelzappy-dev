import type { Post } from './writing';

/** Serialisable shape for lists; drops the compiled component. */
export function toPostItem(p: Post) {
	return { slug: p.slug, title: p.title, date: p.date, tags: p.tags, description: p.description };
}
export type PostItem = ReturnType<typeof toPostItem>;
