---
title: 'Givio Platform'
slug: 'givio-platform'
excerpt: 'Solo build of a gifting platform backed by fractional stocks and crypto: exchange and market-data integrations, PCI-compliant payments, and KYC/AML flows.'
featured: false
publishedAt: '2025-02-01T00:00:00.000Z'
featuredImage: '/portfolio/givio-webapp.png'
liveUrl: 'https://app.givioapp.com'
role: 'Software Engineer'
kind: 'case-study'
status: 'Shipped'
client: 'Edromart Technologies'
featuredStack:
  - 'Next.js'
  - 'Node.js'
stack:
  - 'Next.js'
  - 'Node.js'
  - 'TypeScript'
  - 'PostgreSQL'
  - 'Crypto APIs'
  - 'Stock Market APIs'
  - 'Payment Processing'
  - 'KYC/AML Compliance'
categories:
  - 'Web App'
gallery:
  - '/portfolio/givio-webapp.png'
---

<p>Givio is a gifting platform where a gift certificate is backed by a real asset: a fractional share of a listed company or an amount of cryptocurrency. The recipient can hold it and watch it move, or redeem it at market value. I built the entire platform as the solo developer for Edromart Technologies.</p>

<p>That meant the user-facing web app and the admin dashboard, and the parts that make the product work: integrations with cryptocurrency exchanges for real-time pricing and wallet management, stock market data for NYSE and NASDAQ listings, and fractional share support so someone can gift $25 of a stock without buying a whole share. Payments run through PCI-compliant processing with cards, bank transfers, and digital wallets.</p>

<p>The platform handles financial assets, so the controls are not optional: KYC/AML flows, multi-factor authentication, biometric access on mobile, and cold storage for crypto assets. The gifting layer on top lets users set amounts, add a message, schedule delivery for a date, and send by email or SMS.</p>

<p>Building it alone forced the trade-offs into the open. A standard web app can be a little wrong; a platform that holds people's assets and prices against volatile markets cannot.</p>
