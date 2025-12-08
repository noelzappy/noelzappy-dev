export const Expertise = [
	{
		name: 'Backend',
		details:
			'Python, TypeScript, Node.js, FastAPI, Express.js, NestJS, Go, Java, REST, GraphQL, microservices'
	},
	{
		name: 'Databases',
		details: 'PostgreSQL, MySQL, MongoDB, Redis, Firebase, performance tuning, migrations, indexing'
	},
	{
		name: 'Frontend & Mobile',
		details:
			'Svelte, React, React Native, Next.js, TailwindCSS, JavaScript, TypeScript, component-driven design'
	},
	{
		name: 'Infrastructure',
		details: 'Docker, Kubernetes, AWS, GCP, Azure, CI/CD, observability, logging, metrics'
	},
	{
		name: 'AI & Automation',
		details:
			'LLM workflows, embeddings, retrieval pipelines, orchestration, AI-assisted development'
	},
	{
		name: 'Communication',
		details: 'Technical writing, async collaboration, leadership, code reviews'
	}
];

export const HomepageStructuredData = {
	'@context': 'https://schema.org',
	'@type': 'Person',
	name: 'Emmanuel Noel Zappy Yeboah',
	alternateName: 'Noel Zappy',
	url: 'https://noelzappy.dev',
	image: 'https://noelzappy.dev/og-image.png',
	sameAs: ['https://twitter.com/noelzappy', 'https://github.com/noelzappy'],
	jobTitle: 'Senior Software Engineer',
	worksFor: {
		'@type': 'Organization',
		name: 'Freelance/Contract'
	},
	description:
		'Senior software engineer with over 6 years of experience, specializing in building modern web and mobile applications.',
	knowsAbout: [
		'Software Engineering',
		'Web Development',
		'Mobile Development',
		'Python',
		'TypeScript',
		'JavaScript',
		'Node.js',
		'React',
		'Svelte',
		'Go',
		'Java',
		'AWS',
		'GCP',
		'Azure',
		'Docker',
		'Kubernetes'
	],
	alumniOf: {
		'@type': 'Organization',
		name: 'Software Engineering'
	}
};
