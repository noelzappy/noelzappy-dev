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
			.toHaveTextContent('Selected work: from first app to production.');
		await expect
			.element(page.getByRole('link', { name: 'Phone App', exact: true }))
			.toBeInTheDocument();
		await expect
			.element(page.getByRole('link', { name: 'Brochure Site', exact: true }))
			.toBeInTheDocument();
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
		await expect
			.element(page.getByRole('link', { name: 'Phone App', exact: true }))
			.toBeInTheDocument();
		expect(page.getByRole('link', { name: 'Brochure Site', exact: true }).query()).toBeNull();
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
		expect(page.getByRole('link', { name: 'Phone App', exact: true }).query()).toBeNull();
		expect(page.getByRole('link', { name: 'Brochure Site', exact: true }).query()).toBeNull();
	});

	it('ignores an unknown type value', async () => {
		current.url = new URL('http://localhost/projects?type=bogus');
		render(Page, { data } as never);
		await expect
			.element(page.getByRole('link', { name: 'Brochure Site', exact: true }))
			.toBeInTheDocument();
		await expect
			.element(page.getByRole('button', { name: 'All' }))
			.toHaveAttribute('aria-pressed', 'true');
	});

	it('has a visually hidden Case studies h2 before the rows', async () => {
		const { container } = render(Page, { data } as never);
		const h2 = page.getByRole('heading', { level: 2, name: 'Case studies' });
		await expect.element(h2).toBeInTheDocument();
		const el = container.querySelector('h2.sr-only')!;
		expect(el.textContent).toBe('Case studies');
		expect(el.compareDocumentPosition(container.querySelector('.row')!)).toBe(
			Node.DOCUMENT_POSITION_FOLLOWING
		);
	});

	it('gives each row CTA a unique accessible name', async () => {
		const withLive = {
			caseStudies: [
				item({ slug: 'one', title: 'Alpha', liveUrl: 'https://alpha.example' }),
				item({ slug: 'two', title: 'Beta', liveUrl: 'https://beta.example' })
			],
			openSource: []
		};
		const { container } = render(Page, { data: withLive } as never);
		const names = [...container.querySelectorAll('a.cta')].map((a) =>
			a.textContent!.replace(/\s+/g, ' ').trim()
		);
		expect(names.length).toBe(2);
		expect(new Set(names).size).toBe(2);
		expect(names[0]).toContain('Alpha');
		await expect.element(page.getByRole('link', { name: /Beta/ }).first()).toBeInTheDocument();
	});

	it('hides filter chips whose result set is empty', async () => {
		const noSites = { caseStudies: [data.caseStudies[0]], openSource: [] };
		render(Page, { data: noSites } as never);
		await expect.element(page.getByRole('button', { name: 'Mobile' })).toBeInTheDocument();
		expect(page.getByRole('button', { name: 'Websites' }).query()).toBeNull();
		expect(page.getByRole('button', { name: 'Backend' }).query()).toBeNull();
		expect(page.getByRole('button', { name: 'Open source' }).query()).toBeNull();
		await expect.element(page.getByRole('button', { name: 'Fintech' })).toBeInTheDocument();
	});

	it('never has two elements with the same view-transition-name', async () => {
		render(Page, { data } as never);
		await expect
			.element(page.getByRole('link', { name: 'Phone App', exact: true }))
			.toBeInTheDocument();
		const names = [...document.body.querySelectorAll('*')]
			.map((el) => getComputedStyle(el).viewTransitionName)
			.filter((n) => n && n !== 'none');
		expect(names.length).toBeGreaterThan(0);
		expect(new Set(names).size).toBe(names.length);
	});
});
