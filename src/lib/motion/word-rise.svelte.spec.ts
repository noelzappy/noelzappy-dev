import { afterEach, describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { wordRise } from './word-rise';

const TEXT = 'I design and build software';

function heading() {
	const h1 = document.createElement('h1');
	h1.textContent = TEXT;
	document.body.append(h1);
	return h1;
}

afterEach(() => {
	document.body.replaceChildren();
	document.documentElement.classList.remove('reveal-active', 'morph-active');
});

describe('wordRise', () => {
	it('splits into aria-hidden word spans and keeps the accessible name', async () => {
		const h1 = heading();
		wordRise(h1);
		const spans = h1.querySelectorAll('span');
		expect(spans).toHaveLength(5);
		spans.forEach((s) => expect(s.getAttribute('aria-hidden')).toBe('true'));
		expect(h1.textContent).toBe(TEXT);
		await expect.element(page.getByRole('heading', { level: 1, name: TEXT })).toBeInTheDocument();
	});

	it('staggers each word 40ms apart', () => {
		const h1 = heading();
		wordRise(h1);
		const delays = [...h1.querySelectorAll('span')].map(
			(s) => (s.getAnimations()[0].effect!.getTiming().delay as number) ?? 0
		);
		expect(delays).toEqual([0, 40, 80, 120, 160]);
	});

	it('is skipped while a curtain or morph transition runs', () => {
		for (const cls of ['reveal-active', 'morph-active']) {
			document.documentElement.classList.add(cls);
			const h1 = heading();
			wordRise(h1);
			expect(h1.querySelector('span')).toBeNull();
			document.documentElement.classList.remove(cls);
		}
	});

	it('leaves headings with markup alone', () => {
		const h1 = document.createElement('h1');
		h1.innerHTML = 'A <em>mark</em> up';
		wordRise(h1);
		expect(h1.querySelectorAll('span')).toHaveLength(0);
	});
});
