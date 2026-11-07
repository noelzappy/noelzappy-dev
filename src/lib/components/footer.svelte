<script lang="ts">
	/** `wide` aligns with the full-bleed header (studio pages); otherwise matches the content column. */
	let { wide = false }: { wide?: boolean } = $props();
</script>

<footer class="footer" class:wide>
	<div class="inner">
		<p class="cta">
			Building something that moves money? <a href="/work-with-me#call">Book a 15-minute call</a> or
			email <a href="mailto:me@noelzappy.dev">me@noelzappy.dev</a>.
		</p>
		<nav class="links" aria-label="Contact and profiles">
			<a href="mailto:me@noelzappy.dev">me@noelzappy.dev</a>
			<a href="https://github.com/noelzappy" rel="me noopener noreferrer">GitHub</a>
			<a href="https://www.linkedin.com/in/noelzappy" rel="me noopener noreferrer">LinkedIn</a>
			<a href="https://x.com/noelzappy" rel="me noopener noreferrer">X</a>
			<a href="/rss.xml">RSS</a>
		</nav>
		<p class="muted small">© {new Date().getFullYear()} Emmanuel Yeboah</p>
	</div>
</footer>

<style>
	.footer {
		max-width: var(--measure);
		margin-inline: auto;
		padding: 0 1.25rem calc(var(--rhythm) * 8);
	}
	.footer.wide {
		max-width: none;
		padding-inline: clamp(1.25rem, 3vw, 2.5rem);
	}
	.inner {
		border-top: 1px solid var(--border);
		padding-top: calc(var(--rhythm) * 4);
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.links {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1.25rem;
		font-size: 0.95rem;
	}
	.links a {
		color: var(--muted);
		text-decoration: none;
	}
	.links a:hover {
		color: var(--accent);
	}
	p {
		margin: 0;
	}
	.cta {
		font-size: 0.95rem;
	}
</style>
