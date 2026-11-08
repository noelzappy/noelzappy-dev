import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import subset from './font-subset.json';

/** Every non-ASCII character the site can render must exist in the subset Inter (scripts/subset-fonts.sh). */
const covered = new Set<number>(subset);

function files(dir: string): string[] {
	return readdirSync(dir).flatMap((name) => {
		const full = join(dir, name);
		if (statSync(full).isDirectory()) return files(full);
		return /\.(svelte|md|ts|js)$/.test(name) && !/\.(test|spec)\./.test(name) ? [full] : [];
	});
}

/** Source text without comments, which never render. */
function rendered(text: string): string {
	return text
		.replace(/<!--[\s\S]*?-->/g, '')
		.replace(/\/\*[\s\S]*?\*\//g, '')
		.replace(/^\s*\/\/.*$/gm, '');
}

describe('font subset', () => {
	it('contains the glyphs the design relies on', () => {
		for (const ch of '₵—·→★“”‘’…–') expect(covered.has(ch.codePointAt(0)!), ch).toBe(true);
	});

	it('covers every non-ASCII character used in src and src/content', () => {
		const missing = new Map<string, string>();
		for (const file of files('src')) {
			for (const ch of rendered(readFileSync(file, 'utf8'))) {
				const cp = ch.codePointAt(0)!;
				if (cp > 0x7e && !covered.has(cp) && !missing.has(ch)) missing.set(ch, file);
			}
		}
		expect(
			[...missing].map(([ch, f]) => `${ch} U+${ch.codePointAt(0)!.toString(16)} in ${f}`)
		).toEqual([]);
	});
});
