import { describe, expect, it } from 'vitest';
import { staticImageRatio, webpSize } from './image-size';

describe('image-size', () => {
	it('reads the real dimensions of a lossy webp', () => {
		expect(staticImageRatio('/portfolio/rbl-messages.webp')).toBeCloseTo(589 / 269, 3);
	});
	it('returns undefined for missing or non-webp files', () => {
		expect(staticImageRatio('/portfolio/does-not-exist.webp')).toBeUndefined();
		expect(webpSize(new Uint8Array(40))).toBeNull();
	});
});
