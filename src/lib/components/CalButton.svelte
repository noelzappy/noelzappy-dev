<script lang="ts">
	import { CAL_USERNAME, calUrl, openCal } from '$lib/cal.js';

	let {
		eventSlug,
		label = 'Book a call',
		plain = false,
		arrow = false
	}: { eventSlug: string; label?: string; plain?: boolean; arrow?: boolean } = $props();

	const calLink = $derived(`${CAL_USERNAME}/${eventSlug}`);
	const config = { layout: 'month_view', theme: 'auto' };

	// Native listener (not Svelte's delegated one) so it stops the click before
	// the Cal embed's own document listener sees it: one popup, never two.
	// Without JS, before hydration, or when the embed cannot load, the link simply opens cal.com.
	function bookOnClick(node: HTMLAnchorElement) {
		const onClick = (event: MouseEvent) => {
			// Modified or non-primary clicks keep normal link behaviour (open cal.com in a new tab).
			if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
				return;
			if (!openCal(calLink, config)) return;
			event.preventDefault();
			event.stopPropagation();
		};
		node.addEventListener('click', onClick);
		return () => node.removeEventListener('click', onClick);
	}
</script>

<a
	href={calUrl(calLink)}
	target="_blank"
	rel="noopener noreferrer"
	class="cal-link"
	class:plain
	data-cal-link={calLink}
	data-cal-config={JSON.stringify(config)}
	{@attach bookOnClick}
>
	{label}{#if arrow}
		<span aria-hidden="true">→</span>{/if}
</a>

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
		display: inline-block;
		min-height: var(--tap-min);
		color: inherit;
		text-decoration: none;
		letter-spacing: inherit;
		text-align: start;
	}
</style>
