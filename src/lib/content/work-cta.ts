export interface WorkCtaSource {
	slug: string;
	hasWriteup: boolean;
	liveUrl?: string;
	github?: string;
}

/** Where a work entry leads: its case study, else its live site, else its repository. */
export function workCta(
	project: WorkCtaSource
): { href: string; label: string; external: boolean } | null {
	if (project.hasWriteup) {
		return { href: `/projects/${project.slug}`, label: 'View case study', external: false };
	}
	if (project.liveUrl) return { href: project.liveUrl, label: 'Visit live site', external: true };
	if (project.github) return { href: project.github, label: 'View repository', external: true };
	return null;
}
