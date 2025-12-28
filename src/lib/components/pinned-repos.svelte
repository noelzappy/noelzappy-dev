<script lang="ts">
	import { onMount } from 'svelte';

	type Repository = {
		name: string;
		description: string;
		url: string;
		stargazerCount: number;
		forkCount: number;
		primaryLanguage: {
			name: string;
			color: string;
		} | null;
	};

	let repos: Repository[] = [];
	let loading = true;
	let error: string | null = null;

	onMount(async () => {
		try {
			const response = await fetch('/api/pinned-repos');
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Failed to fetch pinned repositories');
			}
			repos = await response.json();
		} catch (e: unknown) {
			if (e instanceof Error) {
				error = e.message;
			} else {
				error = 'An unknown error occurred while fetching repositories.';
			}
		} finally {
			loading = false;
		}
	});
</script>

<section class="flex flex-col gap-6">
	<h2 class="text-xl font-semibold text-neutral-100">Pinned Repositories</h2>
	{#if loading}
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each Array(6) as _, i (i)}
				<div
					class="flex flex-col gap-4 border border-neutral-700 bg-neutral-800/20 p-4 rounded-lg animate-pulse"
				>
					<div class="h-5 bg-neutral-700 rounded w-2/3"></div>
					<div class="space-y-2">
						<div class="h-3 bg-neutral-700 rounded w-full"></div>
						<div class="h-3 bg-neutral-700 rounded w-5/6"></div>
					</div>
					<div class="flex-grow"></div>
					<div class="flex items-center gap-4">
						<div class="h-4 bg-neutral-700 rounded w-1/4"></div>
						<div class="h-4 bg-neutral-700 rounded w-1/4"></div>
					</div>
				</div>
			{/each}
		</div>
	{:else if error}
		<p class="text-red-500">{error}</p>
	{:else}
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			{#each repos as repo (repo.name)}
				<a
					href={repo.url}
					target="_blank"
					rel="noopener noreferrer"
					class="group flex flex-col gap-4 border border-neutral-700 bg-neutral-800/20 p-4 rounded-lg transition-all duration-300 hover:bg-neutral-800/40 hover:border-neutral-600 hover:shadow-lg hover:shadow-neutral-900/30"
				>
					<div class="flex items-center gap-2">
						<svg
							class="w-5 h-5 text-neutral-400"
							viewBox="0 0 16 16"
							version="1.1"
							aria-hidden="true"
							fill="currentColor"
						>
							<path
								fill-rule="evenodd"
								d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zM4.5 1C3.672 1 3 1.672 3 2.5V11c0 .269.095.52.256.714a.75.75 0 011.072-1.05A1 1 0 005 11V3h7v1.5a.75.75 0 01-1.5 0V3h-2.5a.75.75 0 010-1.5h2.5a.75.75 0 01.75.75V3h1.5V2.5A1.5 1.5 0 0013.5 1h-9z"
							></path>
						</svg>
						<h3
							class="font-semibold text-base text-neutral-100 group-hover:text-white transition-colors"
						>
							{repo.name}
						</h3>
					</div>

					<p class="text-sm text-neutral-400 leading-relaxed line-clamp-2">
						{repo.description}
					</p>

					<div class="flex-grow"></div>

					<div class="flex items-center gap-4 text-xs text-neutral-400">
						{#if repo.primaryLanguage}
							<div class="flex items-center gap-1.5">
								<div
									class="w-3 h-3 rounded-full"
									style="background-color: {repo.primaryLanguage.color};"
								></div>
								<span>{repo.primaryLanguage.name}</span>
							</div>
						{/if}
						<div class="flex items-center gap-1">
							<svg class="w-4 h-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
								<path
									d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 13.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.192L.644 6.374a.75.75 0 01.416-1.28l4.21-.612L7.327.668A.75.75 0 018 .25z"
								></path>
							</svg>
							<span>{repo.stargazerCount}</span>
						</div>
						<div class="flex items-center gap-1">
							<svg class="w-4 h-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
								<path
									d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zM8.75 16a.75.75 0 100-1.5.75.75 0 000 1.5z"
								></path>
							</svg>
							<span>{repo.forkCount}</span>
						</div>
					</div>
				</a>
			{/each}
		</div>
	{/if}
</section>
