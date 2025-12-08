<script lang="ts">
	const contactLinks = [
		{ text: 'noelzappy@gmail.com', href: 'mailto:noelzappy@gmail.com' },
		{ text: 'LinkedIn', href: 'https://www.linkedin.com/in/noelzappy' },
		{ text: 'GitHub', href: 'https://github.com/noelzappy' },
		{ text: 'X (Twitter)', href: 'https://x.com/noelzappy' }
	];
</script>

<div class="flex flex-col gap-12">
	<div class="flex flex-col gap-6">
		<div class="flex flex-col gap-3">
			<h1 class="text-4xl font-semibold tracking-tight text-neutral-100 sm:text-5xl">
				Get in Touch
			</h1>
			<p class="text-lg text-neutral-300 font-light">
				Open to projects, collaborations, and opportunities
			</p>
		</div>
		<p class="text-base leading-relaxed text-neutral-300">
			Whether you have a project in mind, want to collaborate, or just want to chat about tech, feel
			free to reach out through any of the channels below.
		</p>
	</div>

	<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
		{#each contactLinks as contactLink (contactLink.href)}
			<a
				class="group flex items-center justify-between gap-3 p-4 rounded-lg border border-neutral-700 bg-neutral-800/20 hover:bg-neutral-800/40 hover:border-neutral-600 transition-all duration-300"
				href={contactLink.href}
				target="_blank"
				rel="noopener noreferrer"
			>
				<span
					class="text-base font-medium text-neutral-100 group-hover:text-white transition-colors"
				>
					{contactLink.text}
				</span>
				<span
					class="material-symbols-outlined text-xl text-neutral-500 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-white"
				>
					arrow_outward
				</span>
			</a>
		{/each}
	</div>
</div>
