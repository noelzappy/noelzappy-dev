---
title: 'PayLTE'
shortTitle: 'PayLTE'
slug: 'paylte'
excerpt: 'An everyday money app for Ghana: add money, send, pay and keep receipts, with supervised children''s wallets and schools as one place to pay. I designed and built the whole platform end to end. It is not live for real money yet.'
featured: false
publishedAt: '2026-11-08T00:00:00.000Z'
role: 'Designed and built end to end'
kind: 'case-study'
status: 'Active'
client: 'Wirebloc LTD'
featuredStack:
  - 'TypeScript'
  - 'PostgreSQL'
stack:
  - 'TypeScript'
  - 'NestJS'
  - 'Drizzle'
  - 'PostgreSQL'
  - 'Expo'
  - 'React Native'
  - 'TanStack'
  - 'Turborepo'
  - 'Double-entry Ledger'
categories:
  - 'Mobile App'
  - 'Web App'
  - 'Backend'
  - 'Fintech'
problem: 'Money in Ghana moves across mobile money, banks and cash, with no single place that shows where it went. Parents give children cash for school with no view of how it is spent, and schools handle that cash by hand. A product covering all of this had to be correct about every pesewa, explain every movement afterwards, and be safe to put in a child''s hands.'
engagement: 'full-build'
stage: 'startup'
oneLine: "An everyday money app for Ghana, with children's wallets and school payments."
built:
  - 'Mobile app'
  - 'API'
  - 'Admin'
  - 'School portal'
  - 'Ledger'
brandColor: '#98FF1A'
onBrand: 'dark'
---

<p>PayLTE is an everyday money app for Ghana. You add money, send it to another PayLTE user, a mobile money wallet or a bank account, pay, and keep receipts. A parent can give a child a supervised wallet, and schools get one place to be paid. It is a client product for Wirebloc LTD, and I designed and built all of it myself: the product design, the architecture, the API, the mobile app, the admin and school web apps, and the infrastructure. It is not live for real money yet, and the MVP is due for acceptance in January 2027.</p>

<h2>The problem</h2>

<p>Money in Ghana moves across mobile money, banks and cash, and nothing ties it together. A parent who gives a child cash for school has no view of where it went. A school collecting fees in cash reconciles by hand. A fintech product here has to be right about every pesewa and able to explain any movement afterwards, because a wrong posting is a regulatory incident, not a bug.</p>

<h2>What I built</h2>

<p>PayLTE is a Turborepo monorepo of TypeScript, with four apps, two small services and five shared packages.</p>

<ul>
<li><strong>The mobile app</strong> is Expo and React Native. It covers sign-up, identity checks with the Ghana Card, wallet, fund, send, withdraw, receipts, notifications and a Family tab where a parent manages their children's wallets.</li>
<li><strong>The API</strong> is NestJS with Drizzle on PostgreSQL. It has 88 database migrations, thirteen background runners for things like payment polling, reconciliation and settlement, and a contract package that is the single source of truth for its types and error codes.</li>
<li><strong>The admin app</strong> is a TanStack SPA for staff: ledger, reconciliation, identity cases, compliance review, fee and limit policy, terminals and platform configuration.</li>
<li><strong>The school portal</strong> is a second web app for organisations, including a till that runs in a browser at the school.</li>
<li><strong>Fingerprint identification</strong> at school terminals is a small matcher service and a local capture bridge, so a child can pay with a finger and a PIN instead of cash or a phone.</li>
</ul>

<h2>Decisions that mattered</h2>

<h3>An append-only, double-entry ledger</h3>

<p>Every money movement is a journal entry with at least two postings whose debits equal credits, and that rule is enforced in the database, not only in application code. Postings are never updated or deleted: a correction is a new entry that points at what it reverses. A balance is the sum of its postings, and a scheduled job checks the cached balance against that sum. This means any figure a user or an auditor sees can be traced to the events behind it.</p>

<h3>Money is whole pesewas, never decimals</h3>

<p>Every amount is an integer number of pesewas with a currency beside it, from the database column to the API. There is no floating-point type anywhere on the money path, and the build fails if one appears. This matters because rounding drift in a wallet is invisible until it is somebody's money.</p>

<h3>Schools, agents and merchants are one thing</h3>

<p>I modelled all three as one "organisation" that differs by what it is allowed to do, instead of three parallel systems. Lifting a restriction is a row change, not a migration, and staff see schools and agents as two views over one resource. It kept the product small enough for one builder to hold in their head.</p>

<h3>Provider credentials are sealed and need two people</h3>

<p>Credentials for payment, identity and messaging providers live in the database, sealed and write-only, so nobody can read one back. One super-admin proposes a change and a different one approves it after a passing connection test. A swap of provider is a change staff make in the admin app, not a redeploy.</p>

<h3>No mock providers at runtime</h3>

<p>Test doubles exist only inside tests. Local development, staging and production all run the real adapters against real sandboxes or live accounts. I removed the mock routes, the mock environment flags and the mock database rows after seeing staging drift into running code paths that production never would. An environment that cannot reach a fake cannot be misconfigured into one.</p>

<h3>The rules are enforced by the build</h3>

<p>The repository has fourteen decision records, and most carry a check rather than a promise. One gate runs schema lint, migration checks, secret scanning and a boundary check that keeps provider names out of business code, and it has to pass before anything merges.</p>

<h2>Where it stands</h2>

<p>The platform runs on a staging environment and is not live for real money. Runtime settings, sealed credentials and the removal of runtime mocks landed in October 2026. The remaining work before launch is the cutover to live provider accounts and acceptance of the MVP in January 2027. The client's product is unreleased, so this page stays at the level of design and architecture.</p>

<h2>Stack</h2>

<p>TypeScript throughout: NestJS, Drizzle and PostgreSQL for the API, Expo and React Native for the app, React with TanStack for the admin and school apps, and Turborepo with pnpm for the workspace. It deploys as containers to a managed app platform with managed Postgres.</p>
