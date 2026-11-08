<script lang="ts">
	import WorkThumb from './work-thumb.svelte';
	import { fadeUp } from '$lib/motion/fade-up';
	import { showcaseName } from '$lib/motion/shared';
	import { workCta } from '$lib/content/work-cta';
	import type { DeviceShot, Showcase } from '$lib/data/projects';

	interface WorkRowProject {
		slug: string;
		title: string;
		oneLine: string;
		built?: string[];
		brandColor?: string;
		onBrand?: 'light' | 'dark';
		deviceShots?: DeviceShot[];
		showcase?: Showcase;
		featuredImage?: string;
		hasWriteup: boolean;
		liveUrl?: string;
		github?: string;
	}

	let { project }: { project: WorkRowProject } = $props();

	const cta = $derived(workCta(project));
</script>

<article class="row" use:fadeUp>
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
				>{cta.label}<span class="sr-only"> {project.title}</span>
				<span aria-hidden="true">→</span></a
			>
		{/if}
	</div>
	<!-- Only rows that link to a case study carry a morph name (one per slug, so never a duplicate). -->
	<WorkThumb
		{project}
		name={project.hasWriteup && project.brandColor ? showcaseName(project.slug) : undefined}
	/>
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
		display: inline-block;
		min-height: var(--tap-min);
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
		display: inline-flex;
		align-items: center;
		min-height: var(--tap-min);
		margin-top: 1rem;
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

	@media (min-width: 48rem) {
		.row {
			grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
			gap: var(--page-gutter);
			align-items: center;
		}
	}
</style>
