<script lang="ts">
	import type { PageProps } from './$types';
	import { marked } from 'marked';

	let { data }: PageProps = $props();
</script>

<article class="flex flex-col gap-8">
	<header class="flex flex-col gap-4">
		<h1 class="text-3xl font-medium tracking-tight text-neutral-100 sm:text-4xl">
			{data.note.title}
		</h1>
		<p class="text-base text-neutral-400">
			<time dateTime={data.note.date}>
				{data.note.date}
			</time>
		</p>
	</header>
	<div
		class="prose prose-invert max-w-none text-base leading-7 text-neutral-400 prose-headings:font-medium prose-headings:text-neutral-100 prose-a:text-neutral-100 prose-a:underline prose-a:underline-offset-2 hover:prose-a:text-white prose-strong:text-neutral-200"
	>
		{@html marked(data.note.content || '')}
	</div>
</article>
