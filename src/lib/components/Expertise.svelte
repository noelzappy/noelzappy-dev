<script lang="ts">
	import type { ComponentType } from 'svelte';
	import { Server, MonitorSmartphone, Cloud, Pickaxe } from 'lucide-svelte';

	type SkillCategory = {
		title: string;
		icon: ComponentType;
		topSkills: string[];
		otherSkills: string[];
	};

	const expertiseData: SkillCategory[] = [
		{
			title: 'Backend',
			icon: Server,
			topSkills: ['Go', 'Node.js', 'PostgreSQL'],
			otherSkills: ['Python', 'FastAPI', 'NestJS']
		},
		{
			title: 'Frontend',
			icon: MonitorSmartphone,
			topSkills: ['SvelteKit', 'React Native', 'Tailwind CSS'],
			otherSkills: ['React', 'TypeScript', 'Next.Js']
		},
		{
			title: 'Infrastructure',
			icon: Cloud,
			topSkills: ['Docker', 'Linux/VPS'],
			otherSkills: ['AWS', 'Kubernetes', 'CI/CD']
		},
		{
			title: 'Product Engineering',
			icon: Pickaxe,
			topSkills: ['System Design', 'MVP Strategy'],
			otherSkills: ['Analytics & Metrics', 'SEO', ' Technical Scoping', 'User Flow Optimization']
		}
	];
</script>

<section class="flex flex-col gap-6">
	<h2 class="text-xl font-semibold text-neutral-100">Core Expertise</h2>
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
		{#each expertiseData as category (category.title)}
			<div
				class="group flex flex-col gap-6 border border-neutral-700 bg-neutral-800/20 p-6 rounded-xl transition-all duration-300 hover:bg-neutral-800/40 hover:border-neutral-600 hover:shadow-lg hover:shadow-neutral-900/30"
			>
				<div class="flex items-center gap-3">
					<svelte:component
						this={category.icon}
						class="w-6 h-6 text-neutral-400 group-hover:text-white transition-colors"
					/>
					<h3
						class="font-semibold text-lg text-neutral-100 group-hover:text-white transition-colors"
					>
						{category.title}
					</h3>
				</div>

				<div class="flex flex-col gap-4">
					<div>
						<h4 class="text-sm font-medium text-neutral-400 mb-2">Top Skills</h4>
						<div class="flex flex-wrap gap-2">
							{#each category.topSkills as skill (skill)}
								<span
									class="px-3 py-1 text-sm font-medium text-sky-200 bg-sky-900/50 border border-sky-800 rounded-full"
								>
									{skill}
								</span>
							{/each}
						</div>
					</div>
					<div>
						<h4 class="text-sm font-medium text-neutral-400 mb-2">Other Skills</h4>
						<p class="text-sm text-neutral-500">{category.otherSkills.join(', ')}</p>
					</div>
				</div>
			</div>
		{/each}
	</div>
</section>
