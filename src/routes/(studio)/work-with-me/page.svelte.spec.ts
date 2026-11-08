import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import '../../layout.css';
import Page from './+page.svelte';
import { getAllProjects } from '$lib/data/projects-loader';

const OFFER_TITLES = [
	'Build the whole product',
	'Lead or join your team',
	'Fix, rescue or migrate',
	'Websites with a real admin'
];

describe('/work-with-me', () => {
	it('renders the h1', async () => {
		render(Page);
		await expect
			.element(page.getByRole('heading', { level: 1, name: 'Work with me' }))
			.toBeInTheDocument();
	});

	it('introduces me as a product engineer, not a backend engineer', async () => {
		const { container } = render(Page);
		const intro = container.querySelector('.intro')!.textContent!;
		expect(intro).not.toContain('backend engineer');
		expect(intro).toContain('software products end to end');
	});

	it('lists the four offers in order', async () => {
		const { container } = render(Page);
		const titles = [...container.querySelectorAll('.offer h3')].map((h) => h.textContent?.trim());
		expect(titles).toEqual(OFFER_TITLES);
	});

	it('points every internal proof link at a project with a writeup', async () => {
		const { container } = render(Page);
		const links = [
			...container.querySelectorAll<HTMLAnchorElement>('.offer a[href^="/projects/"]')
		];
		expect(links.length).toBeGreaterThan(0);
		const withWriteup = new Set(
			getAllProjects()
				.filter((p) => p.html.trim().length > 0)
				.map((p) => p.slug)
		);
		for (const a of links) {
			expect(withWriteup.has(a.getAttribute('href')!.replace('/projects/', ''))).toBe(true);
		}
	});

	it('proves "Build the whole product" with full-build writeups only', async () => {
		const { container } = render(Page);
		const offer = container.querySelectorAll('.offer')[0];
		const hrefs = [...offer.querySelectorAll<HTMLAnchorElement>('a')].map((a) =>
			a.getAttribute('href')
		);
		expect(hrefs).toEqual([
			'/projects/kekeh-mac',
			'/projects/givio-platform',
			'/projects/growinggift-platform'
		]);
		const all = getAllProjects();
		for (const h of hrefs) {
			const project = all.find((p) => p.slug === h!.replace('/projects/', ''));
			expect(project?.engagement).toBe('full-build');
			expect(project?.html.trim().length).toBeGreaterThan(0);
		}
	});

	it('links Voltax to its live site, since it has no writeup', async () => {
		render(Page);
		const voltax = getAllProjects().find((p) => p.slug === 'voltax');
		expect(voltax?.html.trim()).toBe('');
		await expect
			.element(page.getByRole('link', { name: /Voltax/ }))
			.toHaveAttribute('href', voltax!.liveUrl!);
	});

	it('names the five principles', async () => {
		const { container } = render(Page);
		const titles = [...container.querySelectorAll('.principle h3')].map((h) =>
			h.textContent?.trim()
		);
		expect(titles).toEqual([
			'One person, the whole product.',
			'Money-grade by default.',
			'Shipped, not slideware.',
			'Plain updates, every week.',
			'You own everything I build.'
		]);
	});

	it('has the #call section with the booking button and email', async () => {
		const { container } = render(Page);
		const call = container.querySelector('#call');
		expect(call).not.toBeNull();
		expect(call!.querySelector('[data-cal-link]')).not.toBeNull();
		expect(call!.querySelector('a[href="mailto:emmanuel@noelzappy.com"]')).not.toBeNull();
	});

	it('puts the inquiry form under the booking button in #call', async () => {
		const { container } = render(Page);
		const call = container.querySelector('#call')!;
		expect(call.textContent).toContain('Prefer to write it down?');
		const button = call.querySelector('[data-cal-link]')!;
		const form = call.querySelector('form')!;
		expect(button.compareDocumentPosition(form) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
	});
});
