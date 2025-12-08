<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import SEOHead from '$lib/components/seo-head.svelte';

	let { data }: { data: PageData } = $props();

	let contentElement: HTMLDivElement;

	function formatDate(dateString: string) {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	onMount(() => {
		const links = contentElement.querySelectorAll('a');
		links.forEach((link) => {
			link.setAttribute('target', '_blank');
			link.setAttribute('rel', 'noopener noreferrer');
		});
	});

	const structuredData = $derived({
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: data.project.title,
		description: data.project.excerpt,
		image: data.project.featureImage || 'https://noelzappy.dev/og-image.png',
		datePublished: data.project.publishedAt,
		dateModified: data.project.updatedAt || data.project.publishedAt,
		author: {
			'@type': 'Person',
			name: 'Emmanuel Noel Zappy Yeboah',
			url: 'https://noelzappy.dev'
		},
		publisher: {
			'@type': 'Person',
			name: 'Emmanuel Noel Zappy Yeboah',
			url: 'https://noelzappy.dev'
		},
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': `https://noelzappy.dev/projects/${data.project.slug}`
		}
	});
</script>

<SEOHead
	title={data.project.title}
	description={data.project.excerpt}
	canonical={`https://noelzappy.dev/projects/${data.project.slug}`}
	ogType="article"
	ogImage={data.project.featureImage}
	publishedTime={data.project.publishedAt}
	modifiedTime={data.project.updatedAt}
	tags={data.project.tags}
	{structuredData}
/>

<article class="flex flex-col gap-8">
	<header class="flex flex-col gap-4">
		<h1 class="text-3xl font-medium tracking-tight text-neutral-100 sm:text-4xl">
			{data.project.title}
		</h1>
		<div class="flex items-center gap-4 text-sm text-neutral-400">
			<time dateTime={data.project.publishedAt}>
				{formatDate(data.project.publishedAt)}
			</time>
			{#if data.project.readingTime}
				<span>·</span>
				<span>{data.project.readingTime} min read</span>
			{/if}
		</div>
	</header>
	{#if data.project.featureImage}
		<div class="w-full aspect-video overflow-hidden rounded-lg border border-neutral-800">
			<img
				src={data.project.featureImage}
				alt={data.project.title}
				class="w-full h-full object-cover"
			/>
		</div>
	{/if}
	<div
		bind:this={contentElement}
		class="prose prose-invert max-w-none text-base leading-7 text-neutral-400 prose-headings:font-medium prose-headings:text-neutral-100 prose-a:text-neutral-100 prose-a:underline prose-a:underline-offset-2 hover:prose-a:text-white prose-strong:text-neutral-200 prose-code:text-neutral-300 prose-code:bg-neutral-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-neutral-900 prose-pre:border prose-pre:border-neutral-800 prose-img:rounded-lg prose-ul:list-disc prose-ol:list-decimal"
	>
		{@html data.project.html}
	</div>
	<footer class="border-t border-neutral-800 pt-8">
		<a
			href="/projects"
			class="inline-flex items-center text-sm font-medium text-neutral-400 hover:text-white transition-colors"
			data-sveltekit-preload-data
		>
			<span class="material-symbols-outlined text-base mr-1"> arrow_back </span>
			Back to all projects
		</a>
	</footer>
</article>
