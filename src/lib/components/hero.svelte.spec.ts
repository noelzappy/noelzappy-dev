import { afterEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
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
		oneLine: 'A dating platform I moved to a new stack — 170,000 live users, zero downtime.',
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

afterEach(async () => {
	await page.viewport(1280, 720);
});

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

	it('switching pill to pill shows exactly one project layer and hides the rest', async () => {
		const { root } = setup();
		for (const pill of pills) {
			await page.getByRole('link', { name: pill.title }).hover();
			await expect.poll(() => root.dataset.active).toBe(pill.slug);
			const on = root.querySelectorAll('.project.on');
			expect(on.length).toBe(1);
			expect(on[0].querySelector('.title')?.textContent).toBe(pill.title);
			document.getAnimations().forEach((a) => a.finish());
			const visible = [...root.querySelectorAll('.project')]
				.filter((el) => getComputedStyle(el).visibility === 'visible')
				.map((el) => el.querySelector('.title')?.textContent);
			expect(visible).toEqual([pill.title]);
			const shots = [...root.querySelectorAll('.shot-set')].filter(
				(el) => getComputedStyle(el).visibility === 'visible'
			);
			expect(shots.length).toBe(1);
			expect(getComputedStyle(root.querySelector('.headline')!).visibility).toBe('hidden');
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
			const intro = root.querySelector('.intro')!.getBoundingClientRect();
			const headline = root.querySelector('.headline')!.getBoundingClientRect();
			expect(intro.bottom).toBeLessThanOrEqual(headline.top + 2);
			await page.getByRole('link', { name: 'Kekeh Mac' }).hover();
			await expect.poll(() => root.dataset.active).toBe('kekeh-mac');
			document.getAnimations().forEach((a) => a.finish());
			for (const shot of root.querySelectorAll('.shot-set.on .shot')) {
				const r = shot.getBoundingClientRect();
				expect(r.top).toBeGreaterThanOrEqual(0);
				expect(r.top).toBeLessThan(window.innerHeight);
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
});
