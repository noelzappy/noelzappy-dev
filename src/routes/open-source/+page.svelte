<script lang="ts">
	import { Github, Star, GitFork, ExternalLink } from 'lucide-svelte';
	import GhContributions from '$lib/components/gh-contributions.svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const repos = $derived(data?.repos || []);

	const githubUsername = 'noelzappy';

	function formatNumber(num: number): string {
		if (num >= 1000) {
			return (num / 1000).toFixed(1) + 'k';
		}
		return num.toString();
	}
</script>

<svelte:head>
	<title>Open Source | Emmanuel Noel Zappy</title>
	<meta name="description" content="My open source projects and contributions on GitHub" />
</svelte:head>

<div>
	<div class="flex flex-col gap-6">
		<div class="flex flex-col gap-3">
			<h1 class="text-4xl font-semibold tracking-tight text-neutral-100 sm:text-5xl">
				Open Source
			</h1>
			<p class="text-lg text-neutral-300 font-light">
				A collection of my open source projects. Feel free to explore, contribute, or use them in
				your own work.
			</p>
		</div>
	</div>
	<div class="py-8 mb-10">
		<GhContributions />
	</div>

	<section>
		<div class="mb-8 flex items-center justify-between">
			<h2 class="text-2xl font-bold">Featured Projects</h2>
			<a
				href="https://github.com/{githubUsername}?tab=repositories"
				target="_blank"
				rel="noopener noreferrer"
				class="group flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900/50 px-4 py-2 text-sm font-medium transition-all hover:border-orange-500/50 hover:bg-neutral-800"
			>
				<Github class="h-4 w-4" />
				<span>View All Repos</span>
				<ExternalLink class="h-3 w-3 transition-opacity group-hover:opacity-100" />
			</a>
		</div>

		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each repos as repo (repo.url)}
				<a
					href={repo.url}
					target="_blank"
					rel="noopener noreferrer"
					class="group relative flex flex-col rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 transition-all duration-300 hover:bg-neutral-800/40 hover:border-orange-500"
				>
					<div class="mb-3 flex items-start justify-between">
						<div class="flex items-center gap-2">
							<Github class="h-5 w-5 text-neutral-400 transition-colors group-hover:text-white" />
							<h3 class="font-semibold transition-colors group-hover:text-white">
								{repo.name}
							</h3>
						</div>
						<ExternalLink
							class="h-4 w-4 text-neutral-600 opacity-0 transition-all group-hover:text-neutral-400 group-hover:opacity-100"
						/>
					</div>

					<p class="mb-4 flex-1 text-sm text-neutral-400 line-clamp-2">
						{repo.description || 'No description available'}
					</p>

					<div class="flex items-center justify-between">
						{#if repo.primaryLanguage}
							<div class="flex items-center gap-2">
								<span
									class="h-3 w-3 rounded-full"
									style="background-color: {repo.primaryLanguage.color}"
								></span>
								<span class="text-xs text-neutral-500">{repo.primaryLanguage.name}</span>
							</div>
						{:else}
							<div></div>
						{/if}

						<div class="flex items-center gap-4 text-xs text-neutral-500">
							<div class="flex items-center gap-1">
								<Star class="h-3.5 w-3.5" />
								<span>{formatNumber(repo.stargazerCount)}</span>
							</div>
							<div class="flex items-center gap-1">
								<GitFork class="h-3.5 w-3.5" />
								<span>{formatNumber(repo.forkCount)}</span>
							</div>
						</div>
					</div>
				</a>
			{/each}
		</div>
	</section>

	<section class="mt-16">
		<div class="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-8 text-center">
			<h3 class="mb-3 text-xl font-semibold">Want to Collaborate?</h3>
			<p class="mb-6 text-neutral-400">
				I'm always open to interesting projects and collaborations. Let's build something amazing
				together.
			</p>
			<div class="flex flex-wrap items-center justify-center gap-4">
				<a
					href="https://github.com/{githubUsername}"
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-medium text-neutral-900 transition-all hover:bg-neutral-200"
				>
					<Github class="h-5 w-5" />
					Follow on GitHub
				</a>
				<a
					href="/contact"
					class="inline-flex items-center gap-2 rounded-lg border border-neutral-700 px-6 py-3 font-medium transition-all hover:border-orange-500 hover:text-orange-400"
				>
					Get in Touch
				</a>
			</div>
		</div>
	</section>
</div>
