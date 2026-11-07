import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import '../../routes/layout.css';
import PageHeader from './page-header.svelte';

describe('page-header.svelte', () => {
	it('renders the title as an h1.page-title', async () => {
		render(PageHeader, { title: 'Selected work' });
		const h1 = page.getByRole('heading', { level: 1, name: 'Selected work' });
		await expect.element(h1).toBeInTheDocument();
		expect(h1.element().classList.contains('page-title')).toBe(true);
	});

	it('omits eyebrow and intro when not given', async () => {
		const { container } = render(PageHeader, { title: 'Writing' });
		expect(container.querySelector('.eyebrow')).toBeNull();
		expect(container.querySelector('.intro')).toBeNull();
	});

	it('renders eyebrow and intro when given', async () => {
		// `intro` is also a Svelte mount option, so props must go via `target` + `props`.
		render(PageHeader, {
			target: document.body,
			props: { title: 'About', eyebrow: 'Studio', intro: 'Independent engineer.' }
		});
		await expect.element(page.getByText('Studio')).toBeInTheDocument();
		await expect.element(page.getByText('Independent engineer.')).toBeInTheDocument();
	});
});
