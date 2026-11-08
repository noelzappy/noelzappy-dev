<script lang="ts">
	import type { DeviceShot, Showcase } from '$lib/data/projects';
	import { getShowcase } from '$lib/data/showcase';
	import ProjectShowcase from './project-showcase.svelte';

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
		title,
		html,
		engagement = '',
		stage = '',
		built = [],
		status = '',
		brandColor = '',
		heroImage = '',
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
		title: string;
		html: string;
		engagement?: string;
		stage?: string;
		built?: string[];
		status?: string;
		brandColor?: string;
		heroImage?: string;
		deviceShots?: DeviceShot[];
		showcase?: Showcase;
		impact?: { value: string; label: string }[];
		stack?: string[];
		liveUrl?: string;
		iosUrl?: string;
		androidUrl?: string;
		github?: string;
		next?: { slug: string; title: string } | null;
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

	{#if heroImage}
		<div class="hero image">
			<img src={heroImage} alt="" loading="eager" decoding="async" />
		</div>
	{:else if brandColor && composition}
		<div class="hero field">
			<ProjectShowcase showcase={composition} {brandColor} size="case" />
		</div>
	{/if}

	<div class="column prose">
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- project bodies are authored HTML in the repo -->
		{@html html}
	</div>

	{#if impact.length > 0}
		<section class="impact" aria-labelledby="impact-heading">
			<h2 id="impact-heading">Impact</h2>
			<ul>
				{#each impact as item (item.label)}
					<li>
						<strong>{item.value}</strong>
						<span>{item.label}</span>
					</li>
				{/each}
			</ul>
		</section>
	{/if}

	{#if stack.length || links.length}
		<section class="column facts">
			{#if stack.length}
				<div>
					<h2>Stack</h2>
					<p class="tags">
						{#each stack as item (item)}<span class="tag">{item}</span>{/each}
					</p>
				</div>
			{/if}
			{#if links.length}
				<div>
					<h2>Links</h2>
					<p class="links">
						{#each links as link (link.label)}
							<a href={link.href} rel="noopener noreferrer">{link.label}</a>
						{/each}
					</p>
				</div>
			{/if}
		</section>
	{/if}

	{#if next}
		<nav class="next" aria-label="Next case study">
			<div class="next-inner">
				<p>Next case study</p>
				<a href="/projects/{next.slug}">{next.title}</a>
			</div>
		</nav>
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
	.hero {
		width: 100%;
	}
	.hero.image img {
		display: block;
		width: 100%;
		max-height: 85vh;
		object-fit: cover;
	}
	.hero.field {
		/* The showcase paints its own brand field and sizes its composition to fit it whole. */
		display: block;
	}

	/* Narrative */
	.column {
		width: 100%;
		max-width: calc(var(--measure) + 2 * var(--gutter));
		margin-inline: auto;
		padding-inline: var(--gutter);
		box-sizing: border-box;
	}
	.prose {
		font-size: 1.05rem;
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
	.prose :global(.shots-row img) {
		margin: 0;
		border-radius: var(--radius-screen);
		box-shadow: var(--shadow-screen);
	}

	/* Impact */
	.impact {
		padding-inline: var(--gutter);
		border-top: 1px solid var(--border);
		padding-top: 1.5rem;
	}
	.impact h2 {
		margin: 0 0 1.5rem;
		font-size: 0.78rem;
		letter-spacing: var(--tracking-caption);
		text-transform: uppercase;
		color: var(--muted);
		font-weight: 400;
	}
	.impact ul {
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

	/* Stack + links */
	.facts {
		display: grid;
		gap: 2rem;
	}
	.facts h2 {
		margin: 0 0 0.75rem;
		font-size: 0.78rem;
		letter-spacing: var(--tracking-caption);
		text-transform: uppercase;
		color: var(--muted);
		font-weight: 400;
	}
	.facts p {
		margin: 0;
	}
	.tags,
	.links {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem 1.25rem;
	}
	.tags {
		gap: 0.35rem;
	}
	.links a {
		color: var(--accent);
	}

	/* Next */
	.next {
		width: 100%;
		max-width: var(--page-max);
		margin-inline: auto;
		padding-inline: var(--gutter);
	}
	.next-inner {
		border-top: 1px solid var(--border);
		padding-top: 1.5rem;
	}
	.next p {
		margin: 0 0 0.75rem;
		font-size: 0.78rem;
		letter-spacing: var(--tracking-caption);
		text-transform: uppercase;
		color: var(--muted);
	}
	.next a {
		font-family: var(--font-display);
		font-size: var(--step-display-l);
		line-height: var(--lh-display-l);
		letter-spacing: var(--tracking-display-l);
		font-weight: var(--weight-display-l);
		color: var(--fg);
		text-decoration: none;
		overflow-wrap: anywhere;
	}
	.next a:hover,
	.next a:focus-visible {
		color: var(--accent);
	}
</style>
