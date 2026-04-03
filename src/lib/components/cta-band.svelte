<script lang="ts">
	interface Props {
		heading: string;
		subheading: string;
		primaryLabel: string;
		primaryHref: string;
		primaryCalLink?: string;
		secondaryLabel?: string;
		secondaryHref?: string;
		dark?: boolean;
	}
	let {
		heading,
		subheading,
		primaryLabel,
		primaryHref,
		primaryCalLink,
		secondaryLabel,
		secondaryHref,
		dark = false
	}: Props = $props();

	const calConfig = JSON.stringify({ layout: 'month_view', theme: 'dark' });
</script>

<section
	class="rounded-2xl px-8 py-16 sm:px-16 sm:py-20 text-center {dark
		? 'bg-[var(--color-surface)]'
		: 'bg-[var(--color-accent)]'}"
>
	<h2
		class="text-3xl sm:text-4xl font-bold mb-4 {dark ? 'text-[var(--color-text-primary)]' : 'text-white'}"
	>
		{heading}
	</h2>
	<p class="text-lg mb-8 {dark ? 'text-[var(--color-text-secondary)]' : 'text-white/80'}">
		{subheading}
	</p>
	<div class="flex flex-wrap items-center justify-center gap-4">
		{#if primaryCalLink}
			<button
				data-cal-link={primaryCalLink}
				data-cal-config={calConfig}
				class="{dark ? 'btn-primary' : 'inline-flex items-center gap-2 px-6 py-3 bg-white text-[var(--color-accent)] font-semibold rounded-[6px] hover:bg-neutral-100 transition-all'}"
			>
				{primaryLabel}
			</button>
		{:else}
			<a
				href={primaryHref}
				class="{dark ? 'btn-primary' : 'inline-flex items-center gap-2 px-6 py-3 bg-white text-[var(--color-accent)] font-semibold rounded-[6px] hover:bg-neutral-100 transition-all'}"
			>
				{primaryLabel}
			</a>
		{/if}
		{#if secondaryLabel && secondaryHref}
			<a
				href={secondaryHref}
				class="{dark
					? 'btn-secondary'
					: 'inline-flex items-center gap-2 px-6 py-3 bg-transparent border border-white/50 text-white font-semibold rounded-[6px] hover:bg-white/10 transition-all'}"
			>
				{secondaryLabel}
			</a>
		{/if}
	</div>
</section>
