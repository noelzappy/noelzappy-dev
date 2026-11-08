import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import '../layout.css';
import Page from './+page.svelte';

describe('/+page.svelte', () => {
	it('renders the hero headline', async () => {
		render(Page, { data: { pills: [], screens: [], posts: [] } });
		await expect
			.element(page.getByRole('heading', { level: 1 }))
			.toHaveTextContent('I design and build software products, end to end.');
	});

	it('renders none of the removed homepage sections', async () => {
		render(Page, { data: { pills: [], screens: [], posts: [] } });
		await expect.element(page.getByRole('heading', { level: 1 })).toBeInTheDocument();
		for (const name of ['Selected work', 'What I do', 'Track record', 'Writing']) {
			expect(page.getByRole('heading', { name }).query()).toBeNull();
		}
	});
});
