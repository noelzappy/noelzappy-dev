import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import '../../layout.css';
import Page from './+page.svelte';
import { TIMELINE } from '$lib/data/timeline';

describe('/about', () => {
	it('renders the h1', async () => {
		render(Page);
		await expect
			.element(page.getByRole('heading', { level: 1, name: 'Emmanuel Yeboah' }))
			.toBeInTheDocument();
	});

	it('shows the portrait with real dimensions and alt text', async () => {
		const { container } = render(Page);
		const img = container.querySelector<HTMLImageElement>('img.portrait')!;
		expect(img).not.toBeNull();
		expect(img.getAttribute('src')).toBe('/zappy-face.jpg');
		expect(img.getAttribute('alt')).toBe('Emmanuel Yeboah');
		expect(Number(img.getAttribute('width'))).toBeGreaterThan(0);
		expect(Number(img.getAttribute('height'))).toBeGreaterThan(0);
	});

	it('lists every timeline org', async () => {
		const { container } = render(Page);
		const text = container.querySelector('.timeline')!.textContent!;
		for (const entry of TIMELINE) expect(text).toContain(entry.org);
	});

	it('links writeups and the Now call to action', async () => {
		const { container } = render(Page);
		for (const entry of TIMELINE) {
			if (entry.writeup) {
				expect(container.querySelector(`.timeline a[href="${entry.writeup}"]`)).not.toBeNull();
			}
			if (entry.cta) {
				expect(container.querySelector(`.timeline a[href="${entry.cta.href}"]`)).not.toBeNull();
			}
		}
	});

	it('frames me as a product engineer, not a payments-only backend engineer', async () => {
		const { container } = render(Page);
		const story = container.querySelector('.story')!.textContent!;
		expect(story).not.toMatch(/fintech and payments teams/);
		expect(container.querySelector('.intro')!.textContent).toContain('product engineer');
	});

	it('emits Person structured data with the product engineer title', async () => {
		render(Page);
		const ld = [...document.head.querySelectorAll('script[type="application/ld+json"]')]
			.map((s) => JSON.parse(s.textContent!))
			.find((d) => d.mainEntity?.['@type'] === 'Person');
		expect(ld.mainEntity.jobTitle).toBe('Product Engineer');
	});
});
