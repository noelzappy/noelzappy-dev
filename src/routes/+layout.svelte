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
	<meta name="theme-color" content="#0a0a0a" />

	<!-- Preload local font -->
	<link
		rel="preload"
		href="/fonts/Inter-Variable.woff2"
		as="font"
		type="font/woff2"
		crossorigin="anonymous"
	/>

	<!-- Google Fonts: Syne (headings) + DM Sans (body) -->
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300;1,9..40,400&display=swap"
		rel="stylesheet"
	/>

	<!-- Material Symbols -->
	<link
		href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
		rel="stylesheet"
	/>
</svelte:head>

<div class="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden" style="background-color: var(--color-bg);">
	<div class="flex h-full grow flex-col">
		<div class="px-4 sm:px-6 lg:px-8 flex flex-1 justify-center py-5">
			<div class="flex flex-col w-full max-w-[1200px] flex-1">
				<Navbar />
				<main class="flex flex-col mt-16">
					{@render children()}
				</main>
				<Footer />
			</div>
		</div>
	</div>
</div>
