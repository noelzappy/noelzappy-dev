import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import '../../routes/layout.css';
import CaseStudy from './case-study.svelte';

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
	heroImage: '',
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

	it('uses the hero image when set and omits absent links', async () => {
		render(CaseStudy, {
			...base,
			heroImage: '/portfolio/fetch-agent/fetch-agent.webp',
			liveUrl: 'https://x.test'
		});
		await expect.element(page.getByRole('link', { name: 'App Store' })).not.toBeInTheDocument();
		await expect.element(page.getByRole('link', { name: 'Live site' })).toBeInTheDocument();
	});
});
