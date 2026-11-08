# Screenshot capture kit

Product screens in `static/portfolio/<project>/` should be sharp, consistent and free of test data.
These scripts produce WebP files (the site reads WebP headers for layout, so WebP is required) with
no device frame; `ProjectShowcase` renders them frameless.

## Which script

| Situation                                   | Command                                                                        |
| ------------------------------------------- | ------------------------------------------------------------------------------ |
| Web app or admin screen, local or staging   | `bun run capture:web <slug> [--shot name] [--dry-run]`                         |
| Mobile app in the iOS Simulator             | `bun run capture:ios <slug> [--device "iPhone 17 Pro"] [--shot name] [--auto]` |
| Real iPhone, or any folder of PNG/JPEG/HEIC | `bun run capture:ingest <folder> <slug> [--kind phone\|browser]`               |

Shots are declared in `scripts/capture/projects.ts`. Fill in the `TODO` placeholders (URLs, bundle
IDs, selectors) before the first run.

### Web

- Chromium at 1440x900, 2x scale (2880x1800 output), reduced motion, light theme unless a shot sets
  `colorScheme: 'dark'`.
- Base URL comes from the env var named in the manifest (`CAPTURE_SUSUPAA_URL`, ...). A missing
  variable fails with a clear message. Never run it against third-party sites.
- Logins use env vars named in the manifest (`CAPTURE_SUSUPAA_EMAIL`, `CAPTURE_SUSUPAA_PASSWORD`).
  Credentials never go in code or in the repo.
- Cookie banners, scrollbars and any `hide` selectors are hidden before the shot.

```sh
CAPTURE_SUSUPAA_URL=https://staging.example.com \
CAPTURE_SUSUPAA_EMAIL=... CAPTURE_SUSUPAA_PASSWORD=... \
bun run capture:web susupaa-platform --shot dashboard
```

### iOS Simulator

Boots or reuses the simulator, sets a clean status bar (9:41, full battery, 4 bars, wifi), optionally
launches the app and opens deep links, then waits for Enter at each shot. `--auto` skips the wait for
shots that have a `deepLink`. The status bar override is cleared at the end and on Ctrl-C. If the
manifest device is not installed, pass `--device` with one you have (`xcrun simctl list devices`).

### Real iPhone

Take screenshots (side button + volume up), AirDrop them to the Mac into a new folder, then run
`capture:ingest`. Files are sorted by name, converted to WebP q90, capped at 1179px wide (phone) or
2880px (browser), and named from the file name (`IMG_0042 Home.PNG` becomes `img-0042-home.webp`).
Rename the source files first (`01-home`, `02-send`, `03-success`) to get good output names. EXIF and
other metadata are not carried over.

Before shooting: turn on Do Not Disturb (no notifications in frame), set the clock to look normal,
charge above 80%, and use the same device and light theme for every screen of a project. Maximum
brightness is not needed for screenshots.

## Demo-data checklist

- Realistic Ghanaian or Sierra Leonean names and places (Akosua Mensah, Kwame Boateng, Fatmata
  Kamara, Osu, Kumasi, Freetown).
- Believable amounts and currencies (GHS 250.00, SLE 1,200), not round placeholders like 1,000,000.
- No "Test", "Demo", "asdf" or developer accounts, emails or phone numbers on screen.
- No real customer data: names, numbers, balances, faces, ID documents.
- Dates and times that make sense together. No stale "last login 2019".
- No debug banners, environment ribbons, toasts or error states.

## Per-project recipe

- Three phone screens, in this order: `home` (landing, populated), `key-action` (the product's core
  flow mid-action), `success` (confirmation or result).
- One web or admin screen: `dashboard`, populated, with a believable amount of data.
- Products that have only web: one or two browser shots (the `docs` shot for Voltax).

## Consistency rules

- Light theme unless the product is dark-only.
- One device model per project; status bar at 9:41; no notifications.
- Web at 1440x900, no browser chrome, no scrollbars.
- Keep the same account and data across all shots of a project so names and balances agree.

## After capturing

The scripts print a frontmatter snippet per file. Paste it into `src/content/projects/<slug>.md`
under `showcase` (`phones` or `web`) or `deviceShots`, and replace `alt: 'TODO describe'` with a real
description of what is on screen. `kind` is `phone` or `browser`. Then:

```sh
bun run check && bun run build
```

Delete superseded files from `static/portfolio/<slug>/` once nothing references them.
