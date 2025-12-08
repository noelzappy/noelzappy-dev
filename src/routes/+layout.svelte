<script lang="ts">
	import './layout.css';
	import Navbar from '$lib/components/navbar.svelte';
	import Footer from '$lib/components/footer.svelte';
	import { onMount } from 'svelte';

	let { children } = $props();

	let mouseX = $state(0);
	let mouseY = $state(0);
	let targetX = 0;
	let targetY = 0;

	function handleMouseMove(event: MouseEvent) {
		targetX = event.clientX;
		targetY = event.clientY;
	}

	onMount(() => {
		let animationFrameId: number;

		function animate() {
			mouseX += (targetX - mouseX) * 0.1;
			mouseY += (targetY - mouseY) * 0.1;
			animationFrameId = requestAnimationFrame(animate);
		}

		animate();

		return () => {
			if (animationFrameId) {
				cancelAnimationFrame(animationFrameId);
			}
		};
	});
</script>

<svelte:head>
	<link rel="icon" href="/og-image.png" />
	<title>Noel Zappy - Software Engineer Portfolio</title>
	<meta
		name="description"
		content="Portfolio of Emmanuel Noel Zappy Yeboah, a senior software engineer specializing in modern web and mobile applications."
	/>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="author" content="Emmanuel Noel Zappy Yeboah" />
	<meta
		name="keywords"
		content="Noel Zappy, Emmanuel Yeboah, Software Engineer, Web Developer, Mobile Developer, Portfolio, Full-Stack Developer, React, Node.js, Svelte, SvelteKit, JavaScript, TypeScript, Node, Frontend Developer, Backend Developer, NodeJs, Golang, Java, Python"
	/>
	<meta name="theme-color" content="#0d1117" />
	<meta property="og:title" content="Noel Zappy - Software Engineer Portfolio" />
	<meta
		property="og:description"
		content="Portfolio of Emmanuel Noel Zappy Yeboah, a senior software engineer specializing in modern web and mobile applications."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://noelzappy.dev" />
	<meta property="og:image" content="https://noelzappy.dev/og-image.png" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Noel Zappy - Software Engineer Portfolio" />
	<meta
		name="twitter:description"
		content="Portfolio of Emmanuel Noel Zappy Yeboah, a senior software engineer specializing in modern web and mobile applications."
	/>
	<meta name="twitter:image" content="https://noelzappy.dev/og-image.png" />
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

<div
	class="relative flex h-auto min-h-screen w-full flex-col overflow-hidden"
	role="main"
	onmousemove={handleMouseMove}
>
	<div
		class="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
		style="background: radial-gradient(600px circle at {mouseX}px {mouseY}px, rgba(191, 215, 234,0.02), transparent 80%);"
	></div>
	<div class="layout-container flex h-full grow flex-col relative z-10">
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
