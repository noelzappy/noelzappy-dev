/**
 * Convert screenshots from a folder (real iPhone, or any PNG/JPEG/HEIC) into
 * static/portfolio/<slug>/<name>.webp.
 *
 *   bun run capture:ingest <folder> <slug> [--kind phone|browser]
 */
import { readdirSync, readFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import {
	MAX_WIDTH,
	cappedSize,
	flagString,
	frontmatterSnippet,
	outputPath,
	parseArgs,
	parseKind,
	pngSize,
	slugFromFilename,
	slugify,
	sortFilenames,
	uniqueNames
} from './lib';
import { fail, makeTempDir, removeDir, requireTool, run, toWebp } from './shell';

const HELP = `Usage: bun run capture:ingest <folder> <slug> [--kind phone|browser]

Converts every PNG/JPEG/HEIC in <folder> (sorted by name) to WebP q90 in static/portfolio/<slug>/.
Width is capped at 1179px for phones (default) and 2880px for browser. Names are slugified from
the source file names. EXIF and other metadata are not carried over (verified after each write).`;

const EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.heic', '.heif']);

async function main() {
	const args = parseArgs(process.argv.slice(2), ['help']);
	if (args.flags.help || args.positionals.length < 2) {
		console.log(HELP);
		process.exit(args.flags.help ? 0 : 1);
	}
	const [folder, rawSlug] = args.positionals;
	const slug = slugify(rawSlug);
	const kind = parseKind(flagString(args, 'kind'));
	const files = sortFilenames(
		readdirSync(folder).filter(
			(f) => !f.startsWith('.') && EXTENSIONS.has(extname(f).toLowerCase())
		)
	);
	if (!files.length) throw new Error(`No PNG/JPEG/HEIC files in ${folder}`);

	requireTool('cwebp', 'Install with: brew install webp');
	requireTool('sips', 'sips ships with macOS.');
	const names = uniqueNames(files.map(slugFromFilename));
	const tmp = makeTempDir();
	try {
		files.forEach((file, i) => {
			// sips normalises HEIC/JPEG to PNG so cwebp gets one input format.
			const png = join(tmp, `${i}.png`);
			run('sips', ['-s', 'format', 'png', join(folder, file), '--out', png]);
			const src = pngSize(readFileSync(png));
			if (!src) throw new Error(`${file}: sips did not produce a PNG`);
			const max = MAX_WIDTH[kind];
			const out = outputPath(slug, names[i]);
			const size = toWebp(png, out, src.width > max ? max : undefined);
			const expected = cappedSize(src.width, src.height, max);
			console.log(`${file} -> ${out}  ${size.width}x${size.height}`);
			if (Math.abs(size.height - expected.height) > 1) {
				console.warn(`  warning: expected ${expected.width}x${expected.height}`);
			}
		});
	} finally {
		removeDir(tmp);
	}
	console.log('\nFrontmatter (paste into showcase / deviceShots, then write real alt text):');
	for (const name of names) console.log(frontmatterSnippet(slug, name, kind));
}

main().catch(fail);
