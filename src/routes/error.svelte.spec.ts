import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import './layout.css';

const current = vi.hoisted(() => ({ status: 404, message: 'Not Found' }));

vi.mock('$app/state', () => ({
	page: {
		get status() {
			return current.status;
		},
		get error() {
			return { message: current.message };
		}
	}
}));

import ErrorPage from './+error.svelte';

describe('+error', () => {
	it('shows the status as the eyebrow and one line as the h1', async () => {
		current.status = 404;
		const { container } = render(ErrorPage);
		expect(container.querySelector('.eyebrow')!.textContent).toBe('404');
		await expect
			.element(page.getByRole('heading', { level: 1, name: /doesn't exist/ }))
			.toBeInTheDocument();
		expect(container.querySelector('h1')!.classList.contains('page-title')).toBe(true);
	});

	it('links home and to Work', async () => {
		current.status = 404;
		const { container } = render(ErrorPage);
		expect(container.querySelector('a[href="/"]')!.textContent).toBe('Home');
		expect(container.querySelector('a[href="/projects"]')!.textContent).toBe('Work');
	});

	it('falls back to the error message for unknown statuses', async () => {
		current.status = 418;
		current.message = 'I am a teapot';
		const { container } = render(ErrorPage);
		expect(container.querySelector('.eyebrow')!.textContent).toBe('418');
		expect(container.querySelector('h1')!.textContent).toBe('I am a teapot');
	});

	it('is not indexed', async () => {
		current.status = 404;
		render(ErrorPage);
		expect(document.head.querySelector('meta[name="robots"]')?.getAttribute('content')).toContain(
			'noindex'
		);
	});

	it('has no canonical link', async () => {
		current.status = 404;
		render(ErrorPage);
		expect(document.head.querySelector('link[rel="canonical"]')).toBeNull();
	});
});
