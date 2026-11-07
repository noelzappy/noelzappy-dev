<script lang="ts">
	import SEOHead from '$lib/components/seo-head.svelte';
	import CalButton from '$lib/components/CalButton.svelte';
	import CalEmbed from '$lib/components/cal-embed.svelte';
	import { CAL_EVENTS } from '$lib/cal.js';

	const description =
		"I'm a backend engineer who has spent six years on systems where a bug costs someone money. I work with fintechs and companies moving money in Africa, usually when one of these is true:";
</script>

<CalEmbed />
<SEOHead
	title="Work with me — Emmanuel Yeboah"
	{description}
	canonical="https://noelzappy.dev/work-with-me"
/>

<section class="section prose-block">
	<h1>Work with me</h1>
	<p>{description}</p>
</section>

<section class="section prose-block">
	<h2>1. Your payment integrations are fragile</h2>
	<p>
		You're on one provider and need a second, mobile money callbacks go missing, or reconciliation
		is a spreadsheet. I design and build multi-provider payment layers that fail over cleanly and
		reconcile automatically.
	</p>
	<p class="muted small">
		<em>Proof:</em> I wrote <a href="https://github.com/noelzappy/voltax">Voltax</a>, an open-source
		SDK that unifies African payment gateways behind one API.
	</p>
</section>

<section class="section prose-block">
	<h2>2. You need a ledger you can trust</h2>
	<p>
		Balances drift, refunds are hard to trace, or finance can't answer "where did this money go?" I
		build append-only ledgers with the consistency guarantees money needs.
	</p>
	<p class="muted small">
		<em>Proof:</em> SusuPaa's ledger is the system of record for ₵12.5M+ in successful deposits.
		<a href="/projects/susupaa-platform">Read the writeup →</a>
	</p>
</section>

<section class="section prose-block">
	<h2>3. You have to migrate without going down</h2>
	<p>Moving off a legacy stack, re-platforming, or changing databases with live users.</p>
	<p class="muted small">
		<em>Proof:</em> I migrated 170,000 live users from PHP/MySQL to Node.js/PostgreSQL with zero
		downtime.
		<a href="/writing/how-i-migrated-170k-users-from-php-to-node-js-without-stopping-the-world"
			>How I did it →</a
		>
	</p>
</section>

<section class="section prose-block">
	<h2>How engagements work</h2>
	<ul>
		<!-- TODO(Emmanuel): add price, e.g. "from $X" -->
		<li>
			<strong>Payments architecture review</strong> — a fixed-scope, one-week review of your payment flows,
			ledger and failure handling, with a written report and prioritized fixes.
		</li>
		<li>
			<strong>Build or fix</strong> — scoped projects billed weekly, for when you need it built, not just
			reviewed.
		</li>
		<li>
			<strong>Ongoing</strong> — a monthly retainer for teams that want a payments engineer on call without
			a full-time hire.
		</li>
	</ul>
	<p>
		I work remotely from Accra (GMT), with overlap for European and US East Coast hours. Stack: Go
		and TypeScript, PostgreSQL, event-driven systems. Providers: MTN MoMo, Paystack, Flutterwave,
		Hubtel, Fineract.
	</p>
</section>

<section class="section prose-block" id="call">
	<h2>Start with a call</h2>
	<p>
		<strong><CalButton eventSlug={CAL_EVENTS.intro} label="Book a 15-minute call" /></strong> or
		email
		<strong><a href="mailto:me@noelzappy.dev">me@noelzappy.dev</a></strong> with a few lines about what's
		breaking.
	</p>
</section>

<style>
	.prose-block p,
	.prose-block ul {
		margin: 0;
	}
	.prose-block ul {
		padding-left: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: calc(var(--rhythm) * 2);
	}
	.prose-block h2 {
		scroll-margin-top: 1rem;
	}
</style>
