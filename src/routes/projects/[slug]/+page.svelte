<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import SEOHead from '$lib/components/seo-head.svelte';

	let { data }: { data: PageData } = $props();

	let contentElement: HTMLDivElement;

	function formatDate(dateString: string) {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			month: 'short',
			year: 'numeric'
		});
	}

	function getStatusColor(status: string) {
		switch (status.toLowerCase()) {
			case 'shipped':
				return 'text-emerald-500';
			case 'in progress':
				return 'text-orange-500';
			case 'cancelled':
				return 'text-red-500';
			case 'archived':
				return 'text-neutral-500';
			default:
				return 'text-neutral-400';
		}
	}

	function getStackColor(index: number) {
		const colors = [
			'bg-orange-500/10 text-orange-400 border-orange-500/20',
			'bg-amber-500/10 text-amber-400 border-amber-500/20',
			'bg-teal-500/10 text-teal-400 border-teal-500/20',
			'bg-purple-500/10 text-purple-400 border-purple-500/20',
			'bg-rose-500/10 text-rose-400 border-rose-500/20'
		];
		return colors[index % colors.length];
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
	title={data.project.title || 'Project by Noel Zappy'}
	description={data.project.excerpt || 'Project by Emmanuel Noel Zappy Yeboah'}
	canonical={`https://noelzappy.dev/projects/${data.project.slug}`}
	ogType="article"
	ogImage={data.project.featuredImage || 'https://noelzappy.dev/og-image.png'}
	publishedTime={data.project.publishedAt || ''}
	modifiedTime={data.project.updatedAt || ''}
	{structuredData}
/>

<div class="flex flex-col gap-8 -mt-8">
	<!-- Breadcrumbs & Quick Nav -->
	<div class="flex flex-wrap items-center justify-between gap-4">
		<div class="flex items-center gap-2 text-sm">
			<a
				href="/projects"
				class="text-neutral-500 hover:text-neutral-300 transition-colors"
				data-sveltekit-preload-data
			>
				Projects
			</a>
			<span class="material-symbols-outlined text-base text-neutral-600">chevron_right</span>
			<span class="text-neutral-200 font-medium truncate max-w-[200px]">{data.project.title}</span>
		</div>
		<div class="flex gap-3">
			{#if data.prevProject}
				<a
					href={`/projects/${data.prevProject?.slug}`}
					class="text-neutral-500 hover:text-neutral-200 transition-colors"
					title="Previous: {data.prevProject?.title}"
					data-sveltekit-preload-data
				>
					<span class="material-symbols-outlined">arrow_back</span>
				</a>
			{:else}
				<span class="text-neutral-700 cursor-not-allowed">
					<span class="material-symbols-outlined">arrow_back</span>
				</span>
			{/if}
			{#if data.nextProject}
				<a
					href={`/projects/${data.nextProject.slug}`}
					class="text-neutral-500 hover:text-neutral-200 transition-colors"
					title="Next: {data.nextProject.title}"
					data-sveltekit-preload-data
				>
					<span class="material-symbols-outlined">arrow_forward</span>
				</a>
			{:else}
				<span class="text-neutral-700 cursor-not-allowed">
					<span class="material-symbols-outlined">arrow_forward</span>
				</span>
			{/if}
		</div>
	</div>

	<!-- Hero Section -->
	<div
		class="relative rounded-2xl overflow-hidden bg-neutral-800/30 min-h-[400px] md:min-h-[480px] flex flex-col justify-end p-6 md:p-12 group border border-neutral-700/50"
	>
		<!-- Background Image -->
		{#if data.project.featuredImage}
			<div
				class="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
				style="background-image: url('{data.project.featuredImage}');"
			></div>
		{/if}
		<!-- Gradient Overlay -->
		<div
			class="absolute inset-0 z-10 bg-gradient-to-t from-neutral-900 via-neutral-900/80 to-transparent"
		></div>

		<!-- Content -->
		<div class="relative z-20 max-w-3xl flex flex-col gap-6">
			<div class="flex items-center gap-3">
				<div class="bg-white/10 backdrop-blur-md p-2 rounded-lg border border-white/10">
					<span class="material-symbols-outlined text-white text-2xl">rocket_launch</span>
				</div>
				<span
					class="text-orange-400 font-bold tracking-wider uppercase text-xs bg-orange-500/20 px-3 py-1 rounded-full border border-orange-500/20"
				>
					{data.project.status || 'Project'}
				</span>
			</div>

			<div>
				<h1 class="text-white text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3">
					{data.project.title}
				</h1>
				<p class="text-neutral-400 text-base md:text-lg font-normal max-w-xl leading-relaxed">
					{data.project.excerpt}
				</p>
			</div>

			<div class="flex flex-wrap gap-3 pt-2">
				{#if data.project.liveUrl}
					<a
						href={data.project.liveUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="flex items-center justify-center gap-2 h-11 px-5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold rounded-lg transition-all shadow-lg shadow-orange-600/25"
					>
						<span class="material-symbols-outlined text-lg">open_in_new</span>
						<span>Visit Live Site</span>
					</a>
				{/if}
				{#if data.project.iosUrl}
					<a
						href={data.project.iosUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="flex items-center justify-center gap-2 h-11 px-5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 text-white text-sm font-bold rounded-lg transition-all"
					>
						<span class="material-symbols-outlined text-lg">phone_iphone</span>
						<span>iOS App</span>
					</a>
				{/if}
				{#if data.project.androidUrl}
					<a
						href={data.project.androidUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="flex items-center justify-center gap-2 h-11 px-5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 text-white text-sm font-bold rounded-lg transition-all"
					>
						<span class="material-symbols-outlined text-lg">android</span>
						<span>Android App</span>
					</a>
				{/if}
				{#if data.project.github}
					<a
						href={data.project.github}
						target="_blank"
						rel="noopener noreferrer"
						class="flex items-center justify-center gap-2 h-11 px-5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 text-white text-sm font-bold rounded-lg transition-all"
					>
						<span class="material-symbols-outlined text-lg">code</span>
						<span>View Code</span>
					</a>
				{/if}
			</div>
		</div>
	</div>

	<!-- Main Grid Layout -->
	<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 pt-4">
		<!-- Left Sidebar (Metadata & Stack) -->
		<aside class="lg:col-span-4 flex flex-col gap-6 order-2 lg:order-1">
			<!-- Project Details Card -->
			<div class="bg-neutral-800/30 rounded-xl p-6 border border-neutral-700/50">
				<h3 class="text-base font-bold text-neutral-100 mb-5 flex items-center gap-2">
					<span class="material-symbols-outlined text-orange-400">info</span>
					Project Info
				</h3>
				<div class="flex flex-col gap-4">
					{#if data.project.role}
						<div class="grid grid-cols-[90px_1fr] items-baseline">
							<span class="text-neutral-500 text-sm font-medium">Role</span>
							<span class="text-neutral-200 text-sm font-semibold">{data.project.role}</span>
						</div>
						<div class="w-full h-px bg-neutral-700/50"></div>
					{/if}

					<div class="grid grid-cols-[90px_1fr] items-baseline">
						<span class="text-neutral-500 text-sm font-medium">Timeline</span>
						<span class="text-neutral-200 text-sm font-semibold"
							>{formatDate(data.project.publishedAt)}</span
						>
					</div>
					<div class="w-full h-px bg-neutral-700/50"></div>

					{#if data.project.team}
						<div class="grid grid-cols-[90px_1fr] items-baseline">
							<span class="text-neutral-500 text-sm font-medium">Team</span>
							<span class="text-neutral-200 text-sm font-semibold">{data.project.team}</span>
						</div>
						<div class="w-full h-px bg-neutral-700/50"></div>
					{/if}

					{#if data.project.status}
						<div class="grid grid-cols-[90px_1fr] items-baseline">
							<span class="text-neutral-500 text-sm font-medium">Status</span>
							<span
								class="flex items-center gap-2 text-sm font-bold {getStatusColor(
									data.project.status
								)}"
							>
								{#if data.project.status.toLowerCase() === 'shipped'}
									<span class="relative flex h-2 w-2">
										<span
											class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
										></span>
										<span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
									</span>
								{/if}
								{data.project.status}
							</span>
						</div>
						<div class="w-full h-px bg-neutral-700/50"></div>
					{/if}

					{#if data.project.client}
						<div class="grid grid-cols-[90px_1fr] items-baseline">
							<span class="text-neutral-500 text-sm font-medium">Client</span>
							<span class="text-neutral-200 text-sm font-semibold">{data.project.client}</span>
						</div>
					{/if}
				</div>
			</div>

			<!-- Tech Stack -->
			{#if data.project.featuredStack?.length || data.project.stack?.length}
				<div class="bg-neutral-800/30 rounded-xl p-6 border border-neutral-700/50">
					<h3 class="text-base font-bold text-neutral-100 mb-4 flex items-center gap-2">
						<span class="material-symbols-outlined text-orange-400">code</span>
						Tech Stack
					</h3>
					<div class="flex flex-col gap-4">
						{#if data.project.featuredStack?.length}
							<div>
								<p class="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
									Featured
								</p>
								<div class="flex flex-wrap gap-2">
									{#each data.project.featuredStack as tech, index (tech)}
										<span
											class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold border {getStackColor(
												index
											)}"
										>
											{tech}
										</span>
									{/each}
								</div>
							</div>
						{/if}
						{#if data.project.stack?.length}
							{#if data.project.featuredStack?.length}
								<div class="w-full h-px bg-neutral-700/50"></div>
							{/if}
							<div>
								<p class="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
									Full List
								</p>
								<div class="flex flex-wrap gap-2 text-sm text-neutral-300">
									{#each data.project.stack as tech (tech)}
										<span class="bg-neutral-700/50 px-2.5 py-1 rounded-md">{tech}</span>
									{/each}
								</div>
							</div>
						{/if}
					</div>
				</div>
			{/if}
		</aside>

		<!-- Right Content (Narrative & Gallery) -->
		<div class="lg:col-span-8 flex flex-col gap-10 order-1 lg:order-2">
			<!-- Stats Banner -->
			{#if data.project.stats?.length}
				<div
					class="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-neutral-800/30 rounded-xl p-6 border border-neutral-700/50"
				>
					{#each data.project.stats as stat, index (stat.key)}
						<div
							class="flex flex-col gap-1 p-2 {index > 0
								? 'sm:border-l border-neutral-700/50 sm:pl-6'
								: ''}"
						>
							<span class="text-3xl font-black text-orange-400">{stat.value}</span>
							<span class="text-sm font-medium text-neutral-500">{stat.key}</span>
							{#if stat.description}
								<span class="text-xs text-neutral-600">{stat.description}</span>
							{/if}
						</div>
					{/each}
				</div>
			{/if}

			<!-- Content Section -->
			<section>
				<h2 class="text-2xl font-bold text-neutral-100 mb-6">About This Project</h2>
				<div
					bind:this={contentElement}
					class="prose prose-invert max-w-none text-base leading-7 text-neutral-400 prose-headings:font-medium prose-headings:text-neutral-100 prose-a:text-orange-400 prose-a:underline prose-a:underline-offset-2 hover:prose-a:text-orange-300 prose-strong:text-neutral-200 prose-code:text-neutral-300 prose-code:bg-neutral-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-neutral-900 prose-pre:border prose-pre:border-neutral-800 prose-img:rounded-lg prose-ul:list-disc prose-ol:list-decimal prose-li:marker:text-orange-400"
				>
					{@html data.project.html}
				</div>
			</section>

			<!-- Gallery Section -->
			{#if data.project.gallery?.length}
				<section>
					<div class="flex items-center justify-between mb-6">
						<h2 class="text-2xl font-bold text-neutral-100">Gallery</h2>
					</div>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						{#each data.project.gallery as image, index (index)}
							<div
								class="group relative overflow-hidden rounded-xl bg-neutral-800 aspect-[4/3] cursor-pointer {index ===
									data.project.gallery.length - 1 && data.project.gallery.length % 2 !== 0
									? 'md:col-span-2'
									: ''}"
							>
								<img
									src={image}
									alt="Gallery image {index + 1}"
									class="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
									loading="lazy"
								/>
								<div
									class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
								>
									<span class="material-symbols-outlined text-white text-4xl">zoom_in</span>
								</div>
							</div>
						{/each}
					</div>
				</section>
			{/if}
		</div>
	</div>

	<!-- Bottom CTA -->
	<div class="py-10 border-t border-neutral-700/50 mt-6 text-center">
		<h2 class="text-xl font-bold text-neutral-100 mb-2">Like what you see?</h2>
		<p class="text-neutral-500 mb-6">
			Check out my other projects or get in touch for collaboration.
		</p>
		<div class="flex justify-center gap-4">
			<a
				href="/projects"
				class="flex items-center justify-center h-10 px-6 bg-transparent border border-neutral-700 hover:border-orange-500 text-neutral-200 hover:text-orange-400 rounded-lg transition-colors font-bold text-sm"
				data-sveltekit-preload-data
			>
				More Projects
			</a>
			<a
				href="/contact"
				class="flex items-center justify-center h-10 px-6 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors font-bold text-sm shadow-lg shadow-orange-600/20"
				data-sveltekit-preload-data
			>
				Contact Me
			</a>
		</div>
	</div>
</div>
