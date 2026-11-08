import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import '../../routes/layout.css';
import PostRows from './post-rows.svelte';

const posts = [
	{
		slug: 'one',
		title: 'First post',
		date: '2026-03-05',
		tags: ['go', 'ledgers'],
		description: 'About one.'
	},
	{ slug: 'two', title: 'Second post', date: '2025-12-31', tags: [], description: 'About two.' }
];

describe('PostRows', () => {
	it('renders a linked row per post with a formatted date', async () => {
		const { container } = render(PostRows, { posts });
		const links = container.querySelectorAll<HTMLAnchorElement>('a.main');
		expect(links).toHaveLength(2);
		expect(links[0].getAttribute('href')).toBe('/writing/one');
		expect(links[0].textContent).toContain('First post');
		expect(container.querySelector('time')!.textContent).toBe('5 Mar 2026');
		expect(container.querySelector('time')!.getAttribute('datetime')).toBe('2026-03-05');
	});

	it('links each tag to its tag page', async () => {
		const { container } = render(PostRows, { posts });
		const tags = [...container.querySelectorAll<HTMLAnchorElement>('.tags a')];
		expect(tags.map((a) => a.getAttribute('href'))).toEqual([
			'/writing/tag/go',
			'/writing/tag/ledgers'
		]);
	});

	it('uses display-m for titles and hairline separators between rows', async () => {
		const { container } = render(PostRows, { posts });
		const rows = container.querySelectorAll<HTMLElement>('.row');
		expect(getComputedStyle(rows[1]).borderTopWidth).toBe('1px');
		expect(getComputedStyle(rows[0]).borderTopWidth).toBe('0px');
		const title = getComputedStyle(container.querySelector('.title')!);
		expect(parseFloat(title.fontSize)).toBeGreaterThan(26);
	});
});
