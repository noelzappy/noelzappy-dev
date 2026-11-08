import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/** Width and height of a WebP file from its header, or `null` for anything else or on any error. */
export function webpSize(bytes: Uint8Array): { width: number; height: number } | null {
	const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	const tag = (at: number) => String.fromCharCode(...bytes.subarray(at, at + 4));
	if (bytes.length < 30 || tag(0) !== 'RIFF' || tag(8) !== 'WEBP') return null;
	const chunk = tag(12);
	if (chunk === 'VP8 ')
		return { width: view.getUint16(26, true) & 0x3fff, height: view.getUint16(28, true) & 0x3fff };
	if (chunk === 'VP8L') {
		const bits = view.getUint32(21, true);
		return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
	}
	if (chunk === 'VP8X') {
		const u24 = (at: number) => bytes[at] | (bytes[at + 1] << 8) | (bytes[at + 2] << 16);
		return { width: u24(24) + 1, height: u24(27) + 1 };
	}
	return null;
}

/** height / width of a file under `static/` (a public path like `/portfolio/x.webp`), or undefined. */
export function staticImageRatio(src: string): number | undefined {
	try {
		const size = webpSize(readFileSync(join(process.cwd(), 'static', src)));
		return size && size.width ? size.height / size.width : undefined;
	} catch {
		return undefined;
	}
}
