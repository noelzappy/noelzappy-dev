<script lang="ts">
	import { onMount } from 'svelte';

	type Contribution = {
		date: string;
		contributionCount: number;
		contributionLevel:
			| 'NONE'
			| 'FIRST_QUARTILE'
			| 'SECOND_QUARTILE'
			| 'THIRD_QUARTILE'
			| 'FOURTH_QUARTILE';
	};

	type Week = {
		contributionDays: Contribution[];
	};

	let totalContributions = 0;
	let weeks: Week[] = [];
	let loading = true;
	let error: string | null = null;
	let tooltip = {
		visible: false,
		content: '',
		x: 0,
		y: 0
	};

	const MONTH_LABELS = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
	];
	let monthLabelPositions: { label: string; position: number }[] = [];

	onMount(async () => {
		try {
			const response = await fetch('/api/github-contributions');
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Failed to fetch contributions');
			}
			const data = await response.json();
			totalContributions = data.totalContributions;
			weeks = data.weeks;
			monthLabelPositions = calculateMonthLabels(weeks);
		} catch (e: unknown) {
			if (e instanceof Error) {
				error = e.message;
			} else {
				error = 'An unknown error occurred while fetching contributions.';
			}
		} finally {
			loading = false;
		}
	});

	function calculateMonthLabels(weekData: Week[]): { label: string; position: number }[] {
		const labels: { label: string; position: number }[] = [];
		let lastMonth = -1;

		weekData.forEach((week, weekIndex) => {
			const firstDay = week.contributionDays[0];
			if (!firstDay) return;

			const month = new Date(firstDay.date).getMonth();
			if (weekIndex === 0 || month !== lastMonth) {
				const lastLabel = labels[labels.length - 1];
				if (!lastLabel || weekIndex > lastLabel.position + 4) {
					labels.push({ label: MONTH_LABELS[month], position: weekIndex });
					lastMonth = month;
				}
			}
		});
		return labels;
	}

	function getContributionColor(level: Contribution['contributionLevel']): string {
		switch (level) {
			case 'FIRST_QUARTILE':
				return 'bg-[#9be9a8] dark:bg-[#0e4429]';
			case 'SECOND_QUARTILE':
				return 'bg-[#40c463] dark:bg-[#006d32]';
			case 'THIRD_QUARTILE':
				return 'bg-[#30a14e] dark:bg-[#26a641]';
			case 'FOURTH_QUARTILE':
				return 'bg-[#216e39] dark:bg-[#39d353]';
			case 'NONE':
			default:
				return 'bg-[#ebedf0] dark:bg-[#161b22]';
		}
	}

	function showTooltip(e: MouseEvent, day: Contribution) {
		if (!day.date) return;
		tooltip = {
			visible: true,
			content: `${day.contributionCount} contributions on ${new Date(day.date).toDateString()}`,
			x: e.clientX,
			y: e.clientY
		};
	}

	function hideTooltip() {
		tooltip = { ...tooltip, visible: false };
	}
</script>

<div
	class="contribution-graph-container border border-gray-200 dark:border-gray-700 rounded-md p-4"
>
	{#if loading}
		<div>
			<div class="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2 mb-4 animate-pulse"></div>
			<div class="flex gap-2 mt-2">
				<div
					class="day-labels hidden sm:flex flex-col justify-between text-xs text-transparent select-none"
				>
					<span>.</span>
					<span>Mon</span>
					<span>.</span>
					<span>Wed</span>
					<span>.</span>
					<span>Fri</span>
					<span>.</span>
				</div>
				<div class="graph-grid grid grid-flow-col auto-cols-fr gap-1 w-full">
					{#each Array(53) as _, i (i)}
						<div class="week-col grid grid-rows-7 gap-1">
							{#each Array(7) as _, j (j)}
								<div
									class="day-cell aspect-square rounded-sm bg-neutral-200 dark:bg-neutral-700 animate-pulse"
									style="animation-delay: {i * 15 + j * 15}ms; animation-duration: 1.5s;"
								></div>
							{/each}
						</div>
					{/each}
				</div>
			</div>
			<div class="graph-footer mt-2 flex justify-end items-center">
				<div class="legend flex items-center gap-1 mt-2 sm:mt-0 text-transparent select-none">
					<span>Less</span>
					<div
						class="w-2.5 h-2.5 rounded-sm bg-neutral-200 dark:bg-neutral-700 animate-pulse"
					></div>
					<div
						class="w-2.5 h-2.5 rounded-sm bg-neutral-200 dark:bg-neutral-700 animate-pulse"
					></div>
					<div
						class="w-2.5 h-2.5 rounded-sm bg-neutral-200 dark:bg-neutral-700 animate-pulse"
					></div>
					<div
						class="w-2.5 h-2.5 rounded-sm bg-neutral-200 dark:bg-neutral-700 animate-pulse"
					></div>
					<div
						class="w-2.5 h-2.5 rounded-sm bg-neutral-200 dark:bg-neutral-700 animate-pulse"
					></div>
					<span>More</span>
				</div>
			</div>
		</div>
	{:else if error}
		<p class="text-red-500">{error}</p>
		<p class="text-sm text-gray-500">
			Please ensure you have set up your GITHUB_ACCESS_TOKEN. Add it to your .env file.
		</p>
	{:else}
		<h2 class="text-base font-semibold mb-2">
			{totalContributions} contributions in the last year
		</h2>
		<div>
			<div
				class="month-labels grid text-xs text-gray-600 dark:text-gray-400 pl-8"
				style="grid-template-columns: repeat({weeks.length}, minmax(0, 1fr));"
			>
				{#each monthLabelPositions as { label, position } (position)}
					<div class="month-label text-left" style="grid-column-start: {position + 1};">
						{label}
					</div>
				{/each}
			</div>
			<div class="flex gap-2 mt-1">
				<div class="day-labels hidden sm:flex flex-col justify-between text-xs text-gray-500">
					<span></span>
					<span>Mon</span>
					<span></span>
					<span>Wed</span>
					<span></span>
					<span>Fri</span>
					<span></span>
				</div>
				<div class="graph-grid grid grid-flow-col auto-cols-fr gap-1 w-full">
					{#each weeks as week, i (i)}
						<div class="week-col grid grid-rows-7 gap-1">
							{#each week.contributionDays as day (day.date)}
								<div
									class="day-cell aspect-square rounded-sm transition-transform duration-100 ease-in-out hover:scale-110 {getContributionColor(
										day.contributionLevel
									)}"
									on:mouseenter={(e) => showTooltip(e, day)}
									on:mouseleave={hideTooltip}
								></div>
							{/each}
						</div>
					{/each}
				</div>
			</div>
		</div>

		<div class="graph-footer mt-2 flex justify-end items-center text-xs text-gray-500">
			<div class="legend flex items-center gap-1 mt-2 sm:mt-0">
				<span>Less</span>
				<div class="day-cell-legend w-2.5 h-2.5 rounded-sm bg-[#ebedf0] dark:bg-[#161b22]"></div>
				<div class="day-cell-legend w-2.5 h-2.5 rounded-sm bg-[#9be9a8] dark:bg-[#0e4429]"></div>
				<div class="day-cell-legend w-2.5 h-2.5 rounded-sm bg-[#40c463] dark:bg-[#006d32]"></div>
				<div class="day-cell-legend w-2.5 h-2.5 rounded-sm bg-[#30a14e] dark:bg-[#26a641]"></div>
				<div class="day-cell-legend w-2.5 h-2.5 rounded-sm bg-[#216e39] dark:bg-[#39d353]"></div>
				<span>More</span>
			</div>
		</div>
	{/if}
</div>

{#if tooltip.visible}
	<div
		class="tooltip fixed bg-gray-900 text-white text-xs rounded py-1 px-2 z-50 pointer-events-none"
		style="top: {tooltip.y - 30}px; left: {tooltip.x - 50}px;"
	>
		{tooltip.content}
	</div>
{/if}
