<script lang="ts">
	import './layout.css';
	import Navbar from '$lib/components/navbar.svelte';
	import Footer from '$lib/components/footer.svelte';

	let { children } = $props();
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

<div class="site">
	<Navbar />
	<main>
		{@render children()}
	</main>
	<Footer />
</div>
