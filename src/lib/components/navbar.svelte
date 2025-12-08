<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	const NavMenu = [
		{ name: 'Projects', href: '/projects' },
		{ name: 'Notes', href: '/notes' },
		{ name: 'Contact', href: '/contact' }
	];

	let scrolled = $state(false);
	let mobileMenuOpen = $state(false);

	function isActive(href: string) {
		return page.url.pathname.startsWith(href);
	}

	function isHome() {
		return page.url.pathname === '/';
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
	class="fixed top-0 left-0 right-0 z-50 bg-[#333333]/90 backdrop-blur-md transition-all duration-300 {scrolled
		? 'border-b border-neutral-700/50 shadow-lg'
		: 'border-b border-transparent'}"
>
	<div class="max-w-4xl mx-auto px-6 md:px-0 py-4 flex items-center justify-between">
		<a
			href="/"
			class="flex items-center gap-3 group"
			data-sveltekit-preload-data
			class:logo-active={isHome()}
		>
			<div class="w-8 h-8 flex-shrink-0">
				<svg
					width="32"
					height="32"
					viewBox="0 0 100 100"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					class="transition-transform duration-300 group-hover:scale-110"
				>
					<rect width="100" height="100" rx="20" fill="#1a1a1a" />
					<path
						d="M35 30 L15 50 L35 70"
						stroke="#FFFFFF"
						stroke-width="6"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<path
						d="M65 30 L85 50 L65 70"
						stroke="#FFFFFF"
						stroke-width="6"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<path
						d="M55 25 L42 50 H52 L45 75"
						stroke="#FF6B35"
						stroke-width="4"
						fill="#FF6B35"
						stroke-linejoin="round"
						class="logo-bolt"
					/>
				</svg>
			</div>
			<span
				class="text-xl font-semibold text-neutral-100 group-hover:text-white transition-colors hidden sm:block"
			>
				Zappy
			</span>
		</a>

		<nav class="hidden sm:flex items-center gap-8">
			{#each NavMenu as item (item.href)}
				<a
					class="relative text-sm font-medium transition-colors {isActive(item.href)
						? 'text-white'
						: 'text-neutral-400 hover:text-white'}"
					href={item.href}
					data-sveltekit-preload-data
				>
					{item.name}
					{#if isActive(item.href)}
						<span
							class="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"
						></span>
					{/if}
				</a>
			{/each}
		</nav>

		<button
			class="sm:hidden p-2 text-neutral-400 hover:text-white transition-colors"
			onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
			aria-label="Toggle menu"
		>
			<span class="material-symbols-outlined text-2xl">
				{mobileMenuOpen ? 'close' : 'menu'}
			</span>
		</button>
	</div>

	{#if mobileMenuOpen}
		<nav
			class="sm:hidden border-t border-neutral-700/50 bg-[#333333]/95 backdrop-blur-md shadow-2xl transition-all duration-300"
		>
			<div class="max-w-4xl mx-auto px-6 py-4 flex flex-col gap-4">
				{#each NavMenu as item (item.href)}
					<a
						class="text-base font-medium transition-colors {isActive(item.href)
							? 'text-white'
							: 'text-neutral-400 hover:text-white'}"
						href={item.href}
						data-sveltekit-preload-data
						onclick={() => (mobileMenuOpen = false)}
					>
						{item.name}
					</a>
				{/each}
			</div>
		</nav>
	{/if}
</header>

<style>
	.logo-active .logo-bolt {
		animation: pulse-glow 2s ease-in-out infinite;
	}

	@keyframes pulse-glow {
		0%,
		100% {
			opacity: 1;
			filter: drop-shadow(0 0 2px #ff6b35);
		}
		50% {
			opacity: 0.8;
			filter: drop-shadow(0 0 6px #ff6b35);
		}
	}
</style>
