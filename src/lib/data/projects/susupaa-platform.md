---
title: 'SusuPaa Platform'
slug: 'susupaa-platform'
excerpt: 'As Co-founder & Lead Backend Engineer, I architected a multi-tenant fintech platform that digitizes traditional susu savings groups across Ghana. The system processes over ₵5M+ in transactions with API response times optimized from 1.2s to 700ms.'
featured: true
publishedAt: '2025-07-01T00:00:00.000Z'
featuredImage: '/portfolio/susupaa-webapp.png'
liveUrl: 'https://susupaa.com'
role: 'Co-founder & Lead Backend Engineer'
status: 'Shipped'
client: 'SusuPaa'
featuredStack:
  - 'Python'
  - 'TypeScript'
stack:
  - 'Python'
  - 'TypeScript'
  - 'PostgreSQL'
  - 'Redis'
  - 'Microservices'
  - 'Multi-tenant Architecture'
  - 'WhatsApp API'
  - 'Mobile Money Integration'
categories:
  - 'Web App'
stats:
  - key: 'Monthly Transactions'
    value: '$80k+'
    description: 'Total transaction volume processed'
  - key: 'Groups'
    value: '262+'
    description: 'Active savings groups on platform'
  - key: 'Members'
    value: '2000+'
    description: 'Users managing their savings'
gallery:
  - '/portfolio/susupaa-webapp.png'
  - '/portfolio/susupaa-website.png'
problem: "Susu savings groups across Ghana were managing hundreds of members and millions of cedis through WhatsApp messages, paper ledgers, and phone calls. Missed contributions went unnoticed for weeks, disputes over payouts were common, and group leaders had no reliable way to prove transaction history. Digital alternatives either didn't exist for the Ghanaian market or required a formal bank account that most participants didn't have."
lessons: "Starting with event sourcing from day one rather than retrofitting it later. Our transaction ledger needed audit trails that we had to rebuild after launch — designing the data model around immutable events from the start would have saved us two weeks of migration work. I'd also invest earlier in contract testing between services; we had integration bugs that only surfaced in staging because our unit tests mocked too aggressively."
---

<p>Susu is a centuries-old savings tradition across Ghana and West Africa. Groups of people—family, friends, market traders, or colleagues—pool money together, with each member taking turns receiving the full pot. It's built on trust, community, and discipline. But managing it manually? That's where things get messy. Missed payments, unclear records, and disputes are common.</p>

<p>SusuPaa was created to bring this tradition into the digital age without losing what makes it work. As Co-founder and Lead Backend Engineer, I've been responsible for architecting the entire backend infrastructure and leading a remote team of 5 engineers to build a platform that serves savings groups across Ghana.</p>

<p>The technical challenges were significant. We built a multi-tenant microservices architecture using Python and TypeScript that needed to handle financial transactions with absolute reliability. Every cedi passing through the system has to be tracked accurately—there's no room for error when people's savings are on the line.</p>

<p>One of my key contributions was tackling performance. The initial API responses were taking 1.2 seconds, which felt sluggish for users checking their contributions or making payments. By refactoring PostgreSQL query plans and implementing a tiered Redis caching strategy, I brought that down to 150ms. The app now feels instant.</p>

<p>The platform handles secure contributions with direct Mobile Money and bank account payouts—importantly, user funds never sit with SusuPaa. We built automated cycle management with fair slot distribution, WhatsApp and SMS reminders to keep members accountable, and real-time analytics dashboards so group leaders can see exactly where their savings stand.</p>

<p>Beyond the code, I direct the technical roadmap, lead code reviews, and run sprint planning for our engineering team. It's a balance of hands-on architecture work and making sure the team can ship features efficiently.</p>

<p>Seeing the platform grow to over 262 groups and 1,700+ members since launch in July 2025 has been rewarding. We've been featured in Tech Labari and MyJoy Online, and the testimonials from group leaders who say we've "revolutionized how they manage savings" remind me why this work matters. We're modernizing a tradition that has helped communities build wealth for generations—just making it easier, faster, and more transparent.</p>
