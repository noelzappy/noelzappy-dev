import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from './+page.svelte';

describe('/+page.svelte', () => {
	it('renders the hero, the legacy intro, and hides list sections that have no content', async () => {
		render(Page, { data: { pills: [], posts: [], projects: [] } });
		await expect
			.element(page.getByRole('heading', { level: 1 }))
			.toHaveTextContent('I design and build software products, end to end.');
		await expect
			.element(page.getByRole('link', { name: 'All work' }))
			.toHaveAttribute('href', '/projects');
		await expect
			.element(page.getByRole('link', { name: 'Work with me →' }))
			.toHaveAttribute('href', '/work-with-me');
		await expect.element(page.getByRole('heading', { name: 'Timeline' })).toBeInTheDocument();
		expect(page.getByRole('heading', { name: 'Writing' }).query()).toBeNull();
		expect(page.getByRole('heading', { name: 'Projects' }).query()).toBeNull();
	});

	it('lists posts with tags and projects with their links', async () => {
		render(Page, {
			data: {
				pills: [],
				posts: [
					{ slug: 'a', title: 'Post A', date: '2026-01-07', tags: ['systems'], description: '' }
				],
				projects: [
					{
						slug: 'p',
						title: 'Proj',
						excerpt: 'x',
						kind: 'open-source',
						status: '',
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
