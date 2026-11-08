/** Thin process helpers shared by the capture scripts. Not unit-tested (they shell out). */
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { cwebpArgs, hasMetadata, webpSize } from './lib';

export function run(cmd: string, args: string[]): string {
	return execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

export function makeTempDir(): string {
	return mkdtempSync(join(tmpdir(), 'capture-'));
}

export function removeDir(dir: string): void {
	rmSync(dir, { recursive: true, force: true });
}

/** PNG (or any cwebp input) to WebP at q90; returns the resulting pixel size. Strips metadata. */
export function toWebp(
	input: string,
	output: string,
	maxWidth?: number
): { width: number; height: number } {
	mkdirSync(dirname(output), { recursive: true });
	run('cwebp', cwebpArgs(input, output, maxWidth));
	const bytes = readFileSync(output);
	if (hasMetadata(bytes)) throw new Error(`${output} still carries EXIF/XMP metadata`);
	const size = webpSize(bytes);
	if (!size) throw new Error(`${output} is not a readable WebP`);
	return size;
}

/** Fails early with a clear message when a required CLI is missing. */
export function requireTool(cmd: string, hint: string): void {
	try {
		execFileSync('which', [cmd], { stdio: 'ignore' });
	} catch {
		throw new Error(`${cmd} not found. ${hint}`);
	}
}

export function fail(error: unknown): never {
	console.error(`\nError: ${error instanceof Error ? error.message : String(error)}`);
	process.exit(1);
}
