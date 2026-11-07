<script lang="ts">
	import SEOHead from '$lib/components/seo-head.svelte';
	import PageHeader from '$lib/components/page-header.svelte';
	import Section from '$lib/components/section.svelte';
	import { TIMELINE } from '$lib/data/timeline';
	import { SITE_KEYWORDS } from '$lib/shared/constants';

	const intro =
		"I'm Emmanuel Yeboah, a product engineer based in Accra, Ghana. I've been writing software since 2018.";

	const history = [
		{
			org: 'SusuPaa (Pavex Technologies)',
			engagement: 'Founder',
			title: 'Co-founder & CTO',
			dates: '2025 – Present',
			impact:
				'Built the platform as co-founder and CTO: a custom append-only ledger with strict consistency guarantees, exactly-once settlement processing over a Postgres-backed queue, and p99 API latency cut from 1.6s to 500ms. The ledger is the system of record for ₵12.5M+ in successful deposits. Also responsible for the administrator dashboard and the observability stack: Prometheus, Grafana, Loki, and PostgreSQL WAL archiving to S3 for point-in-time recovery.'
		},
		{
			org: 'Fetch Agent (Commonwealth Media)',
			engagement: 'Contract',
			title: 'Backend Engineer',
			dates: 'Sep 2024 – Dec 2025',
			impact:
				'Backend for a US real estate platform. Built the agent-ranking and filtering engine that matches buyers to agents by experience, commission model, contract terms, and availability, and the APIs behind the app and admin dashboard, held under 200ms.'
		},
		{
			org: 'RBL Matchmaking LLC',
			engagement: 'Contract',
			title: 'Lead Engineer',
			dates: 'Apr 2024 – Oct 2025',
			impact:
				'Executed a zero-downtime migration of 170,000 users from a legacy PHP/MySQL stack to Node.js and PostgreSQL. Built the WebSocket real-time messaging system now serving 200,000 monthly active users. Rebuilt the mobile application in React Native and delivered the React web surfaces for the platform.'
		},
		{
			org: 'Hubtel',
			engagement: 'Full-time',
			title: 'Frontend Engineer',
			dates: 'Feb 2024 – Aug 2024',
			impact:
				"Led frontend development of Hubtel for Hospitals, Ghana's first comprehensive healthcare billing platform, deployed at Korle Bu Teaching Hospital. Built three role-based React portals for patients, caregivers, and administrators. Also contributed to GHQR, Ghana's national interoperable QR payment infrastructure."
		},
		{
			org: 'The Brifcast Ltd. (Brif)',
			engagement: 'Founder',
			title: 'Co-founder & Managing Partner',
			dates: '2023 – Present',
			impact:
				'Media company telling the stories of African founders, with an editorial side and a small production studio. I run the business side (partnerships, client work, operations) and built the internal tools we use.'
		},
		{
			org: 'Built Financial Technologies',
			engagement: 'Full-time',
			title: 'Mobile App Developer',
			dates: 'Sep 2021 – Sep 2024',
			impact:
				"Built and shipped the company's full digital product suite: the built.africa Next.js web platform serving SMEs across 14+ African countries, two production React Native apps (Built Accounting, scaled from 700 to 50,000+ installs, and Built Lite, an offline-first app for low-connectivity environments), and the Ejuma HR platform."
		},
		{
			org: 'Wordnox',
			engagement: 'Founder',
			title: 'Founder (company closed)',
			dates: 'Jul 2019 – Aug 2021',
			impact:
				'My own company, now closed. Built WordPress websites for small-business clients: where I learned what it means to build software that serves real users.'
		}
	];

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
				Most of my work has been on systems where a wrong answer costs someone money or trust:
				ledgers, multi-tenant platforms, and migrations that had to happen while people were still
				using the product. I work in Go, TypeScript and Python on PostgreSQL and a whole load of
				tools, and I care about the unglamorous properties: consistency, idempotency,
				recoverability, and being able to prove after the fact what the system did.
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
				email: <a href="mailto:me@noelzappy.dev">me@noelzappy.dev</a>.
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

<Section label="Work history">
	<ol class="history">
		{#each history as role (role.org)}
			<li>
				<div class="head">
					<h3 class="org">{role.org}</h3>
					<span class="dates">{role.dates} · {role.engagement}</span>
				</div>
				<p class="role-title">{role.title}</p>
				<p class="impact">{role.impact}</p>
			</li>
		{/each}
	</ol>
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
	.line,
	.impact {
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
	.history {
		display: grid;
		gap: clamp(1.5rem, 3vw, 2.5rem);
	}
	.history li {
		display: grid;
		gap: 0.25rem;
	}
	.head {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: baseline;
		gap: 0.25rem 1rem;
	}
	.dates {
		font-size: var(--step-small);
		color: var(--muted);
		font-variant-numeric: tabular-nums;
	}
	.role-title {
		color: var(--fg);
	}
	.impact {
		font-size: var(--step-small);
		line-height: var(--lh-small);
		margin-top: 0.25rem;
	}
	@media (min-width: 48rem) {
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
		.row {
			grid-template-columns: 9rem minmax(0, 1fr);
			gap: 1.5rem;
		}
	}
</style>
