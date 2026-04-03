import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getProjectBySlug, getAllProjects } from '$lib/data/projects-loader';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const project = getProjectBySlug(params.slug);
		const allProjects = getAllProjects();

		if (project) {
			const currentIndex = allProjects.findIndex((p) => p.slug === params.slug);
			const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
			const nextProject =
				currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

			return {
				project: {
					id: project.slug,
					slug: project.slug,
					title: project.title,
					html: project.html,
					publishedAt: project.publishedAt,
					updatedAt: project.publishedAt,
					featuredImage: project.featuredImage || '',
					excerpt: project.excerpt,
					role: project.role || '',
					team: project.team || '',
					status: project.status || '',
					client: project.client || '',
					liveUrl: project.liveUrl || '',
					iosUrl: project.iosUrl || '',
					androidUrl: project.androidUrl || '',
					github: project.github || '',
					gallery: project.gallery || [],
					featuredStack: project.featuredStack || [],
					stack: project.stack || [],
					stats: project.stats || [],
					categories: project.categories || [],
					problem: project.problem || '',
					lessons: project.lessons || ''
				},
				prevProject: prevProject ? { slug: prevProject.slug, title: prevProject.title } : null,
				nextProject: nextProject ? { slug: nextProject.slug, title: nextProject.title } : null
			};
		}
	} catch (err) {
		console.error('Error fetching project:', err);
	}

	error(404, 'Project not found');
};
