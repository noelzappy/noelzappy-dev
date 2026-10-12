<script lang="ts">
	import SEOHead from '$lib/components/seo-head.svelte';
	import { SITE_KEYWORDS } from '$lib/shared/constants';

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
			title: 'Web Developer',
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
			jobTitle: 'Backend Engineer',
			url: 'https://noelzappy.dev'
		}
	};
</script>

<SEOHead
	title="About"
	description="Emmanuel Yeboah, backend engineer in Accra. Six years on ledgers, multi-tenant platforms, and zero-downtime migrations."
	canonical="https://noelzappy.dev/about"
	keywords={SITE_KEYWORDS.join(', ')}
	{structuredData}
/>

<section class="section prose-block">
	<h1>About</h1>
	<p>
		I'm Emmanuel Yeboah, a backend engineer based in Accra, Ghana. I've been writing software since
		2018.
	</p>
	<p>
		Most of my work has been on systems where a wrong answer costs someone money or trust: ledgers,
		multi-tenant platforms, and migrations that had to happen while people were still using the
		product. I work in Go, TypeScript and Python on PostgreSQL and a whole load of tools, and I care
		about the unglamorous properties: consistency, idempotency, recoverability, and being able to
		prove after the fact what the system did.
	</p>
	<p>
		At <a href="/projects/susupaa-platform">SusuPaa (Pavex Technologies)</a> I'm co-founder and CTO,
		and I built the platform's custom append-only ledger with strict consistency guarantees. At
		<a href="/projects/rbl-dating-app">RBL Matchmaking</a> I moved 170,000 live users from PHP/MySQL
		to Node.js/PostgreSQL with zero downtime. At
		<a href="/projects/fetch-agent-real-estate-platform">Fetch Agent</a> I built the real estate agent-ranking
		and filtering engine behind buyer-to-agent matching. Earlier I was a frontend engineer at Hubtel and
		a mobile app developer at Built Financial Technologies.
	</p>
	<p>
		I'm currently consulting on backend and platform work, and I'm open to senior remote backend and
		platform roles. The fastest way to reach me is email:
		<a href="mailto:me@noelzappy.dev">me@noelzappy.dev</a>.
	</p>
</section>

<section class="section prose-block">
	<h2>How I work</h2>
	<p>
		<strong>Ship, then polish.</strong> Working software that ships beats perfect software that doesn't.
		I care deeply about code quality, but I care more about systems that are actually in production serving
		real users.
	</p>
	<p>
		<strong>Code is communication.</strong> The best codebase is the one your team can read, understand,
		and confidently change six months later. I write for the next engineer, not just the machine.
	</p>
	<p>
		<strong>Design for the worst network.</strong> Many of the people using what I build are on slow or
		intermittent connections. Building for that first makes everything more robust everywhere.
	</p>
</section>

<section class="section">
	<h2>Work history</h2>
	<ol class="history">
		{#each history as role (role.org)}
			<li>
				<div class="head">
					<span class="org">{role.org}</span>
					<span class="muted mono">{role.dates} · {role.engagement}</span>
				</div>
				<p class="title small">{role.title}</p>
				<p class="muted small">{role.impact}</p>
			</li>
		{/each}
	</ol>
</section>

<section class="section prose-block">
	<h2>Elsewhere</h2>
	<p>
		I write about systems in <a href="/writing">Writing</a>, and my open-source work is under
		<a href="/projects">Projects</a>. I'm <a href="https://github.com/noelzappy">noelzappy</a> on GitHub
		and X and everywhere else.
	</p>
</section>

<style>
	.prose-block p {
		margin: 0;
	}
	.history {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: calc(var(--rhythm) * 4);
	}
	.history li {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	.head {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 0.25rem 1rem;
		align-items: baseline;
	}
	.org {
		font-weight: 550;
	}
	.history p {
		margin: 0;
	}
	.title {
		color: var(--accent);
	}
</style>
