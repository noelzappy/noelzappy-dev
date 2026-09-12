<script lang="ts">
	import SEOHead from '$lib/components/seo-head.svelte';
	import ProjectList from '$lib/components/project-list.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		name: 'Projects — Emmanuel Yeboah',
		url: 'https://noelzappy.dev/projects',
		author: { '@type': 'Person', name: 'Emmanuel Yeboah', url: 'https://noelzappy.dev' }
	};
</script>

<SEOHead
	title="Projects"
	description="Systems Emmanuel Yeboah has built and open-source tools he maintains: backend platforms, migrations, and infrastructure."
	canonical="https://noelzappy.dev/projects"
	{structuredData}
/>

<section class="section">
	<h1>Projects</h1>
</section>

{#if data.openSource.length}
	<section class="section" aria-labelledby="oss-heading">
		<h2 id="oss-heading">Open source</h2>
		<ProjectList projects={data.openSource} />
	</section>
{/if}

{#if data.caseStudies.length}
	<section class="section" aria-labelledby="work-heading">
		<h2 id="work-heading">Client and product work</h2>
		<ProjectList projects={data.caseStudies} />
	</section>
{/if}
