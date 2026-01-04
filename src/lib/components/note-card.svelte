<script lang="ts">
	interface NoteCardData {
		slug: string;
		title?: string;
		excerpt?: string;
		publishedAt?: string | null;
	}

	interface Props {
		note: NoteCardData;
		showDate?: boolean;
	}

	let { note, showDate = false }: Props = $props();

	function formatDate(dateString: string) {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

<a
	class="group relative flex items-start justify-between gap-4 p-5 sm:p-6 rounded-xl border border-neutral-700 bg-neutral-800/20 hover:bg-neutral-800/40 hover:border-orange-500 transition-all duration-300 hover:shadow-lg hover:shadow-neutral-900/30 overflow-hidden"
	href={`/notes/${note.slug}`}
	data-sveltekit-preload-data
>
	<div
		class="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-orange-300 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
	></div>
	<div class="flex flex-col gap-2.5 flex-1 min-w-0">
		<span class="text-lg font-semibold text-neutral-100 group-hover:text-white transition-colors">
			{note.title}
		</span>
		{#if showDate && note.publishedAt}
			<span class="text-xs text-neutral-500">
				{formatDate(note.publishedAt)}
			</span>
		{/if}
		{#if note.excerpt}
			<span class="text-sm text-neutral-400 line-clamp-2 leading-relaxed">
				{note.excerpt}
			</span>
		{/if}
	</div>
	<span
		class="material-symbols-outlined text-xl text-neutral-500 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white shrink-0"
	>
		arrow_forward
	</span>
</a>
