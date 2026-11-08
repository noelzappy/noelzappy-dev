import { describe, expect, it } from 'vitest';
import { GET } from './+server';

describe('sitemap.xml', () => {
	it('lists every top-level page including /contact', async () => {
		const xml = await (await GET({} as never)).text();
		for (const path of ['/', '/work-with-me', '/writing', '/projects', '/about', '/contact']) {
			expect(xml).toContain(`<loc>https://noelzappy.dev${path}</loc>`);
		}
	});
});
