/**
 * Project frontmatter from markdown files
 */
export interface ProjectFrontmatter {
	title: string;
	slug: string;
	excerpt: string;
	featured: boolean;
	published_at: string;
	feature_image?: string;
}

/**
 * Full project data including parsed HTML content
 */
export interface ProjectData extends ProjectFrontmatter {
	html: string;
}

/**
 * Project data formatted for list views
 */
export interface ProjectListItem {
	id: string;
	slug: string;
	title: string;
	excerpt: string;
	publishedAt: string;
	featureImage: string;
	tags: string[];
}

/**
 * Project data formatted for detail view
 */
export interface ProjectDetail {
	id: string;
	slug: string;
	title: string;
	html: string;
	publishedAt: string;
	updatedAt: string;
	featureImage: string;
	excerpt: string;
	tags: string[];
	readingTime: number;
}
