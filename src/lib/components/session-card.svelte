<script lang="ts">
	import CalButton from '$lib/components/CalButton.svelte';

	interface Props {
		title: string;
		duration: string;
		price: string;
		description: string;
		bookHref?: string;
		eventSlug?: string;
	}
	let { title, duration, price, description, bookHref = '/contact', eventSlug }: Props = $props();
</script>

<div class="card p-6 flex flex-col gap-4">
	<div class="flex items-start justify-between gap-4">
		<div>
			<h3
				class="text-base font-semibold text-[var(--color-text-primary)]"
				style="font-family: var(--font-display);"
			>
				{title}
			</h3>
			<p class="text-xs text-[var(--color-text-secondary)] mt-1" style="font-family: var(--font-mono);">
				{duration}
			</p>
		</div>
		<span
			class="text-2xl font-bold text-[var(--color-accent)] shrink-0"
			style="font-family: var(--font-display);">{price}</span
		>
	</div>
	<p class="text-sm text-[var(--color-text-secondary)] leading-relaxed flex-1">{description}</p>
	{#if eventSlug}
		<CalButton {eventSlug} label="Book →" variant="text" />
	{:else}
		<a href={bookHref} class="btn-text text-sm mt-auto">
			Book →
		</a>
	{/if}
</div>
