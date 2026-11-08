import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page, userEvent } from 'vitest/browser';
import SiteHeader from './site-header.svelte';

// Capture the afterNavigate callback so the test can simulate a completed navigation.
const navigated = vi.hoisted(() => ({ callbacks: [] as (() => void)[] }));
vi.mock('$app/navigation', () => ({
	afterNavigate: (cb: () => void) => {
		navigated.callbacks.push(cb);
	}
}));

vi.mock('$app/state', () => ({ page: { url: new URL('http://localhost/') } }));

const posts = [
	{ slug: 'a', title: 'Post A', date: '2026-01-02', tags: [], description: '' },
	{ slug: 'b', title: 'Post B', date: '2026-01-01', tags: [], description: '' }
];
const pills = [{ slug: 'p1', title: 'Project One' }];

function setup() {
	render(SiteHeader, { pills, posts });
	return page.getByRole('button', { name: 'Menu' });
}

describe('site menu', () => {
	it('opens a dialog named Menu and sets aria-expanded', async () => {
		const button = setup();
		await expect.element(button).toHaveAttribute('aria-expanded', 'false');
		await button.click();
		await expect.element(button).toHaveAttribute('aria-expanded', 'true');
		await expect.element(page.getByRole('dialog', { name: 'Menu' })).toBeVisible();
	});

	it('has the primary nav links', async () => {
		await setup().click();
		const dialog = page.getByRole('dialog', { name: 'Menu' });
		const links: [string, string][] = [
			['Work', '/projects'],
			['Work with me', '/work-with-me'],
			['About', '/about'],
			['Writing', '/writing'],
			['Get in touch', '/contact']
		];
		for (const [name, href] of links) {
			await expect
				.element(dialog.getByRole('link', { name, exact: true }))
				.toHaveAttribute('href', href);
		}
		await expect.element(dialog.getByRole('link', { name: 'Post A' })).toBeVisible();
		await expect.element(dialog.getByRole('link', { name: 'Project One' })).toBeVisible();
	});

	it('closes on Escape and returns focus to the Menu button', async () => {
		const button = setup();
		await button.click();
		await expect.element(page.getByRole('dialog', { name: 'Menu' })).toBeVisible();
		await userEvent.keyboard('{Escape}');
		await expect.element(page.getByRole('dialog', { name: 'Menu' })).not.toBeInTheDocument();
		await expect.element(button).toHaveFocus();
		await expect.element(button).toHaveAttribute('aria-expanded', 'false');
	});

	it('traps focus: Tab from the last element wraps to the first', async () => {
		await setup().click();
		const dialog = page.getByRole('dialog', { name: 'Menu' });
		await expect.element(dialog).toBeVisible();
		const el = dialog.element() as HTMLElement;
		const focusables = [...el.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')];
		focusables.at(-1)!.focus();
		await userEvent.tab();
		expect(document.activeElement).toBe(focusables[0]);
		await userEvent.tab({ shift: true });
		expect(document.activeElement).toBe(focusables.at(-1));
	});

	it('closes and releases the scroll lock when a navigation completes', async () => {
		const button = setup();
		await button.click();
		await expect.element(page.getByRole('dialog', { name: 'Menu' })).toBeVisible();
		expect(document.body.style.overflow).toBe('hidden');
		navigated.callbacks.forEach((cb) => cb());
		await expect.element(page.getByRole('dialog', { name: 'Menu' })).not.toBeInTheDocument();
		expect(document.body.style.overflow).toBe('');
	});
});

describe('site menu theme-color', () => {
	const metas = () => [...document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')];

	it('sets theme-color to the menu surface while open and restores the originals on close', async () => {
		document.head.insertAdjacentHTML(
			'beforeend',
			'<meta name="theme-color" content="#0e0e0d" media="(prefers-color-scheme: dark)">' +
				'<meta name="theme-color" content="#f3efe6" media="(prefers-color-scheme: light)">'
		);
		const before = metas().map((m) => m.content);
		expect(before).toEqual(['#0e0e0d', '#f3efe6']);
		try {
			const button = setup();
			await button.click();
			const dialog = page.getByRole('dialog', { name: 'Menu' });
			await expect.element(dialog).toBeVisible();
			const surface = getComputedStyle(dialog.element() as HTMLElement).backgroundColor;
			expect(surface).not.toBe('');
			expect(metas().map((m) => m.content)).toEqual([surface, surface]);
			await userEvent.keyboard('{Escape}');
			await expect.element(page.getByRole('dialog', { name: 'Menu' })).not.toBeInTheDocument();
			expect(metas().map((m) => m.content)).toEqual(before);
		} finally {
			metas().forEach((m) => m.remove());
		}
	});
});
