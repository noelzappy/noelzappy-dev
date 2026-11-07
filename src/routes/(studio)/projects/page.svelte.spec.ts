import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import '../../layout.css';

const current = vi.hoisted(() => ({ url: new URL('http://localhost/projects') }));

vi.mock('$app/state', () => ({
	page: {
		get url() {
			return current.url;
		}
	}
}));
vi.mock('$app/navigation', () => ({ goto: vi.fn(() => Promise.resolve()) }));

import { goto } from '$app/navigation';
import Page from './+page.svelte';

const item = (over: Record<string, unknown>) => ({
	slug: 'x',
	title: 'X',
	oneLine: 'one line',
	built: [],
	hasWriteup: true,
	kind: 'case-study',
	categories: [],
	...over
});

const data = {
	caseStudies: [
		item({ slug: 'app', title: 'Phone App', categories: ['Mobile App', 'Fintech'] }),
		item({ slug: 'site', title: 'Brochure Site', categories: ['Website'] })
	],
	openSource: [
		item({
			slug: 'tool',
			title: 'Handy Tool',
			kind: 'open-source',
			hasWriteup: false,
			github: 'https://github.com/noelzappy/tool',
			stars: 42
		})
	]
};

describe('/projects +page.svelte', () => {
	beforeEach(() => {
		current.url = new URL('http://localhost/projects');
		vi.mocked(goto).mockClear();
	});

	it('renders the header, every case-study row and the open source list', async () => {
		render(Page, { data } as never);
		await expect
			.element(page.getByRole('heading', { level: 1 }))
			.toHaveTextContent('Selected work — from first app to production.');
		await expect.element(page.getByRole('link', { name: 'Phone App' })).toBeInTheDocument();
		await expect.element(page.getByRole('link', { name: 'Brochure Site' })).toBeInTheDocument();
		await expect.element(page.getByText('Handy Tool')).toBeInTheDocument();
		await expect.element(page.getByText('42')).toBeInTheDocument();
		await expect
			.element(page.getByRole('button', { name: 'All' }))
			.toHaveAttribute('aria-pressed', 'true');
	});

	it('filters rows by category when a chip is pressed', async () => {
		render(Page, { data } as never);
		await page.getByRole('button', { name: 'Mobile' }).click();
		await expect
			.element(page.getByRole('button', { name: 'Mobile' }))
			.toHaveAttribute('aria-pressed', 'true');
		await expect
			.element(page.getByRole('button', { name: 'All' }))
			.toHaveAttribute('aria-pressed', 'false');
		await expect.element(page.getByRole('link', { name: 'Phone App' })).toBeInTheDocument();
		expect(page.getByRole('link', { name: 'Brochure Site' }).query()).toBeNull();
		expect(page.getByText('Handy Tool').query()).toBeNull();
		expect(goto).toHaveBeenCalledWith(
			expect.stringContaining('type=mobile'),
			expect.objectContaining({ replaceState: true, noScroll: true, keepFocus: true })
		);
	});

	it('shows only open source entries for ?type=open-source', async () => {
		current.url = new URL('http://localhost/projects?type=open-source');
		render(Page, { data } as never);
		await expect.element(page.getByText('Handy Tool')).toBeInTheDocument();
		await expect
			.element(page.getByRole('button', { name: 'Open source' }))
			.toHaveAttribute('aria-pressed', 'true');
		expect(page.getByRole('link', { name: 'Phone App' }).query()).toBeNull();
		expect(page.getByRole('link', { name: 'Brochure Site' }).query()).toBeNull();
	});

	it('ignores an unknown type value', async () => {
		current.url = new URL('http://localhost/projects?type=bogus');
		render(Page, { data } as never);
		await expect.element(page.getByRole('link', { name: 'Brochure Site' })).toBeInTheDocument();
		await expect
			.element(page.getByRole('button', { name: 'All' }))
			.toHaveAttribute('aria-pressed', 'true');
	});
});
