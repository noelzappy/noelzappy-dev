<script lang="ts">
	import SEOHead from '$lib/components/seo-head.svelte';
	import CalEmbed from '$lib/components/cal-embed.svelte';
	import Hero from '$lib/components/hero.svelte';
	import {
		HomepageStructuredData,
		SITE_DESCRIPTION,
		SITE_KEYWORDS,
		SITE_TITLE
	} from '$lib/shared/constants';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<CalEmbed />
<SEOHead
	title={SITE_TITLE}
	description={SITE_DESCRIPTION}
	canonical="https://noelzappy.dev"
	keywords={SITE_KEYWORDS.join(', ')}
	structuredData={HomepageStructuredData}
/>

<Hero
	pills={data.pills}
	headline="I design and build software products, end to end."
	intro="I'm an independent product engineer. I design and build mobile apps, web platforms and the systems behind them — and ship them to production for startups and businesses."
/>
