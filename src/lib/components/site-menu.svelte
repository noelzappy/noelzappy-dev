<script lang="ts" module>
	import type { PostMeta } from '$lib/content/writing';
	import type { PillProject } from '$lib/data/projects';

	export type MenuPost = PostMeta & { slug: string };
	export type MenuPill = PillProject;
</script>

<script lang="ts">
	import { tick } from 'svelte';

	let {
		open,
		onclose,
		pills,
		posts
	}: { open: boolean; onclose: () => void; pills: MenuPill[]; posts: MenuPost[] } = $props();

	const NAV = [
		{ label: 'Work', href: '/projects' },
		{ label: 'What I do', href: '/work-with-me' },
		{ label: 'About', href: '/about' },
		{ label: 'Writing', href: '/writing' },
		{ label: 'Get in touch', href: '/contact' }
	];

	let dialog = $state<HTMLElement | null>(null);

	const fmt = new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		timeZone: 'UTC'
	});
	const formatDate = (d: string) => fmt.format(new Date(`${d}T00:00:00Z`));

	// Lock body scroll while open and move focus into the dialog.
	$effect(() => {
		if (!open) return;
		const prev = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		tick().then(() => dialog?.querySelector<HTMLElement>('a[href], button')?.focus());
		return () => {
			document.body.style.overflow = prev;
		};
	});

	function focusables(): HTMLElement[] {
		return dialog
			? [...dialog.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')]
			: [];
	}

	function onkeydown(e: KeyboardEvent) {
		if (!open) return;
		if (e.key === 'Escape') {
			e.preventDefault();
			onclose();
			return;
		}
		if (e.key !== 'Tab') return;
		const items = focusables();
		if (items.length === 0) return;
		const first = items[0];
		const last = items[items.length - 1];
		const active = document.activeElement;
		if (e.shiftKey && (active === first || !dialog?.contains(active))) {
			e.preventDefault();
			last.focus();
		} else if (!e.shiftKey && (active === last || !dialog?.contains(active))) {
			e.preventDefault();
			first.focus();
		}
	}
</script>

<svelte:window {onkeydown} />

{#if open}
	<div
		id="site-menu"
		class="menu"
		role="dialog"
		aria-modal="true"
		aria-label="Menu"
		bind:this={dialog}
	>
		<div class="bar">
			<button type="button" class="close" onclick={onclose}>Close</button>
		</div>
		<div class="body">
			<div class="primary">
				<nav aria-label="Primary">
					<ul class="nav">
						{#each NAV as item (item.href)}
							<li><a href={item.href} onclick={onclose}>{item.label}</a></li>
						{/each}
					</ul>
				</nav>
				{#if pills.length > 0}
					<div class="pills-block">
						<p class="label">Projects</p>
						<ul class="pills">
							{#each pills as pill (pill.slug)}
								<li><a href="/projects/{pill.slug}" onclick={onclose}>{pill.title}</a></li>
							{/each}
						</ul>
					</div>
				{/if}
			</div>
			{#if posts.length > 0}
				<aside class="recent">
					<p class="label">Recent writing</p>
					<ul class="cards">
						{#each posts as post (post.slug)}
							<li>
								<a href="/writing/{post.slug}" onclick={onclose}>
									<span class="card-title">{post.title}</span>
									<time datetime={post.date}>{formatDate(post.date)}</time>
								</a>
							</li>
						{/each}
					</ul>
				</aside>
			{/if}
		</div>
	</div>
{/if}

<style>
	/* The overlay is paper-coloured with ink text in both themes, so it defines its own tokens. */
	.menu {
		--paper: #f3efe6;
		--ink: #0e0e0d;
		--ink-muted: #5c5a52;
		--ink-border: #d9d4c7;
		position: fixed;
		inset: 0;
		z-index: 50;
		background: var(--paper);
		color: var(--ink);
		overflow-y: auto;
		padding: 1rem clamp(1.25rem, 3vw, 2.5rem) 3rem;
		animation: menu-in 300ms cubic-bezier(0.2, 0.7, 0.2, 1);
	}
	@keyframes menu-in {
		from {
			opacity: 0;
			transform: translateY(-1.5rem);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
	.bar {
		display: flex;
		height: 2.5rem;
		align-items: center;
	}
	.close {
		font: inherit;
		font-size: 0.9rem;
		padding: 0.4rem 1rem;
		border: 1px solid var(--ink);
		border-radius: 999px;
		background: transparent;
		color: var(--ink);
		cursor: pointer;
	}
	.close:hover {
		background: var(--ink);
		color: var(--paper);
	}
	.body {
		display: grid;
		grid-template-columns: 1fr;
		gap: 3rem;
		margin-top: 3rem;
	}
	@media (min-width: 900px) {
		.body {
			grid-template-columns: 1.6fr 1fr;
		}
	}
	.nav,
	.pills,
	.cards {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.nav a {
		display: inline-block;
		font-family: var(--font-display);
		font-size: var(--step-display-l);
		line-height: var(--lh-display-l);
		letter-spacing: var(--tracking-display-l);
		font-weight: var(--weight-display-l);
		color: var(--ink);
		text-decoration: none;
	}
	.nav a:hover {
		text-decoration: underline;
		text-decoration-thickness: 2px;
		text-underline-offset: 0.12em;
	}
	.label {
		margin: 0 0 0.75rem;
		font-size: var(--step-caption);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-muted);
	}
	.pills-block {
		margin-top: 2.5rem;
	}
	.pills {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
	.pills a {
		display: inline-block;
		padding: 0.4rem 0.9rem;
		border: 1px solid var(--ink);
		border-radius: 999px;
		font-size: 0.9rem;
		color: var(--ink);
		text-decoration: none;
	}
	.pills a:hover {
		background: var(--ink);
		color: var(--paper);
	}
	.cards {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.cards a {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		padding: 1rem 1.1rem;
		border: 1px solid var(--ink-border);
		border-radius: 0.75rem;
		color: var(--ink);
		text-decoration: none;
	}
	.cards a:hover {
		border-color: var(--ink);
	}
	.card-title {
		font-size: 1.05rem;
		line-height: 1.3;
	}
	.cards time {
		font-size: 0.8rem;
		color: var(--ink-muted);
	}
	a:focus-visible,
	.close:focus-visible {
		outline: 2px solid var(--ink);
		outline-offset: 3px;
	}
	@media (prefers-reduced-motion: reduce) {
		.menu {
			animation: none;
		}
	}
</style>
