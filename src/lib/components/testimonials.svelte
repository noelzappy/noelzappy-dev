<script lang="ts">
	import Section from './section.svelte';
	import { dev } from '$app/environment';
	import type { Testimonial } from '$lib/data/testimonials';

	let { items }: { items: Testimonial[] } = $props();

	// Placeholder quotes are for local design work only; they never ship.
	const shown = $derived(items.filter((t) => dev || !t.placeholder));
</script>

{#if shown.length > 0}
	<Section label="Testimonials">
		<ul class="quotes">
			{#each shown as t, i (i)}
				<li class="quote">
					<blockquote>{t.quote}</blockquote>
					<p class="who">
						<span class="name">{t.name}</span>
						<span class="role">{t.role}</span>
						{#if t.placeholder}<span class="tag">Placeholder</span>{/if}
					</p>
				</li>
			{/each}
		</ul>
	</Section>
{/if}

<style>
	.quotes {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: clamp(1.5rem, 3vw, 2.5rem);
	}
	blockquote {
		margin: 0;
		font-size: var(--step-heading);
		line-height: var(--lh-heading);
		letter-spacing: var(--tracking-heading);
		color: var(--fg);
		max-width: 40ch;
	}
	.who {
		margin: 1rem 0 0;
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.25rem 0.75rem;
		font-size: var(--step-small);
		line-height: var(--lh-small);
		color: var(--muted);
	}
	.name {
		color: var(--fg);
	}
	.tag {
		font-size: var(--step-caption);
		letter-spacing: var(--tracking-caption);
		text-transform: uppercase;
		color: var(--accent);
		border: 1px solid currentColor;
		padding: 0.1rem 0.45rem;
		border-radius: 2px;
	}
	@media (min-width: 64rem) {
		.quotes {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
</style>
