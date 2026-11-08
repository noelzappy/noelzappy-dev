<script lang="ts">
	import SEOHead from '$lib/components/seo-head.svelte';
	import Section from '$lib/components/section.svelte';
	import { formatDate } from '$lib/shared/date';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

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
	<header class="head">
		<h1 class="page-title">{data.title}</h1>
	</header>

	<Section>
		{#snippet aside()}
			<p class="meta">
				<time datetime={data.date}>{formatDate(data.date, 'long')}</time>
				{#if data.tags.length}
					<span class="tags">
						{#each data.tags as tag (tag)}
							<a href="/writing/tag/{tag}">{tag}</a>
						{/each}
					</span>
				{/if}
			</p>
		{/snippet}
		<div class="prose">
			<data.component />
		</div>
	</Section>

	<Section>
		<nav class="adjacent" aria-label="More writing">
			{#if data.older}
				<a class="prev" rel="prev" href="/writing/{data.older.slug}" data-sveltekit-preload-data>
					<span class="dir">Previous</span>
					<span class="name">{data.older.title}</span>
				</a>
			{/if}
			{#if data.newer}
				<a class="next" rel="next" href="/writing/{data.newer.slug}" data-sveltekit-preload-data>
					<span class="dir">Next</span>
					<span class="name">{data.newer.title}</span>
				</a>
			{/if}
			<a class="all" href="/writing">← All writing</a>
		</nav>
	</Section>
</article>

<style>
	.head {
		max-width: var(--page-max);
		margin-inline: auto;
		padding-inline: var(--page-gutter);
		padding-top: calc(var(--header-h) + clamp(2rem, 6vw, 5rem));
		padding-bottom: clamp(2rem, 5vw, 4rem);
	}
	h1 {
		margin: 0;
		max-width: 13em;
		font-family: var(--font-display);
		font-size: var(--step-display-l);
		line-height: var(--lh-display-l);
		letter-spacing: var(--tracking-display-l);
		font-weight: var(--weight-display-l);
		color: var(--fg);
		text-wrap: balance;
	}
	.meta {
		display: grid;
		gap: 0.5rem;
		margin: 0;
		font-size: var(--step-small);
		line-height: var(--lh-small);
		color: var(--muted);
	}
	.tags {
		display: flex;
		flex-wrap: wrap;
	}
	.tags a + a::before {
		content: '·';
		margin-inline: 0.5em;
		color: var(--muted);
	}
	@media (min-width: 48rem) {
		.meta {
			position: sticky;
			top: calc(var(--header-h) + 1rem);
		}
	}
	.meta a {
		display: inline-flex;
		align-items: center;
		min-height: var(--tap-min);
		color: var(--muted);
		text-decoration: none;
	}
	.meta a:hover {
		color: var(--accent);
	}
	.prose {
		max-width: var(--measure);
		font-size: var(--step-body);
		line-height: var(--lh-body);
	}
	.prose :global(:where(h2, h3, h4)) {
		font-family: var(--font-display);
		color: var(--fg);
		font-weight: var(--weight-display-m);
		text-wrap: balance;
	}
	.prose :global(h2) {
		font-size: var(--step-display-m);
		line-height: var(--lh-display-m);
		letter-spacing: var(--tracking-display-m);
		margin-top: 2.5em;
		margin-bottom: 0.75em;
	}
	.prose :global(:is(h3, h4)) {
		font-size: var(--step-heading);
		line-height: var(--lh-heading);
		letter-spacing: var(--tracking-heading);
		font-weight: 500;
		margin-top: 2em;
		margin-bottom: 0.6em;
	}
	.adjacent {
		display: grid;
		gap: 2rem;
		grid-template-columns: minmax(0, 1fr);
	}
	.adjacent a {
		color: var(--fg);
		text-decoration: none;
		display: grid;
		gap: 0.35rem;
	}
	.dir {
		font-size: var(--step-caption);
		line-height: var(--lh-caption);
		letter-spacing: var(--tracking-caption);
		text-transform: uppercase;
		color: var(--muted);
	}
	.name {
		font-size: var(--step-heading);
		line-height: var(--lh-heading);
		letter-spacing: var(--tracking-heading);
	}
	.adjacent a:hover .name {
		color: var(--accent);
	}
	.all {
		display: flex;
		align-items: center;
		min-height: var(--tap-min);
		color: var(--muted);
	}
	@media (min-width: 48rem) {
		.adjacent {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.next {
			grid-column: 2;
			text-align: right;
		}
		.prev {
			grid-column: 1;
		}
		.all {
			grid-column: 1 / -1;
		}
	}
</style>
