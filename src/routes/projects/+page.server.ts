import { getAllProjects } from '$lib/data/projects-loader';
import { PROJECT_CATEGORIES, type ProjectCategory } from '$lib/data/projects';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const page = Number(url.searchParams.get('page')) || 1;
	const categoryFilter = url.searchParams.get('category') as ProjectCategory | null;
	const limit = 50;

	try {
		let allProjects = getAllProjects();

		// Filter by category if specified
		if (categoryFilter && PROJECT_CATEGORIES.includes(categoryFilter)) {
			allProjects = allProjects.filter((project) => project.categories?.includes(categoryFilter));
		}

		const total = allProjects.length;
		const pages = Math.ceil(total / limit);
		const start = (page - 1) * limit;
		const end = start + limit;
		const paginatedProjects = allProjects.slice(start, end);

		return {
			projects: paginatedProjects.map((project) => ({
				id: project.slug,
				slug: project.slug,
				title: project.title,
				excerpt: project.excerpt,
				publishedAt: project.publishedAt,
				featureImage: project.featuredImage || '',
				status: project.status || '',
				role: project.role || '',
				featuredStack: project.featuredStack || [],
				client: project.client || '',
				categories: project.categories || []
			})),
			categories: PROJECT_CATEGORIES,
			activeCategory: categoryFilter,
			pagination: {
				page,
				limit,
				pages,
				total,
				prev: page > 1 ? page - 1 : null,
				next: page < pages ? page + 1 : null
			}
		};
	} catch {
		return {
			projects: [],
			categories: PROJECT_CATEGORIES,
			activeCategory: null,
			pagination: {
				page: 1,
				limit,
				pages: 1,
				total: 0,
				prev: null,
				next: null
			}
		};
	}
};
