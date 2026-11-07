import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import '../../routes/layout.css';
import WorkTile from './work-tile.svelte';

const base = {
	slug: 'kekeh-mac',
	title: 'Kekeh Mac',
	oneLine: 'Rides and deliveries for Freetown.',
	built: ['Driver app', 'API'],
	hasWriteup: true
};

describe('work-tile.svelte', () => {
	it('links the name to the case study and shows the one-liner and deliverables', async () => {
		render(WorkTile, { project: base });
		await expect
			.element(page.getByRole('link', { name: 'Kekeh Mac' }))
			.toHaveAttribute('href', '/projects/kekeh-mac');
		await expect.element(page.getByText('Rides and deliveries for Freetown.')).toBeVisible();
		await expect.element(page.getByText('Driver app · API')).toBeVisible();
	});

	it('shows the first device shot on the brand field', async () => {
		render(WorkTile, {
			project: {
				...base,
				brandColor: '#34b764',
				deviceShots: [
					{ src: '/favicon.png', alt: 'Passenger app tracking a driver', kind: 'phone' }
				]
			}
		});
		await expect
			.element(page.getByRole('img', { name: 'Passenger app tracking a driver' }))
			.toBeInTheDocument();
	});

	it('without a writeup, links out to the repository and shows a swatch', async () => {
		const { container } = render(WorkTile, {
			project: {
				slug: 'voltax',
				title: 'Voltax',
				oneLine: 'An open-source payment SDK.',
				hasWriteup: false,
				github: 'https://github.com/noelzappy/voltax'
			}
		});
		await expect
			.element(page.getByRole('link', { name: 'Voltax' }))
			.toHaveAttribute('href', 'https://github.com/noelzappy/voltax');
		expect(container.querySelector('img')).toBeNull();
	});
});
