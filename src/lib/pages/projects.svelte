<script lang="ts">
	import { Projects } from '$lib/shared/constants';

	let activeFilter: string = $state('All');

	const filteredProjects = $derived(
		activeFilter === 'All' ? Projects : Projects.filter((project) => project.type === activeFilter)
	);
</script>

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

<div class="flex flex-col">
	<div class="flex flex-wrap gap-2 mt-7">
		{#each ['All', 'Open Source', 'Employment', 'Contract', 'Personal'] as filter}
			<button
				onclick={() => (activeFilter = filter)}
				class="px-3 py-1.5 text-sm cursor-pointer font-medium transition-colors {activeFilter ===
				filter
					? 'text-white underline underline-offset-4'
					: 'text-neutral-500 hover:text-neutral-300'}"
			>
				{filter}
			</button>
		{/each}
	</div>
	{#each filteredProjects as project}
		<div class="group grid grid-cols-12 gap-x-4 gap-y-2 py-6 border-b border-gray-800">
			<p class="col-span-12 md:col-span-2 text-sm text-gray-500 font-medium pt-1">
				{project.type}
			</p>
			<div class="col-span-12 md:col-span-10 flex flex-col gap-3">
				<h3 class="text-lg font-semibold text-white">
					{project.title}
				</h3>
				<p class="text-gray-400 text-base leading-relaxed">
					{project.desc}
				</p>
				<div class="flex items-center gap-x-2">
					<a
						class="inline-flex items-center text-sm font-medium text-white hover:text-gray-300 group-hover:underline"
						href={project.linkTo}
					>
						{project.linkText}
						<span
							class="material-symbols-outlined text-base ml-1 transition-transform group-hover:translate-x-1"
						>
							arrow_right_alt
						</span>
					</a>
				</div>
			</div>
		</div>
	{/each}
</div>
