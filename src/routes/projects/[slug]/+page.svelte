<script lang="ts">
	import SEOHead from '$lib/components/seo-head.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const year = (d: string) => new Date(d).getUTCFullYear();

	const structuredData = $derived({
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: data.title,
		description: data.excerpt,
		datePublished: data.publishedAt,
		url: `https://noelzappy.dev/projects/${data.slug}`,
		author: { '@type': 'Person', name: 'Emmanuel Yeboah', url: 'https://noelzappy.dev' }
	});

	const meta = $derived(
		[data.role, data.client, data.publishedAt ? String(year(data.publishedAt)) : '', data.status]
			.filter(Boolean)
			.join(' · ')
	);
</script>

<SEOHead
	title={data.title}
	description={data.excerpt}
	canonical="https://noelzappy.dev/projects/{data.slug}"
	ogType="article"
	ogImage={data.featuredImage ? `https://noelzappy.dev${data.featuredImage}` : undefined}
	{structuredData}
/>

<article class="project">
	<header>
		<h1>{data.title}</h1>
		{#if meta}<p class="muted mono">{meta}</p>{/if}
		<p class="links small">
			{#if data.liveUrl}<a href={data.liveUrl} rel="noopener noreferrer">live</a>{/if}
			{#if data.github}<a href={data.github} rel="noopener noreferrer">repo</a>{/if}
			{#if data.iosUrl}<a href={data.iosUrl} rel="noopener noreferrer">iOS</a>{/if}
			{#if data.androidUrl}<a href={data.androidUrl} rel="noopener noreferrer">Android</a>{/if}
		</p>
		{#if data.stack.length}
			<p class="stack">
				{#each data.stack as item (item)}<span class="tag">{item}</span>{/each}
			</p>
		{/if}
	</header>

	{#if data.problem}
		<section class="section">
			<h2>The problem</h2>
			<p>{data.problem}</p>
		</section>
	{/if}

	<div class="prose">
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- project bodies are authored HTML in the repo -->
		{@html data.html}
	</div>

	{#if data.lessons}
		<section class="section">
			<h2>What I'd do differently</h2>
			<p>{data.lessons}</p>
		</section>
	{/if}

	{#if data.gallery.length}
		<section class="section gallery">
			{#each data.gallery as src, i (src)}
				<img {src} alt="{data.title} screenshot {i + 1}" loading="lazy" />
			{/each}
		</section>
	{/if}

	<footer class="small">
		<a href="/projects">← All projects</a>
	</footer>
</article>

<style>
	.project {
		display: flex;
		flex-direction: column;
		gap: calc(var(--rhythm) * 5);
	}
	header {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}
	h1 {
		font-size: 2rem;
	}
	header p,
	.section p {
		margin: 0;
	}
	.links {
		display: flex;
		gap: 1rem;
	}
	.stack {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
	}
	.gallery img {
		width: 100%;
		border: 1px solid var(--border);
		border-radius: 0.5rem;
	}
	footer {
		border-top: 1px solid var(--border);
		padding-top: calc(var(--rhythm) * 3);
	}
</style>
