import { afterEach, describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { fadeUp } from './fade-up';

afterEach(() => document.body.replaceChildren());

function box(top: number) {
	const el = document.createElement('div');
	el.style.cssText = `position:absolute;left:0;top:${top}px;width:100px;height:50px`;
	document.body.append(el);
	return el;
}

const frame = () => new Promise((r) => requestAnimationFrame(() => r(null)));

describe('fadeUp', () => {
	it('leaves an element already in view visible (never hidden)', async () => {
		await page.viewport(800, 600);
		const el = box(100);
		fadeUp(el);
		await frame();
		expect(el.classList.contains('fade-up')).toBe(false);
	});

	it('hides a below-the-fold element, then reveals it once when it intersects', async () => {
		await page.viewport(800, 600);
		const spacer = document.createElement('div');
		spacer.style.height = '3000px';
		document.body.append(spacer);
		const el = box(2000);
		fadeUp(el);
		expect(el.classList.contains('fade-up')).toBe(true);
		expect(el.classList.contains('fade-up-in')).toBe(false);
		window.scrollTo(0, 1800);
		await expect.poll(() => el.classList.contains('fade-up-in')).toBe(true);
		window.scrollTo(0, 0);
		window.scrollTo(0, 1800);
		await frame();
		expect(el.classList.contains('fade-up-in')).toBe(true);
	});
});
