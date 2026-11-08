---
title: 'Vemphy'
shortTitle: 'Vemphy'
slug: 'vemphy'
excerpt: 'A verification service for institutional documents in Ghana. Banks, universities, employers and insurers sign letters into a registry, and anyone with a copy checks a short code or QR and gets one of four answers. I designed and built all of it.'
featured: false
publishedAt: '2026-11-07T00:00:00.000Z'
featuredImage: '/portfolio/vemphy/verify-desktop.webp'
liveUrl: 'https://vemphy.com'
github: 'https://github.com/vemphy/vc'
role: 'Founder, designer & engineer'
kind: 'case-study'
status: 'Pilot'
client: 'Vemphy'
featuredStack:
  - 'Go'
  - 'TypeScript'
stack:
  - 'Go'
  - 'TypeScript'
  - 'PostgreSQL'
  - 'React'
  - 'TanStack'
  - 'Tailwind CSS'
  - 'OpenAPI'
  - 'W3C Verifiable Credentials'
categories:
  - 'Web App'
  - 'Backend'
problem: 'A letter from a bank, a degree certificate or a salary confirmation is checked today by phone, by walking back to the issuer, or not at all. A clerk at a counter can tell if a stamp looks right, but not if the letter was withdrawn last week. Any fix had to give that clerk one word they can act on, work on a mid-range phone in daylight, and never accuse a person of fraud on evidence it does not have.'
lessons: 'My first build compiled three claim types into the verification package and copied them by hand into Go. Every new kind of letter would have meant a package release and a deploy. I moved claim types into data, with one schema language checked the same way in both languages. I would start there next time rather than discovering it after the first build.'
engagement: 'full-build'
stage: 'own-venture'
oneLine: 'Proof that travels: check any signed document in Ghana with a short code or a QR.'
built:
  - 'Registry'
  - 'Verify site'
  - 'Issuer dashboard'
  - 'Staff console'
  - 'Open toolkit'
brandColor: '#0F5F86'
onBrand: 'light'
deviceShots:
  - src: '/portfolio/vemphy/verify-desktop.webp'
    alt: 'The Vemphy verify page with a code field, Check and Scan QR buttons, and a short explanation of the four answers'
    kind: 'browser'
  - src: '/portfolio/vemphy/verify-mobile.webp'
    alt: 'The Vemphy verify page on a phone, with the code field and Check button at the top'
    kind: 'phone'
showcase:
  layout: 'web-phones'
  web:
    src: '/portfolio/vemphy/verify-desktop.webp'
    alt: 'The Vemphy verify page with a code field, Check and Scan QR buttons, and a short explanation of the four answers'
  phones:
    - src: '/portfolio/vemphy/verify-mobile.webp'
      alt: 'The Vemphy verify page on a phone, with the code field and Check button at the top'
---

<p>Vemphy is a verification service for institutional documents in Ghana. Banks, universities, employers and insurers sign their letters and certificates into a registry. Anyone holding a copy checks the short code or QR printed on it and gets one of four answers: Valid, Revoked, Expired or Unknown. The tagline is "Proof that travels", meaning the proof stays attached to the document wherever it goes. It is in pilot. It is my own product, and I designed and built all of it: the visual identity, the architecture, the registry, the web apps and the open-source toolkit.</p>

<h2>The problem</h2>

<p>Documents like a bank reference letter or a degree certificate are asked for constantly: by landlords, HR clerks, loan officers and traders. Checking one usually means a phone call or a trip to the issuer, so most go unchecked. The person checking is not an engineer. They are standing at a counter, often on a mid-range Android phone, and they need one word they can act on.</p>

<h2>What I built</h2>

<p>The platform is four apps around one service, and the repository holds twelve decision records and eighteen database migrations.</p>

<ul>
<li><strong>The registry</strong> is a Go service. It holds issuers, their signing keys, claims, claim types and status lists, and it answers public verification requests.</li>
<li><strong>The verify site</strong> at <a href="https://vemphy.com" rel="noopener noreferrer">vemphy.com</a> is where a clerk enters or scans a code. The result is decided on the server and works with JavaScript off. A code that fails its check character is caught in the browser and never reaches the registry.</li>
<li><strong>The issuer dashboard</strong> is where a bank's staff sign in, set a password, register passkeys and see an overview. Its later screens are designed but not built yet.</li>
<li><strong>The staff console</strong> is for Vemphy's own team: passkey sign-in, issuers, claim types, revocation approvals and an audit log across issuers.</li>
<li><strong>The open toolkit</strong>, <a href="https://github.com/vemphy/vc" rel="noopener noreferrer">vemphy/vc</a>, is the public repository that does the checking: <code>@vemphy/vc</code> in TypeScript and <code>vc-go</code> in Go, with a set of signed test claims that both must answer correctly.</li>
</ul>

<p>I also designed the identity: a warm paper background, one sea-blue accent, a status palette that is never decorative, and a mark made of two separate strokes that read as a V.</p>

<h2>Decisions that mattered</h2>

<h3>Four answers, and never "fake"</h3>

<p>A public answer is Valid, Revoked, Expired or Unknown, and nothing else. Unknown covers every case where nothing can be confirmed and deliberately does not say why, because a mistyped code, an issuer that has not joined and an altered letter all look the same from here. Three accusatory words never appear anywhere in the product, and a script in the repository fails the build if they do. This matters because a clerk acting on a guess about a stranger's document is the harm the product exists to avoid.</p>

<h3>Verification is public code</h3>

<p>"Trust us, it's valid" is what a registry says when only it can check. The checking code is open source from its first commit, and the private registry consumes it only at published versions, so the registry and an outside verifier cannot disagree. Both languages must produce the recorded answer for every test claim, and a script cross-signs between Go and TypeScript with a key neither side has seen. Anyone can verify a claim offline without trusting Vemphy's servers.</p>

<h3>Claim types are data, not code</h3>

<p>A claim type is a small JSON schema saying which fields a letter has, what each is called and which may be shown to the person checking. A new kind of letter needs no release and no deploy. Core types such as bank reference letters, salary confirmations and degree certificates are curated by Vemphy. Issuers can define their own, which no other issuer can see. Once published, a type is frozen, and a change means publishing the next version, so a claim always displays with the labels it was issued under.</p>

<h3>Keys never leave the key manager, and revoking one takes two people</h3>

<p>An issuer's signing key is the issuer: whoever holds it can produce letters that verify as the bank's. Keys are created inside a key manager (Vault in development, with AWS KMS chosen for production) and are never exported, so no code of mine ever sees one. Revoking a key makes every letter it signed stop verifying, and that cannot be undone by doing the opposite. So it is a request that a second person must approve, and the requester can never approve their own.</p>

<h3>One issuer can never learn what another holds</h3>

<p>Every row that belongs to an issuer carries its issuer id from the first migration, and every query filters on it. Another issuer's data is not found, never forbidden, so a tenant cannot even learn that something exists. A test reads the query files and fails on any query that skips the filter. Vemphy's own staff are a separate population with passkeys only and no passwords.</p>

<h3>No blockchain, no machine learning</h3>

<p>The question is "did this bank sign this?", and a bank's public key plus a signature answers it. A ledger would add a network to depend on and data that cannot be removed. Image checks would produce probabilities, and a probability about a person's document becomes an accusation. Vemphy verifies a signature over data the issuer supplied.</p>

<h2>Where it stands</h2>

<p>Vemphy is in pilot. The public verify site is live and the registry, the staff console and the open toolkit are built. The issuer dashboard has sign-in, passkeys and an overview, and its remaining screens are the next work.</p>

<h2>Stack</h2>

<p>Go with chi, sqlc and PostgreSQL 16 for the registry, generated from an OpenAPI file that also generates the TypeScript client. React 19, TanStack and Tailwind v4 for the web apps. Credentials follow the W3C Verifiable Credentials model, with <code>did:web</code> issuer identities and bitstring status lists.</p>
