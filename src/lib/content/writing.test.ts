import { describe, expect, it } from 'vitest';
import { getPost, getPosts, getPostsByTag, getTags } from './writing';

describe('writing content', () => {
	it('loads posts sorted newest first', () => {
		const posts = getPosts();
		expect(posts.length).toBeGreaterThan(0);
		const dates = posts.map((p) => p.date);
		expect(dates).toEqual([...dates].sort().reverse());
	});

	it('every post has title, description, date and at least one tag', () => {
		for (const p of getPosts()) {
			expect(p.title).toBeTruthy();
			expect(p.description).toBeTruthy();
			expect(p.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
			expect(p.tags.length).toBeGreaterThan(0);
		}
	});

	it('tag counts add up to the tag occurrences across posts', () => {
		const total = getTags().reduce((n, t) => n + t.count, 0);
		const expected = getPosts().reduce((n, p) => n + p.tags.length, 0);
		expect(total).toBe(expected);
		for (const { tag, count } of getTags()) expect(getPostsByTag(tag).length).toBe(count);
	});

	it('finds a post by slug and returns undefined for unknown slugs', () => {
		const first = getPosts()[0];
		expect(getPost(first.slug)?.title).toBe(first.title);
		expect(getPost('does-not-exist')).toBeUndefined();
	});
});
