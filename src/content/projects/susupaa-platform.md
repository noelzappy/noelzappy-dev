---
title: 'SusuPaa Platform'
slug: 'susupaa-platform'
excerpt: 'A multi-tenant platform built on a custom append-only ledger with strict consistency guarantees. 339 organizations onboarded, 28 API modules in production; p99 latency cut from 1.6s to 500ms.'
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
  - key: 'Organizations onboarded'
    value: '339'
    description: 'Onboarded to the platform'
  - key: 'API modules'
    value: '28'
    description: 'Modules in production'
  - key: 'p99 latency'
    value: '500ms'
    description: 'Down from 1.6s'
gallery:
  - '/portfolio/susupaa-webapp.png'
  - '/portfolio/susupaa-website.png'
problem: 'Savings groups were tracking hundreds of members and large sums through WhatsApp messages, paper ledgers, and phone calls. Any system replacing that had to be the single source of truth for money it never held: every contribution and payout provable after the fact, no double-credits under concurrent operations, and strict isolation between hundreds of independent organizations sharing one deployment.'
lessons: "Starting with event sourcing from day one rather than retrofitting it later. Our transaction ledger needed audit trails that we had to rebuild after launch — designing the data model around immutable events from the start would have saved us two weeks of migration work. I'd also invest earlier in contract testing between services; we had integration bugs that only surfaced in staging because our unit tests mocked too aggressively."
---

<p>SusuPaa is a multi-tenant platform for rotating savings groups. Each organization runs its own cycles, members, contributions, and payouts on a shared deployment, and every one of those money movements has to be provable later. I co-founded the company and led the platform from the first commit.</p>

<p>The core is an append-only ledger I designed and operate. Entries are never updated or deleted; balances are derived from the entry history, so any balance can be reproduced from the record that produced it. That is what gives the system its consistency guarantees: a contribution, a payout, and the group balance they affect are written as one unit or not at all, and there is no path that mutates a balance without a corresponding entry.</p>

<p>Concurrency was the second design problem. Settlement jobs run concurrently, and the failure mode in this kind of system is the same everywhere: a job processed twice credits someone twice. Jobs are claimed atomically from a Postgres-backed queue, so each payment or payout is processed exactly once under load, with no double-crediting and no orphaned settlements.</p>

<p>Performance came next. p99 API latency was 1.6 seconds. Refactoring PostgreSQL query plans and adding a tiered Redis caching strategy brought it to 500ms.</p>

<p>Operating it means being able to see it and recover it. I stood up the observability stack (Prometheus metrics, Grafana dashboards, Loki log aggregation) and PostgreSQL WAL archiving to S3 for point-in-time recovery, so a bad deploy or a corrupted write is recoverable to the second rather than to the last nightly dump. Today the platform runs 28 API modules in production, with 339 organizations onboarded.</p>

<p>The domain is Ghanaian susu groups: members pool money and take turns receiving the pot. Contributions and payouts move over mobile-money aggregator rails and bank transfers, and user funds never sit with SusuPaa. On top of the ledger sit cycle management with fair slot distribution, WhatsApp and SMS reminders, and reporting for group leaders.</p>

<p>Beyond the code, I direct the technical roadmap, lead code reviews, and run sprint planning for a remote team of five engineers.</p>

<p>Coverage: <a href="https://techlabari.com/beyond-mobile-money-the-quiet-struggle-to-modernize-ghanas-ancient-susu-system/" rel="noopener noreferrer">Tech Labari</a>, <a href="https://www.myjoyonline.com/susupaa-wins-double-at-moolre-startup-cup/" rel="noopener noreferrer">MyJoyOnline</a>.</p>
