<script lang="ts">
	import LocalTime from './local-time.svelte';
	import CalButton from './CalButton.svelte';
	import { CAL_EVENTS } from '$lib/cal.js';
</script>

<footer class="footer">
	<div class="inner">
		<h2 class="display">Have something to build?</h2>
		<div class="big-links">
			<CalButton eventSlug={CAL_EVENTS.intro} label="Book a 15-minute call" plain />
			<a href="mailto:emmanuel@noelzappy.com">emmanuel@noelzappy.com</a>
		</div>
		<div class="meta">
			<nav class="links" aria-label="Profiles and feeds">
				<a href="https://github.com/noelzappy" rel="me noopener noreferrer">GitHub</a>
				<a href="https://www.linkedin.com/in/noelzappy" rel="me noopener noreferrer">LinkedIn</a>
				<a href="https://x.com/noelzappy" rel="me noopener noreferrer">X</a>
				<a href="/rss.xml">RSS</a>
			</nav>
			<p class="small">© {new Date().getFullYear()} Emmanuel Yeboah</p>
			<p class="small"><LocalTime /></p>
		</div>
	</div>
</footer>

<style>
	.footer {
		max-width: var(--page-max);
		margin-inline: auto;
		padding: clamp(4rem, 10vw, 8rem) var(--page-gutter) clamp(1.5rem, 3vw, 2.5rem);
	}
	.inner {
		border-top: 1px solid var(--border);
		padding-top: clamp(2rem, 5vw, 4rem);
		display: flex;
		flex-direction: column;
		gap: clamp(2rem, 5vw, 4rem);
	}
	.display {
		margin: 0;
		font-family: var(--font-display);
		font-size: var(--step-display-l);
		line-height: var(--lh-display-l);
		letter-spacing: var(--tracking-display-l);
		font-weight: var(--weight-display-l);
		color: var(--fg);
		text-wrap: balance;
	}
	.big-links {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	.big-links a,
	.big-links :global(.cal-link) {
		width: fit-content;
		max-width: 100%;
		overflow-wrap: anywhere;
		font-size: var(--step-display-m);
		line-height: var(--lh-display-m);
		letter-spacing: var(--tracking-display-m);
		font-weight: var(--weight-display-m);
		color: var(--muted);
		text-decoration: none;
		transition: color 0.2s ease;
	}
	.big-links a:hover,
	.big-links a:focus-visible,
	.big-links :global(.cal-link:hover),
	.big-links :global(.cal-link:focus-visible) {
		color: var(--fg);
	}
	.meta {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.5rem 2rem;
		font-size: var(--step-small);
		line-height: var(--lh-small);
		color: var(--muted);
	}
	.links {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1.5rem;
		margin-inline-end: auto;
	}
	.links a {
		color: var(--muted);
		text-decoration: none;
	}
	.links a:hover,
	.links a:focus-visible {
		color: var(--fg);
	}
	p {
		margin: 0;
	}
	@media (prefers-reduced-motion: reduce) {
		.big-links a,
		.big-links :global(.cal-link) {
			transition: none;
		}
	}
</style>
