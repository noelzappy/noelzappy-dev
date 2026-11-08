import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import '../../layout.css';
import Page from './+page.svelte';

describe('/contact', () => {
	it('renders "Get in touch" as the page title', async () => {
		const { container } = render(Page);
		await expect
			.element(page.getByRole('heading', { level: 1, name: 'Get in touch' }))
			.toBeInTheDocument();
		expect(container.querySelector('h1')!.classList.contains('page-title')).toBe(true);
	});

	it('offers the email address and the booking button', async () => {
		const { container } = render(Page);
		expect(container.querySelector('a[href="mailto:emmanuel@noelzappy.com"]')).not.toBeNull();
		expect(container.querySelector('button')!.textContent).toContain('15-minute');
	});

	it('emits ContactPage structured data', async () => {
		render(Page);
		const ld = [...document.head.querySelectorAll('script[type="application/ld+json"]')]
			.map((s) => JSON.parse(s.textContent!))
			.find((d) => d['@type'] === 'ContactPage');
		expect(ld.mainEntity.email).toBe('emmanuel@noelzappy.com');
	});
});
