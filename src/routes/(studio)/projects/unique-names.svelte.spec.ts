import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import '../../layout.css';
import WorkRow from '$lib/components/work-row.svelte';
import { showcaseName } from '$lib/motion/shared';

const project = (slug: string, hasWriteup = true) => ({
	slug,
	title: slug,
	oneLine: 'x',
	brandColor: '#34b764',
	hasWriteup,
	deviceShots: [{ src: '/favicon.png', alt: slug, kind: 'phone' as const }]
});

describe('view-transition-name uniqueness on a list of work rows', () => {
	it('never yields two elements with the same name, and names only linked rows', () => {
		const slugs = ['a-one', 'b-two', 'c-three'];
		for (const s of slugs) render(WorkRow, { project: project(s) });
		render(WorkRow, { project: project('no-writeup', false) });

		const names = [...document.body.querySelectorAll('*')]
			.map((el) => getComputedStyle(el).viewTransitionName)
			.filter((n) => n && n !== 'none');
		expect(names.sort()).toEqual(slugs.map(showcaseName).sort());
		expect(new Set(names).size).toBe(names.length);
	});
});
