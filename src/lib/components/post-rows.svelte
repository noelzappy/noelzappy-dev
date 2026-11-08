<script lang="ts">
	import { formatDate } from '$lib/shared/date';
	import type { PostItem } from '$lib/content/posts-view';

	let { posts }: { posts: PostItem[] } = $props();
</script>

<ul class="rows">
	{#each posts as post (post.slug)}
		<li class="row">
			<a class="main" href="/writing/{post.slug}" data-sveltekit-preload-data>
				<span class="title">{post.title}</span>
				<time datetime={post.date}>{formatDate(post.date)}</time>
			</a>
			{#if post.description}<p class="desc">{post.description}</p>{/if}
			{#if post.tags.length}
				<ul class="tags">
					{#each post.tags as tag (tag)}
						<li><a href="/writing/tag/{tag}">{tag}</a></li>
					{/each}
				</ul>
			{/if}
		</li>
	{/each}
</ul>

<style>
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.row {
		display: grid;
		gap: 0.75rem;
		padding-block: clamp(1.5rem, 3vw, 2.5rem);
		border-top: 1px solid var(--border);
	}
	.row:first-child {
		border-top: 0;
		padding-top: 0;
	}
	.main {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.5rem 2rem;
		color: var(--fg);
		text-decoration: none;
	}
	.title {
		font-size: var(--step-display-m);
		line-height: var(--lh-display-m);
		letter-spacing: var(--tracking-display-m);
		font-weight: var(--weight-display-m);
		text-wrap: balance;
	}
	.main:hover .title {
		color: var(--accent);
	}
	time {
		color: var(--muted);
		font-size: var(--step-small);
		white-space: nowrap;
	}
	.desc {
		margin: 0;
		max-width: 60ch;
		color: var(--muted);
		line-height: var(--lh-body);
	}
	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0 1.25rem;
		font-size: var(--step-small);
	}
	.tags a {
		display: inline-flex;
		align-items: center;
		min-width: var(--tap-min);
		min-height: var(--tap-min);
		color: var(--muted);
		text-decoration: none;
	}
	.tags a:hover {
		color: var(--accent);
	}
</style>
