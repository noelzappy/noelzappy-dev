// One-off: export Ghost posts to src/content/writing/<slug>.md
// Usage: GHOST_KEY=... node scripts/export-ghost.mjs
import { writeFileSync } from 'node:fs';
import { NodeHtmlMarkdown } from 'node-html-markdown';

const KEY = process.env.GHOST_KEY;
if (!KEY) throw new Error('GHOST_KEY required');

const TAGS = {
	'are-we-now-just-bystanders-while-ai-takes-over': ['ai', 'opinion'],
	'software-engineering-is-just-advanced-damage-control': ['engineering', 'opinion'],
	'the-shipping-anxiety-of-ai-generated-code': ['ai', 'engineering'],
	'how-i-migrated-170k-users-from-php-to-node-js-without-stopping-the-world': [
		'systems',
		'migrations'
	],
	'why-i-built-voltax-unifying-the-african-payment-stack': ['open-source', 'api-design'],
	'im-leaving-react-for-svelte': ['frontend', 'opinion'],
	'why-developer-experience-is-now-a-product-priority': ['developer-experience'],
	'why-every-ghanaian-tech-professional-should-take-the-2025-ghana-tech-ecosystem-survey': [
		'community'
	],
	'estimating-project-timelines-as-a-freelancer-a-developers-guide': ['process']
};

const url = `https://ghost.noelzappy.dev/ghost/api/content/posts/?key=${KEY}&limit=50&formats=html&fields=title,slug,published_at,custom_excerpt,excerpt,html`;
const { posts } = await (await fetch(url)).json();
const nhm = new NodeHtmlMarkdown({ bulletMarker: '-', codeFence: '```' });
const yamlStr = (s) => JSON.stringify(s ?? '');

for (const p of posts) {
	const slug = p.slug.trim();
	const tags = TAGS[slug];
	if (!tags) throw new Error(`no tags mapped for ${slug}`);
	const body = nhm
		.translate(p.html || '')
		.replace(/\u00a0/g, ' ')
		.trim();
	const description = (p.custom_excerpt || p.excerpt || '')
		.replace(/\s+/g, ' ')
		.trim()
		.slice(0, 300);
	const fm = [
		'---',
		`title: ${yamlStr(p.title)}`,
		`date: '${p.published_at.slice(0, 10)}'`,
		`tags: [${tags.join(', ')}]`,
		`description: ${yamlStr(description)}`,
		'---'
	].join('\n');
	writeFileSync(`src/content/writing/${slug}.md`, `${fm}\n\n${body}\n`);
	console.log('wrote', slug, tags);
}
