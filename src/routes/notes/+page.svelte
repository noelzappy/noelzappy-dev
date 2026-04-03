<script lang="ts">
	import Newsletter from '$lib/components/newsletter.svelte';
	import SEOHead from '$lib/components/seo-head.svelte';
	import SectionLabel from '$lib/components/section-label.svelte';
	import NoteCard from '$lib/components/note-card.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'Blog',
		name: 'Notes — Emmanuel Yeboah',
		description:
			'Thoughts on software engineering, architecture, and building for African markets.',
		url: 'https://noelzappy.dev/notes',
		author: {
			'@type': 'Person',
			name: 'Emmanuel Noel Zappy Yeboah',
			url: 'https://noelzappy.dev'
		}
	};
</script>

<SEOHead
	title="Notes"
	description="Thoughts on software engineering, architecture, and building for African markets. No fluff — just lessons from real systems."
	canonical="https://noelzappy.dev/notes"
	ogType="website"
	keywords="Tech Blog, Software Architecture, African Fintech, Backend Engineering, Emmanuel Yeboah"
	{structuredData}
/>

<div class="flex flex-col gap-0 py-16 sm:py-24">
	<!-- Page hero -->
	<div class="flex flex-col gap-4 pb-16 sm:pb-20 border-b border-[var(--color-border)]">
		<SectionLabel text="// notes" />
		<h1 class="text-4xl sm:text-5xl font-bold text-[var(--color-text-primary)] mt-2">Notes</h1>
		<p class="text-lg text-[var(--color-text-secondary)] max-w-2xl">My thoughts aloud.</p>
	</div>

	<!-- Articles list -->
	<div class="py-12">
		{#if data.posts.length > 0}
			<div class="flex flex-col gap-3">
				{#each data.posts as post (post.id)}
					<NoteCard note={post} showDate />
				{/each}
			</div>

			<!-- Pagination -->
			{#if data.pagination.pages > 1}
				<div
					class="flex items-center justify-between border-t border-[var(--color-border)] mt-10 pt-8"
				>
					<div class="flex gap-6">
						{#if data.pagination.prev}
							<a
								href={`/notes?page=${data.pagination.prev}`}
								class="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
								data-sveltekit-preload-data
							>
								← Previous
							</a>
						{:else}
							<span class="text-sm font-medium text-neutral-700 cursor-not-allowed">← Previous</span
							>
						{/if}

						{#if data.pagination.next}
							<a
								href={`/notes?page=${data.pagination.next}`}
								class="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
								data-sveltekit-preload-data
							>
								Next →
							</a>
						{:else}
							<span class="text-sm font-medium text-neutral-700 cursor-not-allowed">Next →</span>
						{/if}
					</div>
					<p class="text-sm text-[var(--color-text-secondary)]">
						Page {data.pagination.page} of {data.pagination.pages}
					</p>
				</div>
			{/if}
		{:else}
			<div class="py-24 text-center">
				<p class="text-[var(--color-text-secondary)]">No posts yet. Check back soon.</p>
			</div>
		{/if}
	</div>

	<!-- Newsletter at the bottom -->
	<div class="border-t border-[var(--color-border)] pt-16">
		<Newsletter
			title="Get new notes in your inbox"
			description="Thoughts on architecture, fintech, and building for African markets — delivered when I publish, not on a schedule."
		/>
	</div>
</div>
