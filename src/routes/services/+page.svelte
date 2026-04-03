<script lang="ts">
	import SEOHead from '$lib/components/seo-head.svelte';
	import SectionLabel from '$lib/components/section-label.svelte';
	// import SessionCard from '$lib/components/session-card.svelte';
	import CalButton from '$lib/components/CalButton.svelte';
	// import CTABand from '$lib/components/cta-band.svelte';
	import { inView } from '$lib/actions/inView';
	import { CAL_EVENTS } from '$lib/cal.js';

	const engineeringServices = [
		{
			title: 'Backend Architecture & API Design',
			description:
				"Scalable, maintainable APIs designed to grow with your business. Microservices, monoliths, and everything in between — built for the load you'll have, not just the load you have now."
		},
		{
			title: 'Database Engineering',
			description:
				"PostgreSQL, Redis, query optimization, and data modeling that won't bite you at scale. I've reduced API latency by 56% through query restructuring and caching strategy alone."
		},
		{
			title: 'Mobile App Development',
			description:
				'React Native applications for iOS and Android. Offline-first architecture for low-connectivity environments — built for how African users actually use their phones.'
		},
		{
			title: 'African Payment Integration',
			description:
				"MTN MoMo, Telecel Cash, Hubtel, Paystack, Stripe, and more. I'm also the creator of Voltax — the open-source SDK that unifies African payment gateways into a single typed API."
		},
		{
			title: 'Web Application Development',
			description:
				'Full-stack web apps with React, Next.js, or SvelteKit. From architecture to deployment, including CI/CD pipelines and infrastructure setup on GCP or Docker.'
		},
		{
			title: 'AI Integration & Strategy',
			description:
				'Practical AI integration into your product — LLM workflows, agent architecture, and feature development. I know when to use AI as an accelerator and when to keep your own hands on the wheel.'
		}
	];

	const techStack = [
		'Python',
		'TypeScript',
		'Node.js',
		'NestJS',
		'FastAPI',
		'PostgreSQL',
		'Redis',
		'React Native',
		'React',
		'Next.js',
		'SvelteKit',
		'Docker',
		'GCP',
		'BullMQ'
	];

	// const sessions: {
	// 	title: string;
	// 	duration: string;
	// 	price: string;
	// 	eventSlug: string;
	// 	description: string;
	// }[] = [
	// 	// {
	// 	// 	title: 'Architecture Review',
	// 	// 	duration: '20 min',
	// 	// 	price: '$75',
	// 	// 	eventSlug: CAL_EVENTS.architecture,
	// 	// 	description:
	// 	// 		'Deep dive into your system design. Identify bottlenecks, risks, and opportunities. Walk away with a prioritized, actionable improvement plan — not a list of vague suggestions.'
	// 	// }
	// ];

	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'Service',
		name: 'Full-Stack Engineering & Consulting — Emmanuel Yeboah',
		provider: {
			'@type': 'Person',
			name: 'Emmanuel Noel Zappy Yeboah',
			url: 'https://noelzappy.dev'
		},
		description:
			'Full-stack engineering and technical consulting services specialising in African fintech, mobile apps, and payment infrastructure.',
		url: 'https://noelzappy.dev/services'
	};
</script>

<SEOHead
	title="Services"
	description="Full-stack engineering and technical consulting specialising in African fintech, mobile apps, and payment infrastructure. 6+ years shipping products that handle real African money."
	canonical="https://noelzappy.dev/services"
	ogType="website"
	keywords="Full-Stack Engineering, Fintech Consulting, African Fintech, Mobile App Development, Mobile Money Integration, Technical Consulting"
	{structuredData}
/>

<div class="flex flex-col gap-0 py-16 sm:py-24">
	<!-- Page hero -->
	<div class="flex flex-col gap-4 pb-16 sm:pb-20 border-b border-[var(--color-border)]">
		<SectionLabel text="// services" />
		<h1 class="text-4xl sm:text-5xl font-bold text-[var(--color-text-primary)] mt-2">
			What I offer.
		</h1>
		<p class="text-lg text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
			Two distinct ways to work with me. Both built on the same foundation: {new Date().getFullYear() -
				2020}+ years shipping full-stack products that handle real African money.
		</p>
	</div>

	<!-- SERVICE 1: Full-Stack Engineering -->
	<section class="py-16 sm:py-20 border-b border-[var(--color-border)]">
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
			<!-- Main content -->
			<div class="lg:col-span-2 flex flex-col gap-8">
				<div class="flex flex-col gap-3">
					<SectionLabel text="// 01" />
					<h2
						class="section-headline text-[var(--color-text-primary)]"
						use:inView
						class:fade-up={true}
					>
						Full-Stack Engineering
					</h2>
					<p class="text-sm text-[var(--color-accent)] font-medium italic">
						Your engineering partner.
					</p>
				</div>
				<p class="text-[var(--color-text-secondary)] leading-relaxed text-base">
					A full-stack engineer based in Accra that builds backend systems, mobile apps, and web
					applications for startups and companies locally and internationally. I've built fintech
					platforms handling millions in transactions, mobile apps serving 50,000+ users in
					offline-first environments, and APIs handling 50,000+ daily requests.
					Infrastructure-minded, performance-obsessed, and Africa-first by default.
				</p>

				<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
					{#each engineeringServices as service (service.title)}
						<div
							class="flex items-start gap-3 p-4 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)]"
						>
							<span class="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] shrink-0 mt-2"></span>
							<div class="flex flex-col gap-1">
								<span class="text-sm font-semibold text-neutral-200 leading-snug"
									>{service.title}</span
								>
								<span class="text-xs text-neutral-400 leading-relaxed">{service.description}</span>
							</div>
						</div>
					{/each}
				</div>

				<div>
					<p
						class="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-widest mb-3"
					>
						Tech Stack
					</p>
					<div class="flex flex-wrap gap-2">
						{#each techStack as tech (tech)}
							<span
								class="px-3 py-1 text-sm rounded-full bg-[var(--color-surface)] text-neutral-300 border border-[var(--color-border)]"
							>
								{tech}
							</span>
						{/each}
					</div>
				</div>
			</div>

			<!-- Sidebar -->
			<div class="lg:col-span-1">
				<div class="card p-6 sticky top-24 flex flex-col gap-5">
					<SectionLabel text="// engagement models" />
					<div class="flex flex-col gap-5">
						<div class="flex flex-col gap-2">
							<h4 class="font-semibold text-[var(--color-text-primary)]">Fixed-Scope Projects</h4>
							<p class="text-sm text-[var(--color-text-secondary)] leading-relaxed">
								Defined deliverables, milestone-based billing. Ideal for greenfield builds or
								clearly scoped features. We agree on exactly what ships before a line of code is
								written.
							</p>
						</div>
						<div class="border-t border-[var(--color-border)]"></div>
						<div class="flex flex-col gap-2">
							<h4 class="font-semibold text-[var(--color-text-primary)]">Ongoing Retainers</h4>
							<p class="text-sm text-[var(--color-text-secondary)] leading-relaxed">
								Consistent full-stack engineering capacity on a monthly basis. For teams that need a
								reliable senior engineer without the overhead of a full-time hire.
							</p>
						</div>
					</div>
					<p class="text-xs text-[var(--color-text-secondary)] leading-relaxed">
						Projects are quoted after a discovery call because every engagement is different.
					</p>
					<a href="/contact" class="btn-primary text-sm justify-center mt-2">
						Discuss Your Project →
					</a>
				</div>
			</div>
		</div>
	</section>

	<!-- PRICING NOTE -->
	<section class="py-12 text-center border-b border-[var(--color-border)]">
		<SectionLabel text="// on pricing" class="justify-center mb-3" />
		<p class="text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed">
			Consulting sessions are priced upfront — see below. Development projects are quoted after a
			discovery call because every engagement is different. Not sure which fits? Start with a free
			15-minute intro call.
		</p>
		<div class="mt-4">
			<CalButton
				eventSlug={CAL_EVENTS.intro}
				label="Book a free 15-minute intro call →"
				variant="text"
			/>
		</div>
	</section>

	<!-- SERVICE 2: Consulting Hours -->
	<section class="py-16 sm:py-20">
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
			<!-- Main content -->
			<div class="lg:col-span-2 flex flex-col gap-8" use:inView class:fade-up={true}>
				<div class="flex flex-col gap-3">
					<SectionLabel text="// 02" />
					<h2 class="text-3xl font-bold text-[var(--color-text-primary)]">Consulting Hours</h2>
					<p class="text-sm text-[var(--color-accent)] font-medium italic">
						Focused time with a senior engineer.
					</p>
				</div>
				<p class="text-[var(--color-text-secondary)] leading-relaxed text-base">
					Bookable sessions for teams or individuals who need experienced eyes on a problem.
					Architecture decisions, scaling challenges, African fintech strategy, code quality reviews
					— I prepare beforehand, dig into your context, and give you specific, actionable
					recommendations you can execute on immediately. These aren't generic advice sessions — I
					come prepared with your content and leave you with a written follow-up summary.
				</p>

				<!-- <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					{#each sessions as session (session.title)}
						<SessionCard
							title={session.title}
							duration={session.duration}
							price={session.price}
							description={session.description}
							eventSlug={session.eventSlug}
						/>
					{/each}
				</div> -->
			</div>

			<!-- Sidebar -->
			<div class="lg:col-span-1">
				<div class="card p-6 sticky top-24 flex flex-col gap-5">
					<SectionLabel text="// how it works" />
					<div class="flex flex-col gap-4">
						{#each [{ step: '01', label: 'Book a slot', desc: 'Pick the session type and a time that works for you. Time zones are auto-detected.' }, { step: '02', label: 'Share context', desc: "You'll get a short form after booking. The more context you share about your challenge, the more prepared I'll be." }, { step: '03', label: 'Get answers', desc: 'I come prepared. You leave with specific, actionable recommendations and a written follow-up summary.' }] as item (item.step)}
							<div class="flex items-start gap-4">
								<span class="text-2xl font-bold text-[var(--color-accent)] shrink-0 leading-none"
									>{item.step}.</span
								>
								<div>
									<p class="font-semibold text-[var(--color-text-primary)] text-sm">{item.label}</p>
									<p class="text-xs text-[var(--color-text-secondary)] mt-0.5 leading-relaxed">
										{item.desc}
									</p>
								</div>
							</div>
						{/each}
					</div>
					<CalButton eventSlug={CAL_EVENTS.intro} label="Book a Session →" variant="primary" />
				</div>
			</div>
		</div>
	</section>
</div>
