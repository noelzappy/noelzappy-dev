<script lang="ts">
	import type { Showcase } from '$lib/data/projects';
	import { resolveShowcase } from '$lib/data/showcase';

	/**
	 * One fixed, frameless composition per project, always shown whole and at one scale.
	 *
	 * Everything is laid out in "units" on a grid whose width is the composition's width. A phone is
	 * PHONE units wide and the web screen WEB units, so a phone is always 23 / 82 = 28% of the web
	 * screen however big the composition is. Each screen's height comes from its image's real aspect
	 * (measured on load; a server-provided `ratio`, else nominal, until then), so no source can overrun the composition.
	 *
	 * Sizing: the composition is sized by its field (`cqw`/`cqh`), centred with padding, and capped in
	 * CSS pixels so the small source crops (phones ~250-320px wide, web ~820px) are never rendered
	 * larger than they are. `hero` and `row` fields are given a size and the composition fits inside
	 * it; the `case` field is sized by the composition (capped width -> height + padding, at most
	 * 85vh), so it never carries bands of empty colour.
	 */
	type Props = {
		showcase: Showcase;
		/** Paints the field. Omit to sit on whatever surface the parent provides. */
		brandColor?: string;
		size: 'hero' | 'row' | 'case';
		/** view-transition-name for the morph between hero, row and case study. Only one element on a
		 * page may carry a given name, so callers set it only on the one that is on show. */
		name?: string;
		/** Defer loading and fetch at low priority: for compositions that start out hidden. */
		deferred?: boolean;
	};
	let { showcase, brandColor, size, name, deferred = false }: Props = $props();

	const WEB = 82;
	const PHONE = 23;
	const WEB_NOMINAL = 1 / 1.6; // height / width until the image reports its own
	const PHONE_NOMINAL = 2.2;
	const GAP = 5; // between phones in a phones-only layout
	/** Largest phone / web render width in CSS px: the native width of the smallest sources. */
	const MAX_PHONE_PX = 270;
	const MAX_WEB_PX = 830;

	/** height / width per image src, read from the loaded image. */
	let measured = $state<Record<string, number>>({});
	function measure(node: HTMLImageElement, src: string) {
		const read = () => {
			if (node.naturalWidth) measured[src] = node.naturalHeight / node.naturalWidth;
		};
		if (node.complete) read();
		node.addEventListener('load', read);
		return { destroy: () => node.removeEventListener('load', read) };
	}

	type Placed = { src: string; alt: string; x: number; y: number; ratio: number };
	type Plan = { width: number; height: number; web?: Placed; phones: Placed[]; cap: number };

	const resolved = $derived(resolveShowcase(showcase));

	/**
	 * The narrow-field composition (case study only): at most 2 phones, and a web screen goes without
	 * its phones (beside one it would leave the phone ~80px wide). It is a second plan drawn beside
	 * the full one and swapped by a container query, so prerendered HTML and no-JS pages already show
	 * the right one and nothing reflows on hydration. `null` when it would equal the full plan.
	 */
	const compactResolved = $derived.by<Showcase | null>(() => {
		if (size !== 'case' || !resolved) return null;
		if (resolved.layout === 'web-phones') return { layout: 'web', web: resolved.web };
		if ((resolved.phones?.length ?? 0) > 2)
			return { ...resolved, phones: resolved.phones?.slice(0, 2) };
		return null;
	});

	function buildPlan(resolved: Showcase | null): Plan | null {
		if (!resolved) return null;
		const phones = (resolved.phones ?? []).map((p) => ({
			...p,
			ratio: measured[p.src] ?? p.ratio ?? PHONE_NOMINAL
		}));
		const web = resolved.web && {
			...resolved.web,
			ratio: measured[resolved.web.src] ?? resolved.web.ratio ?? WEB_NOMINAL
		};

		if (resolved.layout === 'web-phones' && web) {
			// Phones overlap the web screen's lower corners (14 units, ~17% of it) and sit lower, so the
			// group feels grounded: their bottoms hang 19-23 units below the web screen's.
			const webH = WEB * web.ratio;
			const two = phones.length > 1;
			const width = two ? 100 : 90;
			const hang = two ? [23.4, 19.4] : [21.4];
			const placed = phones.map((p, i) => {
				const h = PHONE * p.ratio;
				return {
					...p,
					x: two && i === 0 ? 0 : width - PHONE,
					y: Math.max(webH + hang[i] - h, webH * 0.4)
				};
			});
			return {
				width,
				height: Math.max(webH, ...placed.map((p) => p.y + PHONE * p.ratio)),
				web: { ...web, x: two ? 9 : 0, y: 0 },
				phones: placed,
				cap: width * Math.min(MAX_PHONE_PX / PHONE, MAX_WEB_PX / WEB)
			};
		}
		if (resolved.layout === 'phones') {
			const n = phones.length;
			// Two: the second sits lower. Three: the middle one is raised, the outer two sit lower.
			const stagger = n === 3 ? [6, 0, 6] : [0, 6];
			const placed = phones.map((p, i) => ({ ...p, x: i * (PHONE + GAP), y: stagger[i] ?? 0 }));
			const width = n * PHONE + (n - 1) * GAP;
			return {
				width,
				height: Math.max(...placed.map((p) => p.y + PHONE * p.ratio)),
				phones: placed,
				cap: width * (MAX_PHONE_PX / PHONE)
			};
		}
		const only = web as Placed & { ratio: number };
		return {
			width: WEB,
			height: WEB * only.ratio,
			web: { ...only, x: 0, y: 0 },
			phones: [],
			cap: MAX_WEB_PX
		};
	}
	const plan = $derived(buildPlan(resolved));
	const compactPlan = $derived(buildPlan(compactResolved));

	const loading = $derived(size === 'row' || deferred ? 'lazy' : 'eager');
	const priority = $derived(deferred ? 'low' : undefined);
</script>

{#snippet composition(plan: Plan, compact: boolean)}
	<div
		class="composition"
		class:comp-full={!compact}
		class:comp-compact={compact}
		style:--wc={plan.width}
		style:--ar={plan.width / plan.height}
		style:--cap="{plan.cap}px"
	>
		{#if plan.web}
			<div class="web" style:--x={plan.web.x} style:--y={plan.web.y}>
				<img
					use:measure={plan.web.src}
					src={plan.web.src}
					alt={plan.web.alt}
					{loading}
					fetchpriority={priority}
					decoding="async"
					draggable="false"
					style:aspect-ratio={1 / plan.web.ratio}
				/>
			</div>
		{/if}
		{#each plan.phones as phone, i (i)}
			<div class="phone" style:--x={phone.x} style:--y={phone.y} style:--i={i}>
				<img
					use:measure={phone.src}
					src={phone.src}
					alt={phone.alt}
					{loading}
					fetchpriority={priority}
					decoding="async"
					draggable="false"
					style:aspect-ratio={1 / phone.ratio}
				/>
			</div>
		{/each}
	</div>
{/snippet}

<div
	class="showcase {size}"
	style:background={brandColor}
	style:view-transition-name={name}
	data-showcase-name={name}
	data-layout={resolved?.layout ?? 'none'}
>
	{#if plan}
		<div class="stage">
			{@render composition(plan, false)}
			{#if compactPlan}{@render composition(compactPlan, true)}{/if}
		</div>
	{/if}
</div>

<style>
	.showcase {
		position: relative;
		width: 100%;
	}
	.showcase.row {
		aspect-ratio: var(--showcase-aspect, 16 / 10);
	}
	/* Sized by its composition, so it is a container for the composition's cqw. */
	.showcase.case {
		container: showcase / inline-size;
		--padx: 6cqw;
		--pady: 3.5cqw;
	}
	.showcase.hero {
		height: 100%;
	}

	/* The compact composition only exists to be shown on a narrow case field. */
	.comp-compact {
		display: none;
	}
	@container showcase (max-width: 640px) {
		.comp-full:not(:only-child) {
			display: none;
		}
		.comp-compact {
			display: block;
		}
	}

	/* The field's padding: the composition never touches its edge. Percentages resolve per axis. */
	.stage {
		position: absolute;
		inset: 9% 7%;
		container-type: size;
		display: grid;
		place-items: center;
	}
	.hero .stage {
		inset: 0;
	}
	/* The hero is the one place a source may be drawn a little larger than its native width: it is
	   the product at full size, and a slightly soft screen beats a big empty field. */
	.hero .composition {
		width: min(100cqw, calc(100cqh * var(--ar)), calc(var(--cap) * 1.4));
	}
	.case .stage {
		position: static;
		container-type: normal;
		padding: var(--pady) var(--padx);
	}

	/* Fits the stage by whichever axis binds first, then stops at the sharp-pixel cap. */
	.composition {
		--cu: calc(100cqw / var(--wc));
		position: relative;
		container-type: inline-size;
		width: min(100cqw, calc(100cqh * var(--ar)), var(--cap));
		aspect-ratio: var(--ar);
	}
	/* Case: width from the field's width, the cap, and the 85vh height budget; the field's height
	   then follows (composition height + 2 * padding). */
	.case .composition {
		width: min(
			calc(100cqw - 2 * var(--padx)),
			var(--cap),
			calc((85vh - 2 * var(--pady)) * var(--ar))
		);
	}

	.web,
	.phone {
		position: absolute;
		left: calc(var(--x) * var(--cu));
		top: calc(var(--y) * var(--cu));
		box-shadow: var(--shadow-screen);
	}
	img {
		display: block;
		width: 100%;
		height: auto;
		object-fit: contain;
		-webkit-user-drag: none;
		user-select: none;
	}

	.web {
		width: calc(82 * var(--cu));
		overflow: hidden;
		border-radius: var(--radius-screen);
		line-height: 0;
	}

	/* Thin near-black bezel (1.8% of the phone's width); the corner radius is 14% of its width. */
	.phone {
		--pw: calc(23 * var(--cu));
		--bezel: calc(var(--pw) * 0.018);
		--r: calc(var(--pw) * 0.14);
		width: var(--pw);
		box-sizing: border-box;
		padding: var(--bezel);
		border-radius: var(--r);
		background: #0b0b0c;
		line-height: 0;
	}
	.phone img {
		border-radius: calc(var(--r) - var(--bezel));
	}
</style>
