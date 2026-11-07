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

const posts = [
	{ slug: 'a', title: 'Post A', date: '2026-01-02', tags: [], description: '' },
	{ slug: 'b', title: 'Post B', date: '2026-01-01', tags: [], description: '' }
];
const pills = [{ slug: 'p1', title: 'Project One' }];

function setup() {
	render(SiteHeader, { overlay: false, pills, posts });
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
			['What I do', '/work-with-me'],
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
