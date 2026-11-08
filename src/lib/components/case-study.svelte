<script lang="ts">
	import type { DeviceShot, Showcase } from '$lib/data/projects';
	import { getShowcase } from '$lib/data/showcase';
	import ProjectShowcase from './project-showcase.svelte';
	import Section from './section.svelte';
	import WorkThumb from './work-thumb.svelte';
	import { showcaseName } from '$lib/motion/shared';

	const ENGAGEMENT: Record<string, string> = {
		'full-build': 'Full build',
		team: 'Team augmentation',
		rescue: 'Fix & rescue',
		website: 'Website',
		'open-source': 'Open source'
	};
	const STAGE: Record<string, string> = {
		startup: 'Startup',
		business: 'Business',
		ngo: 'Non-profit',
		'own-venture': 'Own venture'
	};

	let {
		slug = '',
		title,
		html,
		engagement = '',
		stage = '',
		built = [],
		status = '',
		brandColor = '',
		onBrand = '',
		deviceShots = [],
		showcase = undefined,
		impact = [],
		stack = [],
		liveUrl = '',
		iosUrl = '',
		androidUrl = '',
		github = '',
		next = null
	}: {
		slug?: string;
		title: string;
		html: string;
		engagement?: string;
		stage?: string;
		built?: string[];
		status?: string;
		brandColor?: string;
		onBrand?: string;
		deviceShots?: DeviceShot[];
		showcase?: Showcase;
		impact?: { value: string; label: string }[];
		stack?: string[];
		liveUrl?: string;
		iosUrl?: string;
		androidUrl?: string;
		github?: string;
		next?: {
			slug: string;
			title: string;
			brandColor?: string;
			onBrand?: 'light' | 'dark';
			showcase?: Showcase;
		} | null;
	} = $props();

	const meta = $derived(
		[
			{ label: 'Engagement', value: ENGAGEMENT[engagement] ?? '' },
			{ label: 'Stage', value: STAGE[stage] ?? '' },
			{ label: 'What I built', value: built.join(' · ') },
			{ label: 'Status', value: status }
		].filter((item) => item.value)
	);
	const links = $derived(
		[
			{ label: 'Live site', href: liveUrl },
			{ label: 'App Store', href: iosUrl },
			{ label: 'Google Play', href: androidUrl },
			{ label: 'Repository', href: github }
		].filter((link) => link.href)
	);
	const composition = $derived(getShowcase({ showcase, deviceShots }));
	// The Next link morphs into the next case study's top, so it carries that project's name only
	// when that page will show a named showcase (brand field and composition). Never the current
	// project's own name: names stay unique per page.
	const nextName = $derived(
		next?.brandColor && getShowcase({ showcase: next.showcase })
			? showcaseName(next.slug)
			: undefined
	);
</script>

<article class="case-study">
	<header class="top">
		<h1 class="page-title">{title}</h1>
		{#if meta.length}
			<dl class="meta">
				{#each meta as item (item.label)}
					<div>
						<dt>{item.label}</dt>
						<dd>{item.value}</dd>
					</div>
				{/each}
			</dl>
		{/if}
	</header>

	{#if brandColor && composition}
		<div class="hero field">
			<ProjectShowcase
				showcase={composition}
				{brandColor}
				size="case"
				name={slug ? showcaseName(slug) : undefined}
			/>
		</div>
	{:else if brandColor}
		<!-- No usable screens: the brand field and a large initial, never composed art. -->
		<div
			class="hero plain"
			style:background={brandColor}
			style:color={onBrand === 'light' ? '#f3efe6' : '#0e0e0d'}
		>
			<span aria-hidden="true">{title.trim().charAt(0).toUpperCase()}</span>
		</div>
	{/if}

	<Section label="Story">
		<div class="prose">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -- project bodies are authored HTML in the repo -->
			{@html html}
		</div>
	</Section>

	{#if impact.length > 0}
		<Section label="Impact">
			<ul class="impact">
				{#each impact as item (item.label)}
					<li>
						<strong>{item.value}</strong>
						<span>{item.label}</span>
					</li>
				{/each}
			</ul>
		</Section>
	{/if}

	{#if stack.length}
		<Section label="Stack">
			<p class="tags">
				{#each stack as item (item)}<span class="tag">{item}</span>{/each}
			</p>
		</Section>
	{/if}

	{#if links.length}
		<Section label="Links">
			<p class="links">
				{#each links as link (link.label)}
					<a href={link.href} rel="noopener noreferrer">{link.label}</a>
				{/each}
			</p>
		</Section>
	{/if}

	{#if next}
		<Section label="Next">
			<nav class="next" aria-label="Next case study">
				<a href="/projects/{next.slug}" data-sveltekit-preload-data>
					{#if next.brandColor}
						<span class="next-visual" aria-hidden="true">
							<WorkThumb
								project={{
									title: next.title,
									brandColor: next.brandColor,
									onBrand: next.onBrand,
									showcase: next.showcase
								}}
								name={nextName}
							/>
						</span>
					{/if}
					<span class="next-title">{next.title}</span>
				</a>
			</nav>
		</Section>
	{/if}
</article>

<style>
	.case-study {
		--gutter: var(--page-gutter);
		display: flex;
		flex-direction: column;
		/* Clears the overlay header with room to breathe. */
		padding-top: calc(var(--header-h) + clamp(2rem, 6vw, 5rem));
		padding-bottom: calc(var(--rhythm) * 8);
		gap: clamp(3rem, 7vw, 6rem);
	}

	.case-study > :global(.sec) {
		width: 100%;
		box-sizing: border-box;
	}

	.top {
		width: 100%;
		max-width: var(--page-max);
		margin-inline: auto;
		padding-inline: var(--gutter);
		display: flex;
		flex-direction: column;
		gap: clamp(2rem, 4vw, 3.5rem);
	}
	h1 {
		margin: 0;
		font-family: var(--font-display);
		font-size: var(--step-display-xl);
		line-height: var(--lh-display-xl);
		letter-spacing: var(--tracking-display-xl);
		font-weight: var(--weight-display-xl);
		overflow-wrap: anywhere;
	}
	.meta {
		margin: 0;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
		gap: 1.5rem 2rem;
		border-top: 1px solid var(--border);
		padding-top: 1.25rem;
	}
	.meta dt {
		font-size: 0.78rem;
		letter-spacing: var(--tracking-caption);
		text-transform: uppercase;
		color: var(--muted);
		margin-bottom: 0.35rem;
	}
	.meta dd {
		margin: 0;
		line-height: var(--lh-heading);
	}

	/* Full-bleed hero */
	.top {
		margin-bottom: clamp(2rem, 4vw, 3.5rem);
	}
	.hero {
		margin-bottom: clamp(1.5rem, 3vw, 2.5rem);
	}
	.hero {
		width: 100%;
	}
	.hero.plain {
		display: grid;
		place-items: center;
		min-height: clamp(14rem, 32vw, 30rem);
		font-family: var(--font-display);
		font-size: clamp(8rem, 22vw, 20rem);
		font-weight: 300;
		line-height: 1;
	}
	.hero.field {
		/* The showcase paints its own brand field and sizes its composition to fit it whole. */
		display: block;
	}

	/* Narrative: lives in a Section body, so its left edge is the site grid's second column. */
	.prose {
		font-size: 1.05rem;
	}
	.prose > :global(:not(.shots-row, img)) {
		max-width: var(--measure);
	}
	.prose :global(h2) {
		font-family: var(--font-display);
		font-size: var(--step-display-m);
		line-height: var(--lh-display-m);
		letter-spacing: var(--tracking-display-m);
		font-weight: var(--weight-display-m);
		margin-top: 2.5em;
		margin-bottom: 0.6em;
	}
	.prose :global(h2:first-child) {
		margin-top: 0;
	}
	.prose :global(img) {
		display: block;
		width: 100%;
		height: auto;
		margin-block: 2rem;
	}
	.prose :global(.shots-row) {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: clamp(0.5rem, 2.5vw, 1.25rem);
		margin-block: 2rem;
		container-type: inline-size;
	}
	/* Narrow screens: ~2.2 phones show (each >= ~140px) so the third is seen to be there; the row snaps. */
	@media (max-width: 40rem) {
		.prose :global(.shots-row) {
			display: flex;
			overflow-x: auto;
			scroll-snap-type: x mandatory;
			scrollbar-width: none;
			padding-bottom: 0.5rem;
		}
		.prose :global(.shots-row img) {
			flex: 0 0 calc((100cqw - 2 * clamp(0.5rem, 2.5vw, 1.25rem)) / 2.2);
			width: calc((100cqw - 2 * clamp(0.5rem, 2.5vw, 1.25rem)) / 2.2);
			scroll-snap-align: start;
		}
	}
	.prose :global(.shots-row img) {
		margin: 0;
		border-radius: var(--radius-screen);
		box-shadow: var(--shadow-screen);
	}

	.impact {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
		gap: 2rem;
	}
	.impact strong {
		display: block;
		font-family: var(--font-display);
		font-size: var(--step-display-l);
		line-height: var(--lh-display-l);
		letter-spacing: var(--tracking-display-l);
		font-weight: var(--weight-display-l);
		overflow-wrap: anywhere;
	}
	.impact span {
		color: var(--muted);
	}

	.tags,
	.links {
		margin: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0 1.25rem;
	}
	.tags {
		gap: 0.35rem;
	}
	.links a {
		display: inline-flex;
		align-items: center;
		min-height: var(--tap-min);
		color: var(--accent);
	}

	.next {
		margin: 0;
	}
	.next a {
		display: grid;
		gap: 1.25rem;
		max-width: 40rem;
		font-family: var(--font-display);
		font-size: var(--step-display-m);
		line-height: var(--lh-display-m);
		letter-spacing: var(--tracking-display-m);
		font-weight: var(--weight-display-m);
		color: var(--fg);
		text-decoration: none;
		overflow-wrap: anywhere;
	}
	.next a:hover,
	.next a:focus-visible {
		color: var(--accent);
	}
	.next-visual {
		display: block;
	}
</style>
