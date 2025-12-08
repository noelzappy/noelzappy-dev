<script lang="ts">
	import { onMount } from 'svelte';

	let newsletterContainer: HTMLDivElement;

	onMount(() => {
		if (newsletterContainer) {
			const existingScript = newsletterContainer.querySelector('script');
			if (existingScript) {
				existingScript.remove();
			}

			const script = document.createElement('script');
			script.src = 'https://cdn.jsdelivr.net/ghost/signup-form@~0.3/umd/signup-form.min.js';
			script.setAttribute('data-button-color', '#222526');
			script.setAttribute('data-button-text-color', '#FFFFFF');
			script.setAttribute('data-site', 'https://cms.noelzappy.dev/');
			script.setAttribute('data-locale', 'en');
			script.async = true;
			newsletterContainer.appendChild(script);
		}
	});
</script>

<div class="border border-neutral-800 rounded-lg p-6 bg-neutral-900/50 backdrop-blur-sm">
	<div class="flex flex-col gap-4 text-center">
		<div class="flex flex-col gap-2">
			<h3 class="text-lg font-semibold text-neutral-100">Enjoy this note? Subscribe for more!</h3>
			<p class="text-sm text-neutral-400">
				Join my newsletter to get the latest insights on software engineering and technology
				delivered to your inbox.
			</p>
		</div>
		<div bind:this={newsletterContainer} class="max-w-md mx-auto w-full"></div>
	</div>
</div>
