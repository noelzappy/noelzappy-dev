<script lang="ts">
	interface SEOProps {
		title: string;
		description: string;
		canonical: string;
		ogType?: 'website' | 'article';
		ogImage?: string;
		publishedTime?: string;
		modifiedTime?: string;
		tags?: string[];
		structuredData?: object;
		keywords?: string;
		noindex?: boolean;
	}

	let {
		title,
		description,
		canonical,
		ogType = 'website',
		ogImage = 'https://noelzappy.dev/zappy-face.jpg' as string | undefined,
		publishedTime,
		modifiedTime,
		tags = [],
		structuredData,
		keywords,
		noindex = false
	}: SEOProps = $props();
</script>

<svelte:head>
	<!-- Primary Meta Tags -->
	<title>{title.includes('Emmanuel Yeboah') ? title : `${title} | Emmanuel Yeboah`}</title>
	<meta name="description" content={description} />
	{#if keywords}
		<meta name="keywords" content={keywords} />
	{/if}
	<link rel="canonical" href={canonical} />
	{#if noindex}
		<meta name="robots" content="noindex" />
	{/if}

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content={ogType} />
	<meta property="og:url" content={canonical} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={ogImage ?? 'https://noelzappy.dev/zappy-face.jpg'} />
	<meta property="og:site_name" content="Emmanuel Yeboah" />
	<meta property="og:locale" content="en_US" />
	{#if publishedTime}
		<meta property="article:published_time" content={publishedTime} />
	{/if}
	{#if modifiedTime}
		<meta property="article:modified_time" content={modifiedTime} />
	{/if}
	{#each tags as tag (tag)}
		<meta property="article:tag" content={tag} />
	{/each}

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content={canonical} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={ogImage ?? 'https://noelzappy.dev/zappy-face.jpg'} />
	<meta name="twitter:creator" content="@noelzappy" />
	<meta name="twitter:site" content="@noelzappy" />

	<!-- JSON-LD Structured Data -->
	{#if structuredData}
		<!-- eslint-disable-next-line @typescript-eslint/no-unused-expressions -->
		{@html '<script type="application/ld+json">' + JSON.stringify(structuredData) + '</script>'}
	{/if}
</svelte:head>
