<script lang="ts">
	import DeviceFrame from './device-frame.svelte';
	import type { DeviceShot } from '$lib/data/projects';

	interface WorkRowProject {
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

	let { project }: { project: WorkRowProject } = $props();

	const shot = $derived(project.deviceShots?.[0]);
	const initial = $derived(project.title.trim().charAt(0).toUpperCase());
	const cta = $derived.by(() => {
		if (project.hasWriteup) {
			return { href: `/projects/${project.slug}`, label: 'View case study', external: false };
		}
		if (project.liveUrl) return { href: project.liveUrl, label: 'Visit live site', external: true };
		if (project.github) return { href: project.github, label: 'View repository', external: true };
		return null;
	});
</script>

<article class="row">
	<div class="text">
		<h3 class="name">
			{#if project.hasWriteup}
				<a href="/projects/{project.slug}" data-sveltekit-preload-data>{project.title}</a>
			{:else}
				{project.title}
			{/if}
		</h3>
		<p class="line">{project.oneLine}</p>
		{#if project.built?.length}<p class="built">{project.built.join(' · ')}</p>{/if}
		{#if cta}
			<a
				class="cta"
				href={cta.href}
				{...cta.external ? { rel: 'noopener noreferrer' } : { 'data-sveltekit-preload-data': '' }}
				>{cta.label} <span aria-hidden="true">→</span></a
			>
		{/if}
	</div>
	<div
		class="thumb"
		class:on-dark={project.onBrand === 'light'}
		style:background={project.brandColor ?? 'var(--border)'}
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
</article>

<style>
	.row {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 1.5rem;
		padding-block: clamp(1.5rem, 4vw, 3rem);
		border-top: 1px solid var(--border);
	}
	.name {
		margin: 0;
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
	.name a:hover {
		color: var(--accent);
	}
	.line {
		margin: 1rem 0 0;
		max-width: 38ch;
		font-size: var(--step-body);
		line-height: 1.5;
		color: var(--fg);
	}
	.built {
		margin: 0.75rem 0 0;
		font-size: var(--step-small);
		line-height: var(--lh-small);
		color: var(--muted);
	}
	.cta {
		display: inline-block;
		margin-top: 1.5rem;
		color: var(--fg);
		font-size: var(--step-small);
		text-decoration: underline;
		text-underline-offset: 0.25em;
		text-decoration-color: var(--border);
	}
	.cta:hover {
		color: var(--accent);
		text-decoration-color: currentColor;
	}
	.cta span {
		display: inline-block;
		transition: transform 0.2s ease;
	}
	.cta:hover span {
		transform: translateX(0.2em);
	}
	@media (prefers-reduced-motion: reduce) {
		.cta span {
			transition: none;
		}
		.cta:hover span {
			transform: none;
		}
	}

	.thumb {
		position: relative;
		overflow: hidden;
		aspect-ratio: 16 / 10;
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

	@media (min-width: 48rem) {
		.row {
			grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
			gap: var(--page-gutter);
			align-items: center;
		}
	}
</style>
