import type { Handle } from '@sveltejs/kit';
import { NodeHtmlMarkdown } from 'node-html-markdown';

const AGENT_DISCOVERY_LINKS = [
	'</.well-known/api-catalog>; rel="api-catalog"',
	'</llm-full.txt>; rel="service-doc"'
];

function acceptsMarkdown(acceptHeader: string | null): boolean {
	if (!acceptHeader) return false;

	return acceptHeader.split(',').some((entry) => {
		const [type, ...params] = entry
			.split(';')
			.map((part) => part.trim().toLowerCase());

		if (type !== 'text/markdown') return false;

		const qParam = params.find((param) => param.startsWith('q='));
		if (!qParam) return true;

		const q = Number.parseFloat(qParam.slice(2));
		return Number.isNaN(q) || q > 0;
	});
}

function ensureVaryAccept(headers: Headers): void {
	const vary = headers.get('Vary');
	if (!vary) {
		headers.set('Vary', 'Accept');
		return;
	}

	const varyValues = vary
		.split(',')
		.map((value) => value.trim().toLowerCase());

	if (!varyValues.includes('accept')) {
		headers.set('Vary', `${vary}, Accept`);
	}
}

function estimateTokens(markdown: string): number {
	// Rough heuristic commonly used for GPT-style token estimates.
	return Math.ceil(markdown.length / 4);
}

export const handle: Handle = async ({ event, resolve }) => {
	let response = await resolve(event);

	if (event.url.pathname === '/') {
		for (const link of AGENT_DISCOVERY_LINKS) {
			response.headers.append('Link', link);
		}
	}

	const shouldReturnMarkdown =
		event.request.method === 'GET' &&
		acceptsMarkdown(event.request.headers.get('Accept')) &&
		response.headers.get('content-type')?.toLowerCase().startsWith('text/html');

	if (shouldReturnMarkdown) {
		const html = await response.text();
		const markdown = NodeHtmlMarkdown.translate(html);
		const headers = new Headers(response.headers);

		headers.set('Content-Type', 'text/markdown; charset=utf-8');
		headers.set('x-markdown-tokens', String(estimateTokens(markdown)));
		headers.delete('Content-Length');
		ensureVaryAccept(headers);

		response = new Response(markdown, {
			status: response.status,
			statusText: response.statusText,
			headers
		});
	}

	return response;
};
