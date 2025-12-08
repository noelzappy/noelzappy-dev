<script lang="ts">
	import SEOHead from '$lib/components/seo-head.svelte';
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
	<div class="flex flex-col gap-2">
		<h1 class="text-3xl font-medium tracking-tight text-neutral-100 sm:text-4xl">
			Projects Showcase
		</h1>

		<div class="flex flex-col gap-6 text-base leading-7 text-neutral-400">
			<p>
				A selection of projects from over the years of professional experience, focusing on clean,
				performant, and user-centric solutions.
			</p>
		</div>
	</div>

	{#if data.projects.length > 0}
		<div class="flex flex-col">
			{#each data.projects as project (project.id)}
				<a
					href={`/projects/${project.slug}`}
					class="group grid grid-cols-12 gap-x-4 gap-y-2 py-6 border-b border-gray-800"
					data-sveltekit-preload-data
				>
					<div class="col-span-12 md:col-span-2 flex items-start">
						<div
							class="w-full aspect-square rounded-lg overflow-hidden bg-neutral-800 border border-neutral-700 flex items-center justify-center group-hover:border-neutral-600 transition-colors"
						>
							<img
								src={project.featureImage}
								alt={project.type}
								class="w-full h-full object-cover"
								loading="lazy"
							/>
						</div>
					</div>
					<div class="col-span-12 md:col-span-10 flex flex-col gap-3">
						<h3
							class="text-lg font-semibold text-white group-hover:text-neutral-200 transition-colors"
						>
							{project.title}
						</h3>

						{#if project.excerpt}
							<p class="text-gray-400 text-base leading-relaxed">
								{project.excerpt}
							</p>
						{/if}

						<div class="flex items-center gap-x-2">
							<span
								class="inline-flex items-center text-sm font-medium text-neutral-400 group-hover:text-white transition-colors"
							>
								View Project
								<span
									class="material-symbols-outlined text-base ml-1 transition-transform group-hover:translate-x-1"
								>
									arrow_right_alt
								</span>
							</span>
						</div>
					</div>
				</a>
			{/each}
		</div>

		<!-- Pagination -->
		{#if data.pagination.pages > 1}
			<div class="flex items-center justify-between border-t border-neutral-800 pt-8">
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
