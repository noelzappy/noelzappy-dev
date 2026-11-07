---
title: 'Five things that break when you add mobile money to a card integration'
date: '2026-11-07'
tags: [payments, mobile-money]
description: 'What changes when mobile money joins a card-based payment flow: callbacks, long-lived pending states, idempotency, reconciliation and provider failover.'
draft: true
---

## 1. Callbacks are not guaranteed (and how to poll safely)

TODO: Explain why webhooks/callbacks from mobile money providers get lost or arrive late, and how to build a safe polling fallback.

## 2. "Pending" can last hours: designing for long-lived states

TODO: Cover how to model transactions that sit in pending for hours, and what the UI, ledger and timeouts should do meanwhile.

## 3. Idempotency keys across providers that don't agree on them

TODO: Describe how providers differ on idempotency semantics and how to build your own key scheme that works across all of them.

## 4. Reconciliation when the provider's report and your ledger disagree

TODO: Walk through detecting and resolving mismatches between provider settlement reports and your ledger.

## 5. Failover between providers without double-charging

TODO: Explain how to fail over to a second provider safely, including how to confirm the first attempt is truly dead before retrying.
