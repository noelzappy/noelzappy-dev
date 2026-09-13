---
title: 'Love Nest Dating App'
slug: 'lovenest-dating-app'
excerpt: 'The full backend for a dating app for single parents: Node.js, PostgreSQL and Redis, WebSocket messaging with presence, a values-based matching system, and physical gifting through partner fulfilment.'
featured: false
publishedAt: '2025-01-01T00:00:00.000Z'
featuredImage: '/portfolio/lovenest/1.jpg'
liveUrl: 'https://lovenest.now'
iosUrl: 'https://apps.apple.com/us/app/love-nest-single-parents/id6747092702'
androidUrl: 'https://play.google.com/store/apps/details?id=com.benfordtech.lovenest'
role: 'Backend Developer'
kind: 'case-study'
status: 'Shipped'
client: 'Lyqx Agency'
featuredStack:
  - 'Node.js'
  - 'PostgreSQL'
stack:
  - 'Node.js'
  - 'PostgreSQL'
  - 'Redis'
  - 'WebSockets'
  - 'REST APIs'
  - 'Real-time Messaging'
categories:
  - 'Mobile App'
gallery:
  - '/portfolio/lovenest/1.jpg'
  - '/portfolio/lovenest/2.jpg'
  - '/portfolio/lovenest/3.jpg'
  - '/portfolio/lovenest/4.jpg'
  - '/portfolio/lovenest/5.jpg'
  - '/portfolio/lovenest/6.jpg'
  - '/portfolio/lovenest/7.jpg'
---

<p>Love Nest is a dating app for single parents. Lyqx Agency brought me in to build the entire backend; the iOS and Android apps were built separately on top of it.</p>

<p>The foundation is Node.js with PostgreSQL for persistence and Redis for caching and sessions. Messaging runs over WebSockets with instant delivery, typing indicators, and presence, since a dating app that lags on messages does not get a second chance.</p>

<p>Matching weighs parenting styles, shared values, and life plans rather than looks and distance alone. Getting the weighting right so results stayed relevant, without collapsing into a single dominant factor, took the most iteration of anything in the project.</p>

<p>The feature that set the product apart was physical gifting. A user can send flowers, chocolates, books, or tea to a match through approved partner networks without either side revealing an address. The backend owns the whole flow: gift selection, payment, fulfilment coordination with the partner, and the privacy boundary in between. The same backend runs the in-person events programme: event creation, participant limits, RSVPs, and coordination with childcare services so parents can attend.</p>

<p>Because the data is sensitive and children are in the picture, the platform has strict data protection, straightforward reporting and blocking, and enforcement mechanisms for harassment built in from the start.</p>
