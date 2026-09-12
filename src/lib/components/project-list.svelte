<script lang="ts">
	interface ProjectItem {
		slug: string;
		title: string;
		excerpt: string;
		kind: 'case-study' | 'open-source';
		liveUrl?: string;
		github?: string;
		hasWriteup: boolean;
		featuredStack?: string[];
	}
	let { projects }: { projects: ProjectItem[] } = $props();
</script>

<ul class="plain-list">
	{#each projects as project (project.slug)}
		<li class="project">
			<div class="head">
				{#if project.hasWriteup}
					<a href="/projects/{project.slug}" class="title" data-sveltekit-preload-data
						>{project.title}</a
					>
				{:else if project.github}
					<a href={project.github} class="title" rel="noopener noreferrer">{project.title}</a>
				{:else}
					<span class="title">{project.title}</span>
				{/if}
				{#if project.featuredStack?.length}
					<span class="muted mono">{project.featuredStack.join(' · ')}</span>
				{/if}
			</div>
			<p class="muted small">{project.excerpt}</p>
			<div class="links small">
				{#if project.liveUrl}
					<a href={project.liveUrl} rel="noopener noreferrer">live</a>
				{/if}
				{#if project.github}
					<a href={project.github} rel="noopener noreferrer">repo</a>
				{/if}
				{#if project.hasWriteup}
					<a href="/projects/{project.slug}" data-sveltekit-preload-data>writeup</a>
				{/if}
			</div>
		</li>
	{/each}
</ul>

<style>
	.project {
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
	a.title:hover {
		color: var(--accent);
	}
	p {
		margin: 0;
	}
	.links {
		display: flex;
		gap: 1rem;
	}
</style>
