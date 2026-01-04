<script lang="ts">
	import SEOHead from '$lib/components/seo-head.svelte';
	import ProjectCard from '$lib/components/project-card.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		name: 'Projects Showcase',
		description:
			'A selection of projects from over the years of professional experience, focusing on clean, performant, and user-centric solutions.',
		url: 'https://noelzappy.dev/projects',
		author: {
			'@type': 'Person',
			name: 'Emmanuel Noel Zappy Yeboah',
			url: 'https://noelzappy.dev'
		}
	};

	function getCategoryIcon(category: string) {
		switch (category) {
			case 'Mobile App':
				return 'phone_iphone';
			case 'Web App':
				return 'web';
			case 'Website':
				return 'language';
			default:
				return 'folder';
		}
	}
</script>

<SEOHead
	title="Projects Showcase"
	description="Explore Emmanuel Noel Zappy Yeboah's portfolio of web and mobile applications across fintech, SaaS, and enterprise solutions. Clean, performant, and user-centric projects."
	canonical="https://noelzappy.dev/projects"
	ogType="website"
	keywords="Software Projects, Web Development Portfolio, Mobile Apps, Fintech Projects, SaaS Solutions, Full-Stack Projects"
	{structuredData}
/>

<div class="flex flex-col gap-12 sm:gap-16">
	<div class="flex flex-col gap-6">
		<div class="flex flex-col gap-3">
			<h1 class="text-4xl font-semibold tracking-tight text-neutral-100 sm:text-5xl">Projects</h1>
			<p class="text-lg text-neutral-300 font-light">
				A curated collection of work spanning fintech, SaaS, and enterprise solutions
			</p>
		</div>

		<!-- Category Filter -->
		<div class="flex flex-wrap gap-2">
			<a
				href="/projects"
				class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-all {!data.activeCategory
					? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
					: 'bg-neutral-800/50 text-neutral-400 border-neutral-700/50 hover:border-neutral-600 hover:text-neutral-300'}"
				data-sveltekit-preload-data
			>
				<span class="material-symbols-outlined text-base">apps</span>
				All
			</a>
			{#each data.categories as category (category)}
				<a
					href="/projects?category={encodeURIComponent(category)}"
					class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-all {data.activeCategory ===
					category
						? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
						: 'bg-neutral-800/50 text-neutral-400 border-neutral-700/50 hover:border-neutral-600 hover:text-neutral-300'}"
					data-sveltekit-preload-data
				>
					<span class="material-symbols-outlined text-base">{getCategoryIcon(category)}</span>
					{category}
				</a>
			{/each}
		</div>
	</div>

	{#if data.projects.length > 0}
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			{#each data.projects as project (project.slug)}
				<ProjectCard {project} />
			{/each}
		</div>

		<!-- Pagination -->
		{#if data.pagination.pages > 1}
			<div class="flex items-center justify-between border-t border-neutral-500 pt-8">
				<div class="flex gap-6">
					{#if data.pagination.prev}
						<a
							href={`/projects?page=${data.pagination.prev}`}
							class="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
							data-sveltekit-preload-data
						>
							← Previous
						</a>
					{:else}
						<span class="text-sm font-medium text-neutral-600 cursor-not-allowed">
							← Previous
						</span>
					{/if}

					{#if data.pagination.next}
						<a
							href={`/projects?page=${data.pagination.next}`}
							class="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
							data-sveltekit-preload-data
						>
							Next →
						</a>
					{:else}
						<span class="text-sm font-medium text-neutral-600 cursor-not-allowed"> Next → </span>
					{/if}
				</div>

				<p class="text-sm text-neutral-400">
					Page {data.pagination.page} of {data.pagination.pages}
				</p>
			</div>
		{/if}
	{:else}
		<div class="flex flex-col items-center justify-center py-12 text-center">
			<p class="text-lg text-neutral-400">No projects found.</p>
			<p class="text-sm text-neutral-500 mt-2">Check back later for new content!</p>
		</div>
	{/if}
</div>
