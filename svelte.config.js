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
	kit: { adapter: adapter() }
};

export default config;
