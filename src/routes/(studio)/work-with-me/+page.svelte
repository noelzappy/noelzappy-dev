<script lang="ts">
	import SEOHead from '$lib/components/seo-head.svelte';
	import CalButton from '$lib/components/CalButton.svelte';
	import InquiryForm from '$lib/components/inquiry-form.svelte';
	import PageHeader from '$lib/components/page-header.svelte';
	import Section from '$lib/components/section.svelte';
	import Testimonials from '$lib/components/testimonials.svelte';
	import { CAL_EVENTS } from '$lib/cal.js';
	import { TESTIMONIALS } from '$lib/data/testimonials';

	const intro =
		"I design and build software products end to end — mobile apps, web platforms and the backends behind them — and I'm best at the ones that move money. I work with startups and businesses, usually when one of these is true:";
	const description =
		"I design and build software products end to end — mobile apps, web platforms and the backends behind them — and I'm best at the ones that move money. I work with startups and businesses.";

	type Proof = { label: string; href: string };
	const OFFERS: { title: string; when: string; proof: Proof[]; note?: string; clients?: string }[] =
		[
			{
				title: 'Build the whole product',
				when: 'Usually when you have an idea, or a prototype that has outgrown its author, and no engineering team yet. I take it from the first screen to the app-store release: the mobile app, the web app, the backend and the admin your team will run it from.',
				proof: [
					{ label: 'Kekeh Mac', href: '/projects/kekeh-mac' },
					{ label: 'Givio', href: '/projects/givio-platform' },
					{ label: 'GrowingGift', href: '/projects/growinggift-platform' }
				]
			},
			{
				title: 'Lead or join your team',
				when: 'Usually when your team needs a senior engineer, or someone to lead the engineering, and the hire cannot wait. I join as a senior or lead engineer, or step in as a fractional CTO, and work inside the way your team already ships.',
				proof: [
					{ label: 'RBL, as lead engineer', href: '/projects/rbl-dating-app' },
					{ label: 'Fetch Agent', href: '/projects/fetch-agent-real-estate-platform' }
				],
				note: 'Co-founder & CTO at Pavex'
			},
			{
				title: 'Fix, rescue or migrate',
				when: "Usually when your payment integrations are fragile, balances drift, or you have to move off a legacy stack with live users. I build payment layers that fail over cleanly, ledgers that finance can trace, and migrations that don't take you down.",
				proof: [
					{ label: 'The RBL migration', href: '/projects/rbl-dating-app' },
					{ label: 'The SusuPaa ledger', href: '/projects/susupaa-platform' },
					{ label: 'Voltax, my open-source payments SDK', href: 'https://voltax.noelzappy.dev' }
				]
			},
			{
				title: 'Websites with a real admin',
				when: 'Usually when your site lives on WordPress and every change needs a developer. I build fast custom sites with an admin your own team can edit, so the site stays current without me.',
				proof: [],
				clients:
					'KAS Foundation, Smiling Hour Foundation, Ashasie Tour, Owl Studios, Agbawe Archives'
			}
		];

	const CAPABILITIES = [
		{ group: 'Mobile', items: 'Expo / React Native' },
		{ group: 'Web', items: 'Next.js, SvelteKit, TanStack' },
		{ group: 'Backend', items: 'Go, NestJS, Node' },
		{ group: 'Payments & fintech', items: 'Ledgers, MoMo, Paystack, Hubtel, KYC' },
		{ group: 'Infra', items: 'Dokploy, Cloudflare, DigitalOcean' },
		{ group: 'AI', items: 'Agents, LLM guardrails' }
	];

	const PRINCIPLES = [
		{
			title: 'One person, the whole product.',
			line: 'You talk to the person writing the code, from the first sketch to the release.'
		},
		{
			title: 'Money-grade by default.',
			line: 'I build every feature as if a mistake in it would cost someone real money.'
		},
		{
			title: 'Shipped, not slideware.',
			line: 'You get working software in your hands early, not a deck about what is coming.'
		},
		{
			title: 'Plain updates, every week.',
			line: 'Each week you hear what is done, what is next and what is in the way, in plain language.'
		},
		{
			title: 'You own everything I build.',
			line: 'The code, the accounts and the infrastructure are yours from day one.'
		}
	];

	const n = (i: number) => String(i + 1).padStart(2, '0');
</script>

<SEOHead
	title="Work with me — Emmanuel Yeboah"
	{description}
	canonical="https://noelzappy.dev/work-with-me"
/>

<PageHeader title="Work with me" {intro} />

<Section label="What I do">
	<ol class="offers">
		{#each OFFERS as offer, i (offer.title)}
			<li class="offer">
				<span class="num" aria-hidden="true">{n(i)}</span>
				<div class="offer-body">
					<h3>{offer.title}</h3>
					<p class="when">{offer.when}</p>
					{#if offer.proof.length > 0 || offer.note}
						<p class="proof">
							<span class="proof-label">Proof</span>
							{#each offer.proof as p (p.href + p.label)}
								<a href={p.href}>{p.label}</a>
							{/each}
							{#if offer.note}<span>{offer.note}</span>{/if}
						</p>
					{/if}
					{#if offer.clients}
						<p class="proof">
							<span class="proof-label">Clients</span>
							<span>{offer.clients}</span>
						</p>
					{/if}
				</div>
			</li>
		{/each}
	</ol>
</Section>

<Section label="Capabilities">
	<dl class="caps">
		{#each CAPABILITIES as c (c.group)}
			<div class="cap">
				<dt>{c.group}</dt>
				<dd>{c.items}</dd>
			</div>
		{/each}
	</dl>
</Section>

<Section label="How I work">
	<ol class="principles">
		{#each PRINCIPLES as p, i (p.title)}
			<li class="principle">
				<span class="num small-num" aria-hidden="true">{n(i)}</span>
				<div>
					<h3>{p.title}</h3>
					<p>{p.line}</p>
				</div>
			</li>
		{/each}
	</ol>
</Section>

<Testimonials items={TESTIMONIALS} />

<Section label="Engagements">
	<ul class="engagements">
		<li>
			<strong>Fixed-scope build</strong>
			<span>A defined product, a defined price, delivered end to end.</span>
		</li>
		<li>
			<strong>Weekly-billed work</strong>
			<span>For when the scope will move: you pay for each week I work, and can stop any week.</span
			>
		</li>
		<li>
			<strong>Monthly retainer</strong>
			<span>A senior engineer on call for your team, without a full-time hire.</span>
		</li>
		<!-- TODO(Emmanuel): add price, e.g. "from $X" -->
		<li>
			<strong>Architecture review</strong>
			<span
				>A fixed-scope, one-week review of your payment flows, ledger and failure handling, with a
				written report and prioritised fixes.</span
			>
		</li>
	</ul>
	<p class="where">
		I work remotely from Accra (GMT), with overlap for European and US East Coast hours.
	</p>
</Section>

<Section label="Start with a call" id="call">
	<div class="call">
		<p class="call-line">
			<CalButton eventSlug={CAL_EVENTS.intro} label="Book a 15-minute call" />
		</p>
		<p>
			Or email <a href="mailto:emmanuel@noelzappy.com">emmanuel@noelzappy.com</a> with a few lines about
			what you need built or what is breaking.
		</p>
		<p class="write">
			Prefer to write it down? Tell me what's breaking and I'll reply within one working day.
		</p>
		<InquiryForm />
	</div>
</Section>

<style>
	ol,
	ul,
	dl {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	h3,
	p {
		margin: 0;
	}
	.num {
		font-size: var(--step-display-m);
		line-height: var(--lh-display-m);
		letter-spacing: var(--tracking-display-m);
		font-weight: var(--weight-display-m);
		color: var(--muted);
		font-variant-numeric: tabular-nums;
	}
	.offers {
		display: grid;
		gap: clamp(2.5rem, 6vw, 5rem);
	}
	.offer {
		display: grid;
		gap: 0.75rem;
	}
	.offer h3 {
		font-family: var(--font-display);
		font-size: var(--step-display-m);
		line-height: var(--lh-display-m);
		letter-spacing: var(--tracking-display-m);
		font-weight: var(--weight-display-m);
		color: var(--fg);
		text-wrap: balance;
	}
	.offer-body {
		display: grid;
		gap: 1.25rem;
	}
	.when {
		max-width: 56ch;
		color: var(--muted);
	}
	.proof {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.25rem 1.25rem;
		font-size: var(--step-small);
		line-height: var(--lh-small);
	}
	.proof-label {
		font-size: var(--step-caption);
		letter-spacing: var(--tracking-caption);
		text-transform: uppercase;
		color: var(--muted);
	}
	.caps {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
		gap: clamp(1.5rem, 3vw, 2.5rem) var(--page-gutter);
	}
	dt {
		font-size: var(--step-heading);
		line-height: var(--lh-heading);
		letter-spacing: var(--tracking-heading);
		color: var(--fg);
	}
	dd {
		margin: 0.25rem 0 0;
		color: var(--muted);
		font-size: var(--step-small);
		line-height: var(--lh-small);
	}
	.principles {
		display: grid;
		gap: clamp(1.5rem, 3vw, 2.5rem);
	}
	.principle {
		display: grid;
		grid-template-columns: 3.5rem minmax(0, 1fr);
		gap: 1rem;
		align-items: baseline;
	}
	.small-num {
		font-size: var(--step-heading);
		line-height: var(--lh-heading);
		letter-spacing: var(--tracking-heading);
	}
	.principle h3 {
		font-size: var(--step-heading);
		line-height: var(--lh-heading);
		letter-spacing: var(--tracking-heading);
		font-weight: 500;
		color: var(--fg);
	}
	.principle p {
		margin-top: 0.25rem;
		color: var(--muted);
		max-width: 52ch;
	}
	.engagements {
		display: grid;
		gap: 1.5rem;
	}
	.engagements li {
		display: grid;
		gap: 0.25rem;
		max-width: 56ch;
	}
	.engagements strong {
		font-size: var(--step-heading);
		line-height: var(--lh-heading);
		letter-spacing: var(--tracking-heading);
		font-weight: 500;
		color: var(--fg);
	}
	.engagements span {
		color: var(--muted);
	}
	.where {
		padding-top: 1rem;
		color: var(--muted);
		font-size: var(--step-small);
		line-height: var(--lh-small);
	}
	.call {
		display: grid;
		gap: 1rem;
	}
	.write {
		margin-top: 1rem;
		color: var(--muted);
		max-width: 56ch;
	}
	.call-line :global(.cal-link) {
		font-size: var(--step-display-m);
		line-height: var(--lh-display-m);
		letter-spacing: var(--tracking-display-m);
		font-weight: var(--weight-display-m);
	}
	@media (min-width: 48rem) {
		.offer {
			grid-template-columns: 5rem minmax(0, 1fr);
			gap: 1.5rem;
		}
		.principle {
			grid-template-columns: 4rem minmax(0, 1fr);
		}
		.engagements {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 2rem var(--page-gutter);
		}
		.engagements li {
			max-width: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		* {
			transition: none !important;
		}
	}
</style>
