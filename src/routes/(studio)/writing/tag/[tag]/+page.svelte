<script lang="ts">
	import SEOHead from '$lib/components/seo-head.svelte';
	import PageHeader from '$lib/components/page-header.svelte';
	import Section from '$lib/components/section.svelte';
	import PostRows from '$lib/components/post-rows.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<SEOHead
	title="Writing tagged “{data.tag}”"
	description="Posts by Emmanuel Yeboah tagged {data.tag}."
	canonical="https://noelzappy.dev/writing/tag/{data.tag}"
/>

<PageHeader eyebrow="Tag" title={data.tag} />

<Section label="Posts">
	<PostRows posts={data.posts} />
	<a class="back" href="/writing">← All writing</a>
</Section>

<style>
	.back {
		justify-self: start;
		color: var(--muted);
		text-decoration: none;
	}
	.back:hover {
		color: var(--accent);
	}
</style>
