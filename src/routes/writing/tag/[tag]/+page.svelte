<script lang="ts">
	import SEOHead from '$lib/components/seo-head.svelte';
	import PostList from '$lib/components/post-list.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<SEOHead
	title="Writing tagged “{data.tag}”"
	description="Posts by Emmanuel Yeboah tagged {data.tag}."
	canonical="https://noelzappy.dev/writing/tag/{data.tag}"
/>

<section class="section">
	<h1>Tagged <span class="mono">{data.tag}</span></h1>
	<PostList posts={data.posts} showDescription />
	<a href="/writing" class="small">← All writing</a>
</section>
