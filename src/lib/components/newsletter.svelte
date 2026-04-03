<script lang="ts">
	import { onMount } from 'svelte';
	let {
		title = 'Subscribe to my Newsletter',
		description = 'Join my newsletter to get the latest insights on software engineering and technology delivered to your inbox.'
	} = $props();

	let newsletterContainer: HTMLDivElement;

	onMount(() => {
		if (newsletterContainer) {
			const existingScript = newsletterContainer.querySelector('script');
			if (existingScript) {
				existingScript.remove();
			}

			const script = document.createElement('script');
			script.src = 'https://cdn.jsdelivr.net/ghost/signup-form@~0.3/umd/signup-form.min.js';
			script.setAttribute('data-button-color', '#e8630a');
			script.setAttribute('data-button-text-color', '#FFFFFF');
			script.setAttribute('data-background-color', '#111111');
			script.setAttribute('data-text-color', '#f5f5f5');
			script.setAttribute('data-site', 'https://ghost.noelzappy.dev/');
			script.setAttribute('data-locale', 'en');
			script.async = true;
			newsletterContainer.appendChild(script);
		}
	});
</script>

<div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 12px; padding: 40px;">
	<div class="flex flex-col gap-4 text-center">
		<div class="flex flex-col gap-2">
			<h3 class="text-lg font-semibold" style="color: var(--color-text-primary);">{title}</h3>
			<p class="text-sm" style="color: var(--color-text-secondary);">
				{description}
			</p>
		</div>
		<div bind:this={newsletterContainer} class="max-w-md mx-auto w-full"></div>
	</div>
</div>
