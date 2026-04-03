import { getAllProjects } from '$lib/data/projects-loader';
import { PROJECT_CATEGORIES, type ProjectCategory } from '$lib/data/projects';
import type { PageServerLoad } from './$types';

const FEATURED_SLUGS = [
	'susupaa-platform',
	'fetch-agent-real-estate-platform',
	'rbl-dating-app',
	'qargo-delivery-app'
];

export const load: PageServerLoad = async ({ url }) => {
	const categoryFilter = url.searchParams.get('category') as ProjectCategory | null;

	try {
		let allProjects = getAllProjects();

		if (categoryFilter && PROJECT_CATEGORIES.includes(categoryFilter)) {
			allProjects = allProjects.filter((p) => p.categories?.includes(categoryFilter));
		}

		const featuredProjects = allProjects.filter((p) => FEATURED_SLUGS.includes(p.slug));
		const otherProjects = allProjects.filter((p) => !FEATURED_SLUGS.includes(p.slug));

		const mapProject = (p: (typeof allProjects)[0]) => ({
			slug: p.slug,
			title: p.title,
			excerpt: p.excerpt,
			featuredImage: p.featuredImage || '',
			status: p.status || '',
			role: p.role || '',
			client: p.client || '',
			featuredStack: p.featuredStack || [],
			stats: p.stats || [],
			categories: p.categories || []
		});

		return {
			featuredProjects: featuredProjects.map(mapProject),
			otherProjects: otherProjects.map(mapProject),
			categories: PROJECT_CATEGORIES,
			activeCategory: categoryFilter
		};
	} catch {
		return {
			featuredProjects: [],
			otherProjects: [],
			categories: PROJECT_CATEGORIES,
			activeCategory: null
		};
	}
};
