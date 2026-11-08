import { afterEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import '../../routes/layout.css';
import SiteHeader from './site-header.svelte';

const state = vi.hoisted(() => ({ path: '/' }));
vi.mock('$app/navigation', () => ({ afterNavigate: () => {} }));
vi.mock('$app/state', () => ({
	page: {
		get url() {
			return new URL(`http://localhost${state.path}`);
		}
	}
}));

let spacer: HTMLElement | null = null;
function addScrollSpace() {
	spacer = document.createElement('div');
	spacer.style.height = '4000px';
	document.body.append(spacer);
}

afterEach(() => {
	spacer?.remove();
	spacer = null;
	window.scrollTo(0, 0);
	state.path = '/';
});

const header = () => document.querySelector('header.site-header') as HTMLElement;
const bg = () => getComputedStyle(header()).backgroundColor;

describe('site-header.svelte', () => {
	it('shows the nav links with exact hrefs at 1280', async () => {
		await page.viewport(1280, 800);
		render(SiteHeader);
		const links: [string, string][] = [
			['Work', '/projects'],
			['About', '/about'],
			['Writing', '/writing'],
			['Work with me', '/work-with-me']
		];
		for (const [name, href] of links) {
			const link = page.getByRole('navigation', { name: 'Main' }).getByRole('link', {
				name,
				exact: true
			});
			await expect.element(link).toBeVisible();
			await expect.element(link).toHaveAttribute('href', href);
		}
	});

	it('hides the Menu button at 1280 and shows it at 375', async () => {
		await page.viewport(1280, 800);
		render(SiteHeader);
		const menu = () => document.querySelector('.menu-pill') as HTMLElement;
		const links = () => document.querySelector('.links') as HTMLElement;
		await expect.poll(() => getComputedStyle(menu()).display).toBe('none');
		await expect.poll(() => getComputedStyle(links()).display).toBe('flex');
		await page.viewport(375, 800);
		await expect.poll(() => getComputedStyle(menu()).display).not.toBe('none');
		await expect.poll(() => getComputedStyle(links()).display).toBe('none');
		await expect.element(page.getByRole('button', { name: 'Menu' })).toBeVisible();
	});

	it('has 44px tap targets and no horizontal overflow at 360', async () => {
		await page.viewport(360, 700);
		render(SiteHeader);
		const targets = [
			page.getByRole('button', { name: 'Menu' }),
			page.getByRole('button', { name: /theme/i })
		];
		for (const t of targets) {
			await expect.element(t).toBeVisible();
			const r = t.element().getBoundingClientRect();
			expect(r.width).toBeGreaterThanOrEqual(43.5);
			expect(r.height).toBeGreaterThanOrEqual(43.5);
		}
		expect(header().scrollWidth).toBeLessThanOrEqual(header().clientWidth);
		expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(360);
	});

	it('marks the current section link with aria-current', async () => {
		await page.viewport(1280, 800);
		state.path = '/projects/some-case';
		render(SiteHeader);
		const nav = page.getByRole('navigation', { name: 'Main' });
		await expect
			.element(nav.getByRole('link', { name: 'Work', exact: true }))
			.toHaveAttribute('aria-current', 'page');
		await expect
			.element(nav.getByRole('link', { name: 'About' }))
			.not.toHaveAttribute('aria-current');
	});

	it('stays fixed at top 0 after scrolling 2000px', async () => {
		await page.viewport(1280, 800);
		render(SiteHeader);
		addScrollSpace();
		window.scrollTo(0, 2000);
		await expect.poll(() => window.scrollY).toBe(2000);
		expect(getComputedStyle(header()).position).toBe('fixed');
		expect(header().getBoundingClientRect().top).toBe(0);
	});

	it('is transparent at the top and solid with a hairline after scroll', async () => {
		await page.viewport(1280, 800);
		render(SiteHeader);
		addScrollSpace();
		expect(bg()).toBe('rgba(0, 0, 0, 0)');
		window.scrollTo(0, 400);
		await expect.poll(bg).not.toBe('rgba(0, 0, 0, 0)');
		const bodyBg = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
		const probe = document.createElement('div');
		probe.style.backgroundColor = bodyBg;
		document.body.append(probe);
		const solid = getComputedStyle(probe).backgroundColor;
		probe.remove();
		await expect.poll(bg).toBe(solid);
		const cs = getComputedStyle(header());
		expect(cs.borderBottomWidth).toBe('1px');
		expect(cs.borderBottomColor).not.toBe('rgba(0, 0, 0, 0)');
		expect(cs.boxShadow).toBe('none');
		expect(cs.backdropFilter).toBe('none');
	});

	it('no longer shows the time or availability', async () => {
		await page.viewport(1280, 800);
		render(SiteHeader);
		const text = header().textContent ?? '';
		expect(text).not.toMatch(/Accra|Booking|GMT|\d{1,2}:\d{2}/);
	});
});
