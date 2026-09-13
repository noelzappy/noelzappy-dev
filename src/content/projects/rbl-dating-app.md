---
title: 'RBL Dating Platform'
slug: 'rbl-dating-app'
excerpt: 'Rewrote a dating platform’s stack from PHP/MySQL to Node.js and PostgreSQL, with a new React Native app and React admin panel, migrating 170,000 users with zero downtime.'
featured: true
publishedAt: '2024-09-06T15:01:56.000Z'
featuredImage: '/portfolio/rblapp.png'
iosUrl: 'https://apps.apple.com/us/app/real-black-love-dating-app/id961016844'
androidUrl: 'https://play.google.com/store/apps/details?id=com.ht.realblacklove'
role: 'Lead Engineer'
kind: 'case-study'
status: 'Shipped'
client: 'RBL Matchmaking LLC'
featuredStack:
  - 'Node.js'
  - 'Express.Js'
  - 'PostgreSQL'
  - 'React Native'
stack:
  - 'Node.js'
  - 'Express.Js'
  - 'PostgreSQL'
  - 'React Native'
  - 'React'
  - 'iOS'
  - 'Android'
categories:
  - 'Mobile App'
  - 'Web App'
stats:
  - key: 'Users Migrated'
    value: '170,000+'
    description: 'Zero downtime migration'
  - key: 'Installs'
    value: '200,000+'
    description: 'Growing user base'
gallery:
  - '/portfolio/rblapp.png'
---

<p>RBL is a dating platform that had been running since 2015 on PHP and MySQL, with 170,000 users, when I was brought in early in 2024 to add features. Two of them were not possible on the existing system. Location matching compared city names inferred from IP addresses, so "people within 50 km" could not be expressed. And the schema was normalised to the point that reading one profile joined several tables. I made the case that this was a rewrite, not a refactor, and got it.</p>

<p>The new stack is Node.js with Express, PostgreSQL with PostGIS for real geospatial queries, and a flatter schema built for reads. The mobile client moved to a current React Native codebase and the admin panel was rebuilt in React. The rebuild took about three months.</p>

<p>The migration could not stop the product. I put a dual-write proxy in front of both backends: every write from the legacy app was validated, transformed into the new schema, written to the new backend, then transformed back and forwarded to PHP. A background job backfilled history. Both systems stayed in sync, so a user on the old app could chat with a user on the new one, and the PHP server was shut down only once adoption crossed a safe threshold. No downtime, and nobody was forced to update.</p>

<p>After launch the swipe endpoint climbed to six seconds under load, because matching ran the full geo and compatibility scoring on demand. I moved it to precomputed batches: a background job prepares each user's next matches, Redis holds them, and the API reads from cache. Response times went from seconds to milliseconds. Alongside that I built the image verification flow that reduces fake profiles.</p>

<p>The platform now serves more than 200,000 users with radius-based matching on a schema that does not need ten joins to read a profile. The full account is in <a href="/writing/how-i-migrated-170k-users-from-php-to-node-js-without-stopping-the-world">How I migrated 170k users from PHP to Node.js without stopping the world</a>.</p>
