import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { createRawSnippet } from 'svelte';
import { page } from 'vitest/browser';
import '../../routes/layout.css';
import Section from './section.svelte';

const children = createRawSnippet(() => ({ render: () => '<p>content</p>' }));
const aside = createRawSnippet(() => ({ render: () => '<p>meta</p>' }));

const left = (el: Element) => el.getBoundingClientRect().left;

describe('Section', () => {
	it('puts a label-less section body in the same column as a labelled one', async () => {
		await page.viewport(1000, 700);
		const a = render(Section, { label: 'Label', children });
		const labelled = left(a.container.querySelector('.body')!);
		a.unmount();
		const b = render(Section, { children });
		const bare = left(b.container.querySelector('.body')!);
		b.unmount();
		const c = render(Section, { aside, children });
		const withAside = left(c.container.querySelector('.body')!);
		expect(bare).toBe(labelled);
		expect(withAside).toBe(labelled);
		expect(labelled).toBeGreaterThan(200);
	});

	it('is a single column on mobile', async () => {
		await page.viewport(375, 700);
		const { container } = render(Section, { children });
		const sec = container.querySelector('.inner')!;
		expect(left(container.querySelector('.body')!)).toBe(left(sec));
	});
});
