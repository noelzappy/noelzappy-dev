<script lang="ts">
	interface PostItem {
		slug: string;
		title: string;
		date: string;
		tags: string[];
		description?: string;
	}
	let { posts, showDescription = false }: { posts: PostItem[]; showDescription?: boolean } =
		$props();

	const fmt = (d: string) =>
		new Date(d + 'T00:00:00Z').toLocaleDateString('en-GB', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
			timeZone: 'UTC'
		});
</script>

<ul class="plain-list">
	{#each posts as post (post.slug)}
		<li class="post">
			<div class="head">
				<a href="/writing/{post.slug}" class="title" data-sveltekit-preload-data>{post.title}</a>
				<time datetime={post.date} class="muted mono">{fmt(post.date)}</time>
			</div>
			{#if showDescription && post.description}
				<p class="muted small">{post.description}</p>
			{/if}
			{#if post.tags.length}
				<div class="tags">
					{#each post.tags as tag (tag)}
						<a href="/writing/tag/{tag}" class="tag">{tag}</a>
					{/each}
				</div>
			{/if}
		</li>
	{/each}
</ul>

<style>
	.post {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}
	.head {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.25rem 1rem;
	}
	.title {
		color: var(--fg);
		font-weight: 550;
		text-decoration: none;
	}
	.title:hover {
		color: var(--accent);
	}
	p {
		margin: 0;
	}
	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
	}
</style>
