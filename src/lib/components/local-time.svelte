<script lang="ts">
	import { onMount } from 'svelte';
	import { SITE_CITY, SITE_TZ } from '$lib/shared/site';
	import { formatLocalTime } from '$lib/shared/time';

	// Empty during SSR/prerender; filled on mount so prerendered HTML has no stale time.
	let time = $state('');

	onMount(() => {
		const update = () => (time = formatLocalTime(new Date(), SITE_TZ));
		update();
		const id = setInterval(update, 30_000);
		return () => clearInterval(id);
	});
</script>

<span class="local-time">{SITE_CITY} <time class="time">{time}</time></span>

<style>
	.time {
		display: inline-block;
		width: 9ch;
		font-variant-numeric: tabular-nums;
	}
</style>
