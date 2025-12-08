<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '$lib/pages/partials/navbar.svelte';
	import Footer from '$lib/pages/partials/footer.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap"
		rel="stylesheet"
	/>
	<link
		href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
		rel="stylesheet"
	/>
</svelte:head>

<div class="relative flex h-auto min-h-screen w-full flex-col">
	<div class="layout-container flex h-full grow flex-col">
		<div class="px-4 sm:px-6 lg:px-8 flex flex-1 justify-center py-5">
			<div class="layout-content-container flex flex-col w-full max-w-4xl flex-1">
				<Navbar />
				<main class="flex flex-col gap-16 py-12 sm:py-16">
					{@render children()}
				</main>
				<Footer />
			</div>
		</div>
	</div>
</div>
