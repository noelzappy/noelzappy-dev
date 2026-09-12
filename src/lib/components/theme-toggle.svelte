<script lang="ts">
	import { onMount } from 'svelte';

	type Theme = 'light' | 'dark';
	let theme = $state<Theme | null>(null);

	function current(): Theme {
		const set = document.documentElement.getAttribute('data-theme');
		if (set === 'light' || set === 'dark') return set;
		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	}

	onMount(() => {
		theme = current();
	});

	function toggle() {
		const next: Theme = current() === 'dark' ? 'light' : 'dark';
		document.documentElement.setAttribute('data-theme', next);
		try {
			localStorage.setItem('theme', next);
		} catch {
			/* storage unavailable: theme still applies for this page */
		}
		theme = next;
	}
</script>

<button
	type="button"
	class="theme-toggle"
	onclick={toggle}
	aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
	title={theme === 'dark' ? 'Light theme' : 'Dark theme'}
>
	{#if theme === 'dark'}
		<svg
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="4" />
			<path
				d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
			/>
		</svg>
	{:else}
		<svg
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
		</svg>
	{/if}
</button>

<style>
	.theme-toggle {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		border: 1px solid var(--border);
		border-radius: 999px;
		background: transparent;
		color: var(--muted);
		cursor: pointer;
	}
	.theme-toggle:hover {
		color: var(--accent);
		border-color: var(--accent);
	}
</style>
