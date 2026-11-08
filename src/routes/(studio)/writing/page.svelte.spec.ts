import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import '../../layout.css';
import Page from './+page.svelte';
import { getPosts, getTags } from '$lib/content/writing';
import { toPostItem } from '$lib/content/posts-view';

const data = { pills: [], posts: getPosts().map(toPostItem), tags: getTags() };

describe('/writing', () => {
	it('renders the Writing h1 as the page title', async () => {
		const { container } = render(Page, { data });
		await expect
			.element(page.getByRole('heading', { level: 1, name: 'Writing' }))
			.toBeInTheDocument();
		expect(container.querySelector('h1')!.classList.contains('page-title')).toBe(true);
	});

	it('lists every published post as a row', async () => {
		const { container } = render(Page, { data });
		const rows = container.querySelectorAll('a.main');
		expect(rows).toHaveLength(data.posts.length);
		expect(data.posts.length).toBeGreaterThan(0);
	});

	it('links every tag to its tag page', async () => {
		const { container } = render(Page, { data });
		for (const { tag } of data.tags) {
			expect(container.querySelector(`a[href="/writing/tag/${tag}"]`)).not.toBeNull();
		}
	});
});
