<script lang="ts">
	/**
	 * A heading's words as inline-block spans that rise 0.4em and fade in, 40ms apart. Rendered at SSR
	 * and animated by CSS from first paint (no hydration dependency, so nothing blinks). The heading
	 * must carry `aria-label` with the full text; the spans are aria-hidden. Real spaces separate the
	 * spans so `text-wrap: balance` / `pretty` still work. The rise is skipped when the component is
	 * created while a curtain or morph transition runs (the transition animates the title itself);
	 * that is decided once, here, not by a live ancestor selector, so it never replays.
	 */
	let { text }: { text: string } = $props();

	const SPACE = ' ';
	const words = $derived(text.trim().split(/\s+/));
	const skip =
		typeof document !== 'undefined' &&
		(document.documentElement.classList.contains('reveal-active') ||
			document.documentElement.classList.contains('morph-active'));
</script>

{#each words as word, i (i)}{#if i > 0}{SPACE}{/if}<span
		class="w"
		class:skip
		aria-hidden="true"
		style:--i={i}>{word}</span
	>{/each}

<style>
	.w {
		display: inline-block;
	}
	@media (prefers-reduced-motion: no-preference) {
		.w:not(.skip) {
			animation: word-rise 600ms cubic-bezier(0.22, 0.8, 0.2, 1) both;
			animation-delay: calc(var(--i) * 40ms);
		}
	}
	@keyframes word-rise {
		from {
			opacity: 0;
			transform: translateY(0.4em);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
</style>
