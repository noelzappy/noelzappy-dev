<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	const NavMenu = [
		{ name: 'Projects', href: '/projects' },
		{ name: 'Notes', href: '/notes' },
		{ name: 'Contact', href: '/contact' }
	];

	let scrolled = $state(false);

	function isActive(href: string) {
		return page.url.pathname.startsWith(href);
	}

	onMount(() => {
		const handleScroll = () => {
			scrolled = window.scrollY > 20;
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<header
	class="fixed top-0 left-0 right-0 z-50 bg-[#333333]/80 backdrop-blur-md transition-all duration-300 {scrolled
		? 'border-b border-neutral-700/50 shadow-lg'
		: 'border-b border-transparent'}"
>
	<div class="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between text-sm font-medium">
		<h1 class="text-xl text-neutral-100 hover:text-white transition-colors">
			<a href="/" class="logo-wrapper inline-block px-2 py-1" data-sveltekit-preload-data>Zappy</a>
		</h1>
		<nav class="flex items-center gap-6">
			{#each NavMenu as item (item.href)}
				<a
					class="transition-colors {isActive(item.href)
						? 'text-white font-semibold'
						: 'text-neutral-400 hover:text-white'}"
					href={item.href}
					data-sveltekit-preload-data
				>
					{item.name}
				</a>
			{/each}
		</nav>
	</div>
</header>

<style>
	@keyframes rotate-border {
		0% {
			background-position: 0% 50%;
		}
		100% {
			background-position: 200% 50%;
		}
	}

	.logo-wrapper {
		position: relative;
		display: inline-block;
	}

	.logo-wrapper::before {
		content: '';
		position: absolute;
		inset: -2px;
		border-radius: 0.375rem;
		padding: 2px;
		background: linear-gradient(
			90deg,
			#667eea,
			#764ba2,
			#f093fb,
			#4facfe,
			#00f2fe,
			#43e97b,
			#568d66,
			#899878,
			#667eea
		);
		background-size: 200% 100%;
		-webkit-mask:
			linear-gradient(#fff 0 0) content-box,
			linear-gradient(#fff 0 0);
		-webkit-mask-composite: xor;
		mask:
			linear-gradient(#fff 0 0) content-box,
			linear-gradient(#fff 0 0);
		mask-composite: exclude;
		opacity: 1;
		animation: rotate-border 3s linear infinite;
	}

	.logo-wrapper:hover::before {
		opacity: 1;
	}
</style>
