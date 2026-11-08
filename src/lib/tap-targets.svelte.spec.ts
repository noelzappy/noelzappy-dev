/**
 * Mobile tap-target gate (Task 7). At a 375px viewport, every visible interactive element
 * (a, button, input, textarea, select, [role=button]) must have a box of at least 44x44 CSS px.
 *
 * Exemption: inline links inside running prose (a paragraph or list item that has other text
 * around the link). This is the WCAG 2.5.8 "inline" exception: the target size of a link in a
 * sentence is constrained by the line height of the surrounding text, so it is not measured.
 * A link that is the only content of its block (a standalone link row, a button-like pill) is
 * NOT inline and is measured.
 */
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import { tick } from 'svelte';
import '../routes/layout.css';

const nav = vi.hoisted(() => ({ path: '/' }));
vi.mock('$app/navigation', () => ({
	afterNavigate: () => {},
	goto: () => Promise.resolve(),
	beforeNavigate: () => {},
	onNavigate: () => {}
}));
vi.mock('$app/state', () => ({
	page: {
		get url() {
			return new URL(`http://localhost${nav.path}`);
		}
	}
}));

import SiteHeader from '$lib/components/site-header.svelte';
import Footer from '$lib/components/footer.svelte';
import HomePage from '../routes/(studio)/+page.svelte';
import ProjectsPage from '../routes/(studio)/projects/+page.svelte';
import CaseStudyPage from '../routes/(studio)/projects/[slug]/+page.svelte';
import WorkWithMePage from '../routes/(studio)/work-with-me/+page.svelte';
import AboutPage from '../routes/(studio)/about/+page.svelte';
import ContactPage from '../routes/(studio)/contact/+page.svelte';
import WritingPage from '../routes/(studio)/writing/+page.svelte';
import PostPage from '../routes/(studio)/writing/[slug]/+page.svelte';
import { load as loadPost } from '../routes/(studio)/writing/[slug]/+page';
import { getAllProjects, getPillProjects, getStripScreens } from '$lib/data/projects-loader';
import { getShowcase } from '$lib/data/showcase';
import { toWorkItem } from '$lib/content/projects-view';
import { toPostItem } from '$lib/content/posts-view';
import { getPosts, getTags } from '$lib/content/writing';

const MIN = 44;
const SELECTOR = 'a, button, input, textarea, select, [role="button"]';

function isHidden(el: HTMLElement): boolean {
	if (el instanceof HTMLInputElement && el.type === 'hidden') return true;
	const cs = getComputedStyle(el);
	if (cs.display === 'none' || cs.visibility === 'hidden') return true;
	if (el.closest('[hidden], [inert], [aria-hidden="true"]')) return true;
	const r = el.getBoundingClientRect();
	// Visually hidden helpers (skip link, sr-only, honeypot) have no real box.
	return r.width <= 1 || r.height <= 1;
}

/** WCAG 2.5.8 inline exception: a link with surrounding text in the same block. */
function isInlineProseLink(el: HTMLElement): boolean {
	if (!(el instanceof HTMLAnchorElement)) return false;
	const block = el.closest('p, li, dd, blockquote');
	if (!block) return false;
	const around = (block.textContent ?? '').replace(el.textContent ?? '', '').trim();
	return around.length > 0 && getComputedStyle(el).display === 'inline';
}

function undersized(root: ParentNode): string[] {
	return [...root.querySelectorAll<HTMLElement>(SELECTOR)]
		.filter((el) => !isHidden(el) && !isInlineProseLink(el))
		.map((el) => ({ el, r: el.getBoundingClientRect() }))
		.filter(({ r }) => r.width < MIN - 0.5 || r.height < MIN - 0.5)
		.map(({ el, r }) => {
			const label = (el.getAttribute('aria-label') ?? el.textContent ?? '').trim().slice(0, 40);
			return `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)} "${label}" ${Math.round(r.width)}x${Math.round(r.height)}`;
		});
}

const projects = getAllProjects();
const caseStudy = projects.find((p) => p.slug === 'kekeh-mac')!;
const nextStudy = projects.find((p) => p.kind === 'case-study' && p.slug !== caseStudy.slug)!;
const pills = getPillProjects();
const posts = getPosts();
const emptyLayoutData = { pills: [], posts: [], writeups: [] };

const pages: Record<string, () => unknown> = {
	home: () =>
		render(HomePage, {
			data: {
				...emptyLayoutData,
				pills,
				screens: getStripScreens(projects).map((s) => ({ ...s, ratio: undefined }))
			} as never
		}),
	projects: () =>
		render(ProjectsPage, {
			data: {
				...emptyLayoutData,
				caseStudies: projects.filter((p) => p.kind === 'case-study').map(toWorkItem),
				openSource: projects.filter((p) => p.kind === 'open-source').map(toWorkItem)
			} as never
		}),
	'case study': () =>
		render(CaseStudyPage, {
			data: {
				...emptyLayoutData,
				slug: caseStudy.slug,
				title: caseStudy.title,
				excerpt: caseStudy.excerpt,
				html: caseStudy.html,
				publishedAt: caseStudy.publishedAt,
				role: caseStudy.role ?? '',
				client: caseStudy.client ?? '',
				status: caseStudy.status ?? '',
				// Fill every optional link so the whole link row is measured, not just what this
				// project happens to have.
				liveUrl: 'https://example.com',
				github: 'https://github.com/noelzappy/example',
				iosUrl: 'https://apps.apple.com/app/example',
				androidUrl: 'https://play.google.com/store/apps/details?id=example',
				stack: caseStudy.stack ?? caseStudy.featuredStack ?? [],
				featuredImage: caseStudy.featuredImage ?? '',
				gallery: caseStudy.gallery ?? [],
				problem: caseStudy.problem ?? '',
				lessons: caseStudy.lessons ?? '',
				engagement: caseStudy.engagement ?? '',
				stage: caseStudy.stage ?? '',
				built: caseStudy.built ?? [],
				brandColor: caseStudy.brandColor ?? '',
				onBrand: caseStudy.onBrand ?? '',
				deviceShots: caseStudy.deviceShots ?? [],
				showcase: getShowcase(caseStudy),
				impact: caseStudy.impact ?? [],
				next: {
					slug: nextStudy.slug,
					title: nextStudy.title,
					brandColor: nextStudy.brandColor ?? '',
					onBrand: nextStudy.onBrand,
					showcase: getShowcase(nextStudy)
				}
			} as never
		}),
	'work with me': () => render(WorkWithMePage),
	about: () => render(AboutPage),
	contact: () => render(ContactPage),
	writing: () =>
		render(WritingPage, {
			data: { ...emptyLayoutData, posts: posts.map(toPostItem), tags: getTags() } as never
		}),
	'writing post': async () => {
		const data = await loadPost({ params: { slug: posts[0].slug } } as never);
		return render(PostPage, { data: { ...emptyLayoutData, ...(data as object) } as never });
	}
};

describe('tap targets at 375px', () => {
	beforeAll(async () => {
		await page.viewport(375, 812);
	});
	afterAll(async () => {
		await page.viewport(414, 896);
	});

	for (const [name, mount] of Object.entries(pages)) {
		it(`${name}: every visible interactive element is at least ${MIN}x${MIN}`, async () => {
			const { container } = (await mount()) as { container: HTMLElement };
			await tick();
			await new Promise((r) => setTimeout(r, 300));
			const interactive = container.querySelectorAll(SELECTOR).length;
			expect(interactive).toBeGreaterThan(0);
			expect(undersized(container)).toEqual([]);
		});
	}

	it('site header and footer: every visible interactive element is large enough', async () => {
		const header = render(SiteHeader, { pills: [], posts: [] });
		await tick();
		expect(undersized(header.container)).toEqual([]);
		header.unmount();
		const footer = render(Footer);
		await tick();
		expect(undersized(footer.container)).toEqual([]);
	});

	it('open menu overlay: every visible interactive element is large enough', async () => {
		const { container } = render(SiteHeader, {
			pills: pills.map(({ slug, title }) => ({ slug, title })),
			posts: posts.slice(0, 3).map(({ slug, title, date, tags, description }) => ({
				slug,
				title,
				date,
				tags,
				description
			}))
		});
		await page.getByRole('button', { name: /menu/i }).click();
		await new Promise((r) => setTimeout(r, 400));
		const overlay = document.querySelector('[role="dialog"]') ?? container;
		expect(overlay.querySelectorAll(SELECTOR).length).toBeGreaterThan(0);
		expect(undersized(document.body).filter((s) => !s.includes('skip'))).toEqual([]);
	});
});
