import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const OLD = ['me', 'noelzappy.dev'].join('@');
const NEW = 'emmanuel@noelzappy.com';

function walk(dir: string): string[] {
	return readdirSync(dir).flatMap((name) => {
		const p = join(dir, name);
		return statSync(p).isDirectory() ? walk(p) : [p];
	});
}

/** The built output is not available while testing, so assert on everything that feeds it. */
describe('site email', () => {
	const files = [...walk('src'), join('static', 'llm-full.txt')].filter(
		(f) => !/\.(png|jpe?g|webp|woff2?|ico|svg)$/.test(f) || f.endsWith('.svg')
	);

	it('never mentions the retired address in src/ or static/llm-full.txt', () => {
		const offenders = files.filter((f) => readFileSync(f, 'utf8').includes(OLD));
		expect(offenders).toEqual([]);
	});

	it('uses the new address in the shared constants', () => {
		expect(readFileSync('src/lib/shared/constants.ts', 'utf8')).toContain(NEW);
	});
});
