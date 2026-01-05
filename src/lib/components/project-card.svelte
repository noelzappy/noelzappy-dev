<script lang="ts">
	interface ProjectCardData {
		slug: string;
		title: string;
		excerpt?: string;
		featuredImage?: string;
		featureImage?: string;
		status?: string;
		role?: string;
		client?: string;
		featuredStack?: string[];
	}

	interface Props {
		project: ProjectCardData;
	}

	let { project }: Props = $props();

	// Normalize image property (homepage uses featuredImage, projects page uses featureImage)
	const imageUrl = $derived(project.featuredImage || project.featureImage);

	function getStatusColor(status: string) {
		switch (status.toLowerCase()) {
			case 'shipped':
				return 'bg-emerald-500 text-white border-emerald-500/30';
			case 'in progress':
				return 'bg-orange-500 text-white border-orange-500/30';
			case 'cancelled':
				return 'bg-red-500 text-white border-red-500/30';
			case 'archived':
				return 'bg-neutral-500 text-white border-neutral-500/30';
			default:
				return 'bg-neutral-500 text-white border-neutral-500/30';
		}
	}
</script>

<a
	href={`/projects/${project.slug}`}
	class="group flex flex-col rounded-xl overflow-hidden border border-neutral-700/50 bg-neutral-800/20 hover:bg-neutral-800/40 hover:border-orange-500/30 transition-all duration-300"
	data-sveltekit-preload-data
>
	<div class="aspect-video w-full overflow-hidden bg-neutral-900 relative">
		{#if imageUrl}
			<img
				src={imageUrl}
				alt={project.title}
				class="w-full h-full transition-transform duration-500 group-hover:scale-105 object-cover object-top"
				loading="lazy"
			/>
		{:else}
			<div class="w-full h-full bg-linear-to-br from-neutral-800 to-neutral-900"></div>
		{/if}
		<!-- Status Badge Overlay -->
		{#if project.status}
			<div class="absolute top-3 left-3">
				<span
					class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full border backdrop-blur-sm {getStatusColor(
						project.status
					)}"
				>
					{#if project.status.toLowerCase() === 'shipped'}
						<span class="relative flex h-1.5 w-1.5">
							<span
								class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
							></span>
							<span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
						</span>
					{/if}
					{project.status}
				</span>
			</div>
		{/if}
	</div>
	<div class="flex flex-col gap-3 p-5">
		<div class="flex items-start justify-between gap-2">
			<h3
				class="text-lg font-semibold text-neutral-100 group-hover:text-orange-400 transition-colors"
			>
				{project.title}
			</h3>
		</div>

		<!-- Role & Client -->
		{#if project.role}
			<p class="text-xs text-neutral-500 font-medium">
				{project.role}
				{#if project.client}
					<span class="text-neutral-600">•</span>
					{project.client}
				{/if}
			</p>
		{/if}

		{#if project.excerpt}
			<p class="text-sm text-neutral-400 line-clamp-2 leading-relaxed">
				{project.excerpt}
			</p>
		{/if}

		<!-- Tech Stack Tags -->
		{#if project.featuredStack && project.featuredStack.length > 0}
			<div class="flex flex-wrap gap-1.5 mt-1">
				{#each project.featuredStack.slice(0, 3) as tech (tech)}
					<span
						class="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md bg-neutral-700/50 text-neutral-300"
					>
						{tech}
					</span>
				{/each}
				{#if project.featuredStack.length > 3}
					<span
						class="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md bg-neutral-700/30 text-neutral-500"
					>
						+{project.featuredStack.length - 3}
					</span>
				{/if}
			</div>
		{/if}

		<div
			class="flex items-center gap-2 text-sm text-neutral-500 group-hover:text-orange-400 transition-colors mt-auto pt-2"
		>
			<span>View project</span>
			<span
				class="material-symbols-outlined text-base transition-transform group-hover:translate-x-1"
				>arrow_forward</span
			>
		</div>
	</div>
</a>
