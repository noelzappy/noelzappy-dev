<script lang="ts">
	import './layout.css';
	import SiteHeader from '$lib/components/site-header.svelte';
	import Footer from '$lib/components/footer.svelte';

	import { setupPageReveal } from '$lib/transitions/page-reveal';
	import { scheduleCalEmbed } from '$lib/cal.js';
	import { onMount } from 'svelte';

	let { children, data } = $props();

	setupPageReveal(() => new Set(data.writeups));
	onMount(scheduleCalEmbed);
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

<a class="skip-link" href="#main">Skip to content</a>
<SiteHeader pills={data.pills} posts={data.posts} />
{@render children()}
<Footer />
<div class="reveal-panel" aria-hidden="true"></div>
