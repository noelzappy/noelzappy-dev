<script lang="ts">
	import { page } from '$app/stores';
	import SEOHead from '$lib/components/seo-head.svelte';

	let statusCode = $derived($page.status);
	let errorMessage = $derived($page.error?.message || 'Something went wrong');

	const suggestions = [
		{
			title: 'Home',
			description: 'Start from the beginning',
			path: '/',
			icon: 'home'
		},
		{
			title: 'Projects',
			description: 'Check out my work',
			path: '/projects',
			icon: 'code'
		},
		{
			title: 'Notes',
			description: 'Read technical insights',
			path: '/notes',
			icon: 'article'
		},
		{
			title: 'Contact',
			description: 'Get in touch',
			path: '/contact',
			icon: 'mail'
		}
	];

	const errorTitles: Record<number, string> = {
		404: '404 - Page Not Found',
		500: '500 - Server Error',
		503: '503 - Service Unavailable'
	};

	const errorDescriptions: Record<number, string> = {
		404: "This route doesn't exist in the codebase. Perhaps you're looking for something else?",
		500: 'An internal error occurred. The server encountered an unexpected condition.',
		503: 'The service is temporarily unavailable. Please try again later.'
	};

	let title = $derived(errorTitles[statusCode] || `${statusCode} - Error`);
	let description = $derived(
		errorDescriptions[statusCode] || 'An unexpected error occurred while processing your request.'
	);
</script>

<SEOHead {title} {description} canonical="https://noelzappy.dev" ogType="website" />

<div class="flex min-h-[calc(100vh-16rem)] flex-col items-center justify-center gap-12 px-4">
	<!-- Error Code Display -->
	<div class="flex flex-col items-center gap-4 text-center">
		<div class="relative">
			<!-- Large Error Code -->
			<h1
				class="text-9xl font-bold tabular-nums tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-neutral-200 via-neutral-400 to-neutral-600 sm:text-[12rem]"
			>
				{statusCode}
			</h1>
			<!-- Decorative brackets (code theme) -->
			<div
				class="absolute -left-8 top-1/2 -translate-y-1/2 text-6xl font-light text-neutral-700 sm:-left-12 sm:text-8xl"
			>
				&lt;
			</div>
			<div
				class="absolute -right-8 top-1/2 -translate-y-1/2 text-6xl font-light text-neutral-700 sm:-right-12 sm:text-8xl"
			>
				&gt;
			</div>
		</div>

		<!-- Error Description -->
		<div class="flex max-w-md flex-col gap-2">
			<h2 class="text-xl font-semibold text-neutral-200 sm:text-2xl">
				{statusCode === 404 ? 'Route Not Found' : 'Something Went Wrong'}
			</h2>
			<p class="text-sm leading-relaxed text-neutral-400 sm:text-base">
				{description}
			</p>
			{#if errorMessage && statusCode !== 404}
				<code
					class="mt-2 rounded border border-neutral-800 bg-neutral-900/50 px-3 py-2 text-xs text-neutral-500"
				>
					{errorMessage}
				</code>
			{/if}
		</div>
	</div>

	<!-- Navigation Suggestions -->
	<div class="flex w-full max-w-2xl flex-col gap-4">
		<h3 class="text-center text-sm font-medium text-neutral-400">Try navigating to:</h3>
		<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
			{#each suggestions as suggestion (suggestion.path)}
				<a
					href={suggestion.path}
					class="group flex flex-col items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900/30 p-4 transition-all duration-300 hover:scale-105 hover:border-neutral-600 hover:bg-neutral-800/50 hover:shadow-lg hover:shadow-neutral-900/50"
				>
					<span
						class="material-symbols-outlined text-3xl text-neutral-500 transition-colors group-hover:text-white"
					>
						{suggestion.icon}
					</span>
					<div class="flex flex-col items-center gap-1 text-center">
						<span class="text-sm font-medium text-neutral-300 group-hover:text-white">
							{suggestion.title}
						</span>
						<span class="text-xs text-neutral-600 group-hover:text-neutral-400">
							{suggestion.description}
						</span>
					</div>
				</a>
			{/each}
		</div>
	</div>

	<!-- Back Button -->
	<button
		onclick={() => window.history.back()}
		class="group flex items-center justify-between gap-3 border-b border-neutral-800 py-3 text-neutral-400 transition-colors hover:text-white"
	>
		<span class="flex items-center gap-2 text-sm font-medium">
			<span
				class="material-symbols-outlined text-lg transition-transform duration-300 group-hover:-translate-x-1"
			>
				arrow_back
			</span>
			Go Back
		</span>
	</button>
</div>
