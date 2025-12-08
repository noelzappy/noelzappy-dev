<script lang="ts">
	import { Expertise } from '$lib/shared/expertise';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<section class="flex flex-col gap-2">
	<h1 class="text-3xl font-medium tracking-tight text-neutral-100 sm:text-4xl">
		Hi, I'm... <br />Emmanuel Noel Zappy Yeboah
	</h1>
	<div class="flex flex-col gap-6 text-base leading-7 text-neutral-400">
		<p>
			I'm a senior software engineer with over 6 years of experience, specializing in building
			modern web & mobile applications. My journey in tech has been driven by a relentless curiosity
			and a desire to solve complex problems.
		</p>
		<p>
			Beyond my own startups and projects, I’ve delivered software for startups and teams across
			fintech, SaaS, content platforms, and mobile apps. These systems are designed and shipped to
			stay reliable even under real-world pressure.
		</p>
	</div>
</section>
<section class="flex flex-col gap-8">
	<h2 class="text-sm font-medium text-neutral-100">Featured Projects</h2>
	<div class="grid grid-cols-1 gap-1 divide-y divide-neutral-800">
		{#each data.posts as project (project.slug)}
			<a
				class="group flex items-center justify-between py-4"
				href={`/projects/${project.slug}`}
				data-sveltekit-preload-data
			>
				<span class="text-neutral-300 group-hover:text-white transition-colors">
					{project.title}
				</span>
				<span
					class="material-symbols-outlined text-xl text-neutral-500 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white"
				>
					arrow_forward
				</span>
			</a>
		{/each}
	</div>
</section>
<section class="flex flex-col gap-8">
	<h2 class="text-md font-medium text-neutral-100">Expertise</h2>
	<div class="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4 text-sm">
		{#each Expertise as skill (skill.name)}
			<div
				class="flex flex-col gap-1 border cursor-pointer text-neutral-400 hover:text-white border-neutral-800 p-2 transition-all duration-300 rounded hover:scale-105 hover:border-neutral-600 hover:shadow-lg hover:shadow-neutral-900/50"
			>
				<h3 class="font-medium text-sm text-neutral-300">{skill.name}</h3>
				<p class="text-neutral-500">{skill.details}</p>
			</div>
		{/each}
	</div>
</section>
