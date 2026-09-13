import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from './+page.svelte';

describe('/+page.svelte', () => {
	it('renders the intro and hides list sections that have no content', async () => {
		render(Page, { data: { posts: [], projects: [] } });
		await expect
			.element(page.getByRole('heading', { level: 1 }))
			.toHaveTextContent("Hey, I'm Emmanuel.");
		await expect.element(page.getByRole('heading', { name: 'Timeline' })).toBeInTheDocument();
		expect(page.getByRole('heading', { name: 'Writing' }).query()).toBeNull();
		expect(page.getByRole('heading', { name: 'Projects' }).query()).toBeNull();
	});

	it('lists posts with tags and projects with their links', async () => {
		render(Page, {
			data: {
				posts: [
					{ slug: 'a', title: 'Post A', date: '2026-01-07', tags: ['systems'], description: '' }
				],
				projects: [
					{
						slug: 'p',
						title: 'Proj',
						excerpt: 'x',
						kind: 'open-source',
						liveUrl: undefined,
						github: 'https://github.com/noelzappy/p',
						hasWriteup: false,
						featuredStack: ['Go']
					}
				]
			}
		});
		await expect
			.element(page.getByRole('link', { name: 'Post A' }))
			.toHaveAttribute('href', '/writing/a');
		await expect
			.element(page.getByRole('link', { name: 'systems' }))
			.toHaveAttribute('href', '/writing/tag/systems');
		await expect
			.element(page.getByRole('link', { name: 'repo' }))
			.toHaveAttribute('href', 'https://github.com/noelzappy/p');
	});
});
