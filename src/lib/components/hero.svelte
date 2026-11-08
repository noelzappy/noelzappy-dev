<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import type { PillProject } from '$lib/data/projects';
	import { getShowcase, getStripScreens, type StripScreen } from '$lib/data/showcase';
	import ProjectShowcase from './project-showcase.svelte';
	import { showcaseName } from '$lib/motion/shared';
	import CalButton from './CalButton.svelte';
	import { CAL_EVENTS } from '$lib/cal';
	import RiseWords from './rise-words.svelte';
	import WorkStrip from './work-strip.svelte';

	/**
	 * One-screen homepage hero with no dead space. Default: a band of real product screens drifting
	 * under the header, then a huge light headline (scaled with the viewport) with the intro beside
	 * it, then the project pills. Hovering or focusing a pill turns the whole hero into that project:
	 * a flat brand-colour field, the project's composition large and centred in the right half, and
	 * its name, one line and what was built on the left above the pills. On phones the pills become a
	 * horizontal scroll row and the active state is switched off, so a tap simply navigates.
	 */
	let {
		pills,
		headline,
		intro,
		screens
	}: { pills: PillProject[]; headline: string | Snippet; intro: string; screens?: StripScreen[] } =
		$props();

	const stripScreens = $derived(screens?.length ? screens : getStripScreens(pills));

	// Text colours for `onBrand`. Contrast against the brand fields is checked in the task report.
	const ON_BRAND = { dark: '#0e0e0d', light: '#f3efe6' } as const;

	let activeSlug = $state('');
	let phone = $state(false);
	/** The pointer or focus is in the pill list: the strip holds still. */
	let engaged = $state(false);
	let tabHidden = $state(false);

	const active = $derived(pills.find((p) => p.slug === activeSlug && p.brandColor && p.onBrand));

	onMount(() => {
		const query = window.matchMedia('(max-width: 640px)');
		const sync = () => {
			phone = query.matches;
			if (phone) activeSlug = '';
		};
		sync();
		query.addEventListener('change', sync);
		const visibility = () => (tabHidden = document.hidden);
		visibility();
		document.addEventListener('visibilitychange', visibility);
		return () => {
			query.removeEventListener('change', sync);
			document.removeEventListener('visibilitychange', visibility);
		};
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
		if (!next || !event.currentTarget.contains(next)) {
			engaged = false;
			reset();
		}
	}
	function leavePointer() {
		engaged = false;
		reset();
	}
</script>

<section
	class="hero"
	data-active={activeSlug && active ? activeSlug : ''}
	style:--hero-bg={active?.brandColor}
	style:--hero-fg={active?.onBrand ? ON_BRAND[active.onBrand] : undefined}
>
	<WorkStrip screens={stripScreens} paused={engaged || tabHidden || !!active} hidden={!!active} />

	<div class="main">
		<h1
			class="headline layer page-title"
			class:off={!!active}
			aria-label={typeof headline === 'string' ? headline : undefined}
		>
			{#if typeof headline === 'string'}<RiseWords
					text={headline}
				/>{:else}{@render headline()}{/if}
		</h1>
		<div class="lede layer" class:off={!!active}>
			<p class="intro">{intro}</p>
			<div class="book">
				<CalButton eventSlug={CAL_EVENTS.intro} label="Book a call" arrow />
			</div>
		</div>
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
		<ul
			class="pills"
			onmouseenter={() => (engaged = true)}
			onmouseleave={leavePointer}
			onfocusin={() => (engaged = true)}
			onfocusout={leaveList}
		>
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
				<a
					href="/projects"
					class="pill all"
					data-sveltekit-preload-data
					onmouseenter={reset}
					onfocus={reset}>All work <span aria-hidden="true">→</span></a
				>
			</li>
		</ul>
	</nav>

	<div class="shots" aria-hidden="true">
		{#each pills as pill (pill.slug)}
			{@const on = active?.slug === pill.slug}
			{@const showcase = getShowcase(pill)}
			{#if showcase}
				<div class="shot-set layer" class:on>
					<ProjectShowcase
						showcase={{
							...showcase,
							web: showcase.web && { ...showcase.web, alt: '' },
							phones: showcase.phones?.map((p) => ({ ...p, alt: '' }))
						}}
						size="hero"
						name={on ? showcaseName(pill.slug) : undefined}
						deferred
					/>
				</div>
			{/if}
		{/each}
	</div>
</section>

<style>
	.hero {
		--pad: clamp(1.25rem, 3vw, 2.5rem);
		/* Headline scales with the viewport so it fills most of the content width at any size, and is
		   capped by height so headline + pills always fit one screen. */
		--hl: min(clamp(var(--step-display-l), 7.8vw, 14rem), 16vh);
		--intro-w: clamp(17rem, 22vw, 34rem);
		position: relative;
		isolation: isolate;
		overflow: clip;
		min-height: 100svh;
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		/* The strip takes whatever height the headline and pills leave, so nothing is left over. */
		grid-template-rows: minmax(4.5rem, 1fr) auto auto;
		/* Top padding clears the overlay header. */
		padding: var(--header-h) 0 var(--pad);
		background: var(--hero-bg, var(--bg));
		color: var(--hero-fg, var(--fg));
	}
	.main,
	.nav {
		z-index: 2;
		padding-inline: var(--pad);
	}
	.main {
		display: grid;
		grid-template-columns: minmax(0, 1fr) var(--intro-w);
		column-gap: var(--pad);
		align-items: start;
		padding-top: 0.5rem;
	}
	.headline {
		grid-area: 1 / 1;
		margin: 0;
		font-family: var(--font-display);
		font-size: var(--hl);
		text-wrap: balance;
		line-height: var(--lh-display-xl);
		letter-spacing: var(--tracking-display-xl);
		font-weight: var(--weight-display-xl);
	}
	.lede {
		grid-area: 1 / 2;
		margin: calc(var(--hl) * 0.2) 0 0;
		font-size: clamp(1.05rem, 1.35vw, 1.7rem);
		line-height: 1.35;
		letter-spacing: var(--tracking-heading);
	}
	.intro,
	.proof {
		margin: 0;
		text-wrap: pretty;
	}
	.proof {
		margin-top: 0.6rem;
		color: var(--muted);
		font-size: var(--step-small);
		line-height: var(--lh-small);
		letter-spacing: var(--tracking-small);
	}
	.book {
		margin-top: 0.1rem;
	}
	.book :global(.cal-link) {
		display: inline-flex;
		align-items: center;
		gap: 0.4em;
		min-height: 2.75rem;
		padding-block: 0.5rem;
		font-size: inherit;
		letter-spacing: inherit;
	}
	/* Out of flow, so the tallest layer never sets the row's height; the headline does. Centred on
	   the same line as the composition (the box between the header and the bottom padding). */
	.project {
		position: absolute;
		left: var(--pad);
		top: calc((var(--header-h) + 100% - var(--pad)) / 2);
		transform: translateY(-50%);
		width: calc(50% - var(--pad) * 1.5);
		pointer-events: none;
	}
	.title {
		margin: 0;
		font-family: var(--font-display);
		font-size: min(clamp(var(--step-display-l), 8vw, 13rem), 15vh);
		line-height: var(--lh-display-l);
		letter-spacing: var(--tracking-display-l);
		font-weight: var(--weight-display-l);
	}
	.one-line {
		margin: 1.25rem 0 0;
		max-width: 32rem;
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
		padding-top: 1.5rem;
	}
	.pills {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.55rem;
	}
	.pill {
		display: inline-flex;
		align-items: center;
		gap: 0.4em;
		min-height: var(--tap-min);
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
	@media (max-height: 820px) {
		.nav {
			padding-top: 1rem;
		}
		.pill {
			padding: 0.4rem 1.1rem;
		}
	}

	/* The active composition: the right half, header to bottom padding, centred inside. The
	   composition fits itself whole inside this box by whichever axis binds first. */
	.shots {
		position: absolute;
		z-index: 1;
		top: var(--header-h);
		bottom: var(--pad);
		left: 50%;
		right: var(--pad);
		pointer-events: none;
	}
	.shot-set {
		position: absolute;
		inset: 0;
	}
	/* Transparent normally (the hero's own field shows through, so nothing has a visible edge while
	   it fades). Painted only for the morph's old snapshot, which then carries the field into the
	   case study. */
	:global(html.morph-active) .shot-set.on :global(.showcase) {
		background: var(--hero-bg);
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
		/* The active composition's screens stagger in: the web screen first, then each phone 80ms
		   apart (restarts every time a showcase becomes the active one). */
		.shot-set.on :global(.web) {
			animation: shot-in 500ms cubic-bezier(0.22, 0.8, 0.2, 1) both;
		}
		.shot-set.on :global(.phone) {
			animation: shot-in 500ms cubic-bezier(0.22, 0.8, 0.2, 1) both;
			animation-delay: calc(120ms + var(--i, 0) * 80ms);
		}
		@keyframes shot-in {
			from {
				opacity: 0;
				transform: translateY(14px);
			}
			to {
				opacity: 1;
				transform: none;
			}
		}
	}

	/* Narrower than a wide desktop: the intro drops under the headline instead of beside it. */
	@media (max-width: 1000px) {
		.main {
			grid-template-columns: minmax(0, 1fr);
		}
		.lede {
			grid-area: 2 / 1;
			margin-top: 1.25rem;
			max-width: 36rem;
		}
	}

	@media (max-width: 640px) {
		.hero {
			--hl: clamp(2.4rem, 11.5vw, 3.5rem);
		}
		.lede {
			font-size: 1.05rem;
			padding-bottom: 0.75rem;
		}
		.project,
		.shots {
			display: none;
		}
		.nav {
			padding-inline: 0;
			padding-top: 0;
		}
		.pills {
			flex-wrap: nowrap;
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
