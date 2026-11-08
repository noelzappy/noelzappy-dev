<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { env } from '$env/dynamic/public';

	const EMAIL = 'emmanuel@noelzappy.com';
	const TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
	const MIN = 20;
	const MAX = 2000;

	type Turnstile = {
		render: (el: HTMLElement, opts: Record<string, unknown>) => string;
		reset: (id?: string) => void;
		remove: (id?: string) => void;
	};
	type Field = 'name' | 'email' | 'message' | 'turnstile';

	let name = $state('');
	let email = $state('');
	let company = $state('');
	let message = $state('');
	let website = $state('');
	let errors = $state<Partial<Record<Field, string>>>({});
	let status = $state<'idle' | 'sending' | 'done' | 'failed'>('idle');

	let siteKey = $state('');
	let endpoint = $state('');
	let token = $state('');
	let widgetEl = $state<HTMLElement>();
	let widgetId: string | undefined;
	let statusEl = $state<HTMLElement>();
	const inputs: Partial<Record<Field, HTMLElement>> = {};

	function turnstile(): Turnstile | undefined {
		return (window as unknown as { turnstile?: Turnstile }).turnstile;
	}

	function loadTurnstile() {
		return new Promise<void>((resolve, reject) => {
			if (turnstile()) return resolve();
			let s = document.querySelector<HTMLScriptElement>(`script[src="${TURNSTILE_SRC}"]`);
			if (!s) {
				s = document.createElement('script');
				s.src = TURNSTILE_SRC;
				s.async = true;
				document.head.appendChild(s);
			}
			s.addEventListener('load', () => resolve(), { once: true });
			s.addEventListener('error', () => reject(new Error('turnstile')), { once: true });
		});
	}

	onMount(() => {
		// Read on the client so prerendered pages work whenever the values are set.
		siteKey = env.PUBLIC_TURNSTILE_SITE_KEY ?? '';
		endpoint = env.PUBLIC_FORGE_INQUIRY_URL ?? '';
		if (!siteKey) return;
		let cancelled = false;
		loadTurnstile()
			.then(async () => {
				await tick();
				if (cancelled || !widgetEl || !turnstile()) return;
				widgetId = turnstile()!.render(widgetEl, {
					sitekey: siteKey,
					callback: (t: string) => {
						token = t;
						errors.turnstile = undefined;
					},
					'expired-callback': () => (token = ''),
					'error-callback': () => (token = '')
				});
			})
			.catch(() => {});
		return () => {
			cancelled = true;
			if (widgetId) turnstile()?.remove(widgetId);
		};
	});

	function validate() {
		const e: Partial<Record<Field, string>> = {};
		if (!name.trim()) e.name = 'Please enter your name.';
		const mail = email.trim();
		if (!mail) e.email = 'Please enter your work email.';
		else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail))
			e.email = "That email address doesn't look right.";
		const len = message.trim().length;
		if (len === 0) e.message = 'Tell me a little about what is going on.';
		else if (len < MIN) e.message = `Please write at least ${MIN} characters (you have ${len}).`;
		else if (len > MAX) e.message = `Please keep it under ${MAX} characters (you have ${len}).`;
		if (siteKey && !token) e.turnstile = 'Please complete the verification.';
		return e;
	}

	async function focusStatus() {
		await tick();
		statusEl?.focus();
	}

	async function onsubmit(ev: SubmitEvent) {
		ev.preventDefault();
		if (status === 'sending') return;
		errors = validate();
		const first = (['name', 'email', 'message', 'turnstile'] as Field[]).find((f) => errors[f]);
		if (first) {
			await tick();
			inputs[first]?.focus();
			return;
		}
		status = 'sending';
		let ok = false;
		if (endpoint) {
			try {
				const res = await fetch(endpoint, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						name: name.trim(),
						email: email.trim(),
						company: company.trim(),
						message: message.trim(),
						website,
						turnstile_token: token
					})
				});
				const body = res.ok ? await res.json().catch(() => null) : null;
				ok = !!body && body.ok === true;
			} catch {
				ok = false;
			}
		}
		if (ok) {
			status = 'done';
		} else {
			status = 'failed';
			token = '';
			if (widgetId) turnstile()?.reset(widgetId);
		}
		await focusStatus();
	}

	function describedBy(f: Field) {
		return errors[f] ? `inquiry-${f}-error` : undefined;
	}
</script>

{#if status === 'done'}
	<p class="done" role="status" tabindex="-1" bind:this={statusEl}>
		Thanks, I'll get back to you within one working day.
	</p>
{:else}
	<form {onsubmit} novalidate class="form" aria-label="Send me a message">
		<div class="field">
			<label for="inquiry-name">Name</label>
			<input
				id="inquiry-name"
				name="name"
				type="text"
				autocomplete="name"
				required
				bind:value={name}
				bind:this={inputs.name}
				aria-invalid={errors.name ? 'true' : undefined}
				aria-describedby={describedBy('name')}
			/>
			{#if errors.name}<p class="error" id="inquiry-name-error">{errors.name}</p>{/if}
		</div>

		<div class="field">
			<label for="inquiry-email">Work email</label>
			<input
				id="inquiry-email"
				name="email"
				type="email"
				inputmode="email"
				autocomplete="email"
				autocapitalize="none"
				spellcheck="false"
				required
				bind:value={email}
				bind:this={inputs.email}
				aria-invalid={errors.email ? 'true' : undefined}
				aria-describedby={describedBy('email')}
			/>
			{#if errors.email}<p class="error" id="inquiry-email-error">{errors.email}</p>{/if}
		</div>

		<div class="field">
			<label for="inquiry-company">Company <span class="opt">optional</span></label>
			<input
				id="inquiry-company"
				name="company"
				type="text"
				autocomplete="organization"
				bind:value={company}
			/>
		</div>

		<div class="field">
			<label for="inquiry-message">What's going on?</label>
			<textarea
				id="inquiry-message"
				name="message"
				rows="6"
				required
				bind:value={message}
				bind:this={inputs.message}
				aria-invalid={errors.message ? 'true' : undefined}
				aria-describedby={describedBy('message')}
			></textarea>
			{#if errors.message}<p class="error" id="inquiry-message-error">{errors.message}</p>{/if}
		</div>

		<div class="trap" aria-hidden="true">
			<label for="inquiry-website">Website</label>
			<input
				id="inquiry-website"
				name="website"
				type="text"
				tabindex="-1"
				autocomplete="off"
				bind:value={website}
			/>
		</div>

		{#if siteKey}
			<div class="field">
				<div bind:this={widgetEl} class="widget"></div>
				{#if errors.turnstile}
					<p class="error" id="inquiry-turnstile-error" tabindex="-1" bind:this={inputs.turnstile}>
						{errors.turnstile}
					</p>
				{/if}
			</div>
		{/if}

		{#if status === 'failed'}
			<p class="error fail" role="alert" tabindex="-1" bind:this={statusEl}>
				Something went wrong. Email me directly at <a href="mailto:{EMAIL}">{EMAIL}</a>.
			</p>
		{/if}

		<div>
			<button type="submit" disabled={status === 'sending'}>
				{status === 'sending' ? 'Sending…' : 'Send message'}
			</button>
		</div>
	</form>
{/if}

<style>
	.form {
		display: grid;
		gap: 1.5rem;
		max-width: 36rem;
		min-width: 0;
	}
	.field {
		display: grid;
		gap: 0.5rem;
		min-width: 0;
	}
	label {
		font-size: var(--step-caption);
		line-height: var(--lh-caption);
		letter-spacing: var(--tracking-caption);
		text-transform: uppercase;
		color: var(--muted);
	}
	.opt {
		text-transform: none;
		letter-spacing: 0;
		opacity: 0.8;
		margin-inline-start: 0.5rem;
	}
	input,
	textarea {
		box-sizing: border-box;
		width: 100%;
		min-height: 2.75rem;
		padding: 0.625rem 0.875rem;
		font: inherit;
		font-size: 1rem;
		line-height: 1.5;
		color: var(--fg);
		background: transparent;
		border: 1px solid var(--border);
		border-radius: var(--radius-screen);
	}
	textarea {
		resize: vertical;
		min-height: 9rem;
	}
	input:focus-visible,
	textarea:focus-visible,
	button:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
		border-color: var(--accent);
	}
	[aria-invalid='true'] {
		border-color: var(--accent);
	}
	.error {
		margin: 0;
		font-size: var(--step-small);
		line-height: var(--lh-small);
		color: var(--accent);
	}
	.fail:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 4px;
	}
	.trap {
		position: absolute;
		left: -10000px;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}
	button {
		min-height: 2.75rem;
		padding: 0.625rem 1.5rem;
		font: inherit;
		font-size: 1rem;
		color: var(--accent);
		background: transparent;
		border: 1px solid var(--accent);
		border-radius: var(--radius-screen);
		cursor: pointer;
	}
	button:hover:not(:disabled) {
		background: var(--accent-soft);
	}
	button:disabled {
		opacity: 0.6;
		cursor: progress;
	}
	.done {
		margin: 0;
		font-family: var(--font-display);
		font-size: var(--step-display-m);
		line-height: var(--lh-display-m);
		letter-spacing: var(--tracking-display-m);
		font-weight: var(--weight-display-m);
		color: var(--fg);
		text-wrap: balance;
	}
	.done:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 6px;
	}
	@media (prefers-reduced-motion: reduce) {
		* {
			transition: none !important;
		}
	}
</style>
