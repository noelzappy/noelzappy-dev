/**
 * Capture web screens with Playwright into static/portfolio/<slug>/<name>.webp.
 *
 *   bun run capture:web <slug> [--shot name] [--dry-run]
 */
import { join } from 'node:path';
import { chromium } from 'playwright';
import {
	DEVICE_SCALE_FACTOR,
	VIEWPORT,
	buildHideCss,
	flagString,
	frontmatterSnippet,
	joinUrl,
	outputPath,
	parseArgs,
	pickWebShots,
	requireEnv,
	resolveBaseUrl
} from './lib';
import { manifest, type WebShot, type WebTarget } from './projects';
import { fail, makeTempDir, removeDir, requireTool, toWebp } from './shell';

const HELP = `Usage: bun run capture:web <slug> [--shot name] [--dry-run]

Captures the web shots in scripts/capture/projects.ts for <slug> at 1440x900 @2x,
reduced motion, light theme unless the shot says otherwise.

  --shot name   capture only this shot
  --dry-run     print what would be captured; open no browser, write nothing

Base URL and login come from the env vars named in the manifest (see docs/capture.md).`;

async function main() {
	const args = parseArgs(process.argv.slice(2), ['dry-run', 'help']);
	if (args.flags.help || !args.positionals.length) {
		console.log(HELP);
		process.exit(args.flags.help ? 0 : 1);
	}
	const slug = args.positionals[0];
	const web: WebTarget | undefined = manifest[slug]?.web;
	if (!web) {
		throw new Error(
			`No web capture for "${slug}". Known: ${Object.keys(manifest)
				.filter((s) => manifest[s].web)
				.join(', ')}`
		);
	}
	const shots = pickWebShots(web.shots, flagString(args, 'shot'));
	const baseUrl = resolveBaseUrl(web.baseUrlEnv, process.env, web.defaultBaseUrl);

	if (args.flags['dry-run']) {
		console.log(`[dry-run] ${slug}: base ${baseUrl}${web.login ? ' (with login)' : ''}`);
		for (const s of shots) {
			console.log(
				`  ${s.name}: ${joinUrl(baseUrl, s.path)} -> ${outputPath(slug, s.name)} (${s.colorScheme ?? 'light'})`
			);
		}
		return;
	}

	requireTool('cwebp', 'Install with: brew install webp');
	const tmp = makeTempDir();
	const browser = await chromium.launch();
	try {
		// One context per colour scheme so login state is not shared across schemes.
		for (const scheme of ['light', 'dark'] as const) {
			const group = shots.filter((s) => (s.colorScheme ?? 'light') === scheme);
			if (!group.length) continue;
			const context = await browser.newContext({
				viewport: { ...VIEWPORT },
				deviceScaleFactor: DEVICE_SCALE_FACTOR,
				reducedMotion: 'reduce',
				colorScheme: scheme
			});
			const page = await context.newPage();
			if (web.login) await login(page, baseUrl, web.login);
			for (const shot of group) await capture(page, baseUrl, slug, shot, tmp);
			await context.close();
		}
	} finally {
		await browser.close();
		removeDir(tmp);
	}
}

type Page = Awaited<ReturnType<Awaited<ReturnType<typeof chromium.launch>>['newPage']>>;

async function login(page: Page, baseUrl: string, cfg: NonNullable<WebTarget['login']>) {
	const email = requireEnv(cfg.emailEnv, process.env);
	const password = requireEnv(cfg.passwordEnv, process.env);
	await page.goto(joinUrl(baseUrl, cfg.url), { waitUntil: 'networkidle' });
	await page.fill(cfg.emailSelector, email);
	await page.fill(cfg.passwordSelector, password);
	await page.click(cfg.submitSelector);
	await page.waitForSelector(cfg.successWaitFor, { timeout: 30_000 });
}

async function capture(page: Page, baseUrl: string, slug: string, shot: WebShot, tmp: string) {
	await page.goto(joinUrl(baseUrl, shot.path), { waitUntil: 'load' });
	if (shot.waitFor) await page.waitForSelector(shot.waitFor, { timeout: 30_000 });
	await page.waitForLoadState('networkidle').catch(() => {});
	await page.addStyleTag({ content: buildHideCss(shot.hide) });
	if (shot.scrollTo) await page.locator(shot.scrollTo).first().scrollIntoViewIfNeeded();
	// Let web fonts and settled layout land before the shutter.
	await page.evaluate(() => document.fonts.ready);
	await page.waitForTimeout(400);

	const png = join(tmp, `${shot.name}.png`);
	await page.screenshot({ path: png, clip: shot.clip, animations: 'disabled' });
	const out = outputPath(slug, shot.name);
	const size = toWebp(png, out);
	console.log(`\n${out}  ${size.width}x${size.height}`);
	console.log(frontmatterSnippet(slug, shot.name, 'browser'));
}

main().catch(fail);
