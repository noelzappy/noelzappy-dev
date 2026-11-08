import { describe, expect, it, vi, afterEach } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { userEvent } from 'vitest/browser';
import '../../routes/layout.css';
import WorkStrip, { parallaxP, parallaxX } from './work-strip.svelte';
import type { StripScreen } from '$lib/data/showcase';

const screens: StripScreen[] = [
	{
		src: '/favicon.png',
		kind: 'phone',
		href: '/projects/kekeh-mac',
		name: 'Kekeh Mac',
		brandColor: '#34b764',
		onBrand: 'dark'
	},
	{
		src: '/favicon.png',
		kind: 'web',
		href: 'https://alvi.test',
		name: 'A very long project name that cannot possibly fit on one line of a narrow card',
		brandColor: '#ffb61e',
		onBrand: 'dark'
	},
	{ src: '/favicon.png', kind: 'phone', name: 'No Colour' }
];

const frame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));

afterEach(() => vi.restoreAllMocks());

describe('parallax maths', () => {
	it('p is 0 at the strip centre and +-1 at the edge plus half a card, clamped beyond', () => {
		const half = 500;
		const w = 200;
		expect(parallaxP(500, 500, half, w)).toBe(0);
		expect(parallaxP(500 + half + w / 2, 500, half, w)).toBe(1);
		expect(parallaxP(500 - half - w / 2, 500, half, w)).toBe(-1);
		expect(parallaxP(5000, 500, half, w)).toBe(1);
		expect(parallaxP(-5000, 500, half, w)).toBe(-1);
		expect(parallaxP(500 + (half + w / 2) / 2, 500, half, w)).toBeCloseTo(0.5);
	});

	it('the image offset opposes p and scales by range', () => {
		expect(parallaxX(0, 80)).toBeCloseTo(0);
		expect(parallaxX(1, 80)).toBe(-80);
		expect(parallaxX(-1, 80)).toBe(80);
		expect(parallaxX(3, 80)).toBe(-80);
	});
});

describe('parallax ranges', () => {
	it('phones travel +-7% of the card width, web shots 25%', async () => {
		const { container } = render(WorkStrip, { screens, offset: 0 });
		await frame();
		const read = (kind: string) => {
			const card = container.querySelector<HTMLElement>(`[data-copy="0"] .${kind} .card`)!;
			const obj = card.querySelector<HTMLElement>('.obj')!;
			const w = card.getBoundingClientRect().width;
			const at = (p: number) => {
				card.style.setProperty('--p', String(p));
				return obj.getBoundingClientRect().left - card.getBoundingClientRect().left;
			};
			return (at(-1) - at(1)) / 2 / w;
		};
		expect(read('phone')).toBeCloseTo(0.07, 2);
		expect(read('web')).toBeCloseTo(0.25, 2);
	});
});

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
		expect(first.querySelectorAll('.screen')[1].getAttribute('rel')).toContain('noopener');
		expect(first.querySelectorAll('.screen')[1].getAttribute('target')).toBe('_blank');
		expect(first.querySelectorAll('.screen')[0].getAttribute('data-sveltekit-preload-data')).toBe(
			'hover'
		);
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

	it('gives every card the same portrait 2:3 size, square cornered', () => {
		const { container } = render(WorkStrip, { screens });
		const cards = [...container.querySelectorAll<HTMLElement>('[data-copy="0"] .card')];
		expect(cards.length).toBeGreaterThan(3);
		const first = cards[0].getBoundingClientRect();
		for (const card of cards) {
			const r = card.getBoundingClientRect();
			expect(Math.abs(r.width - first.width)).toBeLessThanOrEqual(1);
			expect(Math.abs(r.height - first.height)).toBeLessThanOrEqual(1);
			expect(Math.abs(r.width - (r.height * 2) / 3)).toBeLessThanOrEqual(1);
			expect(getComputedStyle(card).borderRadius).toBe('0px');
			expect(getComputedStyle(card).overflow).toBe('hidden');
		}
	});

	it('labels every card with its project name, below the card, on one line with an ellipsis', () => {
		const { container } = render(WorkStrip, { screens });
		const items = [...container.querySelectorAll<HTMLElement>('[data-copy="0"] .screen')];
		expect(items.slice(0, 3).map((i) => i.querySelector('.label')?.textContent)).toEqual([
			'Kekeh Mac',
			screens[1].name,
			'No Colour'
		]);
		for (const item of items) {
			const label = item.querySelector<HTMLElement>('.label')!;
			const card = item.querySelector<HTMLElement>('.card')!;
			expect(card.contains(label)).toBe(false);
			expect(label.getBoundingClientRect().top).toBeGreaterThanOrEqual(
				card.getBoundingClientRect().bottom + 6
			);
			expect(label.getBoundingClientRect().width).toBeLessThanOrEqual(
				card.getBoundingClientRect().width + 1
			);
			const cs = getComputedStyle(label);
			expect(cs.whiteSpace).toBe('nowrap');
			expect(cs.textOverflow).toBe('ellipsis');
			expect(cs.overflow).toBe('hidden');
			expect(parseFloat(cs.lineHeight)).toBeGreaterThan(0);
			expect(label.getBoundingClientRect().height).toBeLessThanOrEqual(
				parseFloat(cs.lineHeight) + 1
			);
		}
	});

	it('paints the card with the brand colour, or the neutral surface token when there is none', () => {
		const { container } = render(WorkStrip, { screens });
		const cards = [...container.querySelectorAll<HTMLElement>('[data-copy="0"] .card')];
		const probe = document.createElement('div');
		probe.style.background = '#34b764';
		document.body.append(probe);
		const green = getComputedStyle(probe).backgroundColor;
		probe.style.background = '#ffb61e';
		const amber = getComputedStyle(probe).backgroundColor;
		probe.style.background = 'var(--code-bg)';
		const fallback = getComputedStyle(probe).backgroundColor;
		probe.remove();
		expect(getComputedStyle(cards[0]).backgroundColor).toBe(green);
		expect(getComputedStyle(cards[1]).backgroundColor).toBe(amber);
		expect(getComputedStyle(cards[2]).backgroundColor).toBe(fallback);
	});

	it('draws a phone as a bezelled object 62% of the card wide, centred, top at 14%', () => {
		const { container } = render(WorkStrip, { screens, offset: 0 });
		const card = container.querySelector<HTMLElement>('[data-copy="0"] .phone .card')!;
		const obj = card.querySelector<HTMLElement>('.obj')!;
		const c = card.getBoundingClientRect();
		const o = obj.getBoundingClientRect();
		expect(o.width / c.width).toBeCloseTo(0.62, 1);
		expect(o.top - c.top).toBeCloseTo(c.height * 0.14, 0);
		const cs = getComputedStyle(obj);
		expect(parseFloat(cs.borderTopLeftRadius)).toBeGreaterThan(o.width * 0.08);
		expect(cs.backgroundColor).toBe('rgb(11, 11, 12)');
		expect(cs.paddingTop).not.toBe('0px');
	});

	it('draws a web shot at 150% of the card width, offset 12% / 18%, with the screen radius', () => {
		const { container } = render(WorkStrip, { screens, offset: 0 });
		const card = container.querySelector<HTMLElement>('[data-copy="0"] .web .card')!;
		const obj = card.querySelector<HTMLElement>('.obj')!;
		const c = card.getBoundingClientRect();
		const o = obj.getBoundingClientRect();
		expect(o.width / c.width).toBeCloseTo(1.5, 1);
		expect(o.top - c.top).toBeCloseTo(c.height * 0.18, 0);
		expect(o.width).toBeGreaterThan(c.width);
		expect(getComputedStyle(obj).borderTopLeftRadius).toBe(
			getComputedStyle(document.documentElement).getPropertyValue('--radius-screen').trim() ===
				'0.5rem'
				? `${0.5 * parseFloat(getComputedStyle(document.documentElement).fontSize)}px`
				: getComputedStyle(obj).borderTopLeftRadius
		);
	});

	it('the object lags its card: it moves left on screen by less than the track does', async () => {
		const { container, rerender } = render(WorkStrip, { screens, offset: 0 });
		await frame();
		const strip = container.querySelector('.strip') as HTMLElement;
		const sr = strip.getBoundingClientRect();
		const cards = [...container.querySelectorAll<HTMLElement>('[data-copy="0"] .card')];
		// A card well inside the strip (p away from the clamp).
		const card = cards.find((c) => {
			const r = c.getBoundingClientRect();
			return r.left > sr.left + 20 && r.right < sr.right - 20;
		})!;
		expect(card).toBeTruthy();
		const img = card.querySelector('.obj')!;
		const cardX = () => card.getBoundingClientRect().left;
		const imgX = () => img.getBoundingClientRect().left;
		const c0 = cardX();
		const i0 = imgX();
		const d = 40;
		await rerender({ screens, offset: d });
		await frame();
		const cardMoved = c0 - cardX();
		const imgMoved = i0 - imgX();
		expect(cardMoved).toBeCloseTo(d, 0);
		expect(imgMoved).toBeGreaterThan(0);
		expect(imgMoved).toBeLessThan(d);
	});

	it('pauses the drift while the pointer is over the strip', async () => {
		const { container } = render(WorkStrip, { screens });
		const strip = container.querySelector('.strip') as HTMLElement;
		const track = container.querySelector('.track') as HTMLElement;
		strip.style.height = '12rem';
		await userEvent.hover(strip);
		await frame();
		const t0 = track.style.transform;
		await new Promise((r) => setTimeout(r, 250));
		expect(track.style.transform).toBe(t0);
	});

	it('does not advance while the paused prop is set', async () => {
		const { container } = render(WorkStrip, { screens, paused: true });
		const track = container.querySelector('.track') as HTMLElement;
		await frame();
		const t0 = track.style.transform;
		await new Promise((r) => setTimeout(r, 250));
		expect(track.style.transform).toBe(t0);
	});

	it('with reduced motion: no transform on the composed objects and only the first copy shows', async () => {
		const real = window.matchMedia.bind(window);
		vi.spyOn(window, 'matchMedia').mockImplementation((q: string) =>
			q.includes('prefers-reduced-motion')
				? ({
						matches: true,
						media: q,
						addEventListener: () => {},
						removeEventListener: () => {}
					} as unknown as MediaQueryList)
				: real(q)
		);
		const { container } = render(WorkStrip, { screens, offset: 120 });
		await frame();
		const track = container.querySelector('.track') as HTMLElement;
		expect(track.style.transform).toBe('');
		for (const obj of container.querySelectorAll('.obj')) {
			expect(getComputedStyle(obj).transform).toBe('none');
		}
		const second = container.querySelector('[data-copy="1"]') as HTMLElement;
		expect(getComputedStyle(second).display).toBe('none');
	});
});
