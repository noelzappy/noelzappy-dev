import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import '../../routes/layout.css';

const publicEnv = vi.hoisted(() => ({ PUBLIC_FORGE_INQUIRY_URL: '' as string | undefined }));
vi.mock('$env/dynamic/public', () => ({ env: publicEnv }));

import InquiryForm from './inquiry-form.svelte';

const LONG = 'Our payouts drift out of sync with the ledger every Friday night.';
const FALLBACK = 'Something went wrong. Email me directly at emmanuel@noelzappy.com.';
const THANKS = "Thanks, I'll get back to you within one working day.";

async function fill(name: string, email: string, message: string, company = '') {
	await page.getByLabelText('Name').fill(name);
	await page.getByLabelText('Work email').fill(email);
	if (company) await page.getByLabelText('Company').fill(company);
	await page.getByLabelText("What's going on?").fill(message);
}
const submit = () => page.getByRole('button', { name: 'Send' });

beforeEach(() => {
	publicEnv.PUBLIC_FORGE_INQUIRY_URL = undefined;
});
afterEach(() => {
	vi.unstubAllGlobals();
});

describe('inquiry form', () => {
	it('labels the fields with mobile-friendly attributes', async () => {
		render(InquiryForm);
		const name = page.getByLabelText('Name').element();
		const email = page.getByLabelText('Work email').element();
		const company = page.getByLabelText('Company').element();
		expect(name.getAttribute('autocomplete')).toBe('name');
		expect(email.getAttribute('autocomplete')).toBe('email');
		expect(email.getAttribute('inputmode')).toBe('email');
		expect(email.getAttribute('type')).toBe('email');
		expect(company.getAttribute('autocomplete')).toBe('organization');
		for (const el of [name, email, company]) {
			expect(parseFloat(getComputedStyle(el).fontSize)).toBeGreaterThanOrEqual(16);
			expect(el.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
		}
	});

	it('shows required errors tied to each field via aria-describedby', async () => {
		render(InquiryForm);
		await submit().click();
		for (const label of ['Name', 'Work email', "What's going on?"]) {
			const el = page.getByLabelText(label).element();
			expect(el.getAttribute('aria-invalid')).toBe('true');
			const id = el.getAttribute('aria-describedby')!;
			expect(id).toBeTruthy();
			const err = document.getElementById(id)!;
			expect(err.textContent!.trim().length).toBeGreaterThan(0);
		}
		expect(page.getByLabelText('Company').element().hasAttribute('aria-describedby')).toBe(false);
	});

	it('rejects a malformed email and a too-short message', async () => {
		render(InquiryForm);
		await fill('Ama', 'not-an-email', 'too short');
		await submit().click();
		const email = page.getByLabelText('Work email').element();
		expect(document.getElementById(email.getAttribute('aria-describedby')!)!.textContent).toContain(
			"doesn't look right"
		);
		const msg = page.getByLabelText("What's going on?").element();
		expect(document.getElementById(msg.getAttribute('aria-describedby')!)!.textContent).toContain(
			'at least 20'
		);
	});

	it('rejects a message over 2000 characters', async () => {
		render(InquiryForm);
		await fill('Ama', 'ama@example.com', 'x'.repeat(2001));
		await submit().click();
		const msg = page.getByLabelText("What's going on?").element();
		expect(document.getElementById(msg.getAttribute('aria-describedby')!)!.textContent).toContain(
			'2000'
		);
	});

	it('hides the honeypot from keyboard and screen readers', async () => {
		const { container } = render(InquiryForm);
		const hp = container.querySelector<HTMLInputElement>('input[name="website"]')!;
		expect(hp.tabIndex).toBe(-1);
		expect(hp.getAttribute('autocomplete')).toBe('off');
		expect(hp.closest('[aria-hidden="true"]')).not.toBeNull();
		expect(hp.getBoundingClientRect().right).toBeLessThan(0);
		await expect.element(page.getByRole('textbox', { name: /website/i })).not.toBeInTheDocument();
	});

	it('with the URL unset shows the email fallback, keeps the text and focuses the message', async () => {
		render(InquiryForm);
		await fill('Ama', 'ama@example.com', LONG, 'Acme');
		await submit().click();
		const alert = page.getByRole('alert');
		await expect.element(alert).toHaveTextContent(FALLBACK);
		expect(page.getByLabelText("What's going on?").element()).toHaveProperty('value', LONG);
		expect(page.getByLabelText('Name').element()).toHaveProperty('value', 'Ama');
		await vi.waitFor(() => expect(document.activeElement).toBe(alert.element()));
		expect(
			document.querySelector('[role="alert"] a[href="mailto:emmanuel@noelzappy.com"]')
		).not.toBeNull();
	});

	it('posts JSON and replaces the form with the thanks message on {ok:true}', async () => {
		publicEnv.PUBLIC_FORGE_INQUIRY_URL = 'https://forge.example/api/public/inquiry';
		const fetchMock = vi.fn(async () => Response.json({ ok: true }));
		vi.stubGlobal('fetch', fetchMock);
		render(InquiryForm);
		await fill('Ama', 'ama@example.com', LONG, 'Acme');
		await submit().click();
		const status = page.getByRole('status');
		await expect.element(status).toHaveTextContent(THANKS);
		await vi.waitFor(() => expect(document.activeElement).toBe(status.element()));
		expect(fetchMock).toHaveBeenCalledTimes(1);
		const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
		expect(url).toBe('https://forge.example/api/public/inquiry');
		expect(init.method).toBe('POST');
		expect(JSON.parse(init.body as string)).toEqual({
			name: 'Ama',
			email: 'ama@example.com',
			company: 'Acme',
			message: LONG,
			website: '',
			turnstile_token: ''
		});
		await expect.element(page.getByLabelText('Name')).not.toBeInTheDocument();
	});

	it('keeps the text and shows the fallback when the server refuses', async () => {
		publicEnv.PUBLIC_FORGE_INQUIRY_URL = 'https://forge.example/api/public/inquiry';
		vi.stubGlobal(
			'fetch',
			vi.fn(async () => Response.json({ ok: false }, { status: 400 }))
		);
		render(InquiryForm);
		await fill('Ama', 'ama@example.com', LONG);
		await submit().click();
		await expect.element(page.getByRole('alert')).toHaveTextContent(FALLBACK);
		expect(page.getByLabelText("What's going on?").element()).toHaveProperty('value', LONG);
		await expect.element(submit()).toBeEnabled();
	});

	it('keeps the text on a network error', async () => {
		publicEnv.PUBLIC_FORGE_INQUIRY_URL = 'https://forge.example/api/public/inquiry';
		vi.stubGlobal(
			'fetch',
			vi.fn(async () => Promise.reject(new TypeError('offline')))
		);
		render(InquiryForm);
		await fill('Ama', 'ama@example.com', LONG);
		await submit().click();
		await expect.element(page.getByRole('alert')).toHaveTextContent(FALLBACK);
		expect(page.getByLabelText("What's going on?").element()).toHaveProperty('value', LONG);
	});

	it('disables the button while the request is pending', async () => {
		publicEnv.PUBLIC_FORGE_INQUIRY_URL = 'https://forge.example/api/public/inquiry';
		let resolve!: (r: Response) => void;
		vi.stubGlobal(
			'fetch',
			vi.fn(() => new Promise<Response>((r) => (resolve = r)))
		);
		render(InquiryForm);
		await fill('Ama', 'ama@example.com', LONG);
		await submit().click();
		await expect.element(page.getByRole('button', { name: 'Sending…' })).toBeDisabled();
		resolve(Response.json({ ok: true }));
		await expect.element(page.getByRole('status')).toHaveTextContent(THANKS);
	});
});
