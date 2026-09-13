---
title: 'SusuPaa Platform'
slug: 'susupaa-platform'
excerpt: 'A multi-tenant platform built on a custom append-only ledger with strict consistency guarantees. Over $1M in transactions processed; p99 latency cut from 1.6s to 500ms.'
featured: true
publishedAt: '2025-07-01T00:00:00.000Z'
featuredImage: '/portfolio/susupaa-webapp.png'
liveUrl: 'https://susupaa.com'
role: 'Co-founder & Lead Engineer'
kind: 'case-study'
status: 'Shipped'
client: 'SusuPaa'
featuredStack:
  - 'Go'
  - 'PostgreSQL'
stack:
  - 'Go'
  - 'PostgreSQL'
  - 'Redis'
  - 'Multi-tenant Architecture'
  - 'Append-only Ledger'
categories:
  - 'Web App'
stats:
  - key: 'Transactions processed'
    value: '$1M+'
    description: 'Cumulative volume through the ledger'
  - key: 'p99 latency'
    value: '500ms'
    description: 'Down from 1.6s'
gallery:
  - '/portfolio/susupaa-webapp.png'
  - '/portfolio/susupaa-website.png'
problem: 'Susu collectors, savings cooperatives, and microfinance institutions were running group savings, passbooks, and loans through WhatsApp messages, paper ledgers, and phone calls. Any system replacing that had to be the single source of truth for money it never held: every contribution, payout, and repayment provable after the fact, no double-credits under concurrent operations, and strict isolation between hundreds of independent organizations sharing one deployment.'
lessons: "Starting with event sourcing from day one rather than retrofitting it later. Our transaction ledger needed audit trails that we had to rebuild after launch — designing the data model around immutable events from the start would have saved us two weeks of migration work. I'd also invest earlier in contract testing between services; we had integration bugs that only surfaced in staging because our unit tests mocked too aggressively."
---

<p>SusuPaa is a multi-tenant platform for Ghana's informal savings sector: susu collectors, savings cooperatives, and microfinance institutions. Each organization runs its own groups, savings plans, loans, and accounting on a shared deployment, and every money movement has to be provable later. I co-founded the company and led the platform from the first commit.</p>

<p>The core is an append-only ledger I designed and operate. Entries are never updated or deleted; balances are derived from the entry history, so any balance can be reproduced from the record that produced it. That is what gives the system its consistency guarantees: a contribution, a payout, and the group balance they affect are written as one unit or not at all, and there is no path that mutates a balance without a corresponding entry.</p>

<p>Concurrency was the second design problem. Settlement jobs run concurrently, and the failure mode in this kind of system is the same everywhere: a job processed twice credits someone twice. Jobs are claimed atomically from a Postgres-backed queue, so each payment or payout is processed exactly once under load, with no double-crediting and no orphaned settlements.</p>

<p>Performance came next. p99 API latency was 1.6 seconds. Refactoring PostgreSQL query plans and adding a tiered Redis caching strategy brought it to 500ms.</p>

<p>Operating it means being able to see it and recover it. I stood up the observability stack (Prometheus metrics, Grafana dashboards, Loki log aggregation) and PostgreSQL WAL archiving to S3 for point-in-time recovery, so a bad deploy or a corrupted write is recoverable to the second rather than to the last nightly dump. The platform has processed over $1M in transactions.</p>

<p>On top of the ledger sit the product modules: group susu from the first slot to the final payout, savings plans and digitised passbooks, lending from application to write-off with real-time portfolio-at-risk and automated provisioning, and accounting with a trial balance by account. Money movements are under dual control, staff roles are separated so no one person can do everything, and field payments can be recorded offline and synced when connectivity returns. Loan reporting maps to Bank of Ghana categories and GCSCA lines.</p>

<p>Contributions and payouts move over mobile money on all three Ghanaian networks and bank transfers through Moolre, Hubtel, Paystack, and LibertePay; user funds never sit with SusuPaa. A read-only assistant, SusuPal, answers questions over an organization's own data and cannot modify anything.</p>

<p>Beyond the code, I direct the technical roadmap, lead code reviews, and run sprint planning for a remote team of five engineers.</p>

<p>Coverage: <a href="https://techlabari.com/beyond-mobile-money-the-quiet-struggle-to-modernize-ghanas-ancient-susu-system/" rel="noopener noreferrer">Tech Labari</a>, <a href="https://www.myjoyonline.com/susupaa-wins-double-at-moolre-startup-cup/" rel="noopener noreferrer">MyJoyOnline</a>.</p>
