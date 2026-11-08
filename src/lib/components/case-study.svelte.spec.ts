import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import '../../routes/layout.css';
import CaseStudy from './case-study.svelte';
import { showcaseName } from '$lib/motion/shared';

const base = {
	title: 'Kekeh Mac',
	slug: 'kekeh-mac',
	html: '<h2>The problem</h2><p>Rides in Freetown.</p>',
	engagement: 'full-build' as const,
	stage: 'startup' as const,
	built: ['Driver app', 'API'],
	status: 'Pilot',
	brandColor: '#34b764',
	onBrand: 'dark' as const,
	deviceShots: [
		{
			src: '/portfolio/kekeh-mac/passenger-03-home.webp',
			alt: 'Passenger tracking',
			kind: 'phone' as const
		},
		{
			src: '/portfolio/kekeh-mac/driver-05-heading-to-pickup.webp',
			alt: 'Driver heading to pickup',
			kind: 'phone' as const
		}
	],
	impact: [] as { value: string; label: string }[],
	stack: ['Flutter'],
	liveUrl: '',
	github: '',
	iosUrl: '',
	androidUrl: '',
	next: { slug: 'susupaa-platform', title: 'SusuPaa Platform' }
};

describe('CaseStudy', () => {
	it('renders title, meta row and next link without an Impact row', async () => {
		render(CaseStudy, base);
		await expect
			.element(page.getByRole('heading', { level: 1, name: 'Kekeh Mac' }))
			.toBeInTheDocument();
		await expect.element(page.getByText('Full build')).toBeInTheDocument();
		await expect.element(page.getByText('Startup', { exact: true })).toBeInTheDocument();
		await expect.element(page.getByText('Driver app · API')).toBeInTheDocument();
		await expect.element(page.getByText('Impact')).not.toBeInTheDocument();
		await expect
			.element(page.getByRole('link', { name: 'SusuPaa Platform' }))
			.toHaveAttribute('href', '/projects/susupaa-platform');
	});

	it('shows the Impact row when impact is present', async () => {
		render(CaseStudy, { ...base, impact: [{ value: '12k', label: 'trips' }] });
		await expect.element(page.getByText('Impact')).toBeInTheDocument();
		await expect.element(page.getByText('12k')).toBeInTheDocument();
	});

	it('omits absent links', async () => {
		render(CaseStudy, { ...base, liveUrl: 'https://x.test' });
		await expect.element(page.getByRole('link', { name: 'App Store' })).not.toBeInTheDocument();
		await expect.element(page.getByRole('link', { name: 'Live site' })).toBeInTheDocument();
	});

	it('without usable screens shows the brand field and an initial, no composed art', async () => {
		const { container } = render(CaseStudy, {
			...base,
			deviceShots: [],
			showcase: { layout: 'web' as const }
		});
		expect(container.querySelector('.hero img')).toBeNull();
		expect(container.querySelector('.hero.plain')).not.toBeNull();
	});

	it('sizes the showcase field from its composition, with little empty colour', async () => {
		await page.viewport(1440, 900);
		const { container } = render(CaseStudy, base);
		const field = container.querySelector('.showcase') as HTMLElement;
		const imgs = [...field.querySelectorAll('img')];
		await Promise.all(
			imgs.map((i) => (i.complete ? 0 : new Promise((r) => i.addEventListener('load', r))))
		);
		await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
		const f = field.getBoundingClientRect();
		const top = Math.min(...imgs.map((i) => i.getBoundingClientRect().top)) - f.top;
		const bottom = f.bottom - Math.max(...imgs.map((i) => i.getBoundingClientRect().bottom));
		expect(Math.max(top, bottom)).toBeLessThanOrEqual(window.innerHeight * 0.08);
	});

	it('puts the narrative on the Section grid, level with the other sections at 768px and up', async () => {
		await page.viewport(1440, 900);
		const { container } = render(CaseStudy, {
			...base,
			impact: [{ value: '12k', label: 'trips' }]
		});
		const prose = container.querySelector('.prose') as HTMLElement;
		const bodies = [...container.querySelectorAll('.sec .body')] as HTMLElement[];
		expect(bodies.length).toBeGreaterThan(1);
		const left = prose.getBoundingClientRect().left;
		for (const body of bodies) expect(body.getBoundingClientRect().left).toBeCloseTo(left, 0);
		// And it is not the title's left edge: column 2, not the page edge.
		const title = container.querySelector('h1') as HTMLElement;
		expect(left).toBeGreaterThan(title.getBoundingClientRect().left + 100);
	});

	it('keeps the showcase inside its hero field', async () => {
		await page.viewport(1440, 900);
		const { container } = render(CaseStudy, base);
		const field = container.querySelector('.hero') as HTMLElement;
		const showcase = container.querySelector('.showcase') as HTMLElement;
		const f = field.getBoundingClientRect();
		for (const img of showcase.querySelectorAll('img')) {
			const r = img.getBoundingClientRect();
			expect(r.left).toBeGreaterThanOrEqual(f.left);
			expect(r.right).toBeLessThanOrEqual(f.right);
			expect(r.top).toBeGreaterThanOrEqual(f.top);
			expect(r.bottom).toBeLessThanOrEqual(f.bottom);
		}
	});

	it('keeps the morph name on the showcase', () => {
		const { container } = render(CaseStudy, base);
		expect(container.querySelector('.showcase')?.getAttribute('data-showcase-name')).toBe(
			showcaseName('kekeh-mac')
		);
	});

	it('at 375px shows two legible phones, whole, in the case top', async () => {
		await page.viewport(375, 812);
		const { container } = render(CaseStudy, {
			...base,
			deviceShots: [
				...base.deviceShots,
				{ src: '/portfolio/kekeh-mac/driver-11-wallet.webp', alt: 'Wallet', kind: 'phone' as const }
			]
		});
		const field = container.querySelector('.showcase') as HTMLElement;
		await expect.poll(() => field.querySelectorAll('img').length).toBe(2);
		const f = field.getBoundingClientRect();
		for (const img of field.querySelectorAll('img')) {
			const r = img.getBoundingClientRect();
			expect(r.width).toBeGreaterThanOrEqual(140);
			expect(r.left).toBeGreaterThanOrEqual(f.left);
			expect(r.right).toBeLessThanOrEqual(f.right);
			expect(r.bottom).toBeLessThanOrEqual(f.bottom);
		}
	});

	it('at 375px a prose shots-row keeps each phone at least 140px wide', async () => {
		await page.viewport(375, 812);
		const { container } = render(CaseStudy, {
			...base,
			html:
				'<div class="shots-row">' +
				['driver-03-home-online', 'driver-11-wallet', 'passenger-12-trip-complete']
					.map(
						(n) => `<img src="/portfolio/kekeh-mac/${n}.webp" alt="${n}" width="496" height="1080">`
					)
					.join('') +
				'</div>'
		});
		const imgs = [...container.querySelectorAll('.shots-row img')] as HTMLImageElement[];
		expect(imgs).toHaveLength(3);
		for (const img of imgs) expect(img.getBoundingClientRect().width).toBeGreaterThanOrEqual(140);
		const row = container.querySelector('.shots-row') as HTMLElement;
		const rr = row.getBoundingClientRect();
		for (const img of imgs.slice(0, 2)) {
			const r = img.getBoundingClientRect();
			expect(r.left).toBeGreaterThanOrEqual(rr.left - 1);
			expect(r.right).toBeLessThanOrEqual(rr.right + 1);
		}
	});
});
