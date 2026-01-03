<script lang="ts">
	import { onMount } from 'svelte';

	type Company = {
		name: string;
		logo: string;
		url: string;
	};

	const COMPANIES: Company[] = [
		{
			name: 'Hubtel',
			logo: '/imgs/hubtel-logo.png',
			url: 'https://hubtel.com/'
		},
		{
			name: 'Built Financial Technologies',
			logo: '/imgs/built-logo.png',
			url: 'https://built.africa/'
		},
		{
			name: 'Common Wealth (Fetch Agent)',
			logo: '/imgs/fetch-agent.png',
			url: 'https://fetchagent.com/'
		},

		{
			name: 'RBL Matchmaking LLC',
			logo: 'https://rbl-app.com/wp-content/uploads/2025/08/REAL-BLACK-LOVE-APP-LOGO-2.png',
			url: 'https://rbl-app.com/'
		},
		{
			name: 'CompuGhana',
			logo: '/imgs/compughana-logo.webp',
			url: 'https://compughana.com/'
		},
		{
			name: 'Brif Africa',
			logo: 'https://thebrif.com/content/images/2024/06/brif-logo-2048x930.png',
			url: 'https://brif.africa/'
		},
		{
			name: 'Susupaa',
			logo: '/imgs/susupaa-logo.png',
			url: 'https://susupaa.com/'
		},
		{
			name: 'Lyqx Agency',
			logo: '/imgs/lyqx-logo.jpeg',
			url: 'https://lyqx.agency'
		}
	];

	let companies1: Company[] = [];
	let companies2: Company[] = [];

	onMount(() => {
		const shuffled = [...COMPANIES].sort(() => Math.random() - 0.5);
		const half = Math.ceil(shuffled.length / 2);
		companies1 = shuffled.slice(0, half);
		companies2 = shuffled.slice(half);
	});
</script>

<section class="antialiased">
	<div class="max-w-7xl mx-auto">
		<div
			class="carousel-container relative flex flex-col gap-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]"
		>
			<div class="flex animate-scroll-left min-w-max">
				{#each [...companies1, ...companies1] as company, i (i)}
					<a
						href={company.url}
						target="_blank"
						rel="noopener"
						class="group flex-shrink-0 mx-4 flex items-center justify-center p-4 bg-neutral-800/20 rounded-2xl h-28 w-44 border border-neutral-700 hover:bg-neutral-800/40 hover:border-neutral-600 hover:shadow-lg hover:shadow-neutral-900/30 transition-all duration-300"
					>
						<img
							src={company.logo}
							alt={company.name}
							class="max-h-12 sm:max-h-16 object-contain transition-all duration-300 filter grayscale group-hover:grayscale-0"
						/>
					</a>
				{/each}
			</div>

			<div class="flex animate-scroll-right min-w-max">
				{#each [...companies2, ...companies2] as company, i (i)}
					<a
						href={company.url}
						target="_blank"
						rel="noopener"
						class="group flex-shrink-0 mx-4 flex items-center justify-center p-4 bg-neutral-800/20 rounded-2xl h-28 w-44 border border-neutral-700 hover:bg-neutral-800/40 hover:border-neutral-600 hover:shadow-lg hover:shadow-neutral-900/30 transition-all duration-300"
					>
						<img
							src={company.logo}
							alt={company.name}
							class="max-h-12 sm:max-h-16 object-contain transition-all duration-300 filter grayscale group-hover:grayscale-0"
						/>
					</a>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	@keyframes scroll-left {
		from {
			transform: translateX(0%);
		}
		to {
			transform: translateX(-50%);
		}
	}
	.animate-scroll-left {
		animation: scroll-left 30s linear infinite;
	}

	@keyframes scroll-right {
		from {
			transform: translateX(-50%);
		}
		to {
			transform: translateX(0%);
		}
	}
	.animate-scroll-right {
		animation: scroll-right 30s linear infinite;
	}

	.carousel-container:hover .animate-scroll-left,
	.carousel-container:hover .animate-scroll-right {
		animation-play-state: paused;
	}
</style>
