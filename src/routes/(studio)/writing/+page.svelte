<script lang="ts">
	import SEOHead from '$lib/components/seo-head.svelte';
	import PageHeader from '$lib/components/page-header.svelte';
	import Section from '$lib/components/section.svelte';
	import PostRows from '$lib/components/post-rows.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<SEOHead
	title="Writing"
	description="Notes on backend engineering, distributed systems, migrations, and the decisions behind them."
	canonical="https://noelzappy.dev/writing"
/>

<PageHeader
	title="Writing"
	intro="Notes on backend engineering, distributed systems and migrations, and the decisions behind them."
/>

{#if data.tags.length}
	<Section label="Topics">
		<ul class="tags">
			{#each data.tags as { tag, count } (tag)}
				<li><a href="/writing/tag/{tag}">{tag} <span class="count">{count}</span></a></li>
			{/each}
		</ul>
	</Section>
{/if}

<Section label="All posts">
	<PostRows posts={data.posts} />
</Section>

<style>
	.tags {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1.75rem;
		font-size: var(--step-body);
	}
	.tags a {
		color: var(--fg);
		text-decoration: none;
	}
	.tags a:hover {
		color: var(--accent);
	}
	.count {
		color: var(--muted);
		font-size: var(--step-small);
		font-variant-numeric: tabular-nums;
	}
</style>
