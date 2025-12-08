<script lang="ts">
	import { Expertise, HomepageStructuredData } from '$lib/shared/constants';
	import Newsletter from '$lib/components/newsletter.svelte';
	import SEOHead from '$lib/components/seo-head.svelte';
	import type { PageData } from './$types';

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

<section class="flex flex-col gap-6">
	<div class="flex flex-col gap-3">
		<h1 class="text-4xl font-semibold tracking-tight text-neutral-100 sm:text-5xl">
			Hi, I'm Emmanuel 👋
		</h1>
		<p class="text-lg text-neutral-300 font-light">
			Senior Software Engineer • 6+ years building reliable systems
		</p>
	</div>
	<div class="flex flex-col gap-5 text-base leading-relaxed text-neutral-300">
		<p>
			I specialize in building modern web and mobile applications with a focus on performance,
			scalability, and user experience. My journey in tech has been driven by curiosity and a
			passion for solving complex problems with elegant solutions.
		</p>
		<p>
			From fintech platforms to SaaS products, I've delivered production systems that serve
			thousands of users daily. I thrive in environments where quality code meets real-world impact.
		</p>
	</div>
	<div class="flex items-center gap-6 pt-2">
		<a
			href="https://www.linkedin.com/in/noelzappy"
			target="_blank"
			rel="noopener noreferrer"
			class="text-neutral-400 hover:text-white transition-colors"
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
			class="text-neutral-400 hover:text-white transition-colors"
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
			class="text-neutral-400 hover:text-white transition-colors"
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
			class="text-neutral-400 hover:text-white transition-colors"
			aria-label="GitHub"
		>
			<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
				<path
					d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
				/>
			</svg>
		</a>
	</div>
</section>

<section class="flex flex-col gap-4">
	<div class="flex items-center justify-between">
		<h2 class="text-xl font-semibold text-neutral-100">Featured Projects</h2>
		<a
			href="/projects"
			class="group flex items-center gap-1 text-sm text-neutral-400 hover:text-white transition-colors"
		>
			View all
			<span
				class="material-symbols-outlined text-base transition-transform group-hover:translate-x-1"
			>
				arrow_forward
			</span>
		</a>
	</div>
	<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
		{#each data.posts as project (project.slug)}
			<a
				href={`/projects/${project.slug}`}
				class="group flex flex-col gap-4 p-6 rounded-lg border border-neutral-700 bg-neutral-800/20 hover:bg-neutral-800/40 hover:border-neutral-600 transition-all duration-300 min-h-[200px]"
				data-sveltekit-preload-data
			>
				<div class="flex-1 flex flex-col gap-3">
					<h3
						class="text-lg font-semibold text-neutral-100 group-hover:text-white transition-colors"
					>
						{project.title}
					</h3>
					{#if project.excerpt}
						<p class="text-sm text-neutral-400 line-clamp-3 leading-relaxed">
							{project.excerpt}
						</p>
					{/if}
				</div>
				<div class="flex items-center justify-between">
					<span class="text-xs text-neutral-500 uppercase tracking-wide">View Project</span>
					<span
						class="material-symbols-outlined text-xl text-neutral-500 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white"
					>
						arrow_forward
					</span>
				</div>
			</a>
		{/each}
	</div>
</section>
<section class="flex flex-col gap-5">
	<h2 class="text-xl font-semibold text-neutral-100">Core Expertise</h2>
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
		{#each Expertise as skill (skill.name)}
			<div
				class="group flex flex-col gap-2 border border-neutral-700 bg-neutral-800/20 p-4 rounded-lg transition-all duration-300 hover:bg-neutral-800/40 hover:border-neutral-600 hover:shadow-lg hover:shadow-neutral-900/30"
			>
				<h3
					class="font-semibold text-base text-neutral-100 group-hover:text-white transition-colors"
				>
					{skill.name}
				</h3>
				<p class="text-sm text-neutral-400 leading-relaxed">{skill.details}</p>
			</div>
		{/each}
	</div>
</section>
<Newsletter />
<section class="flex flex-col gap-4">
	<div class="flex items-center justify-between">
		<h2 class="text-xl font-semibold text-neutral-100">Latest Notes</h2>
		<a
			href="/notes"
			class="group flex items-center gap-1 text-sm text-neutral-400 hover:text-white transition-colors"
		>
			View all
			<span
				class="material-symbols-outlined text-base transition-transform group-hover:translate-x-1"
			>
				arrow_forward
			</span>
		</a>
	</div>
	<div class="grid grid-cols-1 gap-3">
		{#each data.notes as note (note.slug)}
			<a
				class="group flex items-start justify-between gap-4 p-4 rounded-lg border border-neutral-700 bg-neutral-800/20 hover:bg-neutral-800/40 hover:border-neutral-600 transition-all duration-300"
				href={`/notes/${note.slug}`}
				data-sveltekit-preload-data
			>
				<div class="flex flex-col gap-2 flex-1 min-w-0">
					<span
						class="text-base font-medium text-neutral-100 group-hover:text-white transition-colors"
					>
						{note.title}
					</span>
					{#if note.excerpt}
						<span class="text-sm text-neutral-400 line-clamp-2 leading-relaxed">
							{note.excerpt}
						</span>
					{/if}
				</div>
				<span
					class="material-symbols-outlined text-xl text-neutral-500 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white shrink-0"
				>
					arrow_forward
				</span>
			</a>
		{/each}
	</div>
</section>
