import { describe, expect, it } from 'vitest';
import { showcaseName } from './shared';

describe('showcaseName', () => {
	it('prefixes the slug', () => {
		expect(showcaseName('kekeh-mac')).toBe('project-kekeh-mac');
	});

	it('always yields a CSS-ident-safe name', () => {
		for (const slug of ['a b', 'x.y', 'é/ü', '9lives', 'a"b', '']) {
			expect(showcaseName(slug)).toMatch(/^project-[A-Za-z0-9_-]*$/);
		}
	});

	it('escapes injectively', () => {
		expect(showcaseName('a b')).not.toBe(showcaseName('a_b'));
		expect(showcaseName('a.b')).not.toBe(showcaseName('a-b'));
	});
});
