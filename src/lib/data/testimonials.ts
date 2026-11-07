export type Testimonial = { quote: string; name: string; role: string; placeholder?: boolean };

// TODO(Emmanuel): replace these placeholders with real client quotes before launch.
export const TESTIMONIALS: Testimonial[] = [
	{
		quote: 'Client quote goes here.',
		name: 'Client name',
		role: 'Role, Company',
		placeholder: true
	},
	{
		quote: 'Client quote goes here.',
		name: 'Client name',
		role: 'Role, Company',
		placeholder: true
	},
	{
		quote: 'Client quote goes here.',
		name: 'Client name',
		role: 'Role, Company',
		placeholder: true
	}
];

export function hasPlaceholderTestimonials(list: Testimonial[] = TESTIMONIALS): boolean {
	return list.some((t) => t.placeholder === true);
}
