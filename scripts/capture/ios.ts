/**
 * Capture iOS Simulator screens into static/portfolio/<slug>/<name>.webp.
 *
 *   bun run capture:ios <slug> [--device "iPhone 17 Pro"] [--shot name] [--auto]
 */
import { createInterface } from 'node:readline/promises';
import { join } from 'node:path';
import {
	flagString,
	frontmatterSnippet,
	outputPath,
	parseArgs,
	parseSimctlDevices,
	pickDevice,
	pickIosShots,
	screenshotArgs,
	statusBarClearArgs,
	statusBarOverrideArgs
} from './lib';
import { manifest } from './projects';
import { fail, makeTempDir, removeDir, requireTool, run, toWebp } from './shell';

const HELP = `Usage: bun run capture:ios <slug> [--device "iPhone 17 Pro"] [--shot name] [--auto]

Boots (or reuses) a simulator, sets a 9:41 status bar, then captures each iOS shot for <slug>
from scripts/capture/projects.ts. For each shot it prints the name and note and waits for Enter.

  --device name   simulator to use (default: the manifest's device)
  --shot name     capture only this shot
  --auto          do not wait for Enter; capture right after the deep link (deep-linked shots only)

The status bar override is cleared when the run ends, including on Ctrl-C.`;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
let statusBarUdid: string | undefined;

function clearStatusBar() {
	if (!statusBarUdid) return;
	const udid = statusBarUdid;
	statusBarUdid = undefined;
	try {
		run('xcrun', statusBarClearArgs(udid));
	} catch {
		// Simulator may already be shut down.
	}
}

async function main() {
	const args = parseArgs(process.argv.slice(2), ['auto', 'help']);
	if (args.flags.help || !args.positionals.length) {
		console.log(HELP);
		process.exit(args.flags.help ? 0 : 1);
	}
	const slug = args.positionals[0];
	const ios = manifest[slug]?.ios;
	if (!ios) {
		throw new Error(
			`No iOS capture for "${slug}". Known: ${Object.keys(manifest)
				.filter((s) => manifest[s].ios)
				.join(', ')}`
		);
	}
	const shots = pickIosShots(ios.shots, flagString(args, 'shot'));
	const auto = args.flags.auto === true;
	const deviceName = flagString(args, 'device') ?? ios.device;

	requireTool('xcrun', 'Install Xcode command line tools.');
	requireTool('cwebp', 'Install with: brew install webp');

	const devices = parseSimctlDevices(run('xcrun', ['simctl', 'list', '-j', 'devices']));
	const device = pickDevice(devices, deviceName);
	if (!device) {
		const names = [...new Set(devices.map((d) => d.name))].join(', ');
		throw new Error(`No simulator named "${deviceName}". Available: ${names}`);
	}
	if (device.state !== 'Booted') {
		console.log(`Booting ${device.name} (${device.udid})...`);
		run('xcrun', ['simctl', 'boot', device.udid]);
	}
	run('xcrun', ['simctl', 'bootstatus', device.udid, '-b']);
	run('open', ['-a', 'Simulator']);

	process.on('SIGINT', () => {
		clearStatusBar();
		process.exit(130);
	});
	run('xcrun', statusBarOverrideArgs(device.udid));
	statusBarUdid = device.udid;

	if (ios.bundleId) {
		run('xcrun', ['simctl', 'launch', device.udid, ios.bundleId]);
		await sleep(1500);
	} else {
		console.log('No bundleId in the manifest: open the app yourself.');
	}

	const tmp = makeTempDir();
	const rl = createInterface({ input: process.stdin, output: process.stdout });
	try {
		for (const shot of shots) {
			console.log(`\n== ${shot.name}${shot.note ? `: ${shot.note}` : ''}`);
			if (shot.deepLink) {
				run('xcrun', ['simctl', 'openurl', device.udid, shot.deepLink]);
				await sleep(1500);
			}
			if (auto && shot.deepLink) {
				await sleep(1000);
			} else {
				await rl.question('Set up the screen, then press Enter to capture... ');
			}
			const png = join(tmp, `${shot.name}.png`);
			run('xcrun', screenshotArgs(device.udid, png));
			const out = outputPath(slug, shot.name);
			const size = toWebp(png, out);
			console.log(`${out}  ${size.width}x${size.height}`);
			console.log(frontmatterSnippet(slug, shot.name, 'phone'));
		}
	} finally {
		rl.close();
		clearStatusBar();
		removeDir(tmp);
	}
}

main().catch((e) => {
	clearStatusBar();
	fail(e);
});
