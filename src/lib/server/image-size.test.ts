import { describe, expect, it } from 'vitest';
import { staticImageRatio, webpSize, withShotRatios } from './image-size';

describe('image-size', () => {
	it('reads the real dimensions of a lossy webp', () => {
		expect(staticImageRatio('/portfolio/rbl-messages.webp')).toBeCloseTo(589 / 269, 3);
	});
	it('returns undefined for missing or non-webp files', () => {
		expect(staticImageRatio('/portfolio/does-not-exist.webp')).toBeUndefined();
		expect(webpSize(new Uint8Array(40))).toBeNull();
	});
});

describe('withShotRatios', () => {
	it('attaches each shot its real ratio and leaves unmeasurable shots without one', () => {
		const out = withShotRatios({
			layout: 'web-phones',
			web: { src: '/portfolio/susupaa-dashboard.webp', alt: 'w' },
			phones: [
				{ src: '/portfolio/rbl-messages.webp', alt: 'p' },
				{ src: '/portfolio/lovenest/chat.jpg', alt: 'j' }
			]
		});
		expect(out?.web?.ratio).toBeGreaterThan(0);
		expect(out?.phones?.[0].ratio).toBeCloseTo(589 / 269, 3);
		expect(out?.phones?.[1].ratio).toBeUndefined();
	});
	it('is undefined for no showcase', () => {
		expect(withShotRatios(null)).toBeUndefined();
	});
});
