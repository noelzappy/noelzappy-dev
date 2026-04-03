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
	class="note-card group"
	href={`/notes/${note.slug}`}
	data-sveltekit-preload-data
>
	<div class="flex flex-col gap-2.5 flex-1 min-w-0">
		{#if showDate && note.publishedAt}
			<span class="text-xs" style="color: var(--color-text-secondary); font-family: var(--font-mono);">
				{formatDate(note.publishedAt)}
			</span>
		{/if}
		<span class="text-lg font-semibold transition-colors" style="color: var(--color-text-primary); font-family: var(--font-display);">
			{note.title}
		</span>
		{#if note.excerpt}
			<span class="text-sm line-clamp-2 leading-relaxed" style="color: var(--color-text-secondary);">
				{note.excerpt}
			</span>
		{/if}
	</div>
	<span class="note-card-arrow material-symbols-outlined text-xl shrink-0 transition-all duration-300 group-hover:translate-x-1" style="color: var(--color-accent);">
		arrow_forward
	</span>
</a>

<style>
	.note-card {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		padding: 24px 28px;
		border-radius: 12px;
		border: 1px solid var(--color-border);
		background: var(--color-surface);
		transition: all 0.2s ease;
		overflow: hidden;
		text-decoration: none;
	}

	.note-card:hover {
		border-color: rgba(232, 99, 10, 0.3);
		transform: translateY(-2px);
	}
</style>
