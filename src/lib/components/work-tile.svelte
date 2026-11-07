<script lang="ts">
	import WorkThumb from './work-thumb.svelte';
	import { workCta } from '$lib/content/work-cta';
	import type { DeviceShot } from '$lib/data/projects';

	interface WorkTileProject {
		slug: string;
		title: string;
		oneLine: string;
		built?: string[];
		brandColor?: string;
		onBrand?: 'light' | 'dark';
		deviceShots?: DeviceShot[];
		featuredImage?: string;
		hasWriteup: boolean;
		liveUrl?: string;
		github?: string;
	}

	let { project }: { project: WorkTileProject } = $props();

	const cta = $derived(workCta(project));
</script>

<article class="tile">
	<WorkThumb {project} aspect="4 / 3" />
	<h3 class="name">
		{#if cta}
			<a
				class="stretch"
				href={cta.href}
				{...cta.external ? { rel: 'noopener noreferrer' } : { 'data-sveltekit-preload-data': '' }}
				>{project.title}</a
			>
		{:else}
			{project.title}
		{/if}
	</h3>
	<p class="line">{project.oneLine}</p>
	{#if project.built?.length}<p class="built">{project.built.join(' · ')}</p>{/if}
</article>

<style>
	.tile {
		position: relative;
		display: flex;
		flex-direction: column;
	}
	.name {
		margin: 1.25rem 0 0;
		font-family: var(--font-display);
		font-size: var(--step-display-m);
		line-height: var(--lh-display-m);
		letter-spacing: var(--tracking-display-m);
		font-weight: var(--weight-display-m);
	}
	.name a {
		color: var(--fg);
		text-decoration: none;
	}
	/* The whole tile is the target; the heading link covers it. */
	.stretch::after {
		content: '';
		position: absolute;
		inset: 0;
	}
	.tile:hover .name a,
	.name a:focus-visible {
		color: var(--accent);
	}
	.line {
		margin: 0.75rem 0 0;
		max-width: 38ch;
		font-size: var(--step-body);
		line-height: 1.5;
		color: var(--fg);
	}
	.built {
		margin: 0.5rem 0 0;
		font-size: var(--step-small);
		line-height: var(--lh-small);
		color: var(--muted);
	}
</style>
