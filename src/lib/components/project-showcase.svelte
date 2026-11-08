<script lang="ts">
	import type { Showcase } from '$lib/data/projects';

	/**
	 * One fixed, frameless composition per project, always shown whole and at one scale.
	 *
	 * Everything is laid out in "units" on a grid whose width is the composition's width. A phone is
	 * PHONE units wide and the web screen WEB units, so a phone is always 23 / 82 = 28% of the web
	 * screen however big the composition is. The composition is sized by its field (`cqw`/`cqh`),
	 * centred with padding, and capped in CSS pixels so the small source crops (phones are ~250-320px
	 * wide, web screens ~820px) are never rendered larger than they are. Screens carry the site
	 * radius and one soft shadow; phones add only a thin near-black bezel.
	 */
	type Props = {
		showcase: Showcase;
		/** Paints the field. Omit to sit on whatever surface the parent provides. */
		brandColor?: string;
		size: 'hero' | 'row' | 'case';
		/** view-transition-name for the morph between hero, row and case study. */
		name?: string;
	};
	let { showcase, brandColor, size, name }: Props = $props();

	const WEB = 82;
	const PHONE = 23;
	const PHONE_RATIO = 2.2; // nominal phone aspect, height / width
	const GAP = 5; // between phones in a phones-only layout
	/** Largest phone / web render width in CSS px: the native width of the smallest sources. */
	const MAX_PHONE_PX = 270;
	const MAX_WEB_PX = 830;

	type Placed = { src: string; alt: string; x: number; y: number };
	type Plan = { width: number; height: number; web?: Placed; phones: Placed[]; cap: number };

	const plan = $derived.by<Plan>(() => {
		const phones = (showcase.phones ?? []).slice(0, showcase.layout === 'web-phones' ? 2 : 3);
		const web = showcase.web;
		const phoneH = PHONE * PHONE_RATIO;
		let layout = showcase.layout;
		if (layout === 'web-phones' && (!web || !phones.length)) layout = web ? 'web' : 'phones';
		if (layout === 'phones' && !phones.length) layout = 'web';

		if (layout === 'web-phones' && web) {
			// Phones overlap the web screen's lower corners (14 units, ~17% of it) and sit lower, so the
			// group feels grounded. One phone takes the lower-right corner only.
			const two = phones.length > 1;
			const width = two ? 100 : 90;
			const left = two ? 9 : 0;
			const placed = phones.map((p, i) => ({
				...p,
				x: two ? (i === 0 ? 0 : width - PHONE) : width - PHONE,
				y: two ? (i === 0 ? 24 : 20) : 22
			}));
			return {
				width,
				height: Math.max(...placed.map((p) => p.y + phoneH)),
				web: { ...web, x: left, y: 0 },
				phones: placed,
				cap: width * Math.min(MAX_PHONE_PX / PHONE, MAX_WEB_PX / WEB)
			};
		}
		if (layout === 'phones') {
			const n = phones.length;
			const stagger = [0, 6, 0]; // the middle phone of three (or the second of two) sits lower
			const placed = phones.map((p, i) => ({ ...p, x: i * (PHONE + GAP), y: stagger[i] }));
			return {
				width: n * PHONE + (n - 1) * GAP,
				height: phoneH + (n > 1 ? 6 : 0),
				phones: placed,
				cap: (n * PHONE + (n - 1) * GAP) * (MAX_PHONE_PX / PHONE)
			};
		}
		return {
			width: WEB,
			height: WEB / 1.5, // nominal 1.5 covers the 1.33-2.0 sources
			web: { ...(web as { src: string; alt: string }), x: 0, y: 0 },
			phones: [],
			cap: MAX_WEB_PX
		};
	});

	const loading = $derived(size === 'row' ? 'lazy' : 'eager');
	const centredWeb = $derived(plan.phones.length === 0);
</script>

<div
	class="showcase {size}"
	style:background={brandColor}
	style:view-transition-name={name}
	data-layout={showcase.layout}
>
	<div class="stage">
		<div
			class="composition"
			style:--wc={plan.width}
			style:--ar={plan.width / plan.height}
			style:--cap="{plan.cap}px"
		>
			{#if plan.web}
				<div class="web" class:centred={centredWeb} style:--x={plan.web.x} style:--y={plan.web.y}>
					<img src={plan.web.src} alt={plan.web.alt} {loading} decoding="async" draggable="false" />
				</div>
			{/if}
			{#each plan.phones as phone, i (i)}
				<div class="phone" style:--x={phone.x} style:--y={phone.y}>
					<img src={phone.src} alt={phone.alt} {loading} decoding="async" draggable="false" />
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.showcase {
		position: relative;
		width: 100%;
	}
	.showcase.row {
		aspect-ratio: var(--showcase-aspect, 16 / 10);
	}
	.showcase.case {
		aspect-ratio: 16 / 9;
		max-height: 85vh;
	}
	.showcase.hero {
		height: 100%;
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
	.case .stage {
		inset: 8% 6%;
	}

	/* Fits the stage by whichever axis binds first, then stops at the sharp-pixel cap. */
	.composition {
		--cu: calc(100cqw / var(--wc));
		position: relative;
		container-type: inline-size;
		width: min(100cqw, calc(100cqh * var(--ar)), var(--cap));
		aspect-ratio: var(--ar);
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
		-webkit-user-drag: none;
		user-select: none;
	}

	.web {
		width: calc(82 * var(--cu));
		overflow: hidden;
		border-radius: var(--radius-screen);
		line-height: 0;
	}
	.web.centred {
		top: 50%;
		transform: translateY(-50%);
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
