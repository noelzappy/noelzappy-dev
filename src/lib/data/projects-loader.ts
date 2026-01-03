import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { ProjectData } from './projects';

const projectsDirectory = path.join(process.cwd(), 'src/lib/data/projects');

export function getAllProjects(): ProjectData[] {
	const fileNames = fs.readdirSync(projectsDirectory);
	const projects = fileNames
		.filter((fileName) => fileName.endsWith('.md'))
		.map((fileName) => {
			const fullPath = path.join(projectsDirectory, fileName);
			const fileContents = fs.readFileSync(fullPath, 'utf8');
			const { data, content } = matter(fileContents);

			return {
				...data,
				html: content
			} as ProjectData;
		})
		.sort((a, b) => {
			return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
		});

	return projects;
}

export function getProjectBySlug(slug: string): ProjectData | null {
	try {
		const fullPath = path.join(projectsDirectory, `${slug}.md`);
		const fileContents = fs.readFileSync(fullPath, 'utf8');
		const { data, content } = matter(fileContents);

		return {
			...data,
			html: content
		} as ProjectData;
	} catch (_error) {
		return null;
	}
}

export function getFeaturedProjects(limit: number = 5): ProjectData[] {
	const allProjects = getAllProjects();
	return allProjects.filter((project) => project.featured).slice(0, limit);
}
