import { render } from 'svelte/server';
import { getPosts } from '$lib/content/writing';
import type { RequestHandler } from './$types';

export const prerender = true;

const SITE = 'https://noelzappy.dev';
const escape = (s: string) =>
	s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: RequestHandler = async () => {
	const items = getPosts()
		.map((post) => {
			const { body } = render(post.component);
			const url = `${SITE}/writing/${post.slug}`;
			return `
    <item>
      <title>${escape(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(post.date + 'T00:00:00Z').toUTCString()}</pubDate>
      <description>${escape(post.description)}</description>
      ${post.tags.map((t) => `<category>${escape(t)}</category>`).join('')}
      <content:encoded><![CDATA[${body}]]></content:encoded>
    </item>`;
		})
		.join('');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Emmanuel Yeboah — Writing</title>
    <link>${SITE}/writing</link>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml" />
    <description>Notes on backend engineering, distributed systems, and migrations.</description>
    <language>en</language>${items}
  </channel>
</rss>`;

	return new Response(xml, {
		headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' }
	});
};
