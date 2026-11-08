<script lang="ts">
	import ProjectShowcase from './project-showcase.svelte';
	import { getShowcase } from '$lib/data/showcase';
	import type { DeviceShot, Showcase } from '$lib/data/projects';

	interface Thumb {
		title: string;
		brandColor?: string;
		onBrand?: 'light' | 'dark';
		deviceShots?: DeviceShot[];
		showcase?: Showcase;
	}

	let {
		project,
		aspect = '16 / 10',
		name
	}: { project: Thumb; aspect?: string; name?: string } = $props();

	const showcase = $derived(getShowcase(project));
	const initial = $derived(project.title.trim().charAt(0).toUpperCase());
</script>

<div
	class="thumb"
	class:on-dark={project.onBrand === 'light'}
	style:background={project.brandColor ?? 'var(--border)'}
	style:--showcase-aspect={aspect}
>
	{#if showcase}
		<ProjectShowcase {showcase} size="row" brandColor={project.brandColor} {name} />
	{:else}
		<span class="initial" aria-hidden="true">{initial}</span>
	{/if}
</div>

<style>
	.thumb {
		position: relative;
		overflow: hidden;
		display: grid;
		place-items: center;
		aspect-ratio: var(--showcase-aspect);
		border-radius: 0.5rem;
	}
	.initial {
		font-family: var(--font-display);
		font-size: clamp(4rem, 12vw, 9rem);
		font-weight: 300;
		line-height: 1;
		color: var(--muted);
	}
	.on-dark .initial {
		color: rgba(255, 255, 255, 0.85);
	}
</style>
