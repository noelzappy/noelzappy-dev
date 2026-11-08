import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import '../routes/layout.css';
import CalButton from './components/CalButton.svelte';
import Footer from './components/footer.svelte';
import { loadCalEmbed, openCal } from './cal.js';

type CalMock = ReturnType<typeof vi.fn> & { loaded?: boolean };

function mockCal(): CalMock {
	const cal: CalMock = vi.fn();
	cal.loaded = true;
	window.Cal = cal as never;
	return cal;
}

describe('cal booking', () => {
	let cal: CalMock;
	beforeEach(() => {
		cal = mockCal();
	});
	afterEach(() => {
		delete window.Cal;
	});

	it('CalButton opens the Cal modal for its event on click', async () => {
		render(CalButton, { eventSlug: '15min', label: 'Book a 15-minute call' });
		await page.getByRole('button', { name: 'Book a 15-minute call' }).click();
		expect(cal).toHaveBeenCalledTimes(1);
		expect(cal).toHaveBeenCalledWith('modal', {
			calLink: 'noelzappy/15min',
			config: { layout: 'month_view', theme: 'auto' }
		});
	});

	it('the footer booking control is a button that opens the popup, not a link', async () => {
		render(Footer);
		expect(page.getByRole('link', { name: 'Book a 15-minute call' }).elements()).toHaveLength(0);
		await page.getByRole('button', { name: 'Book a 15-minute call' }).click();
		expect(cal).toHaveBeenCalledWith(
			'modal',
			expect.objectContaining({ calLink: 'noelzappy/15min' })
		);
	});

	it('openCal does not double-load the embed when it is already loaded', () => {
		const before = document.querySelectorAll('script[src*="embed.js"]').length;
		openCal('noelzappy/15min', {});
		loadCalEmbed();
		expect(document.querySelectorAll('script[src*="embed.js"]').length).toBe(before);
	});
});

describe('cal embed loader', () => {
	afterEach(() => {
		delete window.Cal;
		document.querySelectorAll('script[src*="embed.js"]').forEach((s) => s.remove());
	});

	it('queues a modal call made before the embed script has loaded, and injects it once', () => {
		delete window.Cal;
		openCal('noelzappy/15min', { layout: 'month_view' });
		openCal('noelzappy/15min', { layout: 'month_view' });
		expect(
			document.querySelectorAll('script[src="https://app.cal.com/embed/embed.js"]')
		).toHaveLength(1);
		const queued = (window.Cal!.q as unknown[][]).map((args) => (args as unknown[])[0] ?? args);
		expect(JSON.stringify(window.Cal!.q)).toContain('modal');
		expect(queued.length).toBeGreaterThan(1);
	});
});
