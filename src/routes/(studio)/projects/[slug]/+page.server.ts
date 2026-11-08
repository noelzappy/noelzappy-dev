import { error } from '@sveltejs/kit';
import { getAllProjects, getNextCaseStudy, getProjectBySlug } from '$lib/data/projects-loader';
import { getShowcase } from '$lib/data/showcase';
import { withShotRatios } from '$lib/server/image-size';
import type { EntryGenerator, PageServerLoad } from './$types';

export const prerender = true;

const withWriteup = () => getAllProjects().filter((p) => p.html.trim().length > 0);

export const entries: EntryGenerator = () => withWriteup().map((p) => ({ slug: p.slug }));

export const load: PageServerLoad = async ({ params }) => {
	const project = getProjectBySlug(params.slug);
	if (!project || !project.html.trim()) error(404, 'Project not found');

	// The Next block shows the next project's showcase, so carry what that needs.
	const nextStudy = getNextCaseStudy(project.slug);
	const nextProject = nextStudy ? getProjectBySlug(nextStudy.slug) : undefined;
	const next =
		nextStudy && nextProject
			? {
					...nextStudy,
					brandColor: nextProject.brandColor ?? '',
					onBrand: nextProject.onBrand,
					showcase: withShotRatios(getShowcase(nextProject))
				}
			: null;

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
		lessons: project.lessons ?? '',
		engagement: project.engagement ?? '',
		stage: project.stage ?? '',
		built: project.built ?? [],
		brandColor: project.brandColor ?? '',
		onBrand: project.onBrand ?? '',
		deviceShots: project.deviceShots ?? [],
		showcase: withShotRatios(getShowcase(project)),
		impact: project.impact ?? [],
		next
	};
};
