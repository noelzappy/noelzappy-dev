import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import '../../routes/layout.css';
import Footer from './footer.svelte';

const href = (name: string) =>
	page.getByRole('link', { name, exact: true }).first().element().getAttribute('href');

describe('footer.svelte', () => {
	it('has the closing heading', async () => {
		render(Footer);
		await expect
			.element(page.getByRole('heading', { name: 'Have something to build?' }))
			.toBeInTheDocument();
	});

	it('has the booking and email links', async () => {
		render(Footer);
		await expect.element(page.getByRole('link', { name: 'Book a 15-minute call' })).toBeVisible();
		expect(href('Book a 15-minute call')).toBe('/work-with-me#call');
		expect(href('me@noelzappy.dev')).toBe('mailto:me@noelzappy.dev');
	});

	it('has profile and feed links', async () => {
		render(Footer);
		await expect.element(page.getByRole('link', { name: 'GitHub' })).toBeVisible();
		expect(href('GitHub')).toBe('https://github.com/noelzappy');
		expect(href('LinkedIn')).toBe('https://www.linkedin.com/in/noelzappy');
		expect(href('X')).toBe('https://x.com/noelzappy');
		expect(href('RSS')).toBe('/rss.xml');
	});
});
