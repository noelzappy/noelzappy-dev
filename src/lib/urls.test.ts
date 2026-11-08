import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getAllProjects } from '$lib/data/projects-loader';
import { getPost, getTags } from '$lib/content/writing';
import { resolveRedirect } from './redirects';
import legacy from './legacy-urls.json';

/**
 * Every URL that existed before the redesign must still resolve: to a page the current source
 * produces (static route, project with a write-up, post, tag), or to a permanent redirect that
 * itself lands on one. Computed from source and content, so no build is needed and it is not flaky.
 * `legacy-urls.json` was generated once from the pre-redesign commit (`legacy.baseline`).
 */

/** Static routes from src/routes: every +page.svelte / +server.ts without a [param], groups stripped. */
function staticRoutes(dir = 'src/routes', base = ''): string[] {
	const out: string[] = [];
	for (const name of readdirSync(dir)) {
		const full = join(dir, name);
		if (statSync(full).isDirectory()) {
			if (name.includes('[')) continue;
			const seg = /^\(.*\)$/.test(name) ? '' : `/${name}`;
			out.push(...staticRoutes(full, base + seg));
		} else if (name === '+page.svelte') {
			out.push(base || '/');
		} else if (name === '+server.ts' && base.includes('.')) {
			out.push(base);
		}
	}
	return out;
}

const STATIC = new Set(staticRoutes());
const PROJECTS = new Set(
	getAllProjects()
		.filter((p) => p.html.trim().length > 0)
		.map((p) => p.slug)
);
const TAGS = new Set(getTags().map((t) => t.tag));

function servedPage(path: string): boolean {
	if (STATIC.has(path)) return true;
	const project = path.match(/^\/projects\/([^/]+)$/);
	if (project) return PROJECTS.has(project[1]);
	const post = path.match(/^\/writing\/([^/]+)$/);
	if (post) return post[1] !== 'tag' && getPost(post[1]) !== undefined;
	const tag = path.match(/^\/writing\/tag\/([^/]+)$/);
	if (tag) return TAGS.has(tag[1]);
	return false;
}

/** A page, or a redirect whose target is a page. */
function resolves(path: string): boolean {
	if (servedPage(path)) return true;
	const target = resolveRedirect(path);
	return target !== null && servedPage(target);
}

const legacyPaths = [
	...legacy.routes,
	...legacy.projects.filter((p) => p.hasBody).map((p) => `/projects/${p.slug}`),
	// Only projects that had a page: a body-less project never had a /projects/<slug> URL to redirect to.
	...legacy.projects.filter((p) => p.hasBody).map((p) => `/work/${p.slug}`),
	...legacy.posts.map((s) => `/writing/${s}`),
	...legacy.posts.map((s) => `/notes/${s}`),
	...legacy.tags.map((t) => `/writing/tag/${t}`),
	...legacy.redirectSources.filter((s) => !s.includes('*'))
];

describe('pre-redesign URLs', () => {
	it('covers a meaningful number of URLs', () => {
		expect(legacyPaths.length).toBeGreaterThan(80);
	});

	it.each([...new Set(legacyPaths)])('%s resolves', (path) => {
		expect(resolves(path), path).toBe(true);
	});

	it('every legacy _redirects source is still in the current _redirects file', () => {
		const current = readFileSync('_redirects', 'utf8');
		for (const source of legacy.redirectSources) {
			expect(current, source).toMatch(new RegExp(`^${source.replace(/[*]/g, '\\*')}\\s`, 'm'));
		}
	});
});
