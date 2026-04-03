<script lang="ts">
	import SEOHead from '$lib/components/seo-head.svelte';
	import SectionLabel from '$lib/components/section-label.svelte';
	import CTABand from '$lib/components/cta-band.svelte';
	import { ArrowRight } from 'lucide-svelte';
	import { inView } from '$lib/actions/inView';
	import type { PageData } from './$types';
	import { HomepageStructuredData } from '$lib/shared/constants';
	import { CAL_USERNAME, CAL_EVENTS } from '$lib/cal.js';

	let { data }: { data: PageData } = $props();
</script>

<SEOHead
	title="Emmanuel Yeboah — Backend Engineer for African Fintech"
	description="6+ years architecting reliable financial systems across Ghana and Africa. Co-founder of SusuPaa. Builder of Voltax. Available for backend engineering and consulting."
	canonical="https://noelzappy.dev"
	ogType="website"
	keywords="Emmanuel Yeboah, Noel Zappy, Backend Engineer, African Fintech, SusuPaa, Ghana Software Engineer, Fintech Architecture, Mobile Money Integration"
	structuredData={HomepageStructuredData}
/>

<!-- ─── HERO ─────────────────────────────────────────────────────────────── -->
<section class="min-h-screen flex flex-col justify-center py-12">
	<div class="flex flex-col gap-8 max-w-4xl">
		<h1 class="hero-headline text-[var(--color-text-primary)]">
			I build the backend that<br class="hidden sm:block" />
			<span class="text-[var(--color-accent)]">African fintech</span> runs on.
		</h1>
		<p
			class="text-lg sm:text-xl text-[var(--color-text-secondary)] max-w-2xl leading-relaxed"
			style="font-family: var(--font-body);"
		>
			Full-stack engineer — backend, mobile, and web — with {new Date().getFullYear() - 2020}+ years
			shipping products that handle real African money. <br />Co-founder of
			<a href="https://susupaa.com" class="text-white" rel="noopener noreferrer" target="_blank"
				>SusuPaa</a
			>. Builder of Voltax, the open-source African payments SDK.
		</p>
		<div class="flex flex-wrap gap-4 pt-2">
			<a href="/services" class="btn-primary">
				Work With Me <ArrowRight class="w-4 h-4" />
			</a>
			<a href="/work" class="btn-secondary">See My Work</a>
		</div>
	</div>
</section>

<!-- ─── SOCIAL PROOF BAR ─────────────────────────────────────────────────── -->
<section
	class="py-8 px-6 sm:px-10 border-t border-b border-[var(--color-border)] bg-[var(--color-surface)]"
	use:inView
	class:fade-up={true}
>
	<div
		class="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center sm:divide-x sm:divide-[var(--color-border)]"
	>
		<div class="flex flex-col gap-1 sm:px-4">
			<span class="card-metric">$45k+</span>
			<span class="card-metric-label">Monthly Volume</span>
		</div>
		<div class="flex flex-col gap-1 sm:px-4">
			<span class="card-metric">170k</span>
			<span class="card-metric-label">Users Migrated</span>
		</div>
		<div class="flex flex-col gap-1 sm:px-4">
			<span class="card-metric">15+</span>
			<span class="card-metric-label">Shipped Products</span>
		</div>
		<div class="flex flex-col gap-1 sm:px-4">
			<span class="card-metric">{new Date().getFullYear() - 2020}+</span>
			<span class="card-metric-label">Years Experience</span>
		</div>
	</div>
</section>

<!-- ─── TWO WAYS TO WORK ─────────────────────────────────────────────────── -->
<section class="section-pad border-t border-[var(--color-border)]">
	<div class="flex flex-col gap-3 mb-12">
		<SectionLabel text="// how we can work together" />
		<h2 class="section-headline text-[var(--color-text-primary)]" use:inView class:fade-up={true}>
			Two ways to work with me.
		</h2>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-children" use:inView>
		<!-- Card 1: Build With Me -->
		<div class="card p-8 flex flex-col gap-6">
			<div class="flex flex-col gap-3">
				<span class="text-3xl text-[var(--color-accent)]" style="font-family: var(--font-mono);"
					>&#123; &#125;</span
				>
				<div>
					<h3 class="text-2xl text-[var(--color-text-primary)]">Build With Me</h3>
					<p class="text-sm text-[var(--color-accent)] mt-1 font-medium">
						Your engineering partner.
					</p>
				</div>
			</div>
			<p class="text-[var(--color-text-secondary)] leading-relaxed">
				For companies building fintech products, SaaS platforms, or anything that needs to handle
				real scale in African markets.
			</p>

			<a href="/services" class="btn-text mt-auto">
				Learn more <ArrowRight class="w-3.5 h-3.5" />
			</a>
		</div>

		<!-- Card 2: Think With Me -->
		<div class="card p-8 flex flex-col gap-6">
			<div class="flex flex-col gap-3">
				<span class="text-3xl text-[var(--color-accent)]" style="font-family: var(--font-mono);"
					>&gt;_</span
				>
				<div>
					<h3 class="text-2xl text-[var(--color-text-primary)]">Think With Me</h3>
					<p class="text-sm text-[var(--color-accent)] mt-1 font-medium">
						Focused consulting sessions.
					</p>
				</div>
			</div>
			<p class="text-[var(--color-text-secondary)] leading-relaxed">
				For teams who need senior engineering eyes on their stack without a full hire. Architecture
				reviews, code audits, technical strategy.
			</p>

			<a href="/contact" class="btn-text mt-auto">
				Book a session <ArrowRight class="w-3.5 h-3.5" />
			</a>
		</div>
	</div>
</section>

<!-- ─── SELECTED WORK ────────────────────────────────────────────────────── -->
<section class="section-pad border-t border-[var(--color-border)]">
	<div class="flex items-end justify-between gap-4 mb-12">
		<div class="flex flex-col gap-3">
			<SectionLabel text="// selected work" />
			<h2 class="section-headline text-[var(--color-text-primary)]" use:inView class:fade-up={true}>
				Work that moved the needle.
			</h2>
		</div>
		<a href="/work" class="btn-text hidden sm:inline-flex shrink-0">
			View all work <ArrowRight class="w-3.5 h-3.5" />
		</a>
	</div>

	{#if data.projects.length > 0}
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-children" use:inView>
			{#each data.projects as project (project.slug)}
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
								<p class="text-xs text-[var(--color-text-secondary)] mt-1 uppercase tracking-wider">
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
	{/if}

	<div class="mt-8 sm:hidden">
		<a href="/work" class="btn-secondary w-full justify-center"> View all work → </a>
	</div>
</section>

<!-- ─── FEATURED NOTE ────────────────────────────────────────────────────── -->
<section class="section-pad border-t border-[var(--color-border)]">
	<div class="flex flex-col gap-3 mb-10">
		<SectionLabel text="// latest thinking" />
	</div>

	{#await data.streamed.featuredNotes}
		<div class="flex flex-col gap-4">
			{#each [1, 2, 3] as i (i)}
				<div class="card p-6 animate-pulse">
					<div class="h-3 bg-[var(--color-surface-hover)] rounded w-1/4 mb-4"></div>
					<div class="h-5 bg-[var(--color-surface-hover)] rounded w-2/3 mb-3"></div>
					<div class="h-4 bg-[var(--color-surface-hover)] rounded w-full mb-2"></div>
					<div class="h-4 bg-[var(--color-surface-hover)] rounded w-4/5"></div>
				</div>
			{/each}
		</div>
	{:then notes}
		{#if notes.length > 0}
			<div class="flex flex-col gap-4 stagger-children" use:inView>
				{#each notes as note (note.slug)}
					<a
						href="/notes/{note.slug}"
						class="project-card group p-6 sm:p-8 flex flex-col gap-3"
						data-sveltekit-preload-data
					>
						<div
							class="flex items-center gap-3 text-xs"
							style="color: var(--color-text-secondary); font-family: var(--font-mono);"
						>
							{#if note.published_at}
								<time datetime={note.published_at}>
									{new Date(note.published_at).toLocaleDateString('en-US', {
										year: 'numeric',
										month: 'long',
										day: 'numeric'
									})}
								</time>
							{/if}
							{#if note.reading_time}
								<span>·</span>
								<span>{note.reading_time} min read</span>
							{/if}
						</div>
						<h3
							class="text-lg font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors leading-snug"
							style="font-family: var(--font-display);"
						>
							{note.title}
						</h3>
						{#if note.excerpt}
							<p class="text-sm text-[var(--color-text-secondary)] leading-relaxed line-clamp-2">
								{note.excerpt}
							</p>
						{/if}
						<span class="btn-text mt-2">
							Read more <ArrowRight
								class="w-3.5 h-3.5 transition-transform group-hover:translate-x-1"
							/>
						</span>
					</a>
				{/each}
			</div>
			<div class="mt-6">
				<a href="/notes" class="btn-text">
					View all notes <ArrowRight class="w-3.5 h-3.5" />
				</a>
			</div>
		{:else}
			<a
				href="/notes"
				class="project-card group p-6 sm:p-8 flex flex-col gap-3"
				data-sveltekit-preload-data
			>
				<h3
					class="text-xl font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors"
					style="font-family: var(--font-display);"
				>
					Thoughts on software, systems, and building for Africa.
				</h3>
				<p class="text-[var(--color-text-secondary)]">
					Architecture decisions, fintech lessons, and the occasional opinion.
				</p>
				<span class="btn-text">
					Read the notes <ArrowRight class="w-3.5 h-3.5" />
				</span>
			</a>
		{/if}
	{/await}
</section>

<!-- ─── CTA BAND ─────────────────────────────────────────────────────────── -->
<section class="pb-24 pt-4">
	<CTABand
		heading="Building something that needs to actually work?"
		subheading="Let's talk about your backend."
		primaryLabel="Book a Free Intro Call →"
		primaryHref="/contact"
		primaryCalLink="{CAL_USERNAME}/{CAL_EVENTS.intro}"
	/>
</section>
