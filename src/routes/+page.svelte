<script lang="ts">
	import SEOHead from '$lib/components/seo-head.svelte';
	import PostList from '$lib/components/post-list.svelte';
	import ProjectList from '$lib/components/project-list.svelte';
	import CalButton from '$lib/components/CalButton.svelte';
	import CalEmbed from '$lib/components/cal-embed.svelte';
	import { CAL_EVENTS } from '$lib/cal.js';
	import { TIMELINE } from '$lib/data/timeline';
	import {
		HomepageStructuredData,
		SITE_DESCRIPTION,
		SITE_KEYWORDS,
		SITE_TITLE
	} from '$lib/shared/constants';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<CalEmbed />
<SEOHead
	title={SITE_TITLE}
	description={SITE_DESCRIPTION}
	canonical="https://noelzappy.dev"
	keywords={SITE_KEYWORDS.join(', ')}
	structuredData={HomepageStructuredData}
/>

<section class="intro">
	<h1>Hey, I'm Emmanuel.</h1>
	<p>Backend engineer. I build systems that can't afford to be wrong.</p>
</section>

<section class="section" aria-labelledby="timeline-heading">
	<h2 id="timeline-heading">Timeline</h2>
	<ol class="timeline">
		{#each TIMELINE as entry (entry.years + entry.org)}
			<li>
				<span class="years muted mono">{entry.years}</span>
				<span class="entry">
					{#if entry.url}
						<a href={entry.url} rel="noopener noreferrer" class="org">{entry.org}</a>
					{:else}
						<span class="org">{entry.org}</span>
					{/if}
					<span class="muted">{entry.line}</span>
					{#if entry.writeup}
						<a href={entry.writeup} class="small" data-sveltekit-preload-data>writeup</a>
					{/if}
				</span>
			</li>
		{/each}
	</ol>
</section>

{#if data.posts.length}
	<section class="section" aria-labelledby="writing-heading">
		<h2 id="writing-heading"><a href="/writing">Writing</a></h2>
		<PostList posts={data.posts} />
		<a href="/writing" class="small">All posts →</a>
	</section>
{/if}

{#if data.projects.length}
	<section class="section" aria-labelledby="projects-heading">
		<h2 id="projects-heading"><a href="/projects">Projects</a></h2>
		<ProjectList projects={data.projects} />
		<a href="/projects" class="small">All projects →</a>
	</section>
{/if}

<section class="section" aria-labelledby="contact-heading">
	<h2 id="contact-heading">Contact</h2>
	<p class="contact">
		Email <a href="mailto:me@noelzappy.dev">me@noelzappy.dev</a> or
		<CalButton eventSlug={CAL_EVENTS.intro} label="book a 15-minute call" />.
	</p>
</section>

<style>
	.contact {
		margin: 0;
	}
	.intro {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.intro h1 {
		font-size: 2rem;
	}
	.intro p {
		margin: 0;
		font-size: 1.15rem;
	}
	.timeline {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.timeline li {
		display: grid;
		grid-template-columns: 7.5rem 1fr;
		gap: 0.25rem 1rem;
		align-items: baseline;
	}
	.years {
		white-space: nowrap;
	}
	.org {
		color: var(--fg);
		font-weight: 550;
		text-decoration: none;
	}
	a.org:hover {
		color: var(--accent);
	}
	.entry {
		display: inline;
	}
	.entry > * + * {
		margin-left: 0.4em;
	}
	@media (max-width: 480px) {
		.timeline li {
			grid-template-columns: 1fr;
			gap: 0.1rem;
		}
	}
</style>
