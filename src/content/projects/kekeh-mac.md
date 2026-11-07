---
title: 'Kekeh Mac'
slug: 'kekeh-mac'
excerpt: 'Rides and deliveries for Freetown, with driver wallets, savings and loans built in.'
featured: false
publishedAt: '2026-10-26T00:00:00.000Z'
kind: 'case-study'
role: 'Lead engineer'
status: 'Pilot'
client: 'Kekeh Mac'
categories:
  - 'Mobile App'
  - 'Web App'
  - 'Backend'
  - 'Fintech'
engagement: 'full-build'
stage: 'startup'
oneLine: 'Rides and deliveries for Freetown, with driver wallets, savings and loans built in.'
built:
  - 'Driver app'
  - 'Passenger app'
  - 'API'
  - 'Admin'
  - 'Real-time dispatch'
brandColor: '#34b764'
onBrand: 'dark'
deviceShots:
  - src: '/portfolio/kekeh-mac/passenger-11-tracking-driver-on-the-way.png'
    alt: 'The Kekeh Mac passenger app tracking a driver on the way on a map of Freetown'
    kind: 'phone'
  - src: '/portfolio/kekeh-mac/driver-05-heading-to-pickup.png'
    alt: 'The Kekeh Mac driver app heading to a pickup with distance, ETA and payout'
    kind: 'phone'
  - src: '/portfolio/kekeh-mac/passenger-03-home.png'
    alt: 'The Kekeh Mac passenger home screen with wallet balance and ride, delivery, car pool and cargo options'
    kind: 'phone'
  - src: '/portfolio/kekeh-mac/driver-03-home-online.png'
    alt: 'The Kekeh Mac driver home screen while online'
    kind: 'phone'
  - src: '/portfolio/kekeh-mac/driver-11-wallet.png'
    alt: 'The Kekeh Mac driver wallet'
    kind: 'phone'
  - src: '/portfolio/kekeh-mac/passenger-12-trip-complete.png'
    alt: 'The Kekeh Mac passenger trip complete screen'
    kind: 'phone'
pill: true
pillOrder: 1
---

Kekeh Mac is a ride-hailing and delivery platform for Freetown, Sierra Leone. It is in a pilot, limited release. I led the build, from the first schema to the apps, with two other developers contributing smaller pieces.

## The goal

Give Freetown one platform for rides, deliveries and shared trips, and give its drivers the financial tools they rarely get.

<div class="shots-row">
<img src="/portfolio/kekeh-mac/driver-03-home-online.png" alt="The driver app home screen while online and ready for jobs" loading="lazy" decoding="async" width="496" height="1080">
<img src="/portfolio/kekeh-mac/driver-11-wallet.png" alt="The driver app wallet screen" loading="lazy" decoding="async" width="496" height="1080">
<img src="/portfolio/kekeh-mac/passenger-12-trip-complete.png" alt="The passenger app trip complete screen" loading="lazy" decoding="async" width="496" height="1080">
</div>

## Real-time dispatch

Drivers connect over Socket.IO and push their location into a Redis geospatial index. When a passenger requests a ride, the API finds nearby drivers from that index and offers the job. A Redis lock makes sure only one driver can accept it.

Carpool and intercity trips needed a different model. Matching a rider's pickup and dropoff to a trip's two endpoints missed everyone in the middle of a route, such as a town the driver passes straight through. I changed search to measure against the line the trip actually travels, so riders along the corridor now see it.

## Two apps, one platform

There are two Expo apps, one for drivers and one for passengers, plus a React admin panel for operations staff. All of them talk to a single NestJS API on PostgreSQL. The apps share design, translation and API-client packages from one Turborepo monorepo, so a change to a screen or an endpoint lands everywhere together.

## Money for drivers

Each driver has a wallet that records every earning, commission and payout. On top of it sit savings goals, micro-loans and advances, and insurance. The platform funds the loans and insurance, and the commission rate is a setting, not a number in the code. Money moves in and out through Monime, a mobile money provider. Every movement is a ledger entry, so any balance can be traced to the events behind it.

## Built for Freetown

Safety features include an SOS screen, emergency contacts who are alerted over WhatsApp, and trip-share links a passenger can send to anyone. Booking also works through a WhatsApp assistant. The apps are set up for translation, and Krio is the next language, though that copy is still to come.

## Stack

TypeScript throughout: Expo and React Native, NestJS, React with TanStack, PostgreSQL with Drizzle, Redis, Socket.IO and Graphile Worker. It runs on DigitalOcean App Platform with managed Postgres and Valkey.
