<script lang="ts">
	import { CAL_USERNAME, openCal } from '$lib/cal.js';

	let {
		eventSlug,
		label = 'Book a call',
		plain = false
	}: { eventSlug: string; label?: string; plain?: boolean } = $props();

	const calLink = $derived(`${CAL_USERNAME}/${eventSlug}`);
	const config = { layout: 'month_view', theme: 'auto' };

	// Native listener (not Svelte's delegated one) so it stops the click before
	// the Cal embed's own document listener sees it: one popup, never two.
	function bookOnClick(node: HTMLButtonElement) {
		const onClick = (event: MouseEvent) => {
			event.stopPropagation();
			openCal(calLink, config);
		};
		node.addEventListener('click', onClick);
		return () => node.removeEventListener('click', onClick);
	}
</script>

<button
	type="button"
	class="cal-link"
	class:plain
	data-cal-link={calLink}
	data-cal-config={JSON.stringify(config)}
	{@attach bookOnClick}
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
	.cal-link.plain {
		color: inherit;
		text-decoration: none;
		letter-spacing: inherit;
		text-align: start;
	}
</style>
