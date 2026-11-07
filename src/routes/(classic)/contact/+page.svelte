<script lang="ts">
	import SEOHead from '$lib/components/seo-head.svelte';
	import CalButton from '$lib/components/CalButton.svelte';
	import CalEmbed from '$lib/components/cal-embed.svelte';
	import { CAL_EVENTS } from '$lib/cal.js';

	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'ContactPage',
		mainEntity: {
			'@type': 'Person',
			name: 'Emmanuel Yeboah',
			url: 'https://noelzappy.dev',
			email: 'me@noelzappy.dev',
			jobTitle: 'Product Engineer'
		}
	};
</script>

<CalEmbed />
<SEOHead
	title="Contact"
	description="Building something that moves money? Email Emmanuel Yeboah or book a 15-minute call."
	canonical="https://noelzappy.dev/contact"
	{structuredData}
/>

<section class="section contact">
	<h1>Contact</h1>
	<p>
		Email is best: <a href="mailto:me@noelzappy.dev">me@noelzappy.dev</a>.
	</p>
	<p>
		If you'd rather talk, <CalButton
			eventSlug={CAL_EVENTS.intro}
			label="book a free 15-minute intro call"
		/>. Time zones are detected automatically.
	</p>
</section>

<style>
	.contact p {
		margin: 0;
	}
</style>
