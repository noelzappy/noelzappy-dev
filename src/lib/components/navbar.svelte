<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	const NavLinks = [
		{ name: 'Work', href: '/work' },
		{ name: 'Services', href: '/services' },
		{ name: 'Notes', href: '/notes' },
		{ name: 'About', href: '/about' }
	];

	let scrolled = $state(false);
	let menuOpen = $state(false);

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
	class="fixed top-0 left-0 right-0 z-50 backdrop-blur-md transition-all duration-300 {scrolled
		? 'border-b border-[var(--color-border)] shadow-lg shadow-black/20'
		: 'border-b border-transparent'}"
	style="background-color: rgba(10,10,10,0.85);"
>
	<div class="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
		<!-- Logo -->
		<a
			href="/"
			class="flex items-center gap-3 group"
			data-sveltekit-preload-data
			class:logo-active={isHome()}
			aria-label="Zappy home"
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
			<span class="text-xl font-semibold text-neutral-100 group-hover:text-white transition-colors font-[Syne,sans-serif]">
				Zappy
			</span>
		</a>

		<!-- Desktop nav -->
		<nav class="hidden sm:flex items-center gap-8" aria-label="Main navigation">
			{#each NavLinks as item (item.href)}
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
			<a
				href="/contact"
				class="btn-primary text-sm py-2 px-5"
				data-sveltekit-preload-data
			>
				Book a Call →
			</a>
		</nav>

		<!-- Mobile menu button -->
		<button
			class="sm:hidden text-neutral-400 hover:text-white transition-colors"
			onclick={() => (menuOpen = !menuOpen)}
			aria-label="Toggle navigation menu"
			aria-expanded={menuOpen}
		>
			{#if menuOpen}
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<line x1="18" y1="6" x2="6" y2="18"/>
					<line x1="6" y1="6" x2="18" y2="18"/>
				</svg>
			{:else}
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<line x1="3" y1="6" x2="21" y2="6"/>
					<line x1="3" y1="12" x2="21" y2="12"/>
					<line x1="3" y1="18" x2="21" y2="18"/>
				</svg>
			{/if}
		</button>
	</div>

	<!-- Mobile nav dropdown -->
	{#if menuOpen}
		<nav
			class="sm:hidden border-t border-[var(--color-border)] px-4 py-4 flex flex-col gap-2"
			style="background-color: rgba(10,10,10,0.97);"
			aria-label="Mobile navigation"
		>
			{#each NavLinks as item (item.href)}
				<a
					class="text-sm font-medium py-2 px-3 rounded-lg transition-colors {isActive(item.href)
						? 'text-white bg-white/5'
						: 'text-neutral-400 hover:text-white hover:bg-white/5'}"
					href={item.href}
					data-sveltekit-preload-data
					onclick={() => (menuOpen = false)}
				>
					{item.name}
				</a>
			{/each}
			<a
				href="/contact"
				class="btn-primary text-sm justify-center mt-2"
				onclick={() => (menuOpen = false)}
			>
				Book a Call →
			</a>
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
