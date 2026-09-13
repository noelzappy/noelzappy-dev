<script lang="ts">
	import { page } from '$app/state';
	import ThemeToggle from './theme-toggle.svelte';

	const links = [
		{ name: 'Writing', href: '/writing' },
		{ name: 'Projects', href: '/projects' },
		{ name: 'About', href: '/about' }
	];

	const isActive = (href: string) => page.url.pathname.startsWith(href);
</script>

<header class="nav">
	<a href="/" class="home" data-sveltekit-preload-data>Emmanuel Yeboah</a>
	<nav aria-label="Main navigation">
		{#each links as link (link.href)}
			<a
				href={link.href}
				class:active={isActive(link.href)}
				aria-current={isActive(link.href) ? 'page' : undefined}
				data-sveltekit-preload-data>{link.name}</a
			>
		{/each}
		<ThemeToggle />
	</nav>
</header>

<style>
	.nav {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem 1.5rem;
	}
	.home {
		color: var(--fg);
		font-weight: 650;
		text-decoration: none;
		letter-spacing: -0.01em;
	}
	.home:hover {
		color: var(--accent);
	}
	nav {
		display: flex;
		align-items: center;
		gap: 1.25rem;
	}
	nav a {
		color: var(--muted);
		text-decoration: none;
		font-size: 0.95rem;
	}
	nav a:hover,
	nav a.active {
		color: var(--accent);
	}
</style>
