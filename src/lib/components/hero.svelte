<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import type { PillProject } from '$lib/data/projects';
	import DeviceFrame from './device-frame.svelte';

	/**
	 * One-screen homepage hero. Default: a huge light headline, a short intro and a column of project
	 * pills. Hovering or focusing a pill turns the whole hero into that project: a flat brand-colour
	 * field, the project name, one line, what was built, and device screens rising from the bottom.
	 * On phones the pills become a horizontal scroll row and the active state is switched off, so a
	 * tap simply navigates.
	 */
	let {
		pills,
		headline,
		intro
	}: { pills: PillProject[]; headline: string | Snippet; intro: string } = $props();

	// Text colours for `onBrand`. Contrast against the brand fields is checked in the task report.
	const ON_BRAND = { dark: '#0e0e0d', light: '#f3efe6' } as const;

	let activeSlug = $state('');
	let phone = $state(false);

	const active = $derived(pills.find((p) => p.slug === activeSlug && p.brandColor && p.onBrand));

	onMount(() => {
		const query = window.matchMedia('(max-width: 640px)');
		const sync = () => {
			phone = query.matches;
			if (phone) activeSlug = '';
		};
		sync();
		query.addEventListener('change', sync);
		return () => query.removeEventListener('change', sync);
	});

	// The overlay header sits outside the hero; tell it which tone reads on the current field.
	$effect(() => {
		const root = document.documentElement;
		if (active?.onBrand && active.brandColor) {
			root.dataset.heroTone = active.onBrand;
			root.style.setProperty('--hero-field', active.brandColor);
		} else {
			delete root.dataset.heroTone;
			root.style.removeProperty('--hero-field');
		}
		return () => {
			delete root.dataset.heroTone;
			root.style.removeProperty('--hero-field');
		};
	});

	function activate(slug: string) {
		if (!phone) activeSlug = slug;
	}
	function reset() {
		activeSlug = '';
	}
	function leaveList(event: FocusEvent & { currentTarget: HTMLElement }) {
		const next = event.relatedTarget as Node | null;
		if (!next || !event.currentTarget.contains(next)) reset();
	}
</script>

<section
	class="hero"
	data-active={activeSlug && active ? activeSlug : ''}
	style:--hero-bg={active?.brandColor}
	style:--hero-fg={active?.onBrand ? ON_BRAND[active.onBrand] : undefined}
>
	<div class="content">
		<p class="intro layer" class:off={!!active}>{intro}</p>

		<div class="stage">
			<h1 class="headline layer" class:off={!!active}>
				{#if typeof headline === 'string'}{headline}{:else}{@render headline()}{/if}
			</h1>
			{#each pills as pill (pill.slug)}
				{@const on = active?.slug === pill.slug}
				<div class="project layer" class:on aria-hidden="true" inert={!on}>
					<p class="title">{pill.title}</p>
					<p class="one-line" id="hero-desc-{pill.slug}">{pill.oneLine}</p>
					{#if pill.built?.length}
						<p class="built">{pill.built.join(' · ')}</p>
					{/if}
				</div>
			{/each}
		</div>

		<nav class="nav" aria-label="Selected work">
			<ul class="pills" onmouseleave={reset} onfocusout={leaveList}>
				{#each pills as pill (pill.slug)}
					<li>
						<a
							href="/projects/{pill.slug}"
							class="pill"
							class:current={active?.slug === pill.slug}
							aria-describedby="hero-desc-{pill.slug}"
							data-sveltekit-preload-data
							onmouseenter={() => activate(pill.slug)}
							onfocus={() => activate(pill.slug)}>{pill.title}</a
						>
					</li>
				{/each}
				<li>
					<a href="/projects" class="pill all" data-sveltekit-preload-data
						>All work <span aria-hidden="true">→</span></a
					>
				</li>
			</ul>
		</nav>
	</div>

	<div class="shots" aria-hidden="true">
		{#each pills as pill (pill.slug)}
			{@const on = active?.slug === pill.slug}
			{@const shots = (pill.deviceShots ?? []).slice(0, 2)}
			{#if shots.length}
				<div class="shot-set layer" class:on class:browser={shots[0].kind === 'browser'}>
					{#each shots as shot, i (shot.src)}
						<div class="shot" class:second={i === 1}>
							<DeviceFrame kind={shot.kind} src={shot.src} alt="" loading="eager" />
						</div>
					{/each}
				</div>
			{/if}
		{/each}
	</div>
</section>

<style>
	.hero {
		--pad: clamp(1.25rem, 3vw, 2.5rem);
		position: relative;
		isolation: isolate;
		overflow: clip;
		min-height: 100svh;
		display: flex;
		background: var(--hero-bg, var(--bg));
		color: var(--hero-fg, var(--fg));
	}
	.content {
		position: relative;
		z-index: 2;
		flex: 1;
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 26rem);
		grid-template-rows: auto 1fr auto;
		grid-template-areas:
			'. intro'
			'stage stage'
			'nav nav';
		column-gap: var(--pad);
		/* Top padding clears the overlay header (~4rem tall). */
		padding: 5.5rem var(--pad) var(--pad);
	}
	.intro {
		grid-area: intro;
		margin: 0;
		font-size: var(--step-heading);
		line-height: 1.35;
		letter-spacing: var(--tracking-heading);
		max-width: 26rem;
		justify-self: end;
	}
	.stage {
		grid-area: stage;
		display: grid;
		align-items: end;
		padding-block: 3rem 2rem;
	}
	.stage > * {
		grid-area: 1 / 1;
	}
	.headline {
		margin: 0;
		max-width: 11.5em;
		font-family: var(--font-display);
		font-size: var(--step-display-xl);
		line-height: var(--lh-display-xl);
		letter-spacing: var(--tracking-display-xl);
		font-weight: var(--weight-display-xl);
	}
	.project {
		align-self: end;
		max-width: min(46rem, 58%);
		pointer-events: none;
	}
	.title {
		margin: 0;
		font-family: var(--font-display);
		font-size: var(--step-display-l);
		line-height: var(--lh-display-l);
		letter-spacing: var(--tracking-display-l);
		font-weight: var(--weight-display-l);
	}
	.one-line {
		margin: 1.25rem 0 0;
		max-width: 30rem;
		font-size: var(--step-heading);
		line-height: 1.35;
		letter-spacing: var(--tracking-heading);
	}
	.built {
		margin: 0.9rem 0 0;
		font-size: var(--step-small);
		line-height: var(--lh-small);
		letter-spacing: 0.01em;
		font-weight: 500;
	}

	.nav {
		grid-area: nav;
	}
	.pills {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.55rem;
	}
	.pill {
		display: inline-flex;
		align-items: center;
		gap: 0.4em;
		padding: 0.55rem 1.3rem;
		border: 1px solid color-mix(in srgb, currentColor 55%, transparent);
		border-radius: 999px;
		color: inherit;
		font-size: 1.05rem;
		line-height: 1.2;
		text-decoration: none;
		white-space: nowrap;
	}
	.pill:hover,
	.pill:focus-visible,
	.pill.current {
		background: var(--hero-fg, var(--fg));
		border-color: var(--hero-fg, var(--fg));
		color: var(--hero-bg, var(--bg));
	}
	.pill:focus-visible {
		outline: 2px solid var(--hero-fg, var(--fg));
		outline-offset: 3px;
	}
	.pill.all {
		border-style: dashed;
	}

	/* Device screens rise from the bottom-right. */
	.shots {
		position: absolute;
		inset: 0;
		z-index: 1;
		pointer-events: none;
	}
	.shot-set {
		position: absolute;
		right: var(--pad);
		bottom: 0;
		display: flex;
		align-items: flex-end;
		gap: clamp(0.75rem, 1.6vw, 1.75rem);
		transform: translateY(10%);
	}
	.shot-set.on {
		transform: none;
	}
	.shot {
		width: clamp(9rem, 15.5vw, 17rem);
		margin-bottom: -9%;
	}
	.shot.second {
		margin-bottom: -2%;
		transform: translateY(-9%);
	}
	.shot-set.browser {
		right: var(--pad);
		margin-right: 0;
	}
	.shot-set.browser .shot {
		width: clamp(22rem, 47vw, 50rem);
		margin-bottom: -7%;
	}

	/* One layer fades out as the next fades in. The destination state's transition wins, so hiding
	   waits for the fade before flipping visibility and showing flips it straight away. */
	.layer.off,
	.project:not(.on),
	.shot-set:not(.on) {
		opacity: 0;
		visibility: hidden;
	}

	@media (prefers-reduced-motion: no-preference) {
		.hero {
			transition: background-color 400ms ease-out;
		}
		.layer {
			transition:
				opacity 400ms ease-out,
				transform 400ms ease-out,
				visibility 0s;
		}
		.layer.off,
		.project:not(.on),
		.shot-set:not(.on) {
			transition:
				opacity 400ms ease-out,
				transform 400ms ease-out,
				visibility 0s linear 400ms;
		}
		.pill {
			transition:
				background-color 150ms ease-out,
				color 150ms ease-out;
		}
	}

	@media (max-width: 640px) {
		.hero {
			min-height: 100svh;
		}
		.content {
			grid-template-columns: minmax(0, 1fr);
			grid-template-rows: auto 1fr auto;
			grid-template-areas:
				'stage'
				'intro'
				'nav';
			padding-top: 5.5rem;
		}
		.stage {
			align-items: start;
			padding-block: 1.5rem 1.5rem;
		}
		.intro {
			justify-self: start;
			font-size: 1.05rem;
			padding-bottom: 1.75rem;
		}
		.project,
		.shots {
			display: none;
		}
		.nav {
			margin-inline: calc(var(--pad) * -1);
		}
		.pills {
			flex-direction: row;
			align-items: center;
			gap: 0.5rem;
			overflow-x: auto;
			padding-inline: var(--pad);
			padding-bottom: 0.25rem;
			scroll-snap-type: x proximity;
			scroll-padding-inline: var(--pad);
			scrollbar-width: none;
		}
		.pills::-webkit-scrollbar {
			display: none;
		}
		.pills > li {
			flex: none;
			scroll-snap-align: start;
		}
	}
</style>
