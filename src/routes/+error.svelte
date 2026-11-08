<script lang="ts">
	import { page } from '$app/state';
	import SEOHead from '$lib/components/seo-head.svelte';
	import PageHeader from '$lib/components/page-header.svelte';
	import Section from '$lib/components/section.svelte';

	const messages: Record<number, string> = {
		404: "That page doesn't exist, or it moved.",
		500: 'Something broke on my end.',
		503: 'The site is temporarily unavailable. Try again shortly.'
	};

	const status = $derived(page.status);
	const message = $derived(messages[status] ?? page.error?.message ?? 'Something went wrong.');
</script>

<SEOHead
	title={status === 404 ? 'Page not found' : `Error ${status}`}
	description={message}
	canonical="https://noelzappy.dev"
	ogType="website"
	noindex
/>

<PageHeader eyebrow={String(status)} title={message} />

<Section>
	<nav class="links" aria-label="Where to next">
		<a href="/">Home</a>
		<a href="/projects">Work</a>
	</nav>
</Section>

<style>
	.links {
		display: flex;
		gap: 2rem;
		font-size: var(--step-heading);
		line-height: var(--lh-heading);
		letter-spacing: var(--tracking-heading);
	}
	.links a {
		color: var(--fg);
		text-decoration: none;
	}
	.links a:hover {
		color: var(--accent);
	}
</style>
