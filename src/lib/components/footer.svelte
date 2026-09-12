<footer class="footer">
	<nav class="links" aria-label="Contact and profiles">
		<a href="mailto:me@noelzappy.dev">me@noelzappy.dev</a>
		<a href="https://github.com/noelzappy" rel="me noopener noreferrer">GitHub</a>
		<a href="https://www.linkedin.com/in/noelzappy" rel="me noopener noreferrer">LinkedIn</a>
		<a href="https://x.com/noelzappy" rel="me noopener noreferrer">X</a>
	</nav>
	<p class="muted small">© {new Date().getFullYear()} Emmanuel Yeboah</p>
</footer>

<style>
	.footer {
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
</style>
