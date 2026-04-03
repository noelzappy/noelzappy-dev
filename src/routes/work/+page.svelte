<script lang="ts">
	import SEOHead from '$lib/components/seo-head.svelte';
	import SectionLabel from '$lib/components/section-label.svelte';
	import { ArrowRight } from 'lucide-svelte';
	import { inView } from '$lib/actions/inView';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		name: 'Work — Emmanuel Yeboah',
		description:
			'A curated collection of fintech, SaaS, and enterprise systems built by Emmanuel Yeboah.',
		url: 'https://noelzappy.dev/work',
		author: {
			'@type': 'Person',
			name: 'Emmanuel Noel Zappy Yeboah',
			url: 'https://noelzappy.dev'
		}
	};
</script>

<SEOHead
	title="Work"
	description="A curated collection spanning fintech, SaaS, and enterprise systems. See how Emmanuel Yeboah has built products that serve thousands of users across Africa."
	canonical="https://noelzappy.dev/work"
	ogType="website"
	keywords="Portfolio, Fintech Projects, SaaS, Backend Engineering, Emmanuel Yeboah, Ghana"
	{structuredData}
/>

<div class="flex flex-col gap-0 py-16 sm:py-24">
	<!-- Page hero -->
	<div class="flex flex-col gap-4 pb-16 sm:pb-20 border-b border-[var(--color-border)]">
		<SectionLabel text="// work" />
		<h1
			class="text-4xl sm:text-5xl font-bold text-[var(--color-text-primary)] mt-2"
			style="font-family: var(--font-display);"
		>
			Work that moved the needle.
		</h1>
		<p class="text-lg text-[var(--color-text-secondary)] max-w-2xl">
			A curated collection spanning fintech, SaaS, and enterprise systems.
		</p>
	</div>

	<!-- TIER 1: Featured Work -->
	{#if data.featuredProjects.length > 0}
		<div class="py-16">
			<div class="flex flex-col gap-3 mb-10">
				<SectionLabel text="// featured work" />
				<h2
					class="text-2xl font-bold text-[var(--color-text-primary)]"
					style="font-family: var(--font-display);"
					use:inView
					class:fade-up={true}
				>
					Featured Projects
				</h2>
			</div>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-children" use:inView>
				{#each data.featuredProjects as project (project.slug)}
					<a
						href="/work/{project.slug}"
						class="project-card group flex flex-col"
						data-sveltekit-preload-data
					>
						<div class="aspect-video w-full overflow-hidden bg-[var(--color-surface)] relative">
							{#if project.featuredImage}
								<img
									src={project.featuredImage}
									alt={project.title}
									class="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
									style="filter: brightness(0.85) contrast(1.05);"
									loading="lazy"
								/>
								<div
									class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none group-hover:opacity-50 transition-opacity duration-300"
								></div>
							{:else}
								<div
									class="w-full h-full bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface-hover)]"
								></div>
							{/if}
							{#if project.status}
								<div class="absolute top-3 left-3">
									<span
										class="px-2.5 py-1 text-xs font-bold rounded-full {project.status.toLowerCase() ===
										'shipped'
											? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
											: 'bg-orange-500/20 text-orange-400 border border-orange-500/30'}"
									>
										{project.status}
									</span>
								</div>
							{/if}
						</div>
						<div class="p-6 flex flex-col gap-4 flex-1">
							<div>
								<h3
									class="text-lg font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors"
									style="font-family: var(--font-display);"
								>
									{project.title}
								</h3>
								{#if project.role}
									<p
										class="text-xs text-[var(--color-text-secondary)] mt-1 uppercase tracking-wider"
									>
										{project.role}{project.client ? ` · ${project.client}` : ''}
									</p>
								{/if}
							</div>

							{#if project.stats && project.stats.length > 0}
								<div>
									<p class="card-metric">{project.stats[0].value}</p>
									<p class="card-metric-label">{project.stats[0].key}</p>
								</div>
							{/if}

							{#if project.excerpt}
								<p
									class="text-sm text-[var(--color-text-secondary)] line-clamp-2 leading-relaxed flex-1"
								>
									{project.excerpt}
								</p>
							{/if}

							{#if project.featuredStack?.length}
								<div class="flex flex-wrap gap-1.5">
									{#each project.featuredStack.slice(0, 4) as tech (tech)}
										<span
											class="px-2 py-0.5 text-xs rounded bg-[var(--color-surface-hover)] text-neutral-400 border border-[var(--color-border)]"
										>
											{tech}
										</span>
									{/each}
								</div>
							{/if}

							<span class="btn-text mt-auto">
								View Case Study <ArrowRight
									class="w-3.5 h-3.5 transition-transform group-hover:translate-x-1"
								/>
							</span>
						</div>
					</a>
				{/each}
			</div>
		</div>
	{/if}

	<!-- TIER 2: Other Projects -->
	{#if data.otherProjects.length > 0}
		<div class="py-16 border-t border-[var(--color-border)]">
			<div class="flex flex-col gap-3 mb-10">
				<SectionLabel text="// more projects" />
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children" use:inView>
				{#each data.otherProjects as project (project.slug)}
					<a
						href="/work/{project.slug}"
						class="project-card group p-5 flex flex-col gap-3"
						data-sveltekit-preload-data
					>
						<div class="flex items-start justify-between gap-2">
							<h3
								class="font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors text-sm"
								style="font-family: var(--font-display);"
							>
								{project.title}
							</h3>
							{#if project.status}
								<span
									class="shrink-0 px-2 py-0.5 text-xs font-bold rounded-full {project.status.toLowerCase() ===
									'shipped'
										? 'bg-emerald-500/10 text-emerald-400'
										: 'bg-orange-500/10 text-orange-400'}"
								>
									{project.status}
								</span>
							{/if}
						</div>
						{#if project.excerpt}
							<p
								class="text-xs text-[var(--color-text-secondary)] line-clamp-2 leading-relaxed flex-1"
							>
								{project.excerpt}
							</p>
						{/if}
						{#if project.featuredStack?.length}
							<div class="flex flex-wrap gap-1">
								{#each project.featuredStack.slice(0, 3) as tech (tech)}
									<span
										class="px-1.5 py-0.5 text-xs rounded bg-[var(--color-surface-hover)] text-neutral-500 border border-[var(--color-border)]"
									>
										{tech}
									</span>
								{/each}
							</div>
						{/if}
						<span class="btn-text text-xs mt-auto">
							View <ArrowRight class="w-3 h-3" />
						</span>
					</a>
				{/each}
			</div>
		</div>
	{/if}

	{#if data.featuredProjects.length === 0 && data.otherProjects.length === 0}
		<div class="py-24 text-center">
			<p class="text-[var(--color-text-secondary)]">No projects found.</p>
		</div>
	{/if}
</div>
