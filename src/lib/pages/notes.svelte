<script lang="ts">
	import { Notes } from '$lib/shared/constants';
</script>

<div class="flex flex-col gap-12 sm:gap-16">
	<div class="flex flex-col gap-1.5">
		<h1 class="text-3xl font-medium tracking-tight text-neutral-100 sm:text-4xl">Notes</h1>
		<div class="flex flex-col gap-6 text-base leading-7 text-neutral-400">
			<p>
				Insights, and reflections on software engineering, technology trends, and my personal
				experiences in the tech industry.
			</p>
		</div>
	</div>
	<div class="flex flex-col gap-10">
		{#each Notes as note}
			<a class="group" href={`/notes/${note.id}`}>
				<div class="grid sm:grid-cols-4 gap-2">
					<p class="sm:col-span-1 text-sm text-gray-400">
						{note.date}
					</p>
					<div class="sm:col-span-3 flex flex-col gap-1.5">
						<p class="text-lg font-medium text-gray-200 group-hover:text-white transition-colors">
							{note.title}
						</p>
						<p class="text-base text-gray-400">
							{note.excerpt}
						</p>
					</div>
				</div>
			</a>
		{/each}
	</div>
</div>
