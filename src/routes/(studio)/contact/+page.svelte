<script lang="ts">
	import SEOHead from '$lib/components/seo-head.svelte';
	import PageHeader from '$lib/components/page-header.svelte';
	import Section from '$lib/components/section.svelte';
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
	description="Get in touch about a product you need built, a team that needs a senior engineer, or a system that needs fixing."
	canonical="https://noelzappy.dev/contact"
	{structuredData}
/>

<PageHeader
	title="Get in touch"
	intro="Tell me what you're building. Email is best, or book a short call."
/>

<Section label="Email">
	<p class="big"><a href="mailto:me@noelzappy.dev">me@noelzappy.dev</a></p>
</Section>

<Section label="Book a call">
	<p class="line">
		If you'd rather talk, <CalButton
			eventSlug={CAL_EVENTS.intro}
			label="book a free 15-minute intro call"
		/>. Time zones are detected automatically.
	</p>
</Section>

<style>
	p {
		margin: 0;
	}
	.big {
		font-size: var(--step-display-m);
		line-height: var(--lh-display-m);
		letter-spacing: var(--tracking-display-m);
		font-weight: var(--weight-display-m);
		overflow-wrap: anywhere;
	}
	.big a {
		color: var(--fg);
		text-decoration: none;
	}
	.big a:hover {
		color: var(--accent);
	}
	.line {
		max-width: 52ch;
		color: var(--muted);
		font-size: var(--step-body);
		line-height: var(--lh-body);
	}
</style>
