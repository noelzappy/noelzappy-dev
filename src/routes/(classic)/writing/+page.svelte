<script lang="ts">
	import SEOHead from '$lib/components/seo-head.svelte';
	import PostList from '$lib/components/post-list.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<SEOHead
	title="Writing"
	description="Notes on backend engineering, distributed systems, migrations, and the decisions behind them."
	canonical="https://noelzappy.dev/writing"
/>

<section class="section">
	<h1>Writing</h1>
	{#if data.tags.length}
		<div class="tags">
			{#each data.tags as { tag, count } (tag)}
				<a href="/writing/tag/{tag}" class="tag">{tag} · {count}</a>
			{/each}
		</div>
	{/if}
	<PostList posts={data.posts} showDescription />
</section>

<style>
	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
	}
</style>
