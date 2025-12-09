<script lang="ts">
	import Newsletter from '$lib/components/newsletter.svelte';
	import SEOHead from '$lib/components/seo-head.svelte';
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

	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'Blog',
		name: 'Noel Zappy Notes',
		description:
			'Insights and reflections on software engineering, technology trends, and personal experiences in the tech industry.',
		url: 'https://noelzappy.dev/notes',
		author: {
			'@type': 'Person',
			name: 'Emmanuel Noel Zappy Yeboah',
			url: 'https://noelzappy.dev'
		},
		publisher: {
			'@type': 'Person',
			name: 'Emmanuel Noel Zappy Yeboah',
			url: 'https://noelzappy.dev'
		}
	};
</script>

<SEOHead
	title="Notes - Tech Blog"
	description="Read Emmanuel Noel Zappy Yeboah's insights on software engineering, web development, cloud architecture, and technology trends. Technical articles and personal experiences."
	canonical="https://noelzappy.dev/notes"
	ogType="website"
	keywords="Tech Blog, Software Engineering Blog, Web Development Articles, Cloud Architecture, TypeScript Tutorials, Python Tips, DevOps Insights"
	{structuredData}
/>

<div class="flex flex-col gap-12 sm:gap-16">
	<div class="flex flex-col gap-6">
		<div class="flex flex-col gap-3">
			<h1 class="text-4xl font-semibold tracking-tight text-neutral-100 sm:text-5xl">Notes</h1>
			<p class="text-lg text-neutral-300 font-light">
				Thoughts on software engineering, architecture, and building great products
			</p>
		</div>
	</div>

	{#if data.posts.length > 0}
		<div class="flex flex-col gap-4">
			{#each data.posts as post, index (post.id)}
				<a
					class="group relative flex items-start justify-between gap-4 p-5 sm:p-6 rounded-xl border border-neutral-700 bg-neutral-800/20 hover:bg-neutral-800/40 hover:border-neutral-600 transition-all duration-300 hover:shadow-lg hover:shadow-neutral-900/30 overflow-hidden"
					href={`/notes/${post.slug}`}
					data-sveltekit-preload-data
				>
					<div
						class="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-neutral-500 to-neutral-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
					></div>
					<div class="flex flex-col gap-2.5 flex-1 min-w-0">
						<span
							class="text-lg font-semibold text-neutral-100 group-hover:text-white transition-colors"
						>
							{post.title}
						</span>
						<span class="text-xs text-neutral-500">
							{formatDate(post.publishedAt || '')}
						</span>
						{#if post.excerpt}
							<p class="text-sm text-neutral-400 line-clamp-2 leading-relaxed">
								{post.excerpt}
							</p>
						{/if}
					</div>
					<span
						class="material-symbols-outlined text-xl text-neutral-500 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white shrink-0"
					>
						arrow_forward
					</span>
				</a>

				{#if index === 0 && data.pagination.page === 1}
					<Newsletter />
				{/if}
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
