import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import '../layout.css';
import type { WorkItem } from '$lib/content/projects-view';
import Page from './+page.svelte';

const project = (slug: string, title: string, extra: Partial<WorkItem> = {}): WorkItem => ({
	slug,
	title,
	oneLine: `${title} one-liner`,
	built: ['Thing'],
	brandColor: undefined,
	onBrand: undefined,
	deviceShots: undefined,
	showcase: undefined,
	featuredImage: undefined,
	hasWriteup: true,
	liveUrl: undefined,
	github: undefined,
	kind: 'case-study',
	categories: [],
	stars: undefined,
	...extra
});

const post = (slug: string, title: string) => ({
	slug,
	title,
	date: '2026-01-07',
	tags: ['systems'],
	description: ''
});

describe('/+page.svelte', () => {
	it('renders the hero and the four sections below it', async () => {
		render(Page, {
			data: { pills: [], posts: [post('a', 'Post A')], projects: [project('p', 'Proj')] }
		});
		await expect
			.element(page.getByRole('heading', { level: 1 }))
			.toHaveTextContent('I design and build software products, end to end.');
		for (const name of ['Selected work', 'What I do', 'Track record', 'Writing']) {
			await expect.element(page.getByRole('heading', { level: 2, name })).toBeInTheDocument();
		}
		expect(page.getByRole('heading', { name: 'Timeline' }).query()).toBeNull();
	});

	it('links Selected work tiles to their case studies and falls back to the repo', async () => {
		render(Page, {
			data: {
				pills: [],
				posts: [],
				projects: [
					project('kekeh-mac', 'Kekeh Mac'),
					project('voltax', 'Voltax', {
						hasWriteup: false,
						github: 'https://github.com/noelzappy/voltax'
					})
				]
			}
		});
		await expect
			.element(page.getByRole('link', { name: 'Kekeh Mac' }))
			.toHaveAttribute('href', '/projects/kekeh-mac');
		await expect
			.element(page.getByRole('link', { name: 'Voltax' }))
			.toHaveAttribute('href', 'https://github.com/noelzappy/voltax');
		await expect
			.element(page.getByRole('link', { name: 'See all projects →' }))
			.toHaveAttribute('href', '/projects');
	});

	it('states the four offers and links to /work-with-me', async () => {
		render(Page, { data: { pills: [], posts: [], projects: [] } });
		for (const name of [
			'Build the whole product',
			'Lead or join your team',
			'Fix, rescue or migrate',
			'Websites with a real admin'
		]) {
			await expect.element(page.getByText(name, { exact: true })).toBeInTheDocument();
		}
		await expect
			.element(page.getByRole('link', { name: 'How I work with teams →' }))
			.toHaveAttribute('href', '/work-with-me');
	});

	it('states the track record as text', async () => {
		render(Page, { data: { pills: [], posts: [], projects: [] } });
		await expect.element(page.getByText('Co-founder & CTO, Pavex')).toBeInTheDocument();
		await expect
			.element(page.getByText('Before: Hubtel · Built Financial Technologies · Fetch Agent · RBL'))
			.toBeInTheDocument();
	});

	it('lists the latest posts with dates, and hides Writing when there are none', async () => {
		const { unmount } = render(Page, {
			data: { pills: [], posts: [post('a', 'Post A')], projects: [] }
		});
		await expect
			.element(page.getByRole('link', { name: 'Post A' }))
			.toHaveAttribute('href', '/writing/a');
		await expect.element(page.getByText('7 Jan 2026')).toBeInTheDocument();
		unmount();
		render(Page, { data: { pills: [], posts: [], projects: [] } });
		expect(page.getByRole('heading', { name: 'Writing' }).query()).toBeNull();
	});
});
