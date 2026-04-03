<footer class="mt-20 border-t border-[var(--color-border)] pt-12 pb-8">
	<div class="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8 mb-10">
		<!-- Column 1: Contact -->
		<div class="flex flex-col gap-4">
			<h4
				class="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-widest"
			>
				Contact
			</h4>

			<div class="flex flex-col gap-2">
				<a
					href="mailto:noelzappy@gmail.com"
					class="text-sm text-neutral-300 hover:text-[var(--color-accent)] transition-colors"
				>
					zap@noelzappy.dev
				</a>
			</div>
		</div>

		<!-- Column 2: Navigate -->
		<div class="flex flex-col gap-4">
			<h4
				class="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-widest"
			>
				Navigate
			</h4>
			<nav class="flex flex-col gap-2" aria-label="Footer navigation">
				<a
					href="/work"
					class="text-sm text-neutral-300 hover:text-[var(--color-accent)] transition-colors"
					data-sveltekit-preload-data>Work</a
				>
				<a
					href="/services"
					class="text-sm text-neutral-300 hover:text-[var(--color-accent)] transition-colors"
					data-sveltekit-preload-data>Services</a
				>
				<a
					href="/notes"
					class="text-sm text-neutral-300 hover:text-[var(--color-accent)] transition-colors"
					data-sveltekit-preload-data>Notes</a
				>
				<a
					href="/about"
					class="text-sm text-neutral-300 hover:text-[var(--color-accent)] transition-colors"
					data-sveltekit-preload-data>About</a
				>
				<a
					href="/contact"
					class="text-sm text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] font-medium transition-colors"
					data-sveltekit-preload-data>Book a Call →</a
				>
			</nav>
		</div>

		<!-- Column 3: Online -->
		<div class="flex flex-col gap-4">
			<h4
				class="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-widest"
			>
				Online
			</h4>
			<div class="flex flex-col gap-2">
				<a
					href="https://github.com/noelzappy"
					target="_blank"
					rel="noopener noreferrer"
					class="text-sm text-neutral-300 hover:text-[var(--color-accent)] transition-colors"
				>
					GitHub
				</a>
				<a
					href="https://x.com/noelzappy"
					target="_blank"
					rel="noopener noreferrer"
					class="text-sm text-neutral-300 hover:text-[var(--color-accent)] transition-colors"
				>
					Twitter / X
				</a>
				<a
					href="https://www.linkedin.com/in/noelzappy"
					target="_blank"
					rel="noopener noreferrer"
					class="text-sm text-neutral-300 hover:text-[var(--color-accent)] transition-colors"
				>
					LinkedIn
				</a>
			</div>
		</div>
	</div>

	<div class="border-t border-[var(--color-border)] pt-6">
		<p class="text-xs text-[var(--color-text-secondary)] text-center">
			© {new Date().getFullYear()} Emmanuel Noel Zappy Yeboah. Based in Accra, Ghana.
		</p>
	</div>
</footer>
