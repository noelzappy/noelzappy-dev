import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import '../../../../layout.css';
import Page from './+page.svelte';
import { getPostsByTag, getTags } from '$lib/content/writing';
import { toPostItem } from '$lib/content/posts-view';

const tag = getTags()[0].tag;
const data = { pills: [], writeups: [], tag, posts: getPostsByTag(tag).map(toPostItem) };

describe('/writing/tag/[tag]', () => {
	it('shows the Tag eyebrow and the tag as the h1', async () => {
		const { container } = render(Page, { data });
		expect(container.querySelector('.eyebrow')!.textContent).toBe('Tag');
		expect(container.querySelector('h1.page-title')!.textContent).toBe(tag);
	});

	it('lists only posts with that tag', async () => {
		const { container } = render(Page, { data });
		expect(container.querySelectorAll('a.main')).toHaveLength(data.posts.length);
		for (const row of container.querySelectorAll('.row')) {
			expect(row.querySelector(`.tags a[href="/writing/tag/${tag}"]`)).not.toBeNull();
		}
	});
});
