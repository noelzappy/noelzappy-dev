<script lang="ts">
	import CaseStudy from '$lib/components/case-study.svelte';
	import SEOHead from '$lib/components/seo-head.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const structuredData = $derived({
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: data.title,
		description: data.excerpt,
		datePublished: data.publishedAt,
		url: `https://noelzappy.dev/projects/${data.slug}`,
		author: { '@type': 'Person', name: 'Emmanuel Yeboah', url: 'https://noelzappy.dev' }
	});
</script>

<SEOHead
	title={data.title}
	description={data.excerpt}
	canonical="https://noelzappy.dev/projects/{data.slug}"
	ogType="article"
	ogImage={data.featuredImage ? `https://noelzappy.dev${data.featuredImage}` : undefined}
	{structuredData}
/>

<CaseStudy {...data} />
