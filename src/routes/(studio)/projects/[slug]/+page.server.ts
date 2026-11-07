import { error } from '@sveltejs/kit';
import { getAllProjects, getProjectBySlug } from '$lib/data/projects-loader';
import type { EntryGenerator, PageServerLoad } from './$types';

export const prerender = true;

const withWriteup = () => getAllProjects().filter((p) => p.html.trim().length > 0);

export const entries: EntryGenerator = () => withWriteup().map((p) => ({ slug: p.slug }));

export const load: PageServerLoad = async ({ params }) => {
	const project = getProjectBySlug(params.slug);
	if (!project || !project.html.trim()) error(404, 'Project not found');

	return {
		slug: project.slug,
		title: project.title,
		excerpt: project.excerpt,
		html: project.html,
		publishedAt: project.publishedAt,
		role: project.role ?? '',
		client: project.client ?? '',
		status: project.status ?? '',
		liveUrl: project.liveUrl ?? '',
		github: project.github ?? '',
		iosUrl: project.iosUrl ?? '',
		androidUrl: project.androidUrl ?? '',
		stack: project.stack ?? project.featuredStack ?? [],
		featuredImage: project.featuredImage ?? '',
		gallery: project.gallery ?? [],
		problem: project.problem ?? '',
		lessons: project.lessons ?? ''
	};
};
