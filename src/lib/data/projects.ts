export type ProjectCategory = 'Mobile App' | 'Web App' | 'Website' | 'Backend' | 'Fintech';
export type ProjectKind = 'case-study' | 'open-source';

export const PROJECT_CATEGORIES: ProjectCategory[] = [
	'Mobile App',
	'Web App',
	'Website',
	'Backend',
	'Fintech'
];

export type ProjectEngagement = 'full-build' | 'team' | 'rescue' | 'website' | 'open-source';
export type ProjectStage = 'startup' | 'business' | 'ngo' | 'own-venture';
export type DeviceShot = { src: string; alt: string; kind: 'phone' | 'browser' };
/** `ratio` is height / width when known up front (server-measured), so layout is stable before load. */
export type Shot = { src: string; alt: string; ratio?: number };
export type ShowcaseLayout = 'web-phones' | 'phones' | 'web';
/** One fixed composition per project: a web screen, 1-3 phone screens, or both. */
export type Showcase = { layout: ShowcaseLayout; web?: Shot; phones?: Shot[] };

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
	github?: string; // repository URL
	stars?: number; // GitHub stars, shown on open-source entries
	kind: ProjectKind;
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
	problem?: string;
	lessons?: string;
	engagement?: ProjectEngagement;
	stage?: ProjectStage;
	built?: string[]; // what was built, e.g. ['Web app', 'API']
	oneLine?: string; // one line for the homepage hero, <= 90 chars
	shortTitle?: string; // short name for tight spots (hero strip cards)
	brandColor?: string; // product's primary colour, #rrggbb
	onBrand?: 'light' | 'dark'; // text colour that reads on brandColor
	heroImage?: string;
	deviceShots?: DeviceShot[];
	showcase?: Showcase;
	pill?: boolean; // listed as a pill on the homepage hero
	pillOrder?: number;
	featuredOrder?: number; // position in the homepage Selected work (featured projects only)
	impact?: { value: string; label: string }[];
}

export interface ProjectData extends ProjectFrontmatter {
	html: string;
}

export type PillProject = Pick<
	ProjectData,
	| 'slug'
	| 'title'
	| 'shortTitle'
	| 'oneLine'
	| 'built'
	| 'brandColor'
	| 'onBrand'
	| 'deviceShots'
	| 'showcase'
>;
