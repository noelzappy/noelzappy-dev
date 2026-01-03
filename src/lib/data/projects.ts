export interface ProjectFrontmatter {
	title: string;
	slug: string;
	excerpt: string;
	featured: boolean;
	publishedAt: string;
	featuredImage?: string;
}

export interface ProjectData extends ProjectFrontmatter {
	html: string;
}

export interface ProjectListItem {
	id: string;
	slug: string;
	title: string;
	excerpt: string;
	publishedAt: string;
	featuredImage: string;
	tags: string[];
}

export interface ProjectDetail {
	id: string;
	slug: string;
	title: string;
	html: string;
	publishedAt: string;
	updatedAt: string;
	featuredImage: string;
	excerpt: string;
	tags: string[];
	readingTime: number;
}
