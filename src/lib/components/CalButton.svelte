<script lang="ts">
	import { CAL_USERNAME } from '$lib/cal.js';

	let { eventSlug, label = 'Book a call' }: { eventSlug: string; label?: string } = $props();

	const calConfig = JSON.stringify({ layout: 'month_view', theme: 'auto' });
</script>

<button
	type="button"
	class="cal-link"
	data-cal-link="{CAL_USERNAME}/{eventSlug}"
	data-cal-config={calConfig}
>
	{label}
</button>

<style>
	.cal-link {
		background: none;
		border: 0;
		padding: 0;
		font: inherit;
		color: var(--accent);
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 0.18em;
		cursor: pointer;
	}
</style>
