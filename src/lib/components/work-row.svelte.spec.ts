import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import '../../routes/layout.css';
import WorkRow from './work-row.svelte';

const base = {
	slug: 'kekeh-mac',
	title: 'Kekeh Mac',
	oneLine: 'Rides and deliveries for Freetown.',
	built: ['Driver app', 'API'],
	hasWriteup: true
};

describe('work-row.svelte', () => {
	it('renders the first device shot with its alt text', async () => {
		render(WorkRow, {
			project: {
				...base,
				brandColor: '#34b764',
				deviceShots: [
					{ src: '/favicon.png', alt: 'Passenger app tracking a driver', kind: 'phone' },
					{ src: '/favicon.png', alt: 'Second shot', kind: 'phone' }
				]
			}
		});
		await expect
			.element(page.getByRole('img', { name: 'Passenger app tracking a driver' }))
			.toBeInTheDocument();
		expect(page.getByRole('img', { name: 'Second shot' }).query()).toBeNull();
	});

	it('falls back to the featured image in a browser frame', async () => {
		render(WorkRow, { project: { ...base, featuredImage: '/favicon.png' } });
		await expect.element(page.getByRole('img', { name: 'Kekeh Mac' })).toBeInTheDocument();
	});

	it('shows an initial swatch and no img when there is no imagery', async () => {
		const { container } = render(WorkRow, { project: base });
		expect(container.querySelector('img')).toBeNull();
		await expect.element(page.getByText('K', { exact: true })).toBeInTheDocument();
	});

	it('links to the case study when there is a writeup', async () => {
		render(WorkRow, { project: base });
		await expect
			.element(page.getByRole('link', { name: /View case study/ }))
			.toHaveAttribute('href', '/projects/kekeh-mac');
		await expect.element(page.getByText('Driver app · API')).toBeInTheDocument();
	});

	it('without a writeup shows the live link instead of a case study link', async () => {
		render(WorkRow, {
			project: { ...base, hasWriteup: false, liveUrl: 'https://example.com' }
		});
		expect(page.getByRole('link', { name: /View case study/ }).query()).toBeNull();
		await expect
			.element(page.getByRole('link', { name: /Visit live site/ }))
			.toHaveAttribute('href', 'https://example.com');
	});

	it('without a writeup or live url falls back to the repo link', async () => {
		render(WorkRow, {
			project: { ...base, hasWriteup: false, github: 'https://github.com/noelzappy/x' }
		});
		await expect
			.element(page.getByRole('link', { name: /View repository/ }))
			.toHaveAttribute('href', 'https://github.com/noelzappy/x');
	});
});
