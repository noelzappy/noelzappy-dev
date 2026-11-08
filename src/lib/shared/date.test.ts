import { describe, expect, it } from 'vitest';
import { formatDate } from './date';

describe('formatDate', () => {
	it('formats short by default, in UTC', () => {
		expect(formatDate('2026-03-05')).toBe('5 Mar 2026');
	});
	it('formats long', () => {
		expect(formatDate('2026-03-05', 'long')).toBe('5 March 2026');
	});
	it('does not shift across the UTC day boundary', () => {
		expect(formatDate('2026-01-01')).toBe('1 Jan 2026');
		expect(formatDate('2025-12-31', 'long')).toBe('31 December 2025');
	});
});
