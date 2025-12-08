<script lang="ts">
	const contactLinks = [
		{ text: 'noelzappy@gmail.com', href: 'mailto:noelzappy@gmail.com' },
		{ text: 'LinkedIn', href: 'https://www.linkedin.com/in/noelzappy' },
		{ text: 'GitHub', href: 'https://github.com/noelzappy' },
		{ text: 'X (Twitter)', href: 'https://x.com/noelzappy' }
	];
</script>

<div class="w-full">
	<h1 class="text-3xl font-medium tracking-tight text-neutral-100 sm:text-4xl">Contact Me</h1>
	<div class="flex flex-col gap-6 text-base leading-7 text-neutral-400">
		<p>
			For projects, collaborations, or inquiries, please reach out via email or connect with me on
			social media.
		</p>
	</div>

	<div class="mt-12 space-y-4">
		{#each contactLinks as contactLink}
			<a
				class="flex items-center gap-3 text-lg font-medium text-gray-300 hover:text-white transition-colors group"
				href={contactLink.href}
				target="_blank"
				rel="noopener noreferrer"
			>
				<span>{contactLink.text}</span>
				<span
					class="material-symbols-outlined text-gray-500 group-hover:text-white transition-colors"
				>
					arrow_outward
				</span>
			</a>
		{/each}
	</div>
</div>
