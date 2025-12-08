import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { Projects } from '$lib/shared/constants';

export const load: PageLoad = ({ params }) => {
	const project = Projects.find((project) => project.id.toString() === params.slug);

	if (project) {
		return {
			project
		};
	}

	error(404, 'Project not found');
};
