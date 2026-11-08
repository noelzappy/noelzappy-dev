<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fadeUp } from '$lib/motion/fade-up';

	let {
		label,
		id,
		aside,
		children
	}: { label?: string; id?: string; aside?: Snippet; children: Snippet } = $props();
</script>

<section {id} class="sec">
	<div class="inner">
		{#if aside}<div class="aside">{@render aside()}</div>{:else if label}<h2 class="label">
				{label}
			</h2>{/if}
		<div class="body" use:fadeUp>{@render children()}</div>
	</div>
</section>

<style>
	.sec {
		max-width: var(--page-max);
		margin-inline: auto;
		padding-inline: var(--page-gutter);
		scroll-margin-top: var(--header-h);
	}
	.inner {
		border-top: 1px solid var(--border);
		padding-block: clamp(2rem, 5vw, 4.5rem);
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 1.5rem;
	}
	.label {
		margin: 0;
		font-size: var(--step-caption);
		line-height: var(--lh-caption);
		letter-spacing: var(--tracking-caption);
		text-transform: uppercase;
		font-weight: 500;
		color: var(--muted);
	}
	@media (min-width: 48rem) {
		.inner {
			grid-template-columns: minmax(0, 1fr) minmax(0, 3fr);
			gap: var(--page-gutter);
		}
		.body {
			grid-column: 2;
		}
	}
</style>
