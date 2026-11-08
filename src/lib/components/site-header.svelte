<script lang="ts">
	import { tick } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import ThemeToggle from './theme-toggle.svelte';
	import SiteMenu, { type MenuPill, type MenuPost } from './site-menu.svelte';

	/** Fixed bar: transparent over each page's hero at scroll 0, solid with a hairline once scrolled. */
	let { pills = [], posts = [] }: { pills?: MenuPill[]; posts?: MenuPost[] } = $props();

	const LINKS = [
		{ label: 'Work', href: '/projects' },
		{ label: 'About', href: '/about' },
		{ label: 'Writing', href: '/writing' }
	];
	const CTA = { label: 'Work with me', href: '/work-with-me' };

	const isActive = (href: string) =>
		page.url.pathname === href || page.url.pathname.startsWith(`${href}/`);

	let open = $state(false);
	let button = $state<HTMLButtonElement | null>(null);
	let scrolled = $state(false);

	function onscroll() {
		scrolled = window.scrollY > 24;
	}

	$effect(onscroll);

	// The Menu button disappears at >=900px; don't leave the overlay open behind it.
	$effect(() => {
		const mq = window.matchMedia('(min-width: 900px)');
		const sync = () => {
			if (mq.matches) open = false;
		};
		mq.addEventListener('change', sync);
		return () => mq.removeEventListener('change', sync);
	});

	async function close() {
		open = false;
		await tick();
		button?.focus();
	}

	// Any completed navigation (menu link, wordmark, in-page link) dismisses the menu. No focus
	// move here: the new page owns focus.
	afterNavigate(() => {
		open = false;
	});
</script>

<svelte:window {onscroll} />

<header class="site-header" class:scrolled>
	<a class="wordmark" href="/">Emmanuel Yeboah</a>
	<div class="right">
		<nav class="links" aria-label="Main">
			{#each LINKS as link (link.href)}
				<a href={link.href} aria-current={isActive(link.href) ? 'page' : undefined}>{link.label}</a>
			{/each}
			<a class="cta" href={CTA.href} aria-current={isActive(CTA.href) ? 'page' : undefined}
				>{CTA.label}</a
			>
		</nav>
		<button
			type="button"
			class="menu-pill"
			bind:this={button}
			aria-expanded={open}
			aria-controls="site-menu"
			onclick={() => (open = true)}>Menu</button
		>
		<span class="toggle"><ThemeToggle /></span>
	</div>
</header>

<SiteMenu {open} onclose={close} {pills} {posts} />

<style>
	.site-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		box-sizing: border-box;
		height: var(--header-h);
		padding: 0 var(--page-gutter);
		color: var(--fg);
		position: fixed;
		inset: 0 0 auto 0;
		z-index: 20;
		background: transparent;
		border-bottom: 1px solid transparent;
	}
	.site-header.scrolled {
		background: var(--bg);
		border-bottom-color: var(--border);
	}
	@media (prefers-reduced-motion: no-preference) {
		.site-header {
			transition:
				background-color 200ms,
				border-color 200ms;
		}
		.links a.cta,
		.menu-pill {
			transition:
				background 150ms,
				color 150ms;
		}
	}
	/* The hero paints a flat brand colour while a project pill is active and sets data-hero-tone on
	   <html>; re-point the header's tokens so it reads on that field. Once scrolled the bar is
	   solid, so it returns to the page's own tokens. */
	:global(html[data-hero-tone='dark']) .site-header:not(.scrolled) {
		--fg: #0e0e0d;
		--bg: var(--hero-field);
		--muted: #0e0e0d;
		--accent: #0e0e0d;
	}
	:global(html[data-hero-tone='light']) .site-header:not(.scrolled) {
		--fg: #f3efe6;
		--bg: var(--hero-field);
		--muted: #f3efe6;
		--accent: #f3efe6;
	}
	.right {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		white-space: nowrap;
	}
	.links {
		display: none;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.9rem;
	}
	.links a {
		display: inline-flex;
		align-items: center;
		min-height: 2.75rem;
		padding: 0 0.75rem;
		color: var(--muted);
		text-decoration: none;
	}
	.links a:hover {
		color: var(--fg);
	}
	.links a[aria-current='page'] {
		color: var(--accent);
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 0.4em;
	}
	.links a.cta[aria-current='page'] {
		text-decoration: none;
	}
	.links a.cta {
		min-height: 2.25rem;
		margin-inline: 0.5rem;
		padding: 0 1rem;
		border: 1px solid var(--accent);
		border-radius: 999px;
		color: var(--accent);
	}
	.links a.cta:hover,
	.links a.cta[aria-current='page'] {
		background: var(--accent);
		color: var(--bg);
	}
	.menu-pill {
		font: inherit;
		font-size: 0.9rem;
		min-height: 2.75rem;
		padding: 0 1.1rem;
		border: 1px solid var(--fg);
		border-radius: 999px;
		background: transparent;
		color: var(--fg);
		cursor: pointer;
	}
	.menu-pill:hover {
		background: var(--fg);
		color: var(--bg);
	}
	.toggle {
		display: inline-flex;
	}
	.toggle :global(.theme-toggle) {
		width: 2.75rem;
		height: 2.75rem;
	}
	.wordmark {
		display: inline-flex;
		align-items: center;
		min-height: var(--tap-min);
		font-family: var(--font-display);
		font-size: 1.15rem;
		font-weight: 500;
		letter-spacing: -0.015em;
		color: var(--fg);
		text-decoration: none;
		white-space: nowrap;
	}
	@media (min-width: 900px) {
		.links {
			display: flex;
		}
		.menu-pill {
			display: none;
		}
		.toggle :global(.theme-toggle) {
			width: 1.9rem;
			height: 1.9rem;
		}
		.toggle {
			margin-left: 0.5rem;
		}
	}
	@media (max-width: 560px) {
		.wordmark {
			font-size: 1rem;
		}
		.site-header {
			gap: 0.5rem;
		}
	}
</style>
