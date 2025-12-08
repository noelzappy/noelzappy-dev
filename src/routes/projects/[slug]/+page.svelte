<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';

	let { data }: { data: PageData } = $props();

	let contentElement: HTMLDivElement;

	function formatDate(dateString: string) {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	onMount(() => {
		const links = contentElement.querySelectorAll('a');
		links.forEach((link) => {
			link.setAttribute('target', '_blank');
			link.setAttribute('rel', 'noopener noreferrer');
		});
	});
</script>

<article class="flex flex-col gap-8">
	<header class="flex flex-col gap-4">
		<h1 class="text-3xl font-medium tracking-tight text-neutral-100 sm:text-4xl">
			{data.project.title}
		</h1>
		{#if data.project.excerpt}
			<p class="text-lg text-neutral-400">
				{data.project.excerpt}
			</p>
		{/if}
		<div class="flex items-center gap-4 text-sm text-neutral-400">
			<time dateTime={data.project.publishedAt}>
				{formatDate(data.project.publishedAt)}
			</time>
			{#if data.project.readingTime}
				<span>·</span>
				<span>{data.project.readingTime} min read</span>
			{/if}
		</div>
		{#if data.project.tags.length > 0}
			<div class="flex flex-wrap gap-2">
				{#each data.project.tags as tag}
					<span
						class="text-xs px-3 py-1 rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700"
					>
						{tag}
					</span>
				{/each}
			</div>
		{/if}
	</header>
	<div
		bind:this={contentElement}
		class="prose prose-invert max-w-none text-base leading-7 text-neutral-400 prose-headings:font-medium prose-headings:text-neutral-100 prose-a:text-neutral-100 prose-a:underline prose-a:underline-offset-2 hover:prose-a:text-white prose-strong:text-neutral-200 prose-code:text-neutral-300 prose-code:bg-neutral-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-neutral-900 prose-pre:border prose-pre:border-neutral-800 prose-img:rounded-lg prose-ul:list-disc prose-ol:list-decimal"
	>
		{@html data.project.html}
	</div>
	<footer class="border-t border-neutral-800 pt-8">
		<a
			href="/projects"
			class="inline-flex items-center text-sm font-medium text-neutral-400 hover:text-white transition-colors"
		>
			<span class="material-symbols-outlined text-base mr-1"> arrow_back </span>
			Back to all projects
		</a>
	</footer>
</article>
