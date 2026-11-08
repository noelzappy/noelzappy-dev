/** Formats a `YYYY-MM-DD` content date. Always UTC so the displayed day never shifts by timezone. */
export function formatDate(iso: string, style: 'short' | 'long' = 'short'): string {
	return new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB', {
		day: 'numeric',
		month: style === 'long' ? 'long' : 'short',
		year: 'numeric',
		timeZone: 'UTC'
	});
}
