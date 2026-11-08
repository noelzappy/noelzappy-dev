import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import '../../routes/layout.css';

// Production behaviour. The dev=true behaviour lives in testimonials.dev.svelte.spec.ts, since a
// module mock is fixed per file.
vi.mock('$app/environment', () => ({ dev: false }));

import Testimonials from './testimonials.svelte';
import { TESTIMONIALS, hasPlaceholderTestimonials } from '$lib/data/testimonials';

describe('testimonials.svelte', () => {
	it('hides placeholder entries and the whole section outside dev', async () => {
		const { container } = render(Testimonials, { items: TESTIMONIALS });
		expect(container.querySelector('section')).toBeNull();
		expect(container.textContent).not.toContain('Client quote goes here');
		expect(page.getByText('Placeholder').query()).toBeNull();
	});

	it('still renders real entries outside dev, without the placeholders beside them', async () => {
		render(Testimonials, {
			items: [...TESTIMONIALS, { quote: 'Great.', name: 'Ama', role: 'CEO, Acme' }]
		});
		await expect.element(page.getByText('Great.')).toBeInTheDocument();
		expect(document.body.textContent).not.toContain('Client quote goes here');
	});

	it('renders nothing when the list is empty', async () => {
		const { container } = render(Testimonials, { items: [] });
		expect(container.querySelector('section')).toBeNull();
		await expect
			.element(page.getByRole('heading', { name: 'Testimonials' }))
			.not.toBeInTheDocument();
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
