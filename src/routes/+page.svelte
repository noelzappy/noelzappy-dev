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
	<div class="flex items-center gap-4 pt-2">
		<a
			href="https://github.com/noelzappy"
			target="_blank"
			rel="noopener noreferrer"
			class="group flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
			aria-label="GitHub"
		>
			<span class="material-symbols-outlined text-xl">code</span>
			<span class="hidden sm:inline">GitHub</span>
		</a>
		<a
			href="https://www.linkedin.com/in/noelzappy"
			target="_blank"
			rel="noopener noreferrer"
			class="group flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
			aria-label="LinkedIn"
		>
			<span class="material-symbols-outlined text-xl">work</span>
			<span class="hidden sm:inline">LinkedIn</span>
		</a>
		<a
			href="https://x.com/noelzappy"
			target="_blank"
			rel="noopener noreferrer"
			class="group flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
			aria-label="Twitter/X"
		>
			<span class="material-symbols-outlined text-xl">tag</span>
			<span class="hidden sm:inline">X (Twitter)</span>
		</a>
		<a
			href="mailto:noelzappy@gmail.com"
			class="group flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
			aria-label="Email"
		>
			<span class="material-symbols-outlined text-xl">mail</span>
			<span class="hidden sm:inline">Email</span>
		</a>
	</div>
</section>
<Newsletter />
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
	<div class="grid grid-cols-1 gap-3">
		{#each data.posts as project (project.slug)}
			<a
				href={`/projects/${project.slug}`}
				class="group flex items-start gap-4 p-4 rounded-lg border border-neutral-700 bg-neutral-800/20 hover:bg-neutral-800/40 hover:border-neutral-600 transition-all duration-300"
				data-sveltekit-preload-data
			>
				<div class="w-20 h-20 flex-shrink-0">
					<div
						class="w-full h-full rounded-lg overflow-hidden bg-neutral-800 border border-neutral-700"
					>
						<img
							src={project.featureImage}
							alt={project.title}
							class="w-full h-full object-cover"
							loading="lazy"
						/>
					</div>
				</div>
				<div class="flex flex-col gap-2 flex-1 min-w-0">
					<h3
						class="text-base font-medium text-neutral-100 group-hover:text-white transition-colors"
					>
						{project.title}
					</h3>
					{#if project.excerpt}
						<p class="text-sm text-neutral-400 line-clamp-2 leading-relaxed">
							{project.excerpt}
						</p>
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
