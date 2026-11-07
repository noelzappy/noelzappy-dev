# noelzappy.dev — Repositioning Brief (for Claude Code)

## Goal
Reposition the site from "engineer open to roles" to **"independent backend/payments
consultant"** before cold outreach begins. Prospects (CTOs/founders at African
fintechs and companies moving money in Africa) will google Emmanuel after getting an
email; within 10 seconds they must see what he does, for whom, proof, and how to book.

## Constraints
- **Keep the existing visual design**, layout system, fonts and colors. This is a
  content + information-architecture change, plus one new page. Reuse existing
  components and styles; no new UI library.
- First inspect the repo: framework, where page content/metadata lives, how the
  timeline/projects/writing are sourced (MDX, JSON, components). Follow its patterns.
- Keep all existing URLs working (writeups and posts are linked from outreach).
- Show Emmanuel a diff + local preview before committing. Don't deploy.

## Changes

### 1. Site metadata (all pages that inherit default meta)
- `<title>`: **Emmanuel Yeboah — Backend & Payments Engineer for African Fintech**
- `meta description`, `og:description`, `twitter:description`:
  > Independent backend engineer for companies moving money in Africa. I build and fix payment integrations, ledgers and zero-downtime migrations — MoMo, Paystack, Flutterwave, Hubtel.
- `og:title` / `twitter:title`: same as title.
- **Remove every mention of "Open to senior remote backend and platform roles"**
  anywhere on the site (meta, about page, footer, structured data). Grep for "open to",
  "roles", "hiring", "available for".
- Update meta keywords (if kept) to include: payments engineer, mobile money,
  Paystack, Flutterwave, Hubtel, fintech consultant, Ghana, Africa.

### 2. Homepage hero
Keep the greeting and the existing line. Change to:

> # Hey, I'm Emmanuel.
> Backend engineer. I build systems that can't afford to be wrong.
>
> I help fintechs and companies moving money in Africa get their payment integrations, ledgers and migrations right — MoMo, Paystack, Flutterwave, Hubtel.
>
> **[Work with me →](/work-with-me)** · [Book a 15-minute call](<existing booking link>)

Use the site's existing link/button styling; the "Work with me" link should be the
most prominent element after the headline.

### 3. Navigation
Add **Work with me** as the first nav item: `Work with me · Writing · Projects · About`.

### 4. Timeline fixes
- "Now — Consulting" line → **"Now — Independent consultant. Payments, ledgers and migrations for fintech teams. [Work with me](/work-with-me)"**
- Fetch Agent role title: "Web developer (contract)" → **"Backend engineer (contract)"**
  (the description is backend work).
- No other timeline content changes.

### 5. New page: `/work-with-me`
Match the site's existing page template and typography. Content:

---
**Title:** Work with me

I'm a backend engineer who has spent six years on systems where a bug costs someone
money. I work with fintechs and companies moving money in Africa, usually when one of
these is true:

#### 1. Your payment integrations are fragile
You're on one provider and need a second, mobile money callbacks go missing, or
reconciliation is a spreadsheet. I design and build multi-provider payment layers
that fail over cleanly and reconcile automatically.
*Proof:* I wrote [Voltax](https://github.com/noelzappy/voltax), an open-source SDK that unifies African payment gateways behind one API.

#### 2. You need a ledger you can trust
Balances drift, refunds are hard to trace, or finance can't answer "where did this
money go?" I build append-only ledgers with the consistency guarantees money needs.
*Proof:* SusuPaa's ledger is the system of record for ₵12.5M+ in successful deposits. [Read the writeup →](/projects/susupaa-platform)

#### 3. You have to migrate without going down
Moving off a legacy stack, re-platforming, or changing databases with live users.
*Proof:* I migrated 170,000 live users from PHP/MySQL to Node.js/PostgreSQL with zero downtime. [How I did it →](/writing/how-i-migrated-170k-users-from-php-to-node-js-without-stopping-the-world)

#### How engagements work
- **Payments architecture review** — a fixed-scope, one-week review of your payment flows, ledger and failure handling, with a written report and prioritized fixes. **TODO(Emmanuel): price, e.g. "from $X".**
- **Build or fix** — scoped projects billed weekly, for when you need it built, not just reviewed.
- **Ongoing** — a monthly retainer for teams that want a payments engineer on call without a full-time hire.

I work remotely from Accra (GMT), with overlap for European and US East Coast hours.
Stack: Go and TypeScript, PostgreSQL, event-driven systems. Providers: MTN MoMo,
Paystack, Flutterwave, Hubtel, Fineract.

#### Start with a call
**[Book a 15-minute call](<existing booking link>)** or email **me@noelzappy.dev**
with a few lines about what's breaking.

---
- Page meta title: "Work with me — Emmanuel Yeboah"; description: first paragraph above.
- Leave the `TODO(Emmanuel)` visible in a code comment only, not rendered text —
  render the audit line **without a price** until he fills it in.

### 6. Contact section (homepage + footer)
Change "Email … or book a 15-minute call" to:
> Building something that moves money? **[Book a 15-minute call](<link>)** or email me@noelzappy.dev.

### 7. About page
Read it. Remove job-seeking language. If it has a "currently" or "looking for"
paragraph, replace with: *"I work independently with fintech and payments teams. If
that's you, [here's how we can work together](/work-with-me)."* Don't rewrite
anything else without flagging it.

### 8. Structured data
If the site emits JSON-LD `Person`, add `jobTitle: "Backend & Payments Engineer"` and
`knowsAbout: ["Payment integrations","Mobile money","Ledgers","Database migrations","Go","TypeScript"]`.
Otherwise skip.

### 9. Writing — scaffold one new post (draft, unpublished)
Create a draft post (use the site's draft mechanism, or a file excluded from build):
**"Five things that break when you add mobile money to a card integration"**
Outline only — Emmanuel writes it:
1. Callbacks are not guaranteed (and how to poll safely)
2. "Pending" can last hours: designing for long-lived states
3. Idempotency keys across providers that don't agree on them
4. Reconciliation when the provider's report and your ledger disagree
5. Failover between providers without double-charging
Each section: placeholder `TODO` + one-line prompt of what to cover.

## Acceptance checklist
- [ ] No occurrence of job-seeking phrasing anywhere in built output (grep the build dir).
- [ ] `/work-with-me` renders, is in nav, works at 375px width, passes the site's existing lint/build.
- [ ] All pre-existing URLs still resolve.
- [ ] Link previews (og tags) show the new title/description.
- [ ] Booking link used everywhere is the same one already on the site.
- [ ] Diff + preview shown to Emmanuel; nothing deployed.
