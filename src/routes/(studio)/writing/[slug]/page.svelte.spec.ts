import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import '../../../layout.css';
import Page from './+page.svelte';
import { load } from './+page';
import { getPosts } from '$lib/content/writing';

import type { PageData } from './$types';

const posts = getPosts();
const loadSlug = async (slug: string) =>
	({
		pills: [],
		posts: [],
		...((await load({ params: { slug } } as unknown as Parameters<typeof load>[0])) as object)
	}) as unknown as PageData;

describe('/writing/[slug]', () => {
	it('renders the title as the h1.page-title with a date and tag meta row', async () => {
		const data = await loadSlug(posts[0].slug);
		const { container } = render(Page, { data });
		const h1 = container.querySelector('h1')!;
		expect(h1.classList.contains('page-title')).toBe(true);
		expect(h1.textContent).toBe(posts[0].title);
		expect(container.querySelector('.meta time')!.getAttribute('datetime')).toBe(posts[0].date);
		for (const tag of posts[0].tags) {
			expect(container.querySelector(`.meta a[href="/writing/tag/${tag}"]`)).not.toBeNull();
		}
	});

	it('renders the post body in a reading-width prose column', async () => {
		const data = await loadSlug(posts[0].slug);
		const { container } = render(Page, { data });
		const prose = container.querySelector<HTMLElement>('.prose')!;
		expect(prose.textContent!.length).toBeGreaterThan(200);
		// max-width resolves from --measure (68ch); the test viewport itself may be narrower.
		const max = parseFloat(getComputedStyle(prose).maxWidth);
		expect(max).toBeGreaterThan(550);
		expect(max).toBeLessThan(900);
	});

	it('links to the older post as previous and newer post as next', async () => {
		expect(posts.length).toBeGreaterThan(2);
		const data = await loadSlug(posts[1].slug);
		const { container } = render(Page, { data });
		expect(container.querySelector('a.prev')!.getAttribute('href')).toBe(
			`/writing/${posts[2].slug}`
		);
		expect(container.querySelector('a.next')!.getAttribute('href')).toBe(
			`/writing/${posts[0].slug}`
		);
	});

	it('omits next on the newest post and previous on the oldest', async () => {
		const newest = render(Page, { data: await loadSlug(posts[0].slug) });
		expect(newest.container.querySelector('a.next')).toBeNull();
		expect(newest.container.querySelector('a.prev')).not.toBeNull();
		newest.unmount();
		const oldest = render(Page, { data: await loadSlug(posts[posts.length - 1].slug) });
		expect(oldest.container.querySelector('a.prev')).toBeNull();
	});

	it('emits BlogPosting structured data', async () => {
		const data = await loadSlug(posts[0].slug);
		render(Page, { data });
		const ld = [...document.head.querySelectorAll('script[type="application/ld+json"]')]
			.map((s) => JSON.parse(s.textContent!))
			.find((d) => d['@type'] === 'BlogPosting');
		expect(ld.headline).toBe(posts[0].title);
		expect(ld.url).toBe(`https://noelzappy.dev/writing/${posts[0].slug}`);
	});

	it('puts the prose in the second column of the site grid, not flush left', async () => {
		const data = await loadSlug(posts[0].slug);
		const { container } = render(Page, { data });
		const prose = container.querySelector<HTMLElement>('.prose')!;
		const meta = container.querySelector<HTMLElement>('.meta')!;
		const wide = window.innerWidth >= 768;
		if (wide) {
			expect(prose.getBoundingClientRect().left).toBeGreaterThan(
				meta.getBoundingClientRect().right
			);
		}
		expect(container.querySelectorAll('time')).toHaveLength(1);
		expect(container.querySelectorAll('.sec')).toHaveLength(2);
	});

	it('aligns the prev/next nav with the prose column', async () => {
		await page.viewport(1000, 700);
		const data = await loadSlug(posts[1].slug);
		const { container } = render(Page, { data });
		const nav = container.querySelector('.adjacent')!;
		expect(nav.getBoundingClientRect().left).toBe(
			container.querySelector('.prose')!.getBoundingClientRect().left
		);
	});
});
