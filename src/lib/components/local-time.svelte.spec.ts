import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import LocalTime from './local-time.svelte';

describe('local-time.svelte', () => {
	it('renders a <time> element with a formatted time after mount', async () => {
		const { container } = render(LocalTime);
		await expect
			.poll(() => container.querySelector('time')?.textContent?.trim())
			.toMatch(/^\d{1,2}:\d{2} (AM|PM)$/);
		expect(container.textContent).toContain('Accra');
	});

	it('keeps the same <time> width before and after the time fills', async () => {
		const { container } = render(LocalTime);
		const el = container.querySelector('time') as HTMLElement;
		const before = el.getBoundingClientRect().width;
		await expect.poll(() => el.textContent?.trim()).toMatch(/^\d{1,2}:\d{2} (AM|PM)$/);
		expect(el.getBoundingClientRect().width).toBe(before);
		el.textContent = '';
		expect(el.getBoundingClientRect().width).toBe(before);
		el.textContent = '12:05 AM';
		expect(el.getBoundingClientRect().width).toBe(before);
	});
});
