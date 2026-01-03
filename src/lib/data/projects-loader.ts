import matter from 'gray-matter';
import type { ProjectData } from './projects';

const projectFiles = import.meta.glob('./projects/*.md', {
	query: '?raw',
	eager: true,
	import: 'default'
}) as Record<string, string>;

function parseProjects(): ProjectData[] {
	const projects: ProjectData[] = [];

	for (const [filePath, content] of Object.entries(projectFiles)) {
		const fileName = filePath.split('/').pop() || '';
		const { data, content: markdown } = matter(content);

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
	return allProjects.find((project) => project.id === slug) || null;
}

export function getFeaturedProjects(limit: number = 5): ProjectData[] {
	const allProjects = getAllProjects();
	return allProjects.filter((project) => project.featured).slice(0, limit);
}
