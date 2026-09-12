/** Permanent redirects from the pre-2026 URL structure. Returns null when no redirect applies. */
export function resolveRedirect(pathname: string): string | null {
	const path = pathname.replace(/\/+$/, '') || '/';
	if (path === '/notes') return '/writing';
	if (path === '/work' || path === '/open-source') return '/projects';
	const note = path.match(/^\/notes\/([^/]+)$/);
	if (note) return `/writing/${note[1]}`;
	const work = path.match(/^\/work\/([^/]+)$/);
	if (work) return `/projects/${work[1]}`;
	return null;
}
