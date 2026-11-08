<script module lang="ts">
	/**
	 * Where a card sits across the strip: -1 at the left edge (card fully out), 0 at the strip's
	 * centre, +1 at the right edge (card fully out). Clamped.
	 */
	export function parallaxP(
		cardCenterX: number,
		stripCenterX: number,
		stripHalfWidth: number,
		cardWidth: number
	): number {
		const p = (cardCenterX - stripCenterX) / (stripHalfWidth + cardWidth / 2);
		return Math.max(-1, Math.min(1, p));
	}

	/**
	 * The image's translateX inside its card. It opposes p, so the image lags the card: at p = +1
	 * (card entering on the right) it shows its right-hand part, and slides right as the card
	 * travels left.
	 */
	export function parallaxX(p: number, range: number): number {
		return -Math.max(-1, Math.min(1, p)) * range;
	}
</script>

<script lang="ts">
	import type { StripScreen } from '$lib/data/showcase';

	/**
	 * A calm band of real product screens drifting left in one seamless loop. Decorative for assistive
	 * tech: aria-hidden, and its links are tabindex -1, so it never takes focus or reaches a screen
	 * reader (the hero pills give the same navigation). Pointer and touch users can click a screen to
	 * open its project, so the strip is not inert; the drift pauses while it is hovered.
	 *
	 * Every card is the same portrait 2:3 size, painted in its project's brand colour, with the
	 * screen composed inside it as an object (a bezelled phone, or a wide web shot bleeding off the
	 * edge) and the project's name under it. The object lags the card (parallax). One rAF loop moves
	 * the track and writes a `--p` position per card; layout is measured once, not per frame. The
	 * track holds two identical copies and slides by one copy's width, so the loop has no seam.
	 *
	 * `offset` pins the track (px) and stops the loop; it exists so tests can drive the strip.
	 */
	let {
		screens,
		paused = false,
		hidden = false,
		offset
	}: { screens: StripScreen[]; paused?: boolean; hidden?: boolean; offset?: number } = $props();

	const WEB_NOMINAL = 1 / 1.6; // height / width when the shot's ratio is unknown
	/** Enough screens in one copy to be wider than any viewport, however few projects there are. */
	const MIN_PER_COPY = 10;
	/** Images that load eagerly: the first few screens on the left. */
	const EAGER = 3;
	/** One copy's width per this many ms, as the old CSS drift. */
	const LOOP_MS = 80_000;

	const reps = $derived(screens.length ? Math.ceil(MIN_PER_COPY / screens.length) : 0);
	const copy = $derived(Array.from({ length: reps }, () => screens).flat());

	let strip = $state<HTMLElement>();
	let track = $state<HTMLElement>();
	let reduced = $state(false);

	$effect(() => {
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		reduced = mq.matches;
		const on = () => (reduced = mq.matches);
		mq.addEventListener('change', on);
		return () => mq.removeEventListener('change', on);
	});

	$effect(() => {
		if (!strip || !track) return;
		const stripEl = strip;
		const trackEl = track;
		const cards = [...trackEl.querySelectorAll<HTMLElement>('.card')];
		void copy.length;

		if (reduced) {
			trackEl.style.transform = '';
			for (const card of cards) card.style.removeProperty('--p');
			return;
		}

		const lastP = new Float32Array(cards.length).fill(NaN);
		let lefts: number[] = [];
		let widths: number[] = [];
		let copyW = 0;
		let stripW = 0;
		let current = 0;

		const measure = () => {
			copyW = trackEl.querySelector<HTMLElement>('.copy')?.offsetWidth ?? 0;
			stripW = stripEl.clientWidth;
			lefts = cards.map((c) => c.offsetLeft);
			widths = cards.map((c) => c.offsetWidth);
			lastP.fill(NaN);
		};

		const apply = () => {
			trackEl.style.transform = `translate3d(${-current}px,0,0)`;
			const half = stripW / 2;
			for (let i = 0; i < cards.length; i++) {
				const cx = lefts[i] + widths[i] / 2 - current;
				// Fully off-screen cards keep whatever they last had.
				if (cx < -widths[i] / 2 || cx > stripW + widths[i] / 2) continue;
				const p = parallaxP(cx, half, half, widths[i]);
				if (Math.abs(p - lastP[i]) < 0.0005) continue;
				lastP[i] = p;
				cards[i].style.setProperty('--p', p.toFixed(4));
			}
		};

		measure();
		const ro = new ResizeObserver(() => {
			measure();
			apply();
		});
		ro.observe(stripEl);
		ro.observe(trackEl);

		if (offset !== undefined) {
			current = copyW ? offset % copyW : offset;
			apply();
			return () => ro.disconnect();
		}

		apply();
		const canHover = window.matchMedia('(hover: hover)').matches;
		let hovering = false;
		const enter = () => (hovering = true);
		const leave = () => (hovering = false);
		if (canHover) {
			stripEl.addEventListener('pointerenter', enter);
			stripEl.addEventListener('pointerleave', leave);
		}

		let raf = 0;
		let last = 0;
		const tick = (now: number) => {
			raf = requestAnimationFrame(tick);
			const dt = last ? Math.min(now - last, 100) : 0;
			last = now;
			if (paused || hovering || !copyW || dt === 0) return;
			current = (current + (dt * copyW) / LOOP_MS) % copyW;
			apply();
		};
		const start = () => {
			if (!raf && !document.hidden) {
				last = 0;
				raf = requestAnimationFrame(tick);
			}
		};
		const stop = () => {
			cancelAnimationFrame(raf);
			raf = 0;
		};
		const onVisibility = () => (document.hidden ? stop() : start());
		document.addEventListener('visibilitychange', onVisibility);
		start();

		return () => {
			stop();
			document.removeEventListener('visibilitychange', onVisibility);
			stripEl.removeEventListener('pointerenter', enter);
			stripEl.removeEventListener('pointerleave', leave);
			ro.disconnect();
		};
	});
</script>

{#snippet shot(screen: StripScreen, eager: boolean, priority: 'high' | 'low' | undefined)}
	<span class="card" style:--brand={screen.brandColor} style:--ratio={screen.ratio ?? WEB_NOMINAL}>
		<span class="obj">
			<img
				src={screen.src}
				alt=""
				loading={eager ? 'eager' : 'lazy'}
				fetchpriority={priority}
				decoding="async"
				draggable="false"
			/>
		</span>
	</span>
	<span class="label">{screen.name ?? ''}</span>
{/snippet}

<div class="strip" class:hidden class:reduced aria-hidden="true" bind:this={strip}>
	<div class="track" bind:this={track}>
		{#each [0, 1] as c (c)}
			<div class="copy" data-copy={c}>
				{#each copy as screen, i (i)}
					{@const eager = c === 0 && i < EAGER}
					{@const priority = eager ? (i === 0 ? 'high' : undefined) : 'low'}
					{#if screen.href}
						<a
							class="screen {screen.kind}"
							href={screen.href}
							tabindex="-1"
							aria-hidden="true"
							{...screen.href.startsWith('/')
								? { 'data-sveltekit-preload-data': 'hover' }
								: { target: '_blank', rel: 'noopener noreferrer' }}
						>
							{@render shot(screen, eager, priority)}
						</a>
					{:else}
						<div class="screen {screen.kind}">
							{@render shot(screen, eager, priority)}
						</div>
					{/if}
				{/each}
			</div>
		{/each}
	</div>
</div>

<style>
	/* A size container, so the cards' height can follow whatever height the grid gives the band. */
	.strip {
		container-type: size;
		min-height: 0;
		overflow-x: clip;
		overflow-y: visible;
		opacity: 0.88;
	}
	.strip.hidden {
		opacity: 0;
		visibility: hidden;
	}
	.track {
		--label-gap: 0.5rem;
		--label-lh: 1.35rem;
		/* The card plus its label fit the band as the card alone did before. */
		--h: clamp(4.5rem, min(100cqh - 1.5rem - var(--label-gap) - var(--label-lh), 32vh), 25rem);
		--w: calc(var(--h) * 2 / 3);
		--gap: clamp(0.5rem, 0.7vw, 0.875rem);
		position: relative;
		display: flex;
		align-items: center;
		width: max-content;
		height: 100%;
		will-change: transform;
	}
	.copy {
		display: flex;
		flex: none;
		align-items: center;
		gap: var(--gap);
		/* The copy ends with a gap too, so one copy's width is exactly the loop distance. */
		padding-right: var(--gap);
		/* offsetLeft of a card is measured against the track. */
		position: static;
	}

	/* A card plus its name label: one link. Static, so the card's offsetLeft is against the track. */
	.screen {
		display: block;
		flex: none;
		width: var(--w);
		line-height: 0;
	}
	a.screen {
		cursor: pointer;
		color: inherit;
		text-decoration: none;
	}
	.card {
		position: relative;
		display: block;
		width: var(--w);
		height: var(--h);
		overflow: hidden;
		border-radius: 0;
		background: var(--brand, var(--code-bg));
	}
	.label {
		display: block;
		margin-top: var(--label-gap);
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		font-size: var(--step-small);
		line-height: var(--label-lh);
		height: var(--label-lh);
		color: var(--muted);
	}

	/* The composed object. Its parallax lags the card (see parallaxX): range is 7% of the card's
	   width for phones, 25% for web shots. */
	.obj {
		position: absolute;
		display: block;
		box-sizing: border-box;
		line-height: 0;
		--range: 0.25;
		transform: translate3d(calc(var(--p, 0) * var(--w) * var(--range) * -1), 0, 0);
		will-change: transform;
		box-shadow: var(--shadow-screen);
	}
	.web .obj {
		left: 12%;
		top: 18%;
		width: 150%;
		overflow: hidden;
		border-radius: var(--radius-screen);
	}
	/* Thin near-black bezel as ProjectShowcase draws it; screen radius is 9% of the screen's width. */
	.phone .obj {
		--range: 0.07;
		--ow: calc(var(--w) * 0.62);
		--bezel: calc(var(--ow) * 0.018);
		--r: calc(var(--ow) * 0.09);
		left: 19%;
		top: 14%;
		width: 62%;
		padding: var(--bezel);
		border-radius: calc(var(--r) + var(--bezel));
		background: #0b0b0c;
	}
	img {
		display: block;
		width: 100%;
		height: auto;
		aspect-ratio: 1 / var(--ratio);
		object-fit: cover;
		-webkit-user-drag: none;
		user-select: none;
	}
	.phone img {
		border-radius: var(--r);
	}

	/* Phones: no names under the cards (the pills name the projects), and the space goes to the
	   images, a little larger than the band's old share. Units on the zeros: calc() needs them. */
	@media (max-width: 640px) {
		.track {
			--label-gap: 0rem;
			--label-lh: 0rem;
			--h: clamp(4.5rem, min(100cqh - 0.5rem, 36vh), 25rem);
		}
		.label {
			display: none;
		}
	}

	@media (prefers-reduced-motion: no-preference) {
		.strip {
			transition:
				opacity 400ms ease-out,
				visibility 0s;
		}
		.strip.hidden {
			transition:
				opacity 400ms ease-out,
				visibility 0s linear 400ms;
		}
	}

	/* Static: the first copy is the whole strip, images centred. */
	.strip.reduced .copy[data-copy='1'] {
		display: none;
	}
	.strip.reduced .obj {
		transform: none;
	}
	@media (prefers-reduced-motion: reduce) {
		.copy[data-copy='1'] {
			display: none;
		}
		.obj {
			transform: none;
		}
	}
</style>
