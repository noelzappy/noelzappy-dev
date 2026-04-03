<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import SEOHead from '$lib/components/seo-head.svelte';
	import SectionLabel from '$lib/components/section-label.svelte';
	import Newsletter from '$lib/components/newsletter.svelte';

	let { data }: { data: PageData } = $props();

	let contentElement: HTMLDivElement;

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	onMount(() => {
		const links = contentElement?.querySelectorAll('a');
		links?.forEach((link) => {
			link.setAttribute('target', '_blank');
			link.setAttribute('rel', 'noopener noreferrer');
		});
	});

	const structuredData = $derived({
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: data.post.title,
		description: data.post.excerpt,
		image: data.post.featureImage || 'https://noelzappy.dev/og-image.png',
		datePublished: data.post.publishedAt,
		dateModified: data.post.updatedAt || data.post.publishedAt,
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
			'@id': `https://noelzappy.dev/notes/${data.post.slug}`
		}
	});
</script>

<SEOHead
	title={data.post.title || 'Note — Noel Zappy'}
	description={data.post.excerpt || 'Note by Emmanuel Noel Zappy Yeboah'}
	canonical={`https://noelzappy.dev/notes/${data.post.slug}`}
	ogType="article"
	ogImage={data.post.featureImage || 'https://noelzappy.dev/og-image.png'}
	publishedTime={data.post.publishedAt || ''}
	modifiedTime={data.post.updatedAt || ''}
	{structuredData}
/>

<article class="flex flex-col gap-0 py-16 sm:py-20 max-w-2xl mx-auto w-full">
	<!-- Back link -->
	<div class="mb-10">
		<a
			href="/notes"
			class="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
			data-sveltekit-preload-data
		>
			<span class="material-symbols-outlined text-base">arrow_back</span>
			All notes
		</a>
	</div>

	<header class="flex flex-col gap-5 mb-10 pb-10 border-b border-[var(--color-border)]">
		<!-- Tags -->
		{#if data.post.tags && data.post.tags.length > 0}
			<div class="flex flex-wrap gap-2">
				{#each data.post.tags as tag (tag)}
					<span class="section-label px-2 py-0.5 bg-[var(--color-accent-muted)] rounded text-xs">
						{tag}
					</span>
				{/each}
			</div>
		{/if}

		<h1 class="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] leading-snug">
			{data.post.title}
		</h1>
		<div class="flex items-center gap-4 text-sm text-[var(--color-text-secondary)]">
			{#if data.post.publishedAt}
				<time datetime={data.post.publishedAt}>
					{formatDate(data.post.publishedAt)}
				</time>
			{/if}
			{#if data.post.readingTime}
				<span>·</span>
				<span>{data.post.readingTime} min read</span>
			{/if}
		</div>
	</header>

	<!-- Post content -->
	<div
		bind:this={contentElement}
		class="prose prose-invert max-w-none text-base leading-7 text-neutral-400 prose-headings:font-bold prose-headings:text-[var(--color-text-primary)] prose-a:text-[var(--color-accent)] prose-a:underline prose-a:underline-offset-2 hover:prose-a:text-[var(--color-accent-hover)] prose-strong:text-neutral-200 prose-code:text-neutral-300 prose-code:bg-[var(--color-surface)] prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-[var(--color-surface)] prose-pre:border prose-pre:border-[var(--color-border)] prose-img:rounded-xl"
	>
		{@html data.post.html}
	</div>

	<!-- Related notes CTA -->
	<div class="mt-16 border-t border-[var(--color-border)] pt-10">
		<SectionLabel text="// keep reading" class="mb-4" />
		<a
			href="/notes"
			class="inline-flex items-center gap-2 text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] font-medium transition-colors"
			data-sveltekit-preload-data
		>
			<span class="material-symbols-outlined text-base">article</span>
			Browse all notes
		</a>
	</div>

	<!-- Newsletter -->
	<div class="mt-10">
		<Newsletter
			title="Enjoy this note? Subscribe for more."
			description="Architecture, fintech, and building for African markets — straight to your inbox."
		/>
	</div>
</article>
