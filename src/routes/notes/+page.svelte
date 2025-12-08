<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function formatDate(dateString: string) {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

<div class="flex flex-col gap-12 sm:gap-16">
	<div class="flex flex-col gap-1.5">
		<h1 class="text-3xl font-medium tracking-tight text-neutral-100 sm:text-4xl">Notes</h1>
		<div class="flex flex-col gap-6 text-base leading-7 text-neutral-400">
			<p>
				Insights and reflections on software engineering, technology trends, and my personal
				experiences in the tech industry.
			</p>
		</div>
	</div>

	{#if data.posts.length > 0}
		<div class="flex flex-col gap-10">
			{#each data.posts as post (post.id)}
				<a class="group" href={`/notes/${post.slug}`} data-sveltekit-preload-data>
					<div class="grid sm:grid-cols-4 gap-2">
						<div class="sm:col-span-3 flex flex-col gap-1.5">
							<p class="text-lg font-medium text-gray-200 group-hover:text-white transition-colors">
								{post.title}
							</p>
							<p class="sm:col-span-1 text-sm text-gray-400">
								{formatDate(post.publishedAt)}
							</p>
							{#if post.excerpt}
								<p class="text-base text-gray-400">
									{post.excerpt}
								</p>
							{/if}
							{#if post.tags.length > 0}
								<div class="flex flex-wrap gap-2 mt-2">
									{#each post.tags as tag (tag)}
										<span
											class="text-xs px-2 py-1 rounded bg-neutral-800 text-neutral-400 border border-neutral-700"
										>
											{tag}
										</span>
									{/each}
								</div>
							{/if}
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
							href={`/notes?page=${data.pagination.prev}`}
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
							href={`/notes?page=${data.pagination.next}`}
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
			<p class="text-lg text-neutral-400">No posts found.</p>
			<p class="text-sm text-neutral-500 mt-2">Check back later for new content!</p>
		</div>
	{/if}
</div>
