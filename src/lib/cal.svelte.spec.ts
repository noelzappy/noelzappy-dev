import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import '../routes/layout.css';
import CalButton from './components/CalButton.svelte';
import Footer from './components/footer.svelte';
import { openCal, resetCalEmbedFailure } from './cal.js';

type CalMock = ReturnType<typeof vi.fn> & { loaded?: boolean };

function mockCal(): CalMock {
	const cal: CalMock = vi.fn();
	cal.loaded = true;
	window.Cal = cal as never;
	return cal;
}

/** Dispatches a cancelable click (never follows the link) and returns it to read defaultPrevented. */
function click(el: Element): MouseEvent {
	const event = new MouseEvent('click', { bubbles: true, cancelable: true });
	el.dispatchEvent(event);
	return event;
}

describe('cal booking', () => {
	let cal: CalMock;
	beforeEach(() => {
		cal = mockCal();
		resetCalEmbedFailure();
	});
	afterEach(() => {
		delete window.Cal;
	});

	it('CalButton is a link to cal.com that opens the Cal modal on click', async () => {
		render(CalButton, { eventSlug: '15min', label: 'Book a 15-minute call' });
		const link = page.getByRole('link', { name: 'Book a 15-minute call' });
		await expect.element(link).toHaveAttribute('href', 'https://cal.com/noelzappy/15min');
		await expect.element(link).toHaveAttribute('target', '_blank');
		await expect.element(link).toHaveAttribute('rel', 'noopener noreferrer');
		expect(click(link.element()).defaultPrevented).toBe(true);
		expect(cal).toHaveBeenCalledTimes(1);
		expect(cal).toHaveBeenCalledWith('modal', {
			calLink: 'noelzappy/15min',
			config: { layout: 'month_view', theme: 'auto' }
		});
	});

	it('the footer booking control is the same CalButton link', async () => {
		render(Footer);
		const link = page.getByRole('link', { name: 'Book a 15-minute call' });
		await expect.element(link).toHaveAttribute('href', 'https://cal.com/noelzappy/15min');
		click(link.element());
		expect(cal).toHaveBeenCalledWith(
			'modal',
			expect.objectContaining({ calLink: 'noelzappy/15min' })
		);
	});
});

describe('cal embed loader (offline: the script element is captured, never fetched)', () => {
	let appended: HTMLScriptElement[];
	beforeEach(() => {
		delete window.Cal;
		resetCalEmbedFailure();
		appended = [];
		vi.spyOn(document.head, 'appendChild').mockImplementation(((node: Node) => {
			appended.push(node as HTMLScriptElement);
			return node;
		}) as never);
	});
	afterEach(() => {
		vi.restoreAllMocks();
		delete window.Cal;
		resetCalEmbedFailure();
	});

	it('queues a modal call made before the embed has loaded, and injects the script once', () => {
		expect(openCal('noelzappy/15min', { layout: 'month_view' })).toBe(true);
		expect(openCal('noelzappy/15min', { layout: 'month_view' })).toBe(true);
		expect(appended.map((s) => s.src)).toEqual(['https://app.cal.com/embed/embed.js']);
		expect(JSON.stringify(window.Cal!.q)).toContain('modal');
	});

	it('when embed.js fails to load, a click is not prevented so the link opens cal.com', async () => {
		render(CalButton, { eventSlug: '15min', label: 'Book a 15-minute call' });
		const el = page.getByRole('link', { name: 'Book a 15-minute call' }).element();
		expect(click(el).defaultPrevented).toBe(true);

		appended[0].dispatchEvent(new Event('error'));

		expect(click(el).defaultPrevented).toBe(false);
		expect(openCal('noelzappy/15min', {})).toBe(false);
	});
});
