import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Copy rule: no em dashes, and no spaced en dashes used as punctuation.
 * En dashes between numbers (2021–2024) are fine. Code (fenced blocks, inline code,
 * <code>/<pre>) is exempt, as are HTML and JS comments, which never render.
 */
const DASH = /—|(?<=\s)–(?=\s)/;

function files(dir: string): string[] {
	return readdirSync(dir).flatMap((name) => {
		const full = join(dir, name);
		if (statSync(full).isDirectory()) return files(full);
		return /\.(svelte|md|ts|js|txt)$/.test(name) ? [full] : [];
	});
}

function prose(text: string): string {
	return text
		.replace(/^(```|~~~)[\s\S]*?^\1/gm, '')
		.replace(/<(pre|code)[\s\S]*?<\/\1>/g, '')
		.replace(/`[^`\n]*`/g, '')
		.replace(/<!--[\s\S]*?-->/g, '')
		.replace(/\/\*[\s\S]*?\*\//g, '')
		.replace(/^\s*\/\/.*$/gm, '');
}

const sources = [...files('src').filter((f) => !/\.(test|spec)\./.test(f)), 'static/llm-full.txt'];

describe('copy has no dashes used as punctuation', () => {
	it('scans a meaningful set of files', () => {
		expect(sources.length).toBeGreaterThan(50);
		expect(sources.some((f) => f.endsWith('llm-full.txt'))).toBe(true);
		expect(sources.some((f) => f.includes('src/content/writing/'))).toBe(true);
	});

	it.each(sources)('%s', (file) => {
		const offending = prose(readFileSync(file, 'utf8'))
			.split('\n')
			.filter((line) => DASH.test(line));
		expect(offending).toEqual([]);
	});
});
