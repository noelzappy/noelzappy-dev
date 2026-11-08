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

	it('has the booking button and email link', async () => {
		render(Footer);
		await expect.element(page.getByRole('link', { name: 'Book a 15-minute call' })).toBeVisible();
		expect(href('emmanuel@noelzappy.com')).toBe('mailto:emmanuel@noelzappy.com');
	});

	it('has profile and feed links', async () => {
		render(Footer);
		await expect.element(page.getByRole('link', { name: 'GitHub' })).toBeVisible();
		expect(href('GitHub')).toBe('https://github.com/noelzappy');
		expect(href('LinkedIn')).toBe('https://www.linkedin.com/in/noelzappy');
		expect(href('X')).toBe('https://x.com/noelzappy');
		expect(href('RSS')).toBe('/rss.xml');
	});

	it('keeps the email address on one line at phone widths', async () => {
		await page.viewport(360, 780);
		try {
			render(Footer);
			const link = page.getByRole('link', { name: 'emmanuel@noelzappy.com' }).element();
			const range = document.createRange();
			range.selectNodeContents(link);
			// A mid-word break (overflow-wrap: anywhere) would lay the text out on two lines.
			expect(range.getClientRects()).toHaveLength(1);
			expect(link.getBoundingClientRect().right).toBeLessThanOrEqual(360);
		} finally {
			await page.viewport(414, 896);
		}
	});
});
