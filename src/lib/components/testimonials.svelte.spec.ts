import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import '../../routes/layout.css';
import Testimonials from './testimonials.svelte';
import { TESTIMONIALS, hasPlaceholderTestimonials } from '$lib/data/testimonials';

describe('testimonials.svelte', () => {
	it('renders nothing when the list is empty', async () => {
		const { container } = render(Testimonials, { items: [] });
		expect(container.querySelector('section')).toBeNull();
		await expect
			.element(page.getByRole('heading', { name: 'Testimonials' }))
			.not.toBeInTheDocument();
	});

	it('tags placeholder entries so they are not mistaken for real quotes', async () => {
		render(Testimonials, { items: TESTIMONIALS });
		await expect
			.element(page.getByRole('heading', { level: 2, name: 'Testimonials' }))
			.toBeInTheDocument();
		await expect.element(page.getByText('Placeholder').first()).toBeInTheDocument();
		expect(document.querySelectorAll('.tag').length).toBe(TESTIMONIALS.length);
	});

	it('does not tag real entries', async () => {
		render(Testimonials, {
			items: [{ quote: 'Great.', name: 'Ama', role: 'CEO, Acme' }]
		});
		await expect.element(page.getByText('Great.')).toBeInTheDocument();
		expect(document.querySelector('.tag')).toBeNull();
	});

	it('reports placeholders for the deploy check', () => {
		expect(hasPlaceholderTestimonials()).toBe(true);
		expect(hasPlaceholderTestimonials([{ quote: 'q', name: 'n', role: 'r' }])).toBe(false);
	});
});
