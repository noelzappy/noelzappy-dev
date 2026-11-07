<script lang="ts">
	import { tick } from 'svelte';
	import LocalTime from './local-time.svelte';
	import ThemeToggle from './theme-toggle.svelte';
	import SiteMenu, { type MenuPill, type MenuPost } from './site-menu.svelte';
	import { AVAILABILITY } from '$lib/shared/site';

	/**
	 * `overlay` is decided by the root layout: true on `(studio)` routes (full-bleed pages), where
	 * the header is absolutely positioned and transparent over the hero; false on `(classic)` routes,
	 * where it sits in normal flow above the content column.
	 */
	let {
		overlay = false,
		pills = [],
		posts = []
	}: { overlay?: boolean; pills?: MenuPill[]; posts?: MenuPost[] } = $props();

	let open = $state(false);
	let button = $state<HTMLButtonElement | null>(null);

	async function close() {
		open = false;
		await tick();
		button?.focus();
	}
</script>

<header class="site-header" class:overlay>
	<div class="left">
		<button
			type="button"
			class="menu-pill"
			bind:this={button}
			aria-expanded={open}
			aria-controls="site-menu"
			onclick={() => (open = true)}>Menu</button
		>
	</div>
	<a class="wordmark" href="/">Emmanuel Yeboah</a>
	<div class="right">
		<span class="time"><LocalTime /></span>
		<span class="availability">{AVAILABILITY}</span>
		<ThemeToggle />
	</div>
</header>

<SiteMenu {open} onclose={close} {pills} {posts} />

<style>
	.site-header {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		gap: 1rem;
		padding: 1rem clamp(1.25rem, 3vw, 2.5rem);
		color: var(--fg);
	}
	.site-header.overlay {
		position: absolute;
		inset: 0 0 auto 0;
		z-index: 20;
		background: transparent;
	}
	/* The hero paints a flat brand colour while a project pill is active and sets data-hero-tone on
	   <html>; re-point the header's tokens so it reads on that field. */
	:global(html[data-hero-tone='dark']) .site-header.overlay {
		--fg: #0e0e0d;
		--bg: var(--hero-field);
		--muted: #0e0e0d;
		--accent: #0e0e0d;
	}
	:global(html[data-hero-tone='light']) .site-header.overlay {
		--fg: #f3efe6;
		--bg: var(--hero-field);
		--muted: #f3efe6;
		--accent: #f3efe6;
	}
	.left {
		justify-self: start;
	}
	.right {
		justify-self: end;
		display: flex;
		align-items: center;
		gap: 0.875rem;
		font-size: 0.85rem;
		color: var(--muted);
		white-space: nowrap;
	}
	.availability {
		color: var(--accent);
	}
	.menu-pill {
		font: inherit;
		font-size: 0.9rem;
		padding: 0.4rem 1rem;
		border: 1px solid var(--fg);
		border-radius: 999px;
		background: transparent;
		color: var(--fg);
		cursor: pointer;
		transition:
			background 150ms,
			color 150ms;
	}
	.menu-pill:hover {
		background: var(--fg);
		color: var(--bg);
	}
	.wordmark {
		font-family: var(--font-display);
		font-size: 1.15rem;
		font-weight: 500;
		letter-spacing: -0.015em;
		color: var(--fg);
		text-decoration: none;
		white-space: nowrap;
	}
	@media (max-width: 760px) {
		.availability {
			display: none;
		}
	}
	@media (max-width: 560px) {
		.time {
			display: none;
		}
		.wordmark {
			font-size: 1rem;
		}
		.site-header {
			gap: 0.5rem;
		}
	}
</style>
