import type { Component } from 'svelte';

export interface PostMeta {
	title: string;
	date: string;
	tags: string[];
	description: string;
	/** Drafts are visible in dev only; production builds exclude them everywhere. */
	draft?: boolean;
}

export interface Post extends PostMeta {
	slug: string;
	component: Component;
}

type MdModule = { default: Component; metadata: PostMeta };

const published = import.meta.glob<MdModule>('/src/content/writing/*.md', { eager: true });

// Drafts live in writing/drafts/ and are only ever imported in dev, so their text never reaches a
// production bundle. To publish one, move it up into writing/ and drop `draft: true`.
const drafts = import.meta.env.DEV
	? import.meta.glob<MdModule>('/src/content/writing/drafts/*.md', { eager: true })
	: {};

const modules = { ...published, ...drafts };

function slugFromPath(path: string): string {
	return path.split('/').pop()!.replace(/\.md$/, '');
}

const posts: Post[] = Object.entries(modules)
	.map(([path, mod]) => ({
		slug: slugFromPath(path),
		...mod.metadata,
		date: String(mod.metadata.date).slice(0, 10),
		tags: mod.metadata.tags ?? [],
		component: mod.default
	}))
	.filter((p) => import.meta.env.DEV || !p.draft)
	.sort((a, b) => b.date.localeCompare(a.date));

export function getPosts(): Post[] {
	return posts;
}

export function getPost(slug: string): Post | undefined {
	return posts.find((p) => p.slug === slug);
}

export function getPostsByTag(tag: string): Post[] {
	return posts.filter((p) => p.tags.includes(tag));
}

export function getTags(): { tag: string; count: number }[] {
	const counts = new Map<string, number>();
	for (const p of posts) for (const t of p.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
	return [...counts.entries()]
		.map(([tag, count]) => ({ tag, count }))
		.sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}
