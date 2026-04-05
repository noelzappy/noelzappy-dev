<script lang="ts">
	import SEOHead from '$lib/components/seo-head.svelte';
	import SectionLabel from '$lib/components/section-label.svelte';
	import { inView } from '$lib/actions/inView';

	const timeline = [
		{
			company: 'SusuPaa',
			title: 'Co-founder & Lead Backend Engineer',
			dates: 'Apr 2025 – Present',
			impact:
				'Architecting the backend infrastructure for a multi-tenant fintech platform digitizing traditional susu savings groups across Ghana. Built from first commit to $40k+ in monthly transaction volume with 99.9% transaction reliability.'
		},
		{
			company: 'Fetch Agent (Common Wealth)',
			title: 'Senior Backend Engineer',
			dates: 'Sep 2024 – Dec 2025',
			impact:
				'Led backend for a US real estate platform. Scaled APIs to 50,000+ daily requests at sub-200ms response times. Built the proprietary agent-ranking algorithm that improved user-to-agent conversion.'
		},
		{
			company: 'RBL Matchmaking LLC',
			title: 'Lead Full-Stack Engineer',
			dates: 'Apr 2024 – Oct 2025',
			impact:
				'Executed a zero-downtime migration of 170,000 users from PHP/MySQL to Node.js and PostgreSQL. Built the WebSocket messaging system now serving 200,000 monthly active users.'
		},
		{
			company: 'Hubtel',
			title: 'Software Engineer',
			dates: 'Feb 2024 – Oct 2024',
			impact:
				"Engineered core components of GHQR — Ghana's national interoperable QR payment platform. My first experience building financial infrastructure at national scale."
		},
		{
			company: 'Built Financial Technologies',
			title: 'Lead Mobile Engineer',
			dates: 'Sep 2021 – Oct 2024',
			impact:
				"Scaled a fintech mobile app from 700 to 50,000+ installs. Built offline-first local banking, POS, and automated accounting tools for Ghana's SME market."
		},
		{
			company: 'Wordnox',
			title: 'Frontend Engineer',
			dates: 'Jul 2019 – Aug 2021',
			impact:
				'My first professional role. Where I learned what it means to build software that serves real users — not just passes tests.'
		}
	];

	const philosophy = [
		{
			title: 'Ship, Then Polish',
			body: "Working software that ships beats perfect software that doesn't. I care deeply about code quality, but I care more about systems that are actually in production serving real users."
		},
		{
			title: 'Code is Communication',
			body: 'The best codebase is the one your team can read, understand, and confidently change six months later. I write for the next engineer, not just the machine.'
		},
		{
			title: 'Africa First, World Ready',
			body: 'I build for African markets first — mobile money, low-bandwidth, high-trust constraints. That discipline makes everything I build more robust everywhere.'
		}
	];

	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'AboutPage',
		mainEntity: {
			'@type': 'Person',
			name: 'Emmanuel Noel Zappy Yeboah',
			jobTitle: 'Backend Engineer',
			description:
				'6+ years architecting reliable financial systems across Ghana and Africa. Co-founder of SusuPaa.',
			url: 'https://noelzappy.dev'
		}
	};
</script>

<SEOHead
	title="About"
	description="The story behind Emmanuel Yeboah — 6+ years building fintech infrastructure for African markets. Co-founder of SusuPaa, builder of Voltax, backend engineer."
	canonical="https://noelzappy.dev/about"
	ogType="website"
	keywords="Emmanuel Yeboah, Noel Zappy, About, Backend Engineer, Ghana, African Fintech, SusuPaa"
	{structuredData}
/>

<div class="flex flex-col gap-0 py-16 sm:py-24">
	<!-- Page hero -->
	<div class="flex flex-col gap-4 pb-16 sm:pb-20 border-b border-[var(--color-border)]">
		<SectionLabel text="// about" />
		<h1 class="text-4xl sm:text-5xl font-bold text-[var(--color-text-primary)] mt-2">
			The story behind the engineer.
		</h1>
	</div>

	<!-- Opening narrative -->
	<section class="py-16 sm:py-20 border-b border-[var(--color-border)]">
		<div
			class="max-w-2xl flex flex-col gap-6 text-[var(--color-text-secondary)] leading-relaxed text-base"
		>
			<p>
				The journey started in 2018 with a Udemy course authored by Angela Yu. I got into University
				of the People in 2020 and earned a CS degree.
			</p>
			<p>
				What drives me isn't just engineering — it's the fact that good financial infrastructure
				changes what people can do with their money. When a savings group in Accra can track their
				contributions in real time, when a small business in Kumasi can accept mobile payments
				reliably, that's not a technical achievement. That's a real change in someone's life. That's
				what I'm here to build.
			</p>
		</div>
	</section>

	<!-- Timeline -->
	<section class="py-16 sm:py-20 border-b border-[var(--color-border)]">
		<div class="flex flex-col gap-4 mb-12">
			<SectionLabel text="// the path here" />
			<h2 class="section-headline text-[var(--color-text-primary)]" use:inView class:fade-up={true}>
				Where I've built.
			</h2>
		</div>
		<div class="flex flex-col gap-0 stagger-children" use:inView>
			{#each timeline as role, index (role.company)}
				<div class="flex gap-6 sm:gap-8 {index < timeline.length - 1 ? 'pb-10' : ''}">
					<div class="flex flex-col items-center">
						<div class="w-3 h-3 rounded-full bg-[var(--color-accent)] shrink-0 mt-1.5"></div>
						{#if index < timeline.length - 1}
							<div class="w-px flex-1 bg-[var(--color-border)] mt-2"></div>
						{/if}
					</div>
					<div class="flex flex-col gap-2 pb-2 flex-1">
						<div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
							<h3
								class="text-lg font-bold text-[var(--color-text-primary)]"
								style="font-family: var(--font-display);"
							>
								{role.company}
							</h3>
							<span
								class="text-xs text-[var(--color-text-secondary)]"
								style="font-family: var(--font-mono);">{role.dates}</span
							>
						</div>
						<p class="text-sm text-[var(--color-accent)] font-medium">{role.title}</p>
						<p class="text-sm text-[var(--color-text-secondary)] leading-relaxed">{role.impact}</p>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- Philosophy cards -->
	<section class="py-16 sm:py-20 border-b border-[var(--color-border)]">
		<div class="flex flex-col gap-4 mb-12">
			<SectionLabel text="// what I believe" />
			<h2 class="section-headline text-[var(--color-text-primary)]" use:inView class:fade-up={true}>
				How I think about building.
			</h2>
		</div>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children" use:inView>
			{#each philosophy as item (item.title)}
				<div class="card p-6 flex flex-col gap-3">
					<h3 class="font-bold text-[var(--color-text-primary)]">"{item.title}"</h3>
					<p class="text-sm text-[var(--color-text-secondary)] leading-relaxed">{item.body}</p>
				</div>
			{/each}
		</div>
	</section>

	<!-- Beyond the code -->
	<section class="py-16 sm:py-20">
		<div class="flex flex-col gap-4 mb-12">
			<SectionLabel text="// beyond the code" />
			<h2 class="section-headline text-[var(--color-text-primary)]" use:inView class:fade-up={true}>
				Other things worth knowing.
			</h2>
		</div>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children" use:inView>
			<div class="card p-6 flex flex-col gap-3">
				<h3 class="font-semibold text-[var(--color-text-primary)]">Open Source</h3>
				<p class="text-sm text-[var(--color-text-secondary)] leading-relaxed">
					I build and maintain open source tools including Voltax — a developer productivity
					library. Available for use and contribution on GitHub.
				</p>
				<a href="/open-source" class="btn-text text-sm mt-auto"> View open source work → </a>
			</div>
			<div class="card p-6 flex flex-col gap-3">
				<h3 class="font-semibold text-[var(--color-text-primary)]">Writing</h3>
				<p class="text-sm text-[var(--color-text-secondary)] leading-relaxed">
					I write about software architecture, African fintech, and the hard decisions that come
					with building systems at scale. No fluff.
				</p>
				<a href="/notes" class="btn-text text-sm mt-auto"> Read the notes → </a>
			</div>
			<div class="card p-6 flex flex-col gap-3">
				<h3 class="font-semibold text-[var(--color-text-primary)]">Based in Accra</h3>
				<p class="text-sm text-[var(--color-text-secondary)] leading-relaxed">
					I work from Accra, Ghana — and serve clients across Africa and internationally.
					Remote-first, async-friendly, and timezone-flexible.
				</p>
				<a href="/contact" class="btn-text text-sm mt-auto"> Let's work together → </a>
			</div>
		</div>
	</section>
</div>
