<script lang="ts">
	import './layout.css';
	import SiteHeader from '$lib/components/site-header.svelte';
	import Footer from '$lib/components/footer.svelte';

	import { page } from '$app/state';
	import { setupPageReveal } from '$lib/transitions/page-reveal';

	let { children, data } = $props();

	setupPageReveal();

	// Studio pages are full-bleed, so the header overlays the hero; classic pages keep it in flow.
	// Decided from the route group in the matched route id, e.g. '/(studio)/projects/[slug]'.
	const studio = $derived(page.route.id?.startsWith('/(studio)') ?? false);
</script>

<svelte:head>
	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	<link rel="apple-touch-icon" href="/favicon.svg" />
	<meta name="author" content="Emmanuel Yeboah" />
	<link
		rel="alternate"
		type="application/rss+xml"
		title="Emmanuel Yeboah — Writing"
		href="/rss.xml"
	/>
	<link
		rel="preload"
		href="/fonts/Inter-Variable.woff2"
		as="font"
		type="font/woff2"
		crossorigin="anonymous"
	/>
</svelte:head>

<SiteHeader overlay={studio} pills={data.pills} posts={data.posts} />
{@render children()}
<Footer wide={studio} />
<div class="reveal-panel" aria-hidden="true"></div>
