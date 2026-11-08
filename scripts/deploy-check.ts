/**
 * Pre-deploy gate. Run after `bun run build`:  bun scripts/deploy-check.ts
 *
 * Exits non-zero while placeholder content is still on the site:
 *  - placeholder testimonials in src/lib/data/testimonials.ts
 *  - "TODO(Emmanuel)" in rendered output (HTML comments are ignored)
 *
 * Deliberately NOT part of `bun run test`: placeholders must stay visible during development
 * without failing CI.
 */
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { hasPlaceholderTestimonials } from '../src/lib/data/testimonials';

const OUTPUT = '.svelte-kit/cloudflare';
const problems: string[] = [];

if (hasPlaceholderTestimonials()) {
	problems.push('Placeholder testimonials are still in src/lib/data/testimonials.ts.');
}

function htmlFiles(dir: string): string[] {
	return readdirSync(dir).flatMap((name) => {
		const full = join(dir, name);
		if (statSync(full).isDirectory()) return name === '_app' ? [] : htmlFiles(full);
		return name.endsWith('.html') ? [full] : [];
	});
}

if (!existsSync(OUTPUT)) {
	problems.push(`No build output at ${OUTPUT}. Run \`bun run build\` first.`);
} else {
	for (const file of htmlFiles(OUTPUT)) {
		const rendered = readFileSync(file, 'utf8').replace(/<!--[\s\S]*?-->/g, '');
		if (rendered.includes('TODO(Emmanuel)')) problems.push(`TODO(Emmanuel) in rendered ${file}`);
	}
}

if (problems.length) {
	console.error('deploy-check failed:\n' + problems.map((p) => `  - ${p}`).join('\n'));
	process.exit(1);
}
console.log('deploy-check passed.');
