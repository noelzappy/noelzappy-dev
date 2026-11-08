import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import type { Showcase } from '$lib/data/projects';
import '../../routes/layout.css';
import ProjectShowcase from './project-showcase.svelte';

const web = { src: '/portfolio/susupaa-dashboard.webp', alt: 'SusuPaa dashboard' };
const phone1 = { src: '/portfolio/rbl-quick-match.webp', alt: 'RBL quick match' };
const phone2 = { src: '/portfolio/rbl-messages.webp', alt: 'RBL messages' };
const phone3 = { src: '/portfolio/built-wallet.webp', alt: 'Built wallet' };

const compositions: Record<string, Showcase> = {
	'web-phones': { layout: 'web-phones', web, phones: [phone1, phone2] },
	'web-phones (one phone)': { layout: 'web-phones', web, phones: [phone1] },
	phones: { layout: 'phones', phones: [phone1, phone2, phone3] },
	'phones (one)': { layout: 'phones', phones: [phone1] },
	web: { layout: 'web', web },
	// Aspect extremes: a 2.0 web screen, a 9:16 portrait "web" source, and a 2.28 phone.
	'wide web + tall phones': {
		layout: 'web-phones',
		web: { src: '/portfolio/fetch-agent/2.webp', alt: 'Wide web' },
		phones: [
			{ src: '/portfolio/lovenest/discover.jpg', alt: 'Tall phone' },
			{ src: '/portfolio/lovenest/chat.jpg', alt: 'Tall phone 2' }
		]
	},
	'portrait web source': {
		layout: 'web-phones',
		web: { src: '/portfolio/lovenest/3.jpg', alt: 'Portrait source' },
		phones: [phone1, phone2]
	},
	'3 tall phones': {
		layout: 'phones',
		phones: [
			{ src: '/portfolio/lovenest/discover.jpg', alt: 'Tall A' },
			{ src: '/portfolio/lovenest/welcome.jpg', alt: 'Tall B' },
			{ src: '/portfolio/lovenest/chat.jpg', alt: 'Tall C' }
		]
	}
};

const settle = () =>
	new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

async function loaded(container: Element) {
	await Promise.all(
		[...container.querySelectorAll('img')].map((img) =>
			img.complete ? Promise.resolve() : new Promise((resolve) => (img.onload = resolve))
		)
	);
}

describe('project-showcase.svelte', () => {
	it('renders one img per shot, each with its alt text', async () => {
		const { container } = render(ProjectShowcase, {
			showcase: compositions.phones,
			size: 'row'
		});
		const imgs = [...container.querySelectorAll('img')];
		expect(imgs.map((img) => img.alt)).toEqual(['RBL quick match', 'RBL messages', 'Built wallet']);
		expect(container.querySelectorAll('.phone')).toHaveLength(3);
	});

	it('web-phones renders the web screen plus two phones', async () => {
		const { container } = render(ProjectShowcase, {
			showcase: compositions['web-phones'],
			size: 'row'
		});
		expect(container.querySelectorAll('.web img')).toHaveLength(1);
		expect(container.querySelectorAll('.phone img')).toHaveLength(2);
	});

	it('draws no browser chrome', async () => {
		const { container } = render(ProjectShowcase, {
			showcase: compositions['web-phones'],
			size: 'case'
		});
		expect(container.querySelector('.browser-chrome, .chrome')).toBeNull();
	});

	it('paints the brand field and carries the view-transition name', async () => {
		const { container } = render(ProjectShowcase, {
			showcase: compositions.web,
			size: 'row',
			brandColor: '#ffb61e',
			name: 'project-susupaa'
		});
		const root = container.querySelector('.showcase') as HTMLElement;
		expect(getComputedStyle(root).backgroundColor).toBe('rgb(255, 182, 30)');
		expect(getComputedStyle(root).viewTransitionName).toBe('project-susupaa');
	});

	it('uses one shadow and one radius token on every screen', async () => {
		const { container } = render(ProjectShowcase, {
			showcase: compositions['web-phones'],
			size: 'row'
		});
		const root = document.documentElement;
		const shadow = getComputedStyle(root).getPropertyValue('--shadow-screen').trim();
		expect(shadow).not.toBe('');
		expect(getComputedStyle(root).getPropertyValue('--radius-screen').trim()).not.toBe('');
		const screens = [...container.querySelectorAll('.web, .phone')] as HTMLElement[];
		expect(screens).toHaveLength(3);
		const probe = document.createElement('div');
		probe.style.boxShadow = 'var(--shadow-screen)';
		document.body.append(probe);
		const expected = getComputedStyle(probe).boxShadow;
		probe.remove();
		for (const screen of screens) expect(getComputedStyle(screen).boxShadow).toBe(expected);
	});

	for (const size of ['row', 'case', 'hero'] as const) {
		for (const [label, showcase] of Object.entries(compositions)) {
			it(`never crops (${size}): ${label} stays inside its field at 320, 640 and 1200px`, async () => {
				const { container } = render(ProjectShowcase, { showcase, size });
				await loaded(container);
				const root = container.querySelector('.showcase') as HTMLElement;
				for (const width of [320, 640, 1200]) {
					container.style.width = `${width}px`;
					// A hero is given a box to fill; row and case size themselves.
					container.style.height = size === 'hero' ? `${width * 0.625}px` : '';
					await settle();
					const field = root.getBoundingClientRect();
					expect(field.width).toBeCloseTo(width, 0);
					const imgs = [...root.querySelectorAll('img')];
					expect(imgs.length).toBeGreaterThan(0);
					for (const img of imgs) {
						const r = img.getBoundingClientRect();
						expect(r.width).toBeGreaterThan(0);
						expect(r.left).toBeGreaterThanOrEqual(field.left - 1);
						expect(r.right).toBeLessThanOrEqual(field.right + 1);
						expect(r.top).toBeGreaterThanOrEqual(field.top - 1);
						expect(r.bottom).toBeLessThanOrEqual(field.bottom + 1);
					}
				}
			});
		}
	}

	it('draws nothing and reports the resolved layout for invalid data', async () => {
		const { container } = render(ProjectShowcase, { showcase: { layout: 'web' }, size: 'row' });
		expect(container.querySelectorAll('img')).toHaveLength(0);
		expect(container.querySelector('.showcase')?.getAttribute('data-layout')).toBe('none');
		const second = render(ProjectShowcase, {
			showcase: { layout: 'web-phones', phones: [phone1] },
			size: 'row'
		});
		expect(second.container.querySelector('.showcase')?.getAttribute('data-layout')).toBe('phones');
		expect(second.container.querySelectorAll('.phone img')).toHaveLength(1);
	});

	it('raises the middle phone of three above the outer two', async () => {
		const { container } = render(ProjectShowcase, { showcase: compositions.phones, size: 'case' });
		await loaded(container);
		await settle();
		const tops = [...container.querySelectorAll('.phone')].map(
			(p) => p.getBoundingClientRect().top
		);
		expect(tops[1]).toBeLessThan(tops[0]);
		expect(tops[0]).toBeCloseTo(tops[2], 0);
	});

	it('keeps phones at one width relative to the web screen and sharp (max 270px)', async () => {
		const { container } = render(ProjectShowcase, {
			showcase: compositions['web-phones'],
			size: 'case'
		});
		await loaded(container);
		container.style.width = '2400px';
		const webWidth = container.querySelector('.web')!.getBoundingClientRect().width;
		const phones = [...container.querySelectorAll('.phone')];
		expect(phones).toHaveLength(2);
		for (const phone of phones) {
			const w = phone.getBoundingClientRect().width;
			expect(w).toBeLessThanOrEqual(271);
			expect(w / webWidth).toBeGreaterThan(0.26);
			expect(w / webWidth).toBeLessThan(0.31);
		}
	});
});

describe('ProjectShowcase provided ratios', () => {
	it('lays a shot out at its provided ratio before the image has loaded', () => {
		const { container } = render(ProjectShowcase, {
			showcase: {
				layout: 'phones',
				phones: [{ src: '/portfolio/rbl-messages.webp?provided-ratio', alt: 'A', ratio: 1.5 }]
			},
			size: 'case'
		});
		const img = container.querySelector('img') as HTMLImageElement;
		expect(img.complete).toBe(false);
		expect(parseFloat(img.style.aspectRatio)).toBeCloseTo(1 / 1.5, 4);
	});
});
