/** Case studies removed in the 2026 redesign; their old URLs go to the list. */
const DROPPED_PROJECTS = new Set([
	'built-lite-app',
	'built-africa-website',
	'built-website',
	'ejuma-platform',
	'drone-inspection-software',
	'tipme-mobile-app',
	'ashasie-travel-website',
	'owl-studios-website',
	'reeno-group-website',
	'getall-handyman',
	'brif-platform',
	'qargo-delivery-app',
	'cocaptain-app'
]);

/** Permanent redirects from the pre-2026 URL structure. Returns null when no redirect applies. */
export function resolveRedirect(pathname: string): string | null {
	const path = pathname.replace(/\/+$/, '') || '/';
	if (path === '/notes') return '/writing';
	if (path === '/work' || path === '/open-source') return '/projects';
	if (path === '/services') return '/contact';
	const note = path.match(/^\/notes\/([^/]+)$/);
	if (note) return `/writing/${note[1]}`;
	const work = path.match(/^\/work\/([^/]+)$/);
	if (work) return DROPPED_PROJECTS.has(work[1]) ? '/projects' : `/projects/${work[1]}`;
	const project = path.match(/^\/projects\/([^/]+)$/);
	if (project && DROPPED_PROJECTS.has(project[1])) return '/projects';
	return null;
}
