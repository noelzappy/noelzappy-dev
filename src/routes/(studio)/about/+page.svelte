<script lang="ts">
	import SEOHead from '$lib/components/seo-head.svelte';
	import PageHeader from '$lib/components/page-header.svelte';
	import Section from '$lib/components/section.svelte';
	import { TIMELINE } from '$lib/data/timeline';
	import { SITE_KEYWORDS } from '$lib/shared/constants';

	const intro =
		"I'm Emmanuel Noel Zappy Yeboah, a product engineer based in Accra, Ghana. I've been writing software since 2018.";

	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'AboutPage',
		mainEntity: {
			'@type': 'Person',
			name: 'Emmanuel Yeboah',
			jobTitle: 'Product Engineer',
			url: 'https://noelzappy.dev'
		}
	};
</script>

<SEOHead
	title="About"
	description="Emmanuel Yeboah, product engineer in Accra. I design and build mobile apps, web platforms and the systems behind them."
	canonical="https://noelzappy.dev/about"
	keywords={SITE_KEYWORDS.join(', ')}
	{structuredData}
/>

<PageHeader eyebrow="About" title="Emmanuel Yeboah" {intro} />

<Section label="Story">
	<div class="story-grid">
		<img
			class="portrait"
			src="/zappy-face.jpg"
			width="605"
			height="607"
			alt="Emmanuel Yeboah"
			fetchpriority="high"
		/>
		<div class="story prose">
			<p>
				Most of my work has been on products where a wrong answer costs someone money or trust:
				ledgers, multi-tenant platforms, and migrations that had to happen while people were still
				using the product. I work across mobile, web and backend: React Native, Go, TypeScript and
				Python on PostgreSQL, and a whole load of tools, and I care about the unglamorous
				properties: consistency, idempotency, recoverability, and being able to prove after the fact
				what the system did.
			</p>
			<p>
				At <a href="/projects/susupaa-platform">SusuPaa (Pavex Technologies)</a> I'm co-founder and
				CTO, and I built the platform's custom append-only ledger with strict consistency
				guarantees. At
				<a href="/projects/rbl-dating-app">RBL Matchmaking</a> I moved 170,000 live users from
				PHP/MySQL to Node.js/PostgreSQL with zero downtime. At
				<a href="/projects/fetch-agent-real-estate-platform">Fetch Agent</a> I built the real estate agent-ranking
				and filtering engine behind buyer-to-agent matching. Earlier I was a frontend engineer at Hubtel
				and a mobile app developer at Built Financial Technologies.
			</p>
			<p>
				I work independently with startups and businesses, and I'm best at products that move money.
				If that's you,
				<a href="/work-with-me">here's how we can work together</a>. The fastest way to reach me is
				email: <a href="mailto:emmanuel@noelzappy.com">emmanuel@noelzappy.com</a>.
			</p>
		</div>
	</div>
</Section>

<Section label="Timeline">
	<ol class="timeline">
		{#each TIMELINE as entry (entry.years + entry.org)}
			<li class="row">
				<span class="years">{entry.years}</span>
				<div class="detail">
					<h3 class="org">
						{#if entry.url}
							<a href={entry.url} rel="noopener">{entry.org}</a>
						{:else}
							{entry.org}
						{/if}
					</h3>
					<p class="line">{entry.line}</p>
					{#if entry.writeup || entry.cta}
						<p class="links">
							{#if entry.writeup}<a href={entry.writeup}
									>Writeup <span aria-hidden="true">→</span></a
								>{/if}
							{#if entry.cta}<a href={entry.cta.href}
									>{entry.cta.label} <span aria-hidden="true">→</span></a
								>{/if}
						</p>
					{/if}
				</div>
			</li>
		{/each}
	</ol>
</Section>

<Section label="How I work">
	<div class="prose">
		<p>
			<strong>Ship, then polish.</strong> Working software that ships beats perfect software that doesn't.
			I care deeply about code quality, but I care more about systems that are actually in production
			serving real users.
		</p>
		<p>
			<strong>Code is communication.</strong> The best codebase is the one your team can read, understand,
			and confidently change six months later. I write for the next engineer, not just the machine.
		</p>
		<p>
			<strong>Design for the worst network.</strong> Many of the people using what I build are on slow
			or intermittent connections. Building for that first makes everything more robust everywhere.
		</p>
	</div>
</Section>

<Section label="Elsewhere">
	<div class="prose">
		<p>
			I write about systems in <a href="/writing">Writing</a>, and my open-source work is under
			<a href="/projects">Projects</a>. I'm <a href="https://github.com/noelzappy">noelzappy</a> on GitHub
			and X and everywhere else.
		</p>
	</div>
</Section>

<style>
	ol,
	h3,
	p {
		margin: 0;
	}
	ol {
		list-style: none;
		padding: 0;
	}
	.story-grid {
		display: grid;
		gap: 2rem;
		align-items: start;
	}
	.portrait {
		width: 100%;
		max-width: 26rem;
		height: auto;
		aspect-ratio: 605 / 607;
		object-fit: cover;
		border-radius: 4px;
		background: var(--code-bg);
	}
	.prose {
		display: grid;
		gap: 1.25rem;
		max-width: 60ch;
	}
	.prose strong {
		color: var(--fg);
		font-weight: 500;
	}
	.timeline {
		display: grid;
	}
	.row {
		display: grid;
		gap: 0.5rem;
		padding-block: 1.5rem;
		border-top: 1px solid var(--border);
	}
	.row:first-child {
		border-top: 0;
		padding-top: 0;
	}
	.years {
		font-size: var(--step-caption);
		line-height: var(--lh-caption);
		letter-spacing: var(--tracking-caption);
		text-transform: uppercase;
		color: var(--muted);
		font-variant-numeric: tabular-nums;
		padding-top: 0.35rem;
	}
	.detail {
		display: grid;
		gap: 0.5rem;
	}
	.org {
		font-size: var(--step-heading);
		line-height: var(--lh-heading);
		letter-spacing: var(--tracking-heading);
		font-weight: 500;
		color: var(--fg);
	}
	.org a {
		color: inherit;
		text-decoration: none;
	}
	.org a:hover {
		text-decoration: underline;
	}
	.line {
		color: var(--muted);
		max-width: 62ch;
	}
	.links {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem 1.5rem;
		font-size: var(--step-small);
		line-height: var(--lh-small);
	}
	/* Side by side only once the content column can hold a readable measure beside the photo. */
	@media (min-width: 72rem) {
		.story-grid {
			grid-template-columns: minmax(0, 1fr) minmax(0, 22rem);
			gap: var(--page-gutter);
		}
		.story {
			order: -1;
		}
		.portrait {
			position: sticky;
			top: calc(var(--header-h) + 1.5rem);
		}
	}
	@media (min-width: 48rem) {
		.row {
			grid-template-columns: 9rem minmax(0, 1fr);
			gap: 1.5rem;
		}
	}
</style>
