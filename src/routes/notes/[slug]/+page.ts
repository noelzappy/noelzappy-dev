import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { Notes } from '$lib/shared/notes';

export const load: PageLoad = ({ params }) => {
	const note = Notes.find((note) => note.id.toString() === params.slug);

	if (note) {
		return {
			note
		};
	}

	error(404, 'Note not found');
};
