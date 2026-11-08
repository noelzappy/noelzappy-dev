<script lang="ts">
	import { formatDate } from '$lib/shared/date';
	import SEOHead from '$lib/components/seo-head.svelte';
	import CalEmbed from '$lib/components/cal-embed.svelte';
	import Hero from '$lib/components/hero.svelte';
	import Section from '$lib/components/section.svelte';
	import WorkTile from '$lib/components/work-tile.svelte';
	import {
		HomepageStructuredData,
		SITE_DESCRIPTION,
		SITE_KEYWORDS,
		SITE_TITLE
	} from '$lib/shared/constants';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const OFFERS = [
		{
			title: 'Build the whole product',
			line: 'From first screen to app-store release: mobile, web, backend and admin.'
		},
		{
			title: 'Lead or join your team',
			line: 'Senior, lead or fractional-CTO contracts with teams that need to ship.'
		},
		{
			title: 'Fix, rescue or migrate',
			line: 'Payments, ledgers, reliability and re-platforming without downtime.'
		},
		{
			title: 'Websites with a real admin',
			line: 'Fast custom sites your team can edit, off WordPress for good.'
		}
	];
</script>

<CalEmbed />
<SEOHead
	title={SITE_TITLE}
	description={SITE_DESCRIPTION}
	canonical="https://noelzappy.dev"
	keywords={SITE_KEYWORDS.join(', ')}
	structuredData={HomepageStructuredData}
/>

<Hero
	pills={data.pills}
	headline="I design and build software products, end to end."
	intro="I'm an independent product engineer. I design and build mobile apps, web platforms and the systems behind them — and ship them to production for startups and businesses."
/>

{#if data.projects.length}
	<Section label="Selected work" id="work">
		<div class="tiles">
			{#each data.projects as project (project.slug)}
				<WorkTile {project} />
			{/each}
		</div>
		<a class="more" href="/projects" data-sveltekit-preload-data>See all projects →</a>
	</Section>
{/if}

<Section label="What I do" id="what-i-do">
	<ul class="offers">
		{#each OFFERS as offer (offer.title)}
			<li>
				<h3 class="offer">{offer.title}</h3>
				<p class="line">{offer.line}</p>
			</li>
		{/each}
	</ul>
	<a class="more" href="/work-with-me" data-sveltekit-preload-data>How I work with teams →</a>
</Section>

<Section label="Track record" id="track-record">
	<p class="record">Co-founder &amp; CTO, Pavex</p>
	<p class="before">Before: Hubtel · Built Financial Technologies · Fetch Agent · RBL</p>
</Section>

{#if data.posts.length}
	<Section label="Writing" id="writing">
		<ul class="posts">
			{#each data.posts as post (post.slug)}
				<li>
					<a href="/writing/{post.slug}" class="post" data-sveltekit-preload-data>
						<span class="title">{post.title}</span>
						<time datetime={post.date}>{formatDate(post.date)}</time>
					</a>
				</li>
			{/each}
		</ul>
		<a class="more" href="/writing" data-sveltekit-preload-data>All posts →</a>
	</Section>
{/if}

<style>
	.tiles {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: clamp(2rem, 5vw, 3.5rem) var(--page-gutter);
	}
	@media (min-width: 48rem) {
		.tiles {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	.more {
		display: inline-block;
		margin-top: 2rem;
		color: var(--fg);
		font-size: var(--step-small);
		text-decoration: underline;
		text-underline-offset: 0.25em;
		text-decoration-color: var(--border);
	}
	.more:hover {
		color: var(--accent);
		text-decoration-color: currentColor;
	}

	.offers {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: minmax(0, 1fr);
	}
	.offers li {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 0.5rem 2rem;
		padding-block: 1.25rem;
		border-top: 1px solid var(--border);
	}
	.offers li:first-child {
		border-top: 0;
		padding-top: 0;
	}
	.offer {
		margin: 0;
		font-family: var(--font-display);
		font-size: var(--step-heading);
		line-height: var(--lh-heading);
		letter-spacing: var(--tracking-heading);
		font-weight: var(--weight-display-m);
	}
	.line {
		margin: 0;
		max-width: 44ch;
		color: var(--muted);
		font-size: var(--step-body);
		line-height: 1.5;
	}
	@media (min-width: 48rem) {
		.offers li {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
			align-items: baseline;
		}
	}

	.record {
		margin: 0;
		font-family: var(--font-display);
		font-size: var(--step-display-m);
		line-height: var(--lh-display-m);
		letter-spacing: var(--tracking-display-m);
		font-weight: var(--weight-display-m);
	}
	.before {
		margin: 0;
		color: var(--muted);
		font-size: var(--step-body);
		line-height: 1.5;
	}

	.posts {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.posts li + li {
		border-top: 1px solid var(--border);
	}
	.post {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.25rem 2rem;
		padding-block: 1rem;
		color: var(--fg);
		text-decoration: none;
	}
	.posts li:first-child .post {
		padding-top: 0;
	}
	.title {
		font-size: var(--step-heading);
		line-height: var(--lh-heading);
		letter-spacing: var(--tracking-heading);
	}
	.post:hover .title {
		color: var(--accent);
	}
	time {
		color: var(--muted);
		font-size: var(--step-small);
		white-space: nowrap;
	}
</style>
