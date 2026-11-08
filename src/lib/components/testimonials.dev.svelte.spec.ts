import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import '../../routes/layout.css';

vi.mock('$app/environment', () => ({ dev: true }));

import Testimonials from './testimonials.svelte';
import { TESTIMONIALS } from '$lib/data/testimonials';

describe('testimonials.svelte in dev', () => {
	it('tags placeholder entries so they are not mistaken for real quotes', async () => {
		render(Testimonials, { items: TESTIMONIALS });
		await expect
			.element(page.getByRole('heading', { level: 2, name: 'Testimonials' }))
			.toBeInTheDocument();
		await expect.element(page.getByText('Placeholder').first()).toBeInTheDocument();
		expect(document.querySelectorAll('.tag').length).toBe(TESTIMONIALS.length);
	});
});
