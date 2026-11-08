<script lang="ts">
	import type { StripScreen } from '$lib/data/showcase';

	/**
	 * A calm band of real product screens drifting left in one seamless loop. Decorative for assistive
	 * tech: aria-hidden, and its links are tabindex -1, so it never takes focus or reaches a screen
	 * reader (the hero pills give the same navigation). Pointer and touch users can click a screen to
	 * open its project, so the strip is not inert; the drift pauses while it is hovered.
	 *
	 * The track holds two identical copies of the screens and slides by exactly one copy's width, so
	 * the loop has no seam. Each screen has one shared height; its width follows its image's real
	 * aspect (nominal until the image reports it). Screens use the same radius and shadow tokens as
	 * ProjectShowcase, and phones the same thin bezel.
	 */
	let {
		screens,
		paused = false,
		hidden = false
	}: { screens: StripScreen[]; paused?: boolean; hidden?: boolean } = $props();

	const WEB_NOMINAL = 1 / 1.6; // height / width until the image reports its own
	const PHONE_NOMINAL = 2.2;
	/** Enough screens in one copy to be wider than any viewport, however few projects there are. */
	const MIN_PER_COPY = 10;
	/** Images that load eagerly: the first few screens on the left. */
	const EAGER = 3;

	let measured = $state<Record<string, number>>({});
	function measure(node: HTMLImageElement, src: string) {
		const read = () => {
			if (node.naturalWidth) measured[src] = node.naturalHeight / node.naturalWidth;
		};
		if (node.complete) read();
		node.addEventListener('load', read);
		return { destroy: () => node.removeEventListener('load', read) };
	}

	const reps = $derived(screens.length ? Math.ceil(MIN_PER_COPY / screens.length) : 0);
	const copy = $derived(Array.from({ length: reps }, () => screens).flat());
</script>

{#snippet shot(src: string, eager: boolean, priority: 'high' | 'low' | undefined)}
	<img
		use:measure={src}
		{src}
		alt=""
		loading={eager ? 'eager' : 'lazy'}
		fetchpriority={priority}
		decoding="async"
		draggable="false"
	/>
{/snippet}

<div class="strip" class:hidden aria-hidden="true">
	<div class="track" class:paused>
		{#each [0, 1] as c (c)}
			<div class="copy" data-copy={c}>
				{#each copy as screen, i (i)}
					{@const ratio =
						measured[screen.src] ??
						screen.ratio ??
						(screen.kind === 'phone' ? PHONE_NOMINAL : WEB_NOMINAL)}
					{@const eager = c === 0 && i < EAGER}
					{@const priority = eager ? (i === 0 ? 'high' : undefined) : 'low'}
					{#if screen.href}
						<a
							class="screen {screen.kind}"
							style:aspect-ratio={1 / ratio}
							href={screen.href}
							tabindex="-1"
							aria-hidden="true"
							{...screen.href.startsWith('/')
								? { 'data-sveltekit-preload-data': 'hover' }
								: { rel: 'noopener noreferrer' }}
						>
							{@render shot(screen.src, eager, priority)}
						</a>
					{:else}
						<div class="screen {screen.kind}" style:aspect-ratio={1 / ratio}>
							{@render shot(screen.src, eager, priority)}
						</div>
					{/if}
				{/each}
			</div>
		{/each}
	</div>
</div>

<style>
	/* A size container, so the screens' height can follow whatever height the grid gives the band. */
	.strip {
		container-type: size;
		min-height: 0;
		/* Only the sides clip: the screens' shadows must fall past the band, not be cut into a line. */
		overflow-x: clip;
		overflow-y: visible;
		opacity: 0.88;
	}
	.strip.hidden {
		opacity: 0;
		visibility: hidden;
	}
	.track {
		--h: clamp(4.5rem, min(100cqh - 1.5rem, 32vh), 25rem);
		--gap: clamp(1rem, 2.2vw, 2.75rem);
		display: flex;
		align-items: center;
		width: max-content;
		height: 100%;
		animation: drift 80s linear infinite;
	}
	.track.paused,
	.strip:hover .track {
		animation-play-state: paused;
	}
	.copy {
		display: flex;
		flex: none;
		align-items: center;
		gap: var(--gap);
		/* The copy ends with a gap too, so one copy's width is exactly the loop distance. */
		padding-right: var(--gap);
	}
	@keyframes drift {
		to {
			transform: translateX(-50%);
		}
	}

	.screen {
		position: relative;
		flex: none;
		height: var(--h);
		box-shadow: var(--shadow-screen);
		line-height: 0;
	}
	a.screen {
		display: block;
		cursor: pointer;
	}
	img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		-webkit-user-drag: none;
		user-select: none;
	}
	.web {
		overflow: hidden;
		border-radius: var(--radius-screen);
	}
	/* Thin near-black bezel; corner radius scales with the phone, as in ProjectShowcase. */
	.phone {
		--bezel: calc(var(--h) * 0.008);
		--r: calc(var(--h) * 0.065);
		box-sizing: border-box;
		padding: var(--bezel);
		border-radius: var(--r);
		background: #0b0b0c;
	}
	.phone img {
		border-radius: calc(var(--r) - var(--bezel));
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

	@media (prefers-reduced-motion: reduce) {
		.track {
			animation: none;
		}
		/* Static: the first copy is the whole strip. */
		.copy[data-copy='1'] {
			display: none;
		}
	}
</style>
