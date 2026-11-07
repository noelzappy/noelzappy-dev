import { describe, expect, it } from 'vitest';
import { formatLocalTime } from './time';

describe('formatLocalTime', () => {
	it('formats afternoon time in Accra', () => {
		expect(formatLocalTime(new Date('2026-11-07T16:54:00Z'), 'Africa/Accra')).toBe('4:54 PM');
	});

	it('formats just after midnight', () => {
		expect(formatLocalTime(new Date('2026-11-07T00:05:00Z'), 'Africa/Accra')).toBe('12:05 AM');
	});
});
