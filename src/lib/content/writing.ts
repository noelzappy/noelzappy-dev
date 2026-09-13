import type { Component } from 'svelte';

export interface PostMeta {
	title: string;
	date: string;
	tags: string[];
	description: string;
}

export interface Post extends PostMeta {
	slug: string;
	component: Component;
}

type MdModule = { default: Component; metadata: PostMeta };

const modules = import.meta.glob<MdModule>('/src/content/writing/*.md', { eager: true });

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
