<script lang="ts">
	let { eyebrow, title, intro }: { eyebrow?: string; title: string; intro?: string } = $props();
</script>

<header class="page-header">
	{#if eyebrow}<p class="eyebrow">{eyebrow}</p>{/if}
	<h1 class="page-title">{title}</h1>
	{#if intro}<p class="intro">{intro}</p>{/if}
</header>

<style>
	.page-header {
		max-width: var(--page-max);
		margin-inline: auto;
		padding: calc(var(--header-h) + clamp(2rem, 6vw, 5rem)) var(--page-gutter)
			clamp(2.5rem, 6vw, 5rem);
	}
	.eyebrow {
		margin: 0 0 1.25rem;
		font-size: var(--step-caption);
		line-height: var(--lh-caption);
		letter-spacing: var(--tracking-caption);
		text-transform: uppercase;
		color: var(--muted);
	}
	h1 {
		margin: 0;
		font-family: var(--font-display);
		font-size: var(--step-display-xl);
		line-height: var(--lh-display-xl);
		letter-spacing: var(--tracking-display-xl);
		font-weight: var(--weight-display-xl);
		color: var(--fg);
		text-wrap: balance;
	}
	.intro {
		margin: clamp(1.5rem, 3vw, 2.5rem) 0 0;
		max-width: 52ch;
		font-size: clamp(1.125rem, 1rem + 0.6vw, 1.5rem);
		line-height: 1.5;
		color: var(--muted);
	}
</style>
