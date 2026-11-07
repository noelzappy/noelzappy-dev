<script lang="ts">
	import SEOHead from '$lib/components/seo-head.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const fmt = (d: string) =>
		new Date(d + 'T00:00:00Z').toLocaleDateString('en-GB', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			timeZone: 'UTC'
		});

	const structuredData = $derived({
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: data.title,
		description: data.description,
		datePublished: data.date,
		keywords: data.tags.join(', '),
		url: `https://noelzappy.dev/writing/${data.slug}`,
		author: { '@type': 'Person', name: 'Emmanuel Yeboah', url: 'https://noelzappy.dev' }
	});
</script>

<SEOHead
	title={data.title}
	description={data.description}
	canonical="https://noelzappy.dev/writing/{data.slug}"
	ogType="article"
	publishedTime={data.date}
	tags={data.tags}
	{structuredData}
/>

<article class="post">
	<header>
		<h1>{data.title}</h1>
		<p class="meta muted mono">
			<time datetime={data.date}>{fmt(data.date)}</time>
			{#each data.tags as tag (tag)}
				<a href="/writing/tag/{tag}" class="tag">{tag}</a>
			{/each}
		</p>
	</header>
	<div class="prose">
		<data.component />
	</div>
	<footer class="small">
		<a href="/writing">← All writing</a>
	</footer>
</article>

<style>
	.post {
		display: flex;
		flex-direction: column;
		gap: calc(var(--rhythm) * 5);
	}
	header {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	h1 {
		font-size: 2rem;
	}
	.meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
		margin: 0;
	}
	footer {
		border-top: 1px solid var(--border);
		padding-top: calc(var(--rhythm) * 3);
	}
</style>
