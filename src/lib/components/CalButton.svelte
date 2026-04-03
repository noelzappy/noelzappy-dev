<script lang="ts">
	import { CAL_USERNAME } from '$lib/cal.js';

	interface Props {
		eventSlug: string;
		label?: string;
		variant?: 'primary' | 'secondary' | 'text';
	}

	let { eventSlug, label = 'Book →', variant = 'text' }: Props = $props();

	const calConfig = JSON.stringify({ layout: 'month_view', theme: 'dark' });
</script>

<button
	class="btn-{variant}"
	data-cal-link="{CAL_USERNAME}/{eventSlug}"
	data-cal-config={calConfig}
>
	{label}
</button>
