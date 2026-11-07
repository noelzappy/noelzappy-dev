import yaml from 'js-yaml';
import type { PillProject, ProjectData } from './projects';

function parseFrontmatter(content: string): { data: Record<string, unknown>; content: string } {
	const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
	const match = content.match(frontmatterRegex);

	if (!match) {
		return { data: {}, content };
	}

	const frontmatter = match[1];
	const markdown = match[2];

	try {
		const data = yaml.load(frontmatter) as Record<string, unknown>;
		return { data: data || {}, content: markdown };
	} catch {
		return { data: {}, content: markdown };
	}
}

const projectFiles = import.meta.glob('/src/content/projects/*.md', {
	query: '?raw',
	eager: true,
	import: 'default'
}) as Record<string, string>;

function parseProjects(): ProjectData[] {
	const projects: ProjectData[] = [];

	for (const [filePath, content] of Object.entries(projectFiles)) {
		const fileName = filePath.split('/').pop() || '';
		const { data, content: markdown } = parseFrontmatter(content);

		projects.push({
			...data,
			id: fileName.replace('.md', ''),
			html: markdown
		} as ProjectData);
	}

	return projects
		.filter((project) => project.id)
		.sort((a, b) => {
			return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
		});
}

// Cache the parsed projects
let cachedProjects: ProjectData[] | null = null;

export function getAllProjects(): ProjectData[] {
	if (!cachedProjects) {
		cachedProjects = parseProjects();
	}
	return cachedProjects;
}

export function getProjectBySlug(slug: string): ProjectData | null {
	const allProjects = getAllProjects();
	return allProjects.find((project) => project.slug === slug) || null;
}

export function getFeaturedProjects(limit: number = 6): ProjectData[] {
	const allProjects = getAllProjects();
	return allProjects.filter((project) => project.featured).slice(0, limit);
}

export function getPillProjects(): PillProject[] {
	return getAllProjects()
		.filter((project) => project.pill === true)
		.sort((a, b) => (a.pillOrder ?? Infinity) - (b.pillOrder ?? Infinity))
		.map(({ slug, title, oneLine, built, brandColor, onBrand, deviceShots }) => ({
			slug,
			title,
			oneLine,
			built,
			brandColor,
			onBrand,
			deviceShots
		}));
}

/**
 * The case study after `slug`, in `getAllProjects()` order, wrapping to the first. Only projects
 * with a writeup have a page to link to. `null` when there are fewer than two, or `slug` has none.
 */
export function getNextCaseStudy(slug: string): { slug: string; title: string } | null {
	const studies = getAllProjects().filter((project) => project.html.trim().length > 0);
	const index = studies.findIndex((project) => project.slug === slug);
	if (studies.length < 2 || index === -1) return null;
	const { slug: nextSlug, title } = studies[(index + 1) % studies.length];
	return { slug: nextSlug, title };
}
