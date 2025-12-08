<script lang="ts">
	import Contact from '$lib/pages/contact.svelte';
	import SEOHead from '$lib/components/seo-head.svelte';

	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'ContactPage',
		mainEntity: {
			'@type': 'Person',
			name: 'Emmanuel Noel Zappy Yeboah',
			alternateName: 'Noel Zappy',
			url: 'https://noelzappy.dev',
			email: 'noelzappy@gmail.com',
			jobTitle: 'Senior Software Engineer',
			sameAs: [
				'https://www.linkedin.com/in/noelzappy',
				'https://github.com/noelzappy',
				'https://x.com/noelzappy',
				'https://twitter.com/noelzappy'
			],
			contactPoint: {
				'@type': 'ContactPoint',
				email: 'noelzappy@gmail.com',
				contactType: 'Professional Inquiries',
				availableLanguage: ['English']
			}
		}
	};
</script>

<SEOHead
	title="Contact"
	description="Get in touch with Emmanuel Noel Zappy Yeboah for projects, collaborations, or inquiries. Connect via email, LinkedIn, GitHub, or Twitter."
	canonical="https://noelzappy.dev/contact"
	ogType="website"
	keywords="Contact Noel Zappy, Email Emmanuel Yeboah, Software Engineer Contact, Hire Full-Stack Developer"
	{structuredData}
/>

<Contact />
