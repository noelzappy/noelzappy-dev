<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import SEOHead from '$lib/components/seo-head.svelte';
	import SectionLabel from '$lib/components/section-label.svelte';
	import CTABand from '$lib/components/cta-band.svelte';
	import { ArrowRight } from 'lucide-svelte';
	import { inView } from '$lib/actions/inView';

	let { data }: { data: PageData } = $props();

	let contentElement: HTMLDivElement;

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('en-US', {
			month: 'short',
			year: 'numeric'
		});
	}

	function getStatusStyle(status: string) {
		switch (status.toLowerCase()) {
			case 'shipped':
				return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
			case 'in progress':
				return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
			default:
				return 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30';
		}
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
		'@type': 'Article',
		headline: data.project.title,
		description: data.project.excerpt,
		image: data.project.featuredImage || 'https://noelzappy.dev/og-image.png',
		datePublished: data.project.publishedAt,
		author: {
			'@type': 'Person',
			name: 'Emmanuel Noel Zappy Yeboah',
			url: 'https://noelzappy.dev'
		}
	});
</script>

<SEOHead
	title={data.project.title || 'Project — Noel Zappy'}
	description={data.project.excerpt || 'Project by Emmanuel Noel Zappy Yeboah'}
	canonical={`https://noelzappy.dev/work/${data.project.slug}`}
	ogType="article"
	ogImage={data.project.featuredImage || 'https://noelzappy.dev/og-image.png'}
	publishedTime={data.project.publishedAt || ''}
	{structuredData}
/>

<article class="flex flex-col gap-0 py-16 sm:py-20">
	<!-- Breadcrumb + navigation -->
	<div class="flex items-center justify-between mb-10">
		<nav
			class="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]"
			aria-label="Breadcrumb"
		>
			<a href="/" class="hover:text-[var(--color-accent)] transition-colors">Home</a>
			<span>/</span>
			<a href="/work" class="hover:text-[var(--color-accent)] transition-colors">Work</a>
			<span>/</span>
			<span class="text-[var(--color-text-primary)] truncate max-w-[200px]"
				>{data.project.title}</span
			>
		</nav>
		<div class="flex gap-3">
			{#if data.prevProject}
				<a
					href="/work/{data.prevProject.slug}"
					class="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors min-h-[44px] flex items-center"
					title="Previous: {data.prevProject.title}"
					data-sveltekit-preload-data
					aria-label="Previous project: {data.prevProject.title}"
				>
					<span class="material-symbols-outlined">arrow_back</span>
				</a>
			{:else}
				<span class="text-neutral-700 cursor-not-allowed flex items-center" aria-hidden="true">
					<span class="material-symbols-outlined">arrow_back</span>
				</span>
			{/if}
			{#if data.nextProject}
				<a
					href="/work/{data.nextProject.slug}"
					class="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors min-h-[44px] flex items-center"
					title="Next: {data.nextProject.title}"
					data-sveltekit-preload-data
					aria-label="Next project: {data.nextProject.title}"
				>
					<span class="material-symbols-outlined">arrow_forward</span>
				</a>
			{:else}
				<span class="text-neutral-700 cursor-not-allowed flex items-center" aria-hidden="true">
					<span class="material-symbols-outlined">arrow_forward</span>
				</span>
			{/if}
		</div>
	</div>

	<!-- Status badge -->
	{#if data.project.status}
		<div class="mb-5">
			<span
				class="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full border backdrop-blur-sm {getStatusStyle(data.project.status)}"
			>
				{#if data.project.status.toLowerCase() === 'shipped'}
					<span class="relative flex h-2 w-2">
						<span
							class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
						></span>
						<span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
					</span>
				{/if}
				{data.project.status}
			</span>
		</div>
	{/if}

	<!-- Title block -->
	<div class="flex flex-col gap-4 mb-8">
		<h1
			class="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--color-text-primary)] tracking-tight leading-tight"
			style="font-family: var(--font-display); font-weight: 800;"
		>
			{data.project.title}
		</h1>
		{#if data.project.excerpt}
			<p class="text-lg text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
				{data.project.excerpt}
			</p>
		{/if}
	</div>

	<!-- Action buttons -->
	<div class="flex flex-wrap gap-3 mb-10">
		{#if data.project.liveUrl}
			<a
				href={data.project.liveUrl}
				target="_blank"
				rel="noopener noreferrer"
				class="btn-primary text-sm"
			>
				<span class="material-symbols-outlined text-base">open_in_new</span>
				Live Site
			</a>
		{/if}
		{#if data.project.iosUrl}
			<a
				href={data.project.iosUrl}
				target="_blank"
				rel="noopener noreferrer"
				class="btn-secondary text-sm"
			>
				<span class="material-symbols-outlined text-base">phone_iphone</span> iOS
			</a>
		{/if}
		{#if data.project.androidUrl}
			<a
				href={data.project.androidUrl}
				target="_blank"
				rel="noopener noreferrer"
				class="btn-secondary text-sm"
			>
				<span class="material-symbols-outlined text-base">android</span> Android
			</a>
		{/if}
		{#if data.project.github}
			<a
				href={data.project.github}
				target="_blank"
				rel="noopener noreferrer"
				class="btn-secondary text-sm"
			>
				<span class="material-symbols-outlined text-base">code</span> Code
			</a>
		{/if}
	</div>

	<!-- Key metrics bar -->
	{#if data.project.stats?.length}
		<div
			class="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)] mb-10"
			use:inView
			class:fade-up={true}
		>
			{#each data.project.stats as stat, index (stat.key)}
				<div
					class="flex flex-col gap-1 {index > 0
						? 'sm:border-l sm:border-[var(--color-border)] sm:pl-6'
						: ''}"
				>
					<span class="card-metric">{stat.value}</span>
					<span class="card-metric-label">{stat.key}</span>
					{#if stat.description}
						<span class="text-xs text-neutral-600 mt-0.5">{stat.description}</span>
					{/if}
				</div>
			{/each}
		</div>
	{/if}

	<!-- Hero image -->
	{#if data.project.featuredImage}
		<div
			class="relative rounded-2xl overflow-hidden border border-[var(--color-border)] mb-12 group"
		>
			<img
				src={data.project.featuredImage}
				alt={data.project.title}
				class="project-image w-full h-auto max-h-[560px] object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
				loading="eager"
			/>
			<div
				class="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-black/20 group-hover:opacity-50 transition-opacity duration-300"
			></div>
		</div>
	{/if}

	<!-- Two-column layout: sidebar + content -->
	<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
		<!-- Left sidebar -->
		<aside class="lg:col-span-4 flex flex-col gap-6">
			<div
				class="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)] sticky top-24"
			>
				<h3
					class="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-widest mb-5"
					style="font-family: var(--font-mono);"
				>
					Project Info
				</h3>
				<div class="flex flex-col gap-4 text-sm">
					{#if data.project.role}
						<div class="grid grid-cols-[80px_1fr] gap-2">
							<span class="text-[var(--color-text-secondary)]">Role</span>
							<span class="text-[var(--color-text-primary)] font-medium">{data.project.role}</span>
						</div>
					{/if}
					<div class="grid grid-cols-[80px_1fr] gap-2">
						<span class="text-[var(--color-text-secondary)]">Timeline</span>
						<span class="text-[var(--color-text-primary)] font-medium"
							>{formatDate(data.project.publishedAt)}</span
						>
					</div>
					{#if data.project.status}
						<div class="grid grid-cols-[80px_1fr] gap-2">
							<span class="text-[var(--color-text-secondary)]">Status</span>
							<span
								class="font-bold {data.project.status.toLowerCase() === 'shipped'
									? 'text-emerald-400'
									: 'text-orange-400'}"
							>
								{data.project.status}
							</span>
						</div>
					{/if}
					{#if data.project.client}
						<div class="grid grid-cols-[80px_1fr] gap-2">
							<span class="text-[var(--color-text-secondary)]">Client</span>
							<span class="text-[var(--color-text-primary)] font-medium">{data.project.client}</span>
						</div>
					{/if}
					{#if data.project.categories?.length}
						<div class="grid grid-cols-[80px_1fr] gap-2">
							<span class="text-[var(--color-text-secondary)]">Type</span>
							<div class="flex flex-wrap gap-1">
								{#each data.project.categories as cat (cat)}
									<a
										href="/work?category={encodeURIComponent(cat)}"
										class="px-2 py-0.5 text-xs rounded bg-[var(--color-accent-muted)] text-[var(--color-accent)] border border-[var(--color-accent)]/20 hover:bg-[var(--color-accent)]/20 transition-colors"
									>
										{cat}
									</a>
								{/each}
							</div>
						</div>
					{/if}
				</div>

				{#if data.project.featuredStack?.length || data.project.stack?.length}
					<div class="border-t border-[var(--color-border)] mt-6 pt-6">
						<h3
							class="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-widest mb-4"
							style="font-family: var(--font-mono);"
						>
							Tech Stack
						</h3>
						{#if data.project.featuredStack?.length}
							<div class="flex flex-wrap gap-2 mb-3">
								{#each data.project.featuredStack as tech (tech)}
									<span
										class="px-2.5 py-1 text-xs font-semibold rounded-full bg-[var(--color-accent-muted)] text-[var(--color-accent)] border border-[var(--color-accent)]/20"
									>
										{tech}
									</span>
								{/each}
							</div>
						{/if}
						{#if data.project.stack?.length}
							<div class="flex flex-wrap gap-1.5">
								{#each data.project.stack as tech (tech)}
									<span
										class="px-2 py-0.5 text-xs rounded bg-[var(--color-surface-hover)] text-neutral-400 border border-[var(--color-border)]"
									>
										{tech}
									</span>
								{/each}
							</div>
						{/if}
					</div>
				{/if}
			</div>
		</aside>

		<!-- Main content -->
		<div class="lg:col-span-8 flex flex-col gap-10">
			<!-- The Problem section (if available) -->
			{#if data.project.problem}
				<div class="problem-section" use:inView class:fade-up={true}>
					<h2>// the problem</h2>
					<p>{data.project.problem}</p>
				</div>
			{/if}

			<!-- Main case study content -->
			<section>
				<div
					bind:this={contentElement}
					class="prose prose-invert max-w-none text-base leading-7 text-neutral-400 prose-headings:font-bold prose-headings:text-[var(--color-text-primary)] prose-a:text-[var(--color-accent)] prose-a:underline prose-a:underline-offset-2 hover:prose-a:text-[var(--color-accent-hover)] prose-strong:text-neutral-200 prose-code:text-neutral-300 prose-code:bg-[var(--color-surface)] prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-[var(--color-surface)] prose-pre:border prose-pre:border-[var(--color-border)] prose-img:rounded-xl prose-ul:list-disc prose-ol:list-decimal prose-li:marker:text-[var(--color-accent)]"
					style="--tw-prose-headings-font-family: var(--font-display);"
				>
					{@html data.project.html}
				</div>
			</section>

			<!-- Gallery -->
			{#if data.project.gallery?.length}
				<section>
					<h2
						class="text-xl font-bold text-[var(--color-text-primary)] mb-6"
						style="font-family: var(--font-display);"
					>
						Gallery
					</h2>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						{#each data.project.gallery as image, index (index)}
							<div
								class="group relative overflow-hidden rounded-xl bg-[var(--color-surface)] aspect-[4/3] {index ===
									data.project.gallery.length - 1 && data.project.gallery.length % 2 !== 0
									? 'md:col-span-2'
									: ''}"
							>
								<img
									src={image}
									alt="Gallery image {index + 1}"
									class="gallery-image object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
									loading="lazy"
								/>
								<div
									class="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-black/20 group-hover:opacity-50 transition-opacity duration-300"
								></div>
							</div>
						{/each}
					</div>
				</section>
			{/if}

			<!-- What I'd Do Differently (if available) -->
			{#if data.project.lessons}
				<div class="lessons-section" use:inView class:fade-up={true}>
					<h2>// retrospective</h2>
					<h3>What I'd Do Differently</h3>
					<p>{data.project.lessons}</p>
				</div>
			{/if}
		</div>
	</div>

	<!-- CTA band at bottom -->
	<div class="mt-16 sm:mt-24">
		<CTABand
			heading="Like what you see?"
			subheading="Let's build something together."
			primaryLabel="Book a Call →"
			primaryHref="/contact"
			secondaryLabel="See More Work"
			secondaryHref="/work"
			dark={true}
		/>
	</div>
</article>

<style>
	.project-image,
	.gallery-image {
		filter: brightness(0.85) contrast(1.05);
	}
	:global(.group:hover) .project-image,
	:global(.group:hover) .gallery-image {
		filter: brightness(1) contrast(1);
	}
</style>
