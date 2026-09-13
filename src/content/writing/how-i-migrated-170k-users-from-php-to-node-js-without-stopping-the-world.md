---
title: "How I Migrated 170k Users from PHP to Node.js Without Stopping the World"
date: '2026-01-07'
tags: [systems, migrations]
description: "Migrating a system with 170,000 users isn’t about clever rewrites; it’s about not breaking trust. This post covers how I moved a legacy PHP/MySQL platform to Node.js and PostgreSQL, kept both systems in sync, and scaled performance without downtime."
---

In 2025, I joined the RBL team, a dating platform that had been running since 2015\. The original goal was simple: improve filtering, fix location-based matching, and assess whether the system could keep scaling.

At the time, the platform had over **170,000 users** running on a legacy **PHP + MySQL** stack. I was hired to add features, but once I dug into the codebase, it became clear the system had hit a hard ceiling.

#### The "WTF" Moments

We all know that feeling when you open a legacy codebase and realize standard feature requests are going to be nightmares. Two things stood out immediately:

**1\. Location matching wasn’t real geo-spatial matching**  
There was no concept of coordinates or radius-based search. Location was inferred by extracting city names from IP addresses using a paid third-party service, then doing string comparisons. If User A was in “Accra” and User B was in “Accra”, they matched. Anything like “people within 50km” was impossible.

**2\. Extreme over-normalization**  
The database schema was rigid to the point of hurting read performance. Simple attributes like height weren’t stored as numbers. There was a separate `heights` table (`1ft`, `1.2ft`, … `8ft`) and user profiles referenced it via foreign keys. Fetching a single profile required joins across tables for `height`, `hobbies`, `education`, and more. Reads were slow, and the schema made iteration painful.

At that point, patching felt irresponsible.

#### The Rewrite

I made the case to stakeholders that this wasn’t a refactor problem. It was a rewrite problem. The new direction:

- **Node.js (Express)** for better concurrency
- **PostgreSQL** with **PostGIS** for proper geospatial queries
- A flatter schema optimized for reads
- Refactored the mobile client to be modern **React Native** compatible.

I spent about **three months** rebuilding the system end-to-end.

- **Backend:** Moved from PHP to Node.js (Express).
- **Data:** Moved from MySQL to PostgreSQL (flattened schema, enums instead of join tables, implemented proper geospatial indexing with PostGIS).
- **Mobile:** Moved client from Legacy React Native to modern React Native.

#### The Migration (The Scary Part)

The platform had **170k active users**. I couldn’t flip a switch, shut down PHP, and assume everyone would update their app overnight. So I didn’t.

Instead, I built a **dual-write proxy**.

This middleware sat in front of both the old and new backends. When a user on the legacy app updated their profile (for example, changing their bio), the proxy would:

1. Validate the request
2. Transform the payload to match the new PostgreSQL schema
3. Send it to the new Node.js backend
4. Transform it again and forward it to the old PHP backend

Both systems stayed in sync, while a separate job backfilled historical data.

A user on the old app could chat with a user on the new React Native app without realizing they were on completely different backends.

Once adoption crossed a safe threshold, I finally shut down the PHP server.

![](/writing/how-i-migrated-170k-users-from-php-to-node-js-without-stopping-the-world/architecture-diagram.webp)

#### Post-Launch & The 6-Second API Call

After launch, everything looked good… until traffic ramped up.

The “swipe” endpoint started timing out. Some requests took **up to 6 seconds**.

The cause was straightforward and painful:  
I was running the full matching algorithm — geo filtering, compatibility scoring — **on-demand** every time a user requested a card.

At this scale, that doesn’t fly.

### The Fix: Redis + Prefetching

I introduced **Redis** and changed the model entirely.

Instead of computing matches in real time:

- When a user opens the app, a background job precomputes their next batch of matches
- The results are cached in Redis
- The API simply reads from cache

Response times dropped from seconds to **milliseconds**.

### 

#### The Result

Today, the platform:

- Supports **200,000+ users**
- Has real radius-based geo filtering
- Uses a schema that doesn’t require 10 joins to read a profile
- Runs on a stack that can actually scale without fear

More importantly, the migration happened without downtime and without breaking the experience for existing users.
