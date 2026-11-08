import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { userEvent } from 'vitest/browser';
import '../../routes/layout.css';
import WorkStrip from './work-strip.svelte';
import type { StripScreen } from '$lib/data/showcase';

const screens: StripScreen[] = [
	{ src: '/favicon.png', kind: 'phone', href: '/projects/kekeh-mac' },
	{ src: '/favicon.png', kind: 'web', href: 'https://alvi.test' },
	{ src: '/favicon.png', kind: 'phone' }
];

describe('WorkStrip', () => {
	it('is aria-hidden and not inert, and its screens are pointer-only links', () => {
		const { container } = render(WorkStrip, { screens });
		const strip = container.querySelector('.strip') as HTMLElement;
		expect(strip.getAttribute('aria-hidden')).toBe('true');
		expect(strip.inert).toBe(false);
		const links = [...strip.querySelectorAll<HTMLAnchorElement>('a.screen')];
		expect(links.length).toBeGreaterThan(0);
		for (const link of links) {
			expect(link.getAttribute('tabindex')).toBe('-1');
			expect(link.getAttribute('aria-hidden')).toBe('true');
			expect(getComputedStyle(link).cursor).toBe('pointer');
		}
	});

	it('links each screen to its project, and screens with no destination are not links', () => {
		const { container } = render(WorkStrip, { screens });
		const first = container.querySelector('[data-copy="0"]')!;
		const hrefs = [...first.querySelectorAll('.screen')]
			.slice(0, 3)
			.map((el) => el.getAttribute('href'));
		expect(hrefs).toEqual(['/projects/kekeh-mac', 'https://alvi.test', null]);
		expect(first.querySelectorAll('.screen')[2].tagName).toBe('DIV');
		// External destinations open safely.
		expect(first.querySelectorAll('.screen')[1].getAttribute('rel')).toContain('noopener');
		expect(first.querySelectorAll('.screen')[1].getAttribute('target')).toBe('_blank');
	});

	it('cannot be reached by keyboard', async () => {
		const { container } = render(WorkStrip, { screens });
		const before = document.createElement('button');
		document.body.prepend(before);
		before.focus();
		for (let i = 0; i < 4; i++) await userEvent.tab();
		expect(container.contains(document.activeElement)).toBe(false);
		before.remove();
	});

	it('pauses the drift while the pointer is over the strip', async () => {
		const { container } = render(WorkStrip, { screens });
		const strip = container.querySelector('.strip') as HTMLElement;
		const track = container.querySelector('.track') as HTMLElement;
		expect(getComputedStyle(track).animationPlayState).toBe('running');
		strip.style.height = '12rem';
		await userEvent.hover(strip);
		expect(getComputedStyle(track).animationPlayState).toBe('paused');
	});
});
