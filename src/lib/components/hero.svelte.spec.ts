import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { cdp, page } from 'vitest/browser';
import type { PillProject } from '$lib/data/projects';
import '../../routes/layout.css';
import Hero from './hero.svelte';

const HEADLINE = 'I design and build software products, end to end.';
const INTRO = "I'm an independent product engineer.";

const pills: PillProject[] = [
	{
		slug: 'kekeh-mac',
		title: 'Kekeh Mac',
		oneLine: 'Rides and deliveries for Freetown, with driver wallets, savings and loans built in.',
		built: ['Driver app', 'Passenger app', 'API', 'Admin', 'Real-time dispatch'],
		brandColor: '#34b764',
		onBrand: 'dark',
		deviceShots: [
			{
				src: '/portfolio/kekeh-mac/passenger-11-tracking-driver-on-the-way.webp',
				alt: 'Passenger tracking',
				kind: 'phone'
			},
			{
				src: '/portfolio/kekeh-mac/driver-05-heading-to-pickup.webp',
				alt: 'Driver heading to pickup',
				kind: 'phone'
			}
		]
	},
	{
		slug: 'susupaa-platform',
		title: 'SusuPaa',
		oneLine: 'Savings and lending software for susu collectors, cooperatives and microfinance.',
		built: ['Web app', 'API', 'Ledger', 'Admin', 'WhatsApp bot'],
		brandColor: '#ffb61e',
		onBrand: 'dark',
		deviceShots: [
			{ src: '/portfolio/susupaa-dashboard.webp', alt: 'SusuPaa dashboard', kind: 'browser' }
		]
	},
	{
		slug: 'rbl-dating-app',
		title: 'RBL Dating Platform',
		oneLine: 'A dating platform I moved to a new stack, with 170,000 live users and zero downtime.',
		built: ['Mobile app', 'Web app', 'API', 'Data migration'],
		brandColor: '#6e2e5e',
		onBrand: 'light',
		deviceShots: [{ src: '/portfolio/rbl-quick-match.webp', alt: 'RBL quick match', kind: 'phone' }]
	}
];

function setup() {
	// `intro` is also a Svelte mount option, so props must go through `props`; the cast satisfies the
	// mount-options overload.
	const { container } = render(Hero, {
		props: { pills, headline: HEADLINE, intro: INTRO }
	} as never);
	const root = container.querySelector('[data-active]') as HTMLElement;
	return { root };
}

// Transitions and animations are switched off so layout and visibility settle immediately.
let noMotion: HTMLStyleElement;
beforeEach(() => {
	noMotion = document.createElement('style');
	noMotion.textContent =
		'*, *::before, *::after { transition: none !important; animation: none !important; }';
	document.head.append(noMotion);
});

afterEach(async () => {
	noMotion.remove();
	await page.viewport(1280, 720);
	await emulateMotion('no-preference');
});

async function emulateMotion(value: 'reduce' | 'no-preference') {
	await cdp().send('Emulation.setEmulatedMedia', {
		features: [{ name: 'prefers-reduced-motion', value }]
	});
}

const rectOf = (el: Element) => el.getBoundingClientRect();

describe('hero.svelte', () => {
	it('renders the headline as the h1, the intro, and the pill links', async () => {
		setup();
		await expect.element(page.getByRole('heading', { level: 1 })).toHaveTextContent(HEADLINE);
		await expect.element(page.getByText(INTRO)).toBeInTheDocument();
		const links: [string, string][] = [
			['Kekeh Mac', '/projects/kekeh-mac'],
			['SusuPaa', '/projects/susupaa-platform'],
			['RBL Dating Platform', '/projects/rbl-dating-app'],
			['All work', '/projects']
		];
		for (const [name, href] of links) {
			await expect.element(page.getByRole('link', { name })).toHaveAttribute('href', href);
		}
	});

	it('starts in the default state', async () => {
		const { root } = setup();
		expect(root.dataset.active).toBe('');
	});

	it('hovering a pill turns the hero into that project', async () => {
		const { root } = setup();
		await page.getByRole('link', { name: 'Kekeh Mac' }).hover();
		await expect.poll(() => root.dataset.active).toBe('kekeh-mac');
		await expect.element(page.getByText(pills[0].oneLine!)).toBeInTheDocument();
		await expect
			.element(page.getByText('Driver app · Passenger app · API · Admin · Real-time dispatch'))
			.toBeInTheDocument();
		expect(getComputedStyle(root).getPropertyValue('--hero-bg').trim()).toBe('#34b764');
	});

	it('focusing a pill with the keyboard activates it too', async () => {
		const { root } = setup();
		(page.getByRole('link', { name: 'SusuPaa' }).element() as HTMLElement).focus();
		await expect.poll(() => root.dataset.active).toBe('susupaa-platform');
		(page.getByRole('link', { name: 'SusuPaa' }).element() as HTMLElement).blur();
		await expect.poll(() => root.dataset.active).toBe('');
	});

	it('moving the pointer out of the pill list resets to the default state', async () => {
		const { root } = setup();
		await page.getByRole('link', { name: 'RBL Dating Platform' }).hover();
		await expect.poll(() => root.dataset.active).toBe('rbl-dating-app');
		// A neutral spot in the hero's padding, not a layer that may be hidden.
		await page.elementLocator(root).hover({ position: { x: 8, y: 8 } });
		await expect.poll(() => root.dataset.active).toBe('');
	});

	it('focusing All work resets the preview to the default state', async () => {
		const { root } = setup();
		(page.getByRole('link', { name: 'SusuPaa' }).element() as HTMLElement).focus();
		await expect.poll(() => root.dataset.active).toBe('susupaa-platform');
		(page.getByRole('link', { name: 'All work' }).element() as HTMLElement).focus();
		await expect.poll(() => root.dataset.active).toBe('');
	});

	it('names at most one showcase at a time: none by default, only the active one when hovered', async () => {
		const { root } = setup();
		const named = () =>
			[...root.querySelectorAll('*')]
				.map((el) => getComputedStyle(el).viewTransitionName)
				.filter((n) => n && n !== 'none');
		const nameOnly = () => named().filter((n) => n.startsWith('project-'));
		expect(nameOnly()).toEqual([]);
		for (const pill of pills) {
			await page.getByRole('link', { name: pill.title }).hover();
			await expect.poll(() => root.dataset.active).toBe(pill.slug);
			await expect.poll(nameOnly).toEqual([`project-${pill.slug}`]);
		}
		await page.elementLocator(root).hover({ position: { x: 8, y: 8 } });
		await expect.poll(nameOnly).toEqual([]);
	});

	it('switching pill to pill shows exactly one project layer and hides the rest', async () => {
		const { root } = setup();
		for (const pill of pills) {
			await page.getByRole('link', { name: pill.title }).hover();
			await expect.poll(() => root.dataset.active).toBe(pill.slug);
			const on = root.querySelectorAll('.project.on');
			expect(on.length).toBe(1);
			expect(on[0].querySelector('.title')?.textContent).toBe(pill.title);
			await expect
				.poll(() =>
					[...root.querySelectorAll('.project')]
						.filter((el) => getComputedStyle(el).visibility === 'visible')
						.map((el) => el.querySelector('.title')?.textContent)
				)
				.toEqual([pill.title]);
			await expect
				.poll(
					() =>
						[...root.querySelectorAll('.shot-set')].filter(
							(el) => getComputedStyle(el).visibility === 'visible'
						).length
				)
				.toBe(1);
			await expect
				.poll(() => getComputedStyle(root.querySelector('.headline')!).visibility)
				.toBe('hidden');
		}
	});

	for (const [w, h] of [
		[1280, 720],
		[1366, 768],
		[1024, 700],
		[1440, 900],
		[800, 556],
		[1024, 600]
	]) {
		it(`fits one screen at ${w}x${h}`, async () => {
			await page.viewport(w, h);
			const { root } = setup();
			await expect.poll(() => root.getBoundingClientRect().height).toBeLessThanOrEqual(h);
			const all = page.getByRole('link', { name: 'All work' }).element();
			expect(all.getBoundingClientRect().bottom).toBeLessThanOrEqual(window.innerHeight);
			const pillList = root.querySelector('.pills')!.getBoundingClientRect();
			expect(root.querySelector('.headline')!.getBoundingClientRect().bottom).toBeLessThanOrEqual(
				pillList.top + 2
			);
			// Intro and headline do not collide, in the default and an active state.
			const intro = rectOf(root.querySelector('.intro')!);
			const headline = rectOf(root.querySelector('.headline')!);
			const apart =
				intro.bottom <= headline.top + 2 ||
				intro.top >= headline.bottom - 2 ||
				intro.left >= headline.right - 2 ||
				intro.right <= headline.left + 2;
			expect(apart).toBe(true);
			await page.getByRole('link', { name: 'Kekeh Mac' }).hover();
			await expect.poll(() => root.dataset.active).toBe('kekeh-mac');
			for (const shot of root.querySelectorAll('.shot-set.on img')) {
				await expect.poll(() => shot.getBoundingClientRect().top).toBeGreaterThanOrEqual(0);
				await expect.poll(() => shot.getBoundingClientRect().top).toBeLessThan(window.innerHeight);
			}
		});
	}

	it('on a phone the pills scroll sideways and hovering does nothing', async () => {
		await page.viewport(375, 812);
		const { root } = setup();
		const list = root.querySelector('.pills') as HTMLElement;
		await page.getByRole('link', { name: 'Kekeh Mac' }).hover();
		expect(root.dataset.active).toBe('');
		expect(list.scrollWidth).toBeGreaterThanOrEqual(list.clientWidth);
		expect(document.documentElement.scrollWidth).toBe(375);
	});

	describe('ambient work strip', () => {
		const visibleShots = (root: HTMLElement) =>
			[...root.querySelectorAll<HTMLElement>('.strip .track [data-copy="0"] .screen')].filter(
				(el) => rectOf(el).right > 0 && rectOf(el).left < window.innerWidth
			);

		it('is aria-hidden, inert, non-empty and holds nothing focusable', async () => {
			const { root } = setup();
			const strip = root.querySelector('.strip') as HTMLElement;
			expect(strip.getAttribute('aria-hidden')).toBe('true');
			expect(strip.inert).toBe(true);
			expect(strip.querySelectorAll('img').length).toBeGreaterThan(0);
			expect(strip.querySelectorAll('a, button, input, select, textarea, [tabindex]').length).toBe(
				0
			);
			// Decorative: every image has an empty alt.
			for (const img of strip.querySelectorAll('img')) expect(img.getAttribute('alt')).toBe('');
		});

		it('only the first screens load eagerly; the rest are lazy and low priority', async () => {
			const { root } = setup();
			const imgs = [...root.querySelectorAll<HTMLImageElement>('.strip img')];
			const eager = imgs.filter((i) => i.loading === 'eager');
			expect(eager.length).toBeGreaterThan(0);
			expect(eager.length).toBeLessThanOrEqual(3);
			expect(eager[0].getAttribute('fetchpriority')).toBe('high');
			for (const img of imgs.filter((i) => i.loading === 'lazy'))
				expect(img.getAttribute('fetchpriority')).toBe('low');
		});

		for (const [w, h] of [
			[2560, 1440],
			[1440, 900]
		]) {
			it(`leaves no dead band between header, strip and headline at ${w}x${h}`, async () => {
				await page.viewport(w, h);
				const { root } = setup();
				await expect
					.poll(() => visibleShots(root).length, { message: 'strip shows screens' })
					.toBeGreaterThan(1);
				const shots = visibleShots(root);
				const bottom = Math.max(...shots.map((el) => rectOf(el).bottom));
				const top = Math.min(...shots.map((el) => rectOf(el).top));
				const headline = rectOf(root.querySelector('.headline')!);
				const header = parseFloat(getComputedStyle(root).paddingTop);
				expect(headline.top - bottom).toBeLessThanOrEqual(h * 0.12);
				expect(top - (rectOf(root).top + header)).toBeLessThanOrEqual(h * 0.12);
				// The headline is the dominant element: at least 60% of the content width.
				const content =
					root.clientWidth -
					2 * parseFloat(getComputedStyle(root.querySelector('.main')!).paddingInline);
				expect(headline.width / content).toBeGreaterThanOrEqual(0.6);
			});
		}

		it('hides while a pill is active and pauses when the pill list is engaged', async () => {
			// Needs real animations: the blanket reset would also reset the play state.
			noMotion.remove();
			const { root } = setup();
			const strip = root.querySelector('.strip') as HTMLElement;
			const track = strip.querySelector('.track') as HTMLElement;
			await expect.poll(() => getComputedStyle(strip).visibility).toBe('visible');
			await page.getByRole('link', { name: 'Kekeh Mac' }).hover();
			await expect.poll(() => root.dataset.active).toBe('kekeh-mac');
			await expect.poll(() => getComputedStyle(strip).visibility).toBe('hidden');
			await expect.poll(() => getComputedStyle(track).animationPlayState).toBe('paused');
		});

		it('is static under reduced motion and animates otherwise', async () => {
			noMotion.remove();
			const { root } = setup();
			const track = root.querySelector('.strip .track') as HTMLElement;
			expect(getComputedStyle(track).animationName).not.toBe('none');
			expect(parseFloat(getComputedStyle(track).animationDuration)).toBeGreaterThanOrEqual(60);
			expect(parseFloat(getComputedStyle(track).animationDuration)).toBeLessThanOrEqual(90);
			await emulateMotion('reduce');
			await expect.poll(() => getComputedStyle(track).animationName).toBe('none');
		});
	});

	for (const [w, h] of [
		[1280, 600],
		[375, 812]
	]) {
		it(`keeps every pill reachable at ${w}x${h}`, async () => {
			await page.viewport(w, h);
			const { root } = setup();
			const list = root.querySelector('.pills') as HTMLElement;
			expect(document.documentElement.scrollWidth).toBe(w);
			const links = [...list.querySelectorAll('a')];
			expect(links.length).toBe(pills.length + 1);
			if (w <= 640) {
				expect(list.scrollWidth).toBeGreaterThan(list.clientWidth);
				for (const a of links) expect(rectOf(a).bottom).toBeLessThanOrEqual(h);
			} else {
				for (const a of links) {
					expect(rectOf(a).bottom).toBeLessThanOrEqual(h);
					expect(rectOf(a).right).toBeLessThanOrEqual(w);
				}
			}
		});
	}

	for (const [w, h] of [
		[1440, 900],
		[2560, 1440]
	]) {
		it(`active state shows the composition whole and centred in the right half at ${w}x${h}`, async () => {
			await page.viewport(w, h);
			const { root } = setup();
			for (const pill of pills) {
				await page.getByRole('link', { name: pill.title }).hover();
				await expect.poll(() => root.dataset.active).toBe(pill.slug);
				const set = root.querySelector('.shot-set.on') as HTMLElement;
				const showcase = set.querySelector('.showcase') as HTMLElement;
				const box = rectOf(root);
				const sc = rectOf(showcase);
				expect(sc.left).toBeGreaterThanOrEqual(box.left + box.width * 0.45);
				expect(sc.right).toBeLessThanOrEqual(box.right);
				expect(sc.top).toBeGreaterThanOrEqual(box.top);
				expect(sc.bottom).toBeLessThanOrEqual(box.bottom);
				const comp = rectOf(showcase.querySelector('.composition')!);
				expect(
					Math.abs((comp.top + comp.bottom) / 2 - (sc.top + sc.bottom) / 2)
				).toBeLessThanOrEqual(2);
				// Fills a real share of the field on whichever axis binds, instead of floating small in it.
				expect(Math.max(comp.width / sc.width, comp.height / sc.height)).toBeGreaterThanOrEqual(
					0.55
				);
				// Text sits left of the composition and above the pills.
				const text = rectOf(root.querySelector('.project.on')!);
				expect(text.right).toBeLessThanOrEqual(comp.left + 2);
				expect(text.bottom).toBeLessThanOrEqual(rectOf(root.querySelector('.pills')!).top + 2);
				for (const img of root.querySelectorAll<HTMLImageElement>('.shot-set img')) {
					expect(img.loading).toBe('lazy');
					expect(img.getAttribute('fetchpriority')).toBe('low');
				}
			}
		});
	}
});
