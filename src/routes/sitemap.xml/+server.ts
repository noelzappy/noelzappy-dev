import { fetchPosts, fetchProjectPosts } from '$lib/integrations/ghost';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const baseUrl = 'https://noelzappy.dev';

	try {
		// Fetch all posts and projects (increased limit to get all)
		const [notesData, projectsData] = await Promise.all([
			fetchPosts(1, 100),
			fetchProjectPosts(1, 100)
		]);

		const notes = notesData || [];
		const projects = projectsData || [];

		const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
	<!-- Homepage -->
	<url>
		<loc>${baseUrl}</loc>
		<changefreq>weekly</changefreq>
		<priority>1.0</priority>
		<lastmod>${new Date().toISOString()}</lastmod>
	</url>
	
	<!-- Projects Listing -->
	<url>
		<loc>${baseUrl}/projects</loc>
		<changefreq>weekly</changefreq>
		<priority>0.9</priority>
		<lastmod>${new Date().toISOString()}</lastmod>
	</url>
	
	<!-- Notes Listing -->
	<url>
		<loc>${baseUrl}/notes</loc>
		<changefreq>weekly</changefreq>
		<priority>0.9</priority>
		<lastmod>${new Date().toISOString()}</lastmod>
	</url>
	
	<!-- Contact -->
	<url>
		<loc>${baseUrl}/contact</loc>
		<changefreq>monthly</changefreq>
		<priority>0.7</priority>
		<lastmod>${new Date().toISOString()}</lastmod>
	</url>
	
	<!-- Individual Projects -->
	${projects
		.map(
			(project) => `
	<url>
		<loc>${baseUrl}/projects/${project.slug}</loc>
		<lastmod>${new Date(project.updated_at || project.published_at || new Date()).toISOString()}</lastmod>
		<changefreq>monthly</changefreq>
		<priority>0.8</priority>
	</url>`
		)
		.join('')}
	
	<!-- Individual Notes -->
	${notes
		.map(
			(note) => `
	<url>
		<loc>${baseUrl}/notes/${note.slug}</loc>
		<lastmod>${new Date(note.updated_at || note.published_at || new Date()).toISOString()}</lastmod>
		<changefreq>monthly</changefreq>
		<priority>0.8</priority>
	</url>`
		)
		.join('')}
</urlset>`;

		return new Response(sitemap, {
			headers: {
				'Content-Type': 'application/xml',
				'Cache-Control': 'max-age=0, s-maxage=3600'
			}
		});
	} catch (error) {
		console.error('Error generating sitemap:', error);
		return new Response('Error generating sitemap', { status: 500 });
	}
};
