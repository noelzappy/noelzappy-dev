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
	<div class="flex flex-col gap-1.5">
		<h1 class="text-3xl font-medium tracking-tight text-neutral-100 sm:text-4xl">Notes</h1>
		<div class="flex flex-col gap-6 text-base leading-7 text-neutral-300">
			<p>
				Insights and reflections on software engineering, technology trends, and my personal
				experiences in the tech industry.
			</p>
		</div>
	</div>

	{#if data.posts.length > 0}
		<div class="flex flex-col gap-10">
			{#each data.posts as post, index (post.id)}
				<a class="group" href={`/notes/${post.slug}`} data-sveltekit-preload-data>
					<div class="grid sm:grid-cols-4 gap-2">
						<div
							class="sm:col-span-3 flex flex-col gap-1.5 group-hover:text-white group-hover:translate-x-1 transition-transform duration-300"
						>
							<p class="text-lg font-medium text-gray-200 group-hover:text-white transition-colors">
								{post.title}
							</p>
							<p class="sm:col-span-1 text-sm text-neutral-300">
								{formatDate(post.publishedAt)}
							</p>
							{#if post.excerpt}
								<p class="text-base text-neutral-300 hover:text-white transition-colors">
									{post.excerpt}
								</p>
							{/if}
						</div>
					</div>
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
