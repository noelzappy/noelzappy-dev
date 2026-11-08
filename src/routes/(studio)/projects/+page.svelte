<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import SEOHead from '$lib/components/seo-head.svelte';
	import PageHeader from '$lib/components/page-header.svelte';
	import Section from '$lib/components/section.svelte';
	import WorkRow from '$lib/components/work-row.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const FILTERS = [
		{ key: 'all', label: 'All', category: null },
		{ key: 'mobile', label: 'Mobile', category: 'Mobile App' },
		{ key: 'web', label: 'Web', category: 'Web App' },
		{ key: 'backend', label: 'Backend', category: 'Backend' },
		{ key: 'fintech', label: 'Fintech', category: 'Fintech' },
		{ key: 'websites', label: 'Websites', category: 'Website' },
		{ key: 'open-source', label: 'Open source', category: null }
	] as const;
	type FilterKey = (typeof FILTERS)[number]['key'];

	const parse = (value: string | null): FilterKey =>
		FILTERS.find((f) => f.key === value)?.key ?? 'all';

	// `url.searchParams` is off limits while prerendering, so the filter starts at "all" in the
	// static HTML and picks up `?type=` once hydrated.
	// A writable $derived would read searchParams during hydration and mismatch the static HTML.
	// eslint-disable-next-line svelte/prefer-writable-derived
	let active = $state<FilterKey>('all');
	$effect(() => {
		active = parse(page.url.searchParams.get('type'));
	});

	// Chips with nothing behind them are hidden, computed from the data.
	const visibleFilters = $derived(
		FILTERS.filter((f) => {
			if (f.key === 'all') return true;
			if (f.key === 'open-source') return data.openSource.length > 0;
			return data.caseStudies.some((p) => (p.categories as string[]).includes(f.category!));
		})
	);

	const activeFilter = $derived(FILTERS.find((f) => f.key === active)!);
	const rows = $derived(
		active === 'open-source'
			? []
			: data.caseStudies.filter(
					(p) =>
						activeFilter.category === null ||
						(p.categories as string[]).includes(activeFilter.category)
				)
	);
	const showOpenSource = $derived(active === 'all' || active === 'open-source');

	function select(key: FilterKey) {
		active = key;
		const url = new URL(page.url);
		if (key === 'all') url.searchParams.delete('type');
		else url.searchParams.set('type', key);
		void goto(`${url.pathname}${url.search}`, {
			replaceState: true,
			noScroll: true,
			keepFocus: true
		});
	}

	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		name: 'Work | Emmanuel Yeboah',
		url: 'https://noelzappy.dev/projects',
		author: { '@type': 'Person', name: 'Emmanuel Yeboah', url: 'https://noelzappy.dev' }
	};
</script>

<SEOHead
	title="Work"
	description="Selected work by Emmanuel Yeboah: mobile apps, web platforms and backends, from first app to production, plus open-source tools he maintains."
	canonical="https://noelzappy.dev/projects"
	{structuredData}
/>

<PageHeader
	eyebrow="Work"
	title="Selected work: from first app to production."
	intro="Products I've built end to end for startups and businesses, and the tools I maintain in the open."
/>

<div class="filters-wrap">
	<div class="filters" role="group" aria-label="Filter work">
		{#each visibleFilters as f (f.key)}
			<button
				type="button"
				class="chip"
				aria-pressed={active === f.key}
				onclick={() => select(f.key)}>{f.label}</button
			>
		{/each}
	</div>
</div>

<div class="rows">
	<h2 class="sr-only">Case studies</h2>
	{#each rows as project (project.slug)}
		<WorkRow {project} />
	{/each}
	{#if active !== 'open-source' && rows.length === 0}
		<p class="empty">Nothing here yet.</p>
	{/if}
</div>

{#if showOpenSource && data.openSource.length}
	<Section label="Open source" id="open-source">
		<ul class="oss">
			{#each data.openSource as p (p.slug)}
				<li>
					<div class="oss-main">
						<h3>
							{#if p.hasWriteup}
								<a href="/projects/{p.slug}">{p.title}</a>
							{:else if p.github}
								<a href={p.github} rel="noopener noreferrer">{p.title}</a>
							{:else}
								{p.title}
							{/if}
						</h3>
						<p>{p.oneLine}</p>
					</div>
					<div class="oss-meta">
						{#if p.stars !== undefined}<span class="stars">{p.stars}</span>{/if}
						{#if p.github}<a href={p.github} rel="noopener noreferrer">Repo</a>{/if}
					</div>
				</li>
			{/each}
		</ul>
	</Section>
{/if}

<style>
	.filters-wrap {
		max-width: var(--page-max);
		margin-inline: auto;
		padding-inline: var(--page-gutter);
		padding-bottom: clamp(1.5rem, 3vw, 2.5rem);
	}
	.filters {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
	.chip {
		font: inherit;
		font-size: var(--step-small);
		min-height: var(--tap-min);
		padding: 0.45rem 0.95rem;
		border: 1px solid var(--border);
		border-radius: 999px;
		background: transparent;
		color: var(--muted);
		cursor: pointer;
	}
	.chip:hover {
		color: var(--fg);
		border-color: var(--muted);
	}
	.chip[aria-pressed='true'] {
		background: var(--fg);
		border-color: var(--fg);
		color: var(--bg);
	}
	.rows {
		max-width: var(--page-max);
		margin-inline: auto;
		padding-inline: var(--page-gutter);
	}
	.empty {
		margin: 0;
		padding-block: 2rem;
		border-top: 1px solid var(--border);
		color: var(--muted);
	}
	.oss {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
	}
	.oss li {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		padding-block: 1rem;
		border-top: 1px solid var(--border);
	}
	.oss li:first-child {
		border-top: 0;
		padding-top: 0;
	}
	.oss h3 {
		margin: 0;
		font-size: var(--step-body);
		font-weight: 500;
	}
	.oss h3 a {
		color: var(--fg);
		text-decoration: none;
	}
	.oss h3 a:hover {
		color: var(--accent);
	}
	.oss p {
		margin: 0.25rem 0 0;
		font-size: var(--step-small);
		color: var(--muted);
	}
	.oss-meta a {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: var(--tap-min);
		min-height: var(--tap-min);
	}
	.oss-meta {
		display: flex;
		align-items: center;
		gap: 1rem;
		font-size: var(--step-small);
		white-space: nowrap;
	}
	.stars {
		color: var(--muted);
	}
	.stars::before {
		content: '★ ';
	}
	.oss-meta a {
		color: var(--fg);
	}
	.oss-meta a:hover {
		color: var(--accent);
	}
</style>
