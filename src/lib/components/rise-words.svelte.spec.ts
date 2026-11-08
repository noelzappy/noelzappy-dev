import { afterEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import PageHeader from './page-header.svelte';
import RiseWords from './rise-words.svelte';

const TEXT = 'I design and build software';

afterEach(() => document.documentElement.classList.remove('reveal-active', 'morph-active'));

describe('RiseWords', () => {
	it('renders aria-hidden word spans, staggered 40ms, with real spaces between', () => {
		const { container } = render(RiseWords, { text: TEXT });
		const spans = [...container.querySelectorAll('span')];
		expect(spans).toHaveLength(5);
		spans.forEach((s) => expect(s.getAttribute('aria-hidden')).toBe('true'));
		expect(container.textContent).toBe(TEXT);
		expect(spans.map((s) => s.getAnimations()[0]?.effect?.getTiming().delay)).toEqual([
			0, 40, 80, 120, 160
		]);
	});

	it('keeps the heading accessible name equal to the original text', async () => {
		render(PageHeader, { title: TEXT });
		await expect.element(page.getByRole('heading', { level: 1, name: TEXT })).toBeInTheDocument();
	});

	it('does not animate when created during a curtain or morph transition', () => {
		for (const cls of ['reveal-active', 'morph-active']) {
			document.documentElement.classList.add(cls);
			const { container } = render(RiseWords, { text: TEXT });
			expect(container.querySelector('span')!.getAnimations()).toHaveLength(0);
			document.documentElement.classList.remove(cls);
		}
	});
});
