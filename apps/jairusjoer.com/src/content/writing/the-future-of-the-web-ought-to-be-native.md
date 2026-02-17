---
title: The Future of the Web Ought to Be Native
description: How a web-native, local-first, federated stack can transform the concept of personal software into a practical reality for certain types of applications.
date: 2026-01-30
status: Draft
---

At the end of 2025, I wrote _[About Personal Software](/writing/about-personal-software)_, in which I explored how human taste and identity dictate quality in an AI-driven landscape and sketched a personal vision for the future of software development. This post builds on the philosophical groundwork laid in that one.

Since then, I have rediscovered Tauri[^tauri] and used it to iterate on cross-platform prototypes with a single web-first codebase. This process has clarified my vision: web primitives are now sufficient in many areas, making the browser a more democratic home for personal software than app stores.

Throughout January, I researched and refined this vision into a simple statement: **the future of the web ought to be native**. Not that every app should be a WebView, but that the browser, extended with local‑first data and federated protocols, can serve as a resilient platform for personal and productivity software.

---

## Personal Software Demands Web Resilience

In _[About Personal Software](/writing/about-personal-software)_, I argued that as AI collapses the cost and complexity of writing functional code, taste (and, to a certain extent, identity) becomes the key differentiator. But taste cannot flourish on a brittle foundation. Personal software needs a resilient medium that:

- Preserves its identity across platforms and devices.
- Survives connectivity issues and platform changes.
- Avoids locking people and data into vendor silos.

A web-first codebase treats the browser as a resilient medium. It provides a consistent experience rather than becoming fragmented across native stacks. When deeper integration is required, a native shell such as Tauri or Electron can be used to wrap and offer access to native APIs, with the core remaining web-first.

This is not a new idea. A decade ago, both Facebook and LinkedIn attempted to develop web codebases for mobile platforms. Facebook labelled its HTML5 mobile strategy a mistake[^businessinsider], while LinkedIn moved away from HTML5 clients due to performance issues[^venturebeat]. Their public reversals taught engineers that:

- A single web codebase did not magically erase differences in performance, release cadence, and API support across platforms.
- For animation-heavy, brand-critical consumer apps, native code still had the edge when it came to performance and user experience.
- Many deep capabilities were exposed to native code first on mobile platforms, and some web APIs only arrived later or with tighter platform constraints.

Since those early experiments, the web itself has matured. (Progressive) web applications now offer installation, offline support[^mdn-offline], push notifications[^caniuse-push][^mdn-push] and deeper device integration across major browsers. The ecosystem of tools for building web-first apps has also grown and improved significantly.

The difference today is not that the web has no drawbacks — it does — but that, when it comes to personal and productivity tools, the balance of trade-offs increasingly favours a web-first approach backed by careful, case-by-case use of native shells where they truly pay off.

---

# Draft

---

## The Web as a Decentralised Operating System

If the browser is to serve as the “kernel” for personal software, it needs more than URLs and hyperlinks. Fortunately, a lot of the necessary pieces already exist.

Modern browsers provide:

- **Offline resilience** via Service Workers, which can cache content and handle requests even when the network is unavailable.[web:134][web:53]
- **Local data storage** through technologies like IndexedDB, enabling applications to keep data on the device instead of on a remote server.[web:134][web:53]
- **Peer‑to‑peer communication** using WebRTC, allowing browsers to connect directly to each other where network conditions permit.[web:53]

On top of that, HTML and CSS—the most widely deployed interface languages in history—have grown expressive enough to carry taste.[file:87][web:53] Container queries, modern layout systems, and view transitions let designers articulate identity and motion directly, without always reaching for heavy client‑side frameworks.[web:53] Semantic HTML and native controls can encode accessibility best practices in the structure of the page, and when combined with guidelines like [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/), they provide a baseline of inclusion that many bespoke native stacks still struggle to match.[web:53][web:86]

In other words:

- The browser is distributed by default.
- Its language of expression is standards‑based.
- Its accessibility story is built‑in, not bolted on.

That combination makes it a plausible substrate for a decentralised operating system—especially for software that is meant to be personal, long‑lived, and identity‑expressive.

At the same time, there are real constraints:

- Mobile browsers, especially on iOS, still limit what web apps can do in the background, how much data they can store, and how they integrate with system UI.[web:25][web:20]
- New capabilities such as local file system access, Bluetooth, NFC, and USB are arriving through initiatives like Google’s “Project Fugu”, but their support varies across browsers and platforms and they must be treated with care.[web:134]

A realistic vision of the web as decentralised OS has to hold both truths: the browser is uniquely open and interoperable, and yet many of its most powerful capabilities sit behind the policy, priorities, and incentives of a small number of browser vendors.[web:47][web:53]

---

## Local‑First as an Extension of Mind

In the earlier essay, I described personal software as an extension of the mind: tools that are so well‑fitted that they become part of one’s thinking process.[file:87] For that to be true, software must feel trustworthy. It must still be there when the network drops. It must keep a person’s work close at hand, not buried in a distant server farm.[file:87]

The “local‑first” movement captures these needs in architectural form. Researchers at Ink & Switch propose that ideal local‑first software:[web:19][web:5]

- Keeps the primary copy of data on the user’s own devices.
- Works offline by default and syncs in the background when possible.
- Allows collaboration without enforcing a single central “source of truth,” instead merging changes from different devices in a principled way.

Techniques like conflict‑free replicated data types (CRDTs) make that last point concrete by allowing multiple copies of the same data to evolve independently and then converge without conflict when they reconnect.[web:49][web:46] The details are mathematically subtle, but the effect is simple: people can edit their notes, drawings, or plans whenever inspiration strikes, without waiting for a server to acknowledge every keystroke.

On the web, local‑first thinking pairs naturally with the capabilities of the browser:

- IndexedDB and similar APIs keep data close.
- Service Workers provide offline caching and background sync.
- A web‑native UI means the same logic can follow a person from laptop to tablet to phone.[web:134][web:19]

There are limits. Some browsers apply strict storage quotas, particularly on mobile; background work must be balanced against battery life; and full local‑first collaboration, especially in partially trusted environments, still requires careful design.[web:25][web:20][web:46] But for many personal tools—notes, journals, knowledge bases, small team planners—the combination of local‑first patterns and web technologies offers an experience that feels more like a well‑thumbed notebook than a rented interface to someone else’s database.

---

## Federation, Interoperability, and European Sovereignty

Resilient tools on a single device are only half of the story. Personal software also lives in a social and institutional world: it shares data, synchronises across services, and exists alongside broader debates about who controls the digital infrastructure we all depend on.

On the technical side, the web already has blueprints for decentralised interaction:

- **ActivityPub**, a W3C Recommendation, defines a protocol for decentralised social networking where independent servers exchange posts and actions in a standard format.[web:29][web:21]
- **Matrix** provides a federated protocol for messaging, used by both communities and public institutions.
- **Solid**, led by Tim Berners‑Lee, proposes personal data “pods” that individuals control, which applications can access with permission instead of each app building its own silo.[web:51][web:57]

These efforts share a simple idea: separate the application from the service, and the service from the storage. In practice, that means:

- A note‑taking tool can publish selected notes into a federated network without giving up ownership of the underlying data.
- A calendar, mail client, or task manager can operate across services instead of being welded to one provider.

On the political side, Europe has been talking more openly about “digital sovereignty”: the desire to reduce structural dependence on a handful of non‑European platforms and to ensure that European values—privacy, competition, openness—are reflected in digital infrastructure.[web:135][web:132] Regulations like the Digital Markets Act (DMA) and Digital Services Act (DSA) aim to rein in gatekeeper behaviour, require interoperability in some contexts, and create space for alternatives.[web:135][web:138] Policy proposals around European digital sovereignty emphasise open standards, open source, and portability as ways for governments and institutions to retain control and choice rather than being locked into a single vendor stack.[web:141][web:144]

The web’s decentralised DNA—URLs, open protocols, interoperability by design—naturally aligns with these goals.[web:53][web:29] Personal software built on a web‑native, federated stack can become a small but meaningful part of that broader movement: software that individuals truly own, that organisations can host themselves if they wish, and that can talk to other tools without elaborate bilateral contracts.

This does not mean every system should be federated or self‑hosted; moderation, cost, and complexity are real concerns.[web:24][web:21] But it does suggest that when we reach for new infrastructure, reaching for the web and for open protocols keeps more options open—for individuals _and_ for regions that care about their digital autonomy.

---

## Trade‑Offs and When Native Still Wins

Advocating for a web‑native future for personal software does not mean dismissing native platforms or pretending that the web is always the better choice. It is more useful to think in terms of fit.

Situations where a **web‑first, browser‑native** approach fits well:

- Tools that are primarily about **content, knowledge, or workflows** rather than heavy 3D graphics or high‑end games.
- Products where **reach, cost‑effectiveness, and easy updates** are central: documentation tools, personal organisers, small CRMs, publishing platforms.[web:133][web:136][web:143]
- Scenarios where **data ownership and longevity** matter more than deep OS integration: note‑taking, journalling, long‑term knowledge management.[web:19][file:87]

Situations where **native UI (with shared business logic)** is often the better baseline:

- Highly polished, **mobile‑first consumer apps** where scroll performance, gestures, and micro‑interactions are central to the brand.
- Apps that depend on **low‑level access** to sensors, system services, or background execution that is not yet comfortable or consistent on the web.[web:25][web:20]
- Cases where app‑store presence, tight OS integration, or platform‑specific design patterns are themselves part of the product’s promise.

There is also a middle path: sharing business logic via technologies like Kotlin Multiplatform while building separate native and web front‑ends where it makes sense.[web:56] That approach keeps the domain model coherent across platforms without forcing every surface into the same technical box.

For personal and productivity software, the combination of a web‑native UI, local‑first data, and optional native shells often hits a sweet spot: one expressive surface, portable across devices, with the ability to deepen integration where real‑world constraints demand it.

---

## A Platform for Taste

In _About Personal Software_, I suggested that as AI takes over more of the mechanical work of programming, humans will increasingly act as tastemakers: setting direction, judging quality, and refining experiences instead of wiring every connection by hand.[file:87] For that shift to be meaningful, those tastemakers need a platform that is:

- Open enough to avoid locking their work into one vendor or ecosystem.
- Resilient enough to survive connectivity issues and platform shifts.
- Expressive enough to carry identity, nuance, and taste.

A web‑native, local‑first, federated stack is my answer to that need—for a particular class of software. It treats the browser as the default home for personal and productivity tools, uses local storage and background sync to keep them trustworthy, and leans on open protocols to keep them connected without being captive.[file:60][web:19][web:29]

Native platforms are not going away, and for many purposes they should not. But for the tools that sit closest to our thinking—the notebooks, dashboards, and workspaces that quietly shape our days—the web already feels like their rightful native land.

The rest, as ever, is craft.

---

[^tauri]: Tauri 2.0, https://v2.tauri.app/

[^businessinsider]: Business Insider, “Zuckerberg: This Is ‘The Biggest Strategic Mistake We’ve Ever Made’”, 2012, https://www.businessinsider.com/mark-zuckerberg-html5-mobile-2012-9

[^venturebeat]: VentureBeat, “Why LinkedIn dumped HTML5 & went native for its mobile apps”, 2013, https://venturebeat.com/technology/linkedin-mobile-web-breakup/

[^mdn-offline]: MDN, "Offline and background operation", https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Offline_and_background_operation

[^caniuse-push]: Can I Use, “Push API”, https://caniuse.com/push-api

[^mdn-push]: MDN, "Push API", https://developer.mozilla.org/en-US/docs/Web/API/Push_API
