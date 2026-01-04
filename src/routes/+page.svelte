<script lang="ts">
	import { HomepageStructuredData } from '$lib/shared/constants';
	import Newsletter from '$lib/components/newsletter.svelte';
	import SEOHead from '$lib/components/seo-head.svelte';
	import type { PageData } from './$types';
	import GhContributions from '$lib/components/gh-contributions.svelte';
	import Experiences from '$lib/components/experiences.svelte';
	import PinnedRepos from '$lib/components/pinned-repos.svelte';
	import Expertise from '$lib/components/expertise.svelte';
	import ProjectCard from '$lib/components/project-card.svelte';
	import NoteCard from '$lib/components/note-card.svelte';
	import { ArrowRight } from 'lucide-svelte';

	let { data }: { data: PageData } = $props();
</script>

<SEOHead
	title="Noel Zappy - Senior Software Engineer | Portfolio"
	description="Emmanuel Noel Zappy Yeboah is a senior software engineer with 6+ years of experience in web, mobile, and cloud development. Specializing in Python, TypeScript, React, and scalable architectures."
	canonical="https://noelzappy.dev"
	ogType="website"
	keywords="Noel Zappy, Emmanuel Yeboah, Software Engineer, Web Developer, Mobile Developer, Portfolio, Full-Stack Developer, React, Node.js, Svelte, SvelteKit, JavaScript, TypeScript, Python, Go, Java, AWS, GCP, Azure, Docker, Kubernetes"
	structuredData={HomepageStructuredData}
/>

<main class="space-y-30">
	<section class="flex flex-col gap-6">
		<div class="flex flex-col gap-3">
			<h1 class="text-4xl font-semibold tracking-tight text-neutral-100 sm:text-5xl">
				Hi, I'm Emmanuel 👋
			</h1>
			<p class="text-lg text-neutral-300 font-light">
				Software Engineer & Product Builder • {new Date().getFullYear() - 2020}+ years building
				reliable systems
			</p>
		</div>
		<div class="flex flex-col gap-5 text-base leading-relaxed text-neutral-300">
			<p>
				I build web and mobile applications that actually hold up in the real world. I specialize in
				performance, clean architecture, and user flows that work—even in environments with strict
				constraints.
			</p>
			<p>
				I’ve founded and scaled fintech SaaS products, owning systems from the first line of code to
				thousands of daily users.
			</p>
		</div>
		<div class="flex flex-wrap items-center gap-6 pt-4">
			<a
				href="/contact"
				class="group inline-flex items-center gap-2 justify-center rounded-lg border border-neutral-600 bg-neutral-800/50 px-4 py-2 text-sm font-medium text-neutral-100 hover:bg-orange-500/80 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 focus:ring-offset-neutral-900 transition-all"
			>
				<span>Get in Touch</span>
				<ArrowRight class="w-4 h-4 transition-transform group-hover:translate-x-1" />
			</a>
			<div class="flex items-center gap-6">
				<a
					href="https://www.linkedin.com/in/noelzappy"
					target="_blank"
					rel="noopener noreferrer"
					class="text-neutral-400 hover:text-orange-500 transition-colors"
					aria-label="LinkedIn"
				>
					<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
						/>
					</svg>
				</a>
				<a
					href="https://x.com/noelzappy"
					target="_blank"
					rel="noopener noreferrer"
					class="text-neutral-400 hover:text-orange-500 transition-colors"
					aria-label="X (Twitter)"
				>
					<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
						/>
					</svg>
				</a>
				<a
					href="mailto:noelzappy@gmail.com"
					class="text-neutral-400 hover:text-orange-500 transition-colors"
					aria-label="Email"
				>
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<rect x="2" y="4" width="20" height="16" rx="2" />
						<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
					</svg>
				</a>
				<a
					href="https://github.com/noelzappy"
					target="_blank"
					rel="noopener noreferrer"
					class="text-neutral-400 hover:text-orange-500 transition-colors"
					aria-label="GitHub"
				>
					<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
						/>
					</svg>
				</a>
			</div>
		</div>
	</section>

	<section class="flex flex-col gap-6">
		<div class="flex items-center justify-between">
			<h2 class="text-xl font-semibold text-neutral-100">My Projects</h2>
			<a
				href="/projects"
				class="group flex items-center gap-1 text-sm text-neutral-400 hover:text-orange-500 transition-colors"
			>
				View all (20+)
				<span
					class="material-symbols-outlined text-base transition-transform group-hover:translate-x-1"
				>
					arrow_forward
				</span>
			</a>
		</div>

		{#await data.streamed.projects}
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				{#each Array(4) as _, _idx (_idx)}
					<div
						class="flex flex-col rounded-xl overflow-hidden border border-neutral-700/50 bg-neutral-800/20"
					>
						<div class="aspect-video w-full bg-neutral-800/40 animate-pulse"></div>
						<div class="flex flex-col gap-3 p-5">
							<div class="h-5 bg-neutral-700 rounded w-2/3 animate-pulse"></div>
							<div class="h-3 bg-neutral-700 rounded w-1/3 animate-pulse"></div>
							<div class="space-y-2">
								<div class="h-3 bg-neutral-700 rounded w-full animate-pulse"></div>
								<div class="h-3 bg-neutral-700 rounded w-4/5 animate-pulse"></div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:then projects}
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				{#each projects as project (project.slug)}
					<ProjectCard {project} />
				{/each}
			</div>
		{/await}
	</section>

	<section>
		<div class="flex items-center justify-between mb-6">
			<h2 class="text-xl font-semibold text-neutral-100">Experiences</h2>
			<div class="flex items-center gap-4">
				<a
					href="https://www.linkedin.com/in/noelzappy/"
					class="group flex items-center gap-1 text-sm text-neutral-400 hover:text-orange-500 transition-colors"
					target="_blank"
					rel="noopener noreferrer"
				>
					View on LinkedIn
					<span
						class="material-symbols-outlined text-base transition-transform group-hover:translate-x-1"
					>
						arrow_forward
					</span>
				</a>
			</div>
		</div>

		<div>
			<Experiences />
		</div>
	</section>

	<section class="flex flex-col gap-5">
		<Expertise />
	</section>

	<section class="flex flex-col gap-6">
		<div class="flex items-center justify-between">
			<h2 class="text-xl font-semibold text-neutral-100">Latest Notes</h2>
			<a
				href="/notes"
				class="group flex items-center gap-1 text-sm text-neutral-400 hover:text-orange-500 transition-colors"
			>
				View all
				<span
					class="material-symbols-outlined text-base transition-transform group-hover:translate-x-1"
				>
					arrow_forward
				</span>
			</a>
		</div>
		<div class="grid grid-cols-1 gap-4">
			{#await data.streamed.notes}
				<div class="flex flex-col gap-3 w-full">
					{#each Array(3) as _, _i (_i)}
						<div
							class="relative rounded-xl p-5 sm:p-6 bg-neutral-800/20 hover:bg-neutral-800/30 overflow-hidden"
						>
							<div class="absolute left-0 top-0 bottom-0 w-1 bg-neutral-700/40"></div>
							<div class="flex items-center gap-4">
								<div class="flex-1">
									<div class="h-5 bg-neutral-700 rounded w-1/2 mb-2 animate-pulse"></div>
									<div class="h-3 bg-neutral-700 rounded w-3/4 animate-pulse"></div>
								</div>
								<div class="w-6 h-6 bg-neutral-700 rounded animate-pulse"></div>
							</div>
						</div>
					{/each}
				</div>
			{:then notes}
				{#each notes as note (note.slug)}
					<NoteCard {note} />
				{/each}
			{/await}
		</div>
	</section>
	<Newsletter />

	<section>
		<div class="flex items-center justify-between mb-6">
			<h2 class="text-xl font-semibold text-neutral-100">GitHub Contributions</h2>
			<div class="flex items-center gap-4">
				<a
					href="https://github.com/noelzappy"
					class="group flex items-center gap-1 text-sm text-neutral-400 hover:text-orange-500 transition-colors"
					target="_blank"
					rel="noopener noreferrer"
				>
					View Contributions
					<span
						class="material-symbols-outlined text-base transition-transform group-hover:translate-x-1"
					>
						arrow_forward
					</span>
				</a>
			</div>
		</div>

		<div>
			<GhContributions />
		</div>
	</section>

	<section>
		<PinnedRepos />
	</section>
</main>
