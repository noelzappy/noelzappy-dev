<script lang="ts">
	import type { DeviceShot } from '$lib/data/projects';
	import DeviceFrame from './device-frame.svelte';

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
	const shots = $derived(deviceShots.slice(0, 3));
</script>

<article class="case-study">
	<header class="top">
		<h1>{title}</h1>
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
	{:else if brandColor && shots.length}
		<div class="hero field" style:background={brandColor}>
			<div class="shots" data-count={shots.length}>
				{#each shots as shot (shot.src)}
					<div class="shot {shot.kind}">
						<DeviceFrame kind={shot.kind} src={shot.src} alt={shot.alt} loading="eager" />
					</div>
				{/each}
			</div>
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
			<p>Next case study</p>
			<a href="/projects/{next.slug}">{next.title}</a>
		</nav>
	{/if}
</article>

<style>
	.case-study {
		--gutter: clamp(1.25rem, 3vw, 2.5rem);
		display: flex;
		flex-direction: column;
		/* Clears the overlay header (one line, ~3.5rem) with room to breathe. */
		padding-top: clamp(6rem, 12vw, 9rem);
		padding-bottom: calc(var(--rhythm) * 8);
		gap: clamp(3rem, 7vw, 6rem);
	}

	.top {
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
		display: flex;
		justify-content: center;
		padding: clamp(2.5rem, 6vw, 5rem) var(--gutter);
		overflow: hidden;
	}
	.shots {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: clamp(1rem, 3vw, 3rem);
		width: 100%;
		max-width: 64rem;
	}
	.shot.phone {
		flex: 0 1 15rem;
		min-width: 0;
	}
	.shot.browser {
		flex: 1 1 0;
		min-width: 0;
		max-width: 48rem;
	}
	/* The middle phone sits lower, so three read as a staggered set. */
	.shots[data-count='3'] .shot:nth-child(2) {
		transform: translateY(2.5rem);
	}
	@media (max-width: 640px) {
		.shot.phone {
			flex-basis: 8rem;
		}
		.shots[data-count='3'] .shot:nth-child(2) {
			transform: translateY(1.25rem);
		}
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
		/* DeviceFrame screen radius is 11% of the frame width; each image is about a third of the row. */
		border-radius: 3.4cqw;
		box-shadow: 0 0.6rem 1.5rem rgba(0, 0, 0, 0.18);
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
		padding-inline: var(--gutter);
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
