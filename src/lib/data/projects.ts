export type ProjectCategory = 'Mobile App' | 'Web App' | 'Website';

export const PROJECT_CATEGORIES: ProjectCategory[] = ['Mobile App', 'Web App', 'Website'];

export interface ProjectFrontmatter {
	id: string;
	title: string;
	slug: string;
	excerpt: string;
	featured: boolean;
	publishedAt: string;
	featuredImage?: string;
	liveUrl?: string;
	iosUrl?: string;
	androidUrl?: string;
	github?: string;
	role: string;
	team?: string; // 4 Members (1 PM, 2 Developers, 1 Designer, etc)
	status: string; // Shipped, In Progress, Discontinued, Archived
	client?: string;
	gallery?: string[];
	featuredStack?: string[];
	stack?: string[];
	categories?: ProjectCategory[];
	stats?: {
		key: string;
		value: string;
		description?: string;
	}[];
}

export interface ProjectData extends ProjectFrontmatter {
	html: string;
}
