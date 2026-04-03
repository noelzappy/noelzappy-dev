<script lang="ts">
	import SEOHead from '$lib/components/seo-head.svelte';
	import SectionLabel from '$lib/components/section-label.svelte';
	import CalButton from '$lib/components/CalButton.svelte';
	import { CAL_EVENTS } from '$lib/cal.js';

	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'ContactPage',
		mainEntity: {
			'@type': 'Person',
			name: 'Emmanuel Noel Zappy Yeboah',
			alternateName: 'Noel Zappy',
			url: 'https://noelzappy.dev',
			email: 'noelzappy@gmail.com',
			jobTitle: 'Senior Software Engineer'
		}
	};
</script>

<SEOHead
	title="Contact"
	description="Book a consulting session or intro call with Emmanuel Yeboah — backend engineer specialising in African fintech. Architecture reviews, code audits, fintech strategy."
	canonical="https://noelzappy.dev/contact"
	ogType="website"
	keywords="Book a Call, Consulting Session, Emmanuel Yeboah, Fintech Consulting, Architecture Review"
	{structuredData}
/>

<div class="flex flex-col gap-0 py-16 sm:py-24">
	<!-- Page hero -->
	<div class="flex flex-col gap-4 pb-16 sm:pb-20 border-b border-[var(--color-border)]">
		<h1 class="text-4xl sm:text-5xl font-bold text-[var(--color-text-primary)]">Let's talk.</h1>
		<p class="text-lg text-[var(--color-text-secondary)] max-w-xl leading-relaxed">
			Pick a session type, choose a time. Time zones are auto-detected.
		</p>
	</div>

	<!-- Free Intro Call -->
	<section class="py-16 border-b border-[var(--color-border)]">
		<div
			class="bg-[var(--color-accent-muted)] border border-[var(--color-accent)]/30 rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
		>
			<div class="flex flex-col gap-3">
				<div class="flex items-center gap-3">
					<span class="section-label">15 min</span>
					<span class="text-xs text-[var(--color-accent)] font-semibold uppercase tracking-wider"
						>Free</span
					>
				</div>
				<h2 class="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)]">
					Free Intro Call
				</h2>
				<p class="text-[var(--color-text-secondary)] max-w-lg leading-relaxed">
					Quick chat to understand your project and see if we're a good fit. No preparation needed,
					no obligation.
				</p>
			</div>
			<CalButton
				eventSlug={CAL_EVENTS.intro}
				label="Book Now →"
				variant="primary"
			/>
		</div>
	</section>

	<!-- Direct contact -->
	<section class="py-16">
		<div class="flex flex-col gap-4 mb-6">
			<SectionLabel text="// direct contact" />
			<h2 class="text-xl font-bold text-[var(--color-text-primary)]">Prefer email?</h2>
		</div>
		<a
			href="mailto:zap@noelzappy.dev"
			class="inline-flex items-center gap-3 text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] text-lg font-medium transition-colors"
			aria-label="Send email to noelzappy@gmail.com"
		>
			<svg
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<rect x="2" y="4" width="20" height="16" rx="2" />
				<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
			</svg>
			zap@noelzappy.dev
		</a>
	</section>
</div>
