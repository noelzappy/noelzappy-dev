import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import { createHighlighter } from 'shiki';

const highlighter = await createHighlighter({
	themes: ['github-light', 'github-dark'],
	langs: [
		'javascript',
		'typescript',
		'go',
		'sql',
		'bash',
		'json',
		'yaml',
		'html',
		'css',
		'svelte',
		'python',
		'php',
		'text'
	]
});

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [
		vitePreprocess(),
		mdsvex({
			extensions: ['.md'],
			highlight: {
				highlighter: (code, lang = 'text') => {
					const language = highlighter.getLoadedLanguages().includes(lang) ? lang : 'text';
					const html = highlighter.codeToHtml(code, {
						lang: language,
						themes: { light: 'github-light', dark: 'github-dark' },
						defaultColor: false
					});
					return `{@html ${JSON.stringify(html)}}`;
				}
			}
		})
	],
	kit: {
		adapter: adapter({
			// Cloudflare caps _routes.json at 100 rules of 100 characters. The default
			// lists every prerendered page and static file individually, which breaks
			// as soon as a post slug is long or the post count grows. Use globs instead:
			// everything below is served as a static asset; only unmatched paths reach
			// the worker (legacy redirects in hooks.server.ts and the error page).
			routes: {
				include: ['/*'],
				exclude: [
					'<build>',
					'/',
					'/__data.json',
					'/about',
					'/contact',
					'/writing',
					'/writing/*',
					'/projects',
					'/projects/*',
					'/rss.xml',
					'/sitemap.xml',
					'/robots.txt',
					'/llm-full.txt',
					'/favicon.svg',
					'/favicon.png',
					'/zappy-face.jpg',
					'/zappy-face.png',
					'/emmanuel_yeboah.webp',
					'/fonts/*',
					'/imgs/*',
					'/portfolio/*'
				]
			}
		})
	}
};

export default config;
