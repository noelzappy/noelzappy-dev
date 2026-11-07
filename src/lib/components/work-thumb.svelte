<script lang="ts">
	import DeviceFrame from './device-frame.svelte';
	import type { DeviceShot } from '$lib/data/projects';

	interface Thumb {
		title: string;
		brandColor?: string;
		onBrand?: 'light' | 'dark';
		deviceShots?: DeviceShot[];
		featuredImage?: string;
	}

	let { project, aspect = '16 / 10' }: { project: Thumb; aspect?: string } = $props();

	const shot = $derived(project.deviceShots?.[0]);
	const initial = $derived(project.title.trim().charAt(0).toUpperCase());
</script>

<div
	class="thumb"
	class:on-dark={project.onBrand === 'light'}
	style:background={project.brandColor ?? 'var(--border)'}
	style:aspect-ratio={aspect}
>
	{#if shot?.kind === 'phone'}
		<div class="phone"><DeviceFrame kind="phone" src={shot.src} alt={shot.alt} /></div>
	{:else if shot}
		<div class="browser"><DeviceFrame kind="browser" src={shot.src} alt={shot.alt} /></div>
	{:else if project.featuredImage}
		<div class="browser">
			<DeviceFrame kind="browser" src={project.featuredImage} alt={project.title} />
		</div>
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
		border-radius: 0.5rem;
	}
	.phone {
		width: 30%;
		align-self: start;
		margin-top: 9%;
	}
	.browser {
		width: 78%;
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
