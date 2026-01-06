<script lang="ts">
	import './layout.css';
	import Navbar from '$lib/components/navbar.svelte';
	import Footer from '$lib/components/footer.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<!-- Favicons -->
	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	<link rel="apple-touch-icon" href="/favicon.svg" />

	<!-- Global Meta -->
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="author" content="Emmanuel Noel Zappy Yeboah" />
	<meta name="theme-color" content="#0d1117" />

	<link
		rel="preload"
		href="/fonts/Inter-Variable.woff2"
		as="font"
		type="font/woff2"
		crossorigin="anonymous"
	/>
	<link
		href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
		rel="stylesheet"
	/>
</svelte:head>

<div
	class="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-black"
	role="main"
>
	<div class="layout-container flex h-full grow flex-col relative z-10">
		<div class="px-4 sm:px-6 lg:px-8 flex flex-1 justify-center py-5">
			<div class="layout-content-container flex flex-col w-full max-w-4xl flex-1">
				<Navbar />
				<main class="flex flex-col gap-16 py-12 sm:py-16 mt-16">
					{@render children()}
				</main>
				<Footer />
			</div>
		</div>
	</div>
</div>
