---
title: The Future Of The Web Ought To Be Native
description: How a web-native, local-first, federated stack can transform the concept of personal software into a practical reality for certain types of applications.
date: 2026-01-30
status: Draft
---

At the end of 2025, I wrote _[About Personal Software](/writing/about-personal-software)_, in which I explored how human taste and identity dictate quality in an <abbr title="Artificial Intelligence">AI</abbr>-driven landscape and sketched a personal vision for the future of software development. This post builds on the philosophical groundwork laid in that one.

Since then, I have rediscovered Tauri[^tauri] and used it to iterate on cross-platform prototypes with a single web-first codebase. This process has clarified my vision: web primitives are now sufficient in many areas, making the browser a more democratic home for personal software than app stores.

Throughout January, I researched and refined this vision into a simple statement: **the future of the web ought to be native**. Not that every app should be a WebView, but that the browser, extended with local‑first data and federated protocols, can serve as a resilient platform for personal and productivity software.

---

## Personal Software Demands Web Resilience

In _[About Personal Software](/writing/about-personal-software)_, I argued that as AI collapses the cost and complexity of writing functional code, taste (and, to a certain extent, identity) becomes the key differentiator. But taste cannot flourish on a brittle foundation. Personal software needs a resilient medium that:

- Preserves its identity across platforms and devices.
- Survives connectivity issues and platform changes.
- Avoids locking people and data into vendor silos.

A web-first codebase treats the browser as a resilient medium. It provides a consistent experience rather than becoming fragmented across native stacks. When deeper integration is required, a native shell such as Tauri or Electron can be used to wrap and offer access to native <abbr title="Application Programming Interfaces">APIs</abbr>, with the core remaining web-first.

This is not a new idea. A decade ago, both Facebook and LinkedIn attempted to develop web codebases for mobile platforms. Facebook labelled its <abbr title="HyperText Markup Language">HTML</abbr> mobile strategy a mistake[^businessinsider], while LinkedIn moved away from HTML clients due to performance issues[^venturebeat]. Their public reversals taught engineers that:

- A single web codebase did not magically erase differences in performance, release cadence, and API support across platforms.
- For animation-heavy, brand-critical consumer apps, native code still had the edge when it came to performance and user experience.
- Many deep capabilities were exposed to native code first on mobile platforms, and some web APIs only arrived later or with tighter platform constraints.

Since those early experiments, the web itself has matured. (Progressive) web applications now offer installation[^mdn-workers], offline support[^mdn-offline], push notifications[^caniuse-push][^mdn-push] and deeper device integration across major browsers. The ecosystem of tools for building web-first apps has also grown and improved significantly.

The difference today is not that the web has no drawbacks, but that the trade-offs increasingly favour a web-first approach for personal and productivity tools. Native shells not only extend into the desktop, but also offer the chance to turn the web into a decentralised operating system by design.

---

## The Web As A Decentralised Operating System

For the browser to serve as the _"kernel"_ for personal software, designers and engineers need to leverage its native capabilities and build on them, rather than trying to work around them. The web offers a wealth of tools that can be used to develop resilient applications:

- **Offline resilience** via Service Workers[^mdn-workers], which can cache content and handle requests even when the network might be unavailable.
- **Local data storage** through technologies like IndexedDB[^mdn-indexeddb], enabling applications to keep data on the device instead of on a remote server.
- **Peer‑to‑peer communication** using WebRTC[^mdn-webrtc], allowing browsers to connect (directly) to each other where network conditions permit.

HTML and <abbr title="Cascading Style Sheets">CSS</abbr>, two of the most widely recognised interface languages, have become expressive enough to fulfil the demands of modern application design. Container queries[^mdn-container], modern layout systems[^mdn-grid] and view transitions[^mdn-transitions] enable designers to express complex identity and motion without heavy frameworks.

When combined with guidelines such as <abbr title="Web Content Accessibility Guidelines">WCAG</abbr>[^wcag], semantic HTML and native controls can encode accessibility best practices in the structure of the page. This provides a baseline of inclusion that many bespoke native stacks might struggle to match appropriately.

This combination makes it a plausible foundation for a decentralised operating system. The web's open standards and interoperability also align with the broader goals of digital sovereignty and user empowerment, which are becoming increasingly important in the current landscape.

Nevertheless, as with every approach, there are limitations to consider when using the web as a platform for personal software. In some cases, a native shell such as Tauri or Electron may be required to provide access to features that are not yet fully supported or performant in the browser. For example:

- Mobile browsers, especially on iOS, still limit what web apps can do in the background and how much data they can store.

- New capabilities such as Bluetooth, <abbr title="Near Field Communication">NFC</abbr>, and <abbr title="Universal Serial Bus">USB</abbr> are arriving through initiatives like Google’s “Project Fugu”[^chrome], but their support varies.

A realistic vision of the web as a decentralised operating system must acknowledge two truths: the browser is open and interoperable by design, yet many of its most powerful capabilities are subject to the policies, priorities and incentives of a small number of browser vendors.

---

## Local‑First As An Extension Of Mind

In the earlier essay, I described personal software as an extension of the mind — tools that fit so well that they become part of one’s thought process. For this to be the case, the software must be trustworthy. It must still be accessible when the network drops out. It should keep a person’s work close at hand.

Researchers at Ink & Switch defined that ideal under the term "local‑first software" in an elaboratice essay, where they outlined the critera of local-first[^inkandswith]. Since then, the local‑first movement[^lofi] has gained traction among developers and users who value:

- **Ownership**: Rather than being locked into a server owned by a third party or vendor, data is stored locally and under the user’s control.
- **Resilience**: The application remains functional without a network connection and data is not lost if the service is interrupted or discontinued.
- **Collaboration**: Multiple users can work on the same data independently, merging their changes without conflict even if they are offline at times.

Techniques such as conflict-free replicated data types (CRDTs) enable multiple copies of the same data to evolve independently and converge without conflict upon reconnection, even after extended periods offline, making this final point possible.

Although the mathematics behind this is subtle, the effect is simple: people can edit their notes, drawings or plans whenever inspiration strikes, without having to wait for a server to acknowledge each change. The system can then reconcile these changes to create a consistent shared state.

When viewing the web through the lens of a decentralised operating system, the concept of local-first thinking naturally aligns with the capabilities of the browser. This approach offers a resilient and trustworthy extension of the mind through proven technologies:

- IndexedDB and similar APIs keep data structured and close.
- Service Workers provide offline caching and background synchronisation.
- Web‑native UI retains the same appearance from desktop to tablet to phone.

Full local-first collaboration, particularly in partially trusted environments, requires careful design. However, for tools such as notes, journals, knowledge bases and small team planners, local-first patterns combined with web technologies provide a robust and seamless experience.

---

## Federation, Interoperability, and European Sovereignty

Resilient tools on a single device are only half of the story. Personal software also lives in a social and institutional world: it shares data, synchronises across services, and exists alongside broader debates about who controls the digital infrastructure we all depend on.

On the technical side, the web already has blueprints for decentralised interaction:

- **ActivityPub**, a <abbr title="World Wide Web Consortium">W3C</abbr> Recommendation, defines a protocol for decentralised social networking where independent servers exchange posts and actions in a standard format.[web:29][web:21]
- **Matrix** provides a federated protocol for messaging, used by both communities and public institutions.
- **Solid**, led by Tim Berners‑Lee, proposes personal data “pods” that individuals control, which applications can access with permission instead of each app building its own silo.[web:51][web:57]

These efforts share a simple idea: separate the application from the service, and the service from the storage. In practice, that means:

- A note‑taking tool can publish selected notes into a federated network without giving up ownership of the underlying data.
- A calendar, mail client, or task manager can operate across services instead of being welded to one provider.

On the political side, Europe has been talking more openly about “digital sovereignty”: the desire to reduce structural dependence on a handful of non‑European platforms and to ensure that European values—privacy, competition, openness—are reflected in digital infrastructure.[web:135][web:132] Regulations like the Digital Markets Act (<abbr title="Digital Markets Act">DMA</abbr>) and Digital Services Act (<abbr title="Digital Services Act">DSA</abbr>) aim to rein in gatekeeper behaviour, require interoperability in some contexts, and create space for alternatives.[web:135][web:138] Policy proposals around European digital sovereignty emphasise open standards, open source, and portability as ways for governments and institutions to retain control and choice rather than being locked into a single vendor stack.[web:141][web:144]

The web’s decentralised DNA—<abbr title="Uniform Resource Locators">URLs</abbr>, open protocols, interoperability by design—naturally aligns with these goals.[web:53][web:29] Personal software built on a web‑native, federated stack can become a small but meaningful part of that broader movement: software that individuals truly own, that organisations can host themselves if they wish, and that can talk to other tools without elaborate bilateral contracts.

This does not mean every system should be federated or self‑hosted; moderation, cost, and complexity are real concerns.[web:24][web:21] But it does suggest that when we reach for new infrastructure, reaching for the web and for open protocols keeps more options open—for individuals _and_ for regions that care about their digital autonomy.

---

## Trade‑Offs and When Native Still Wins

Advocating for a web‑native future for personal software does not mean dismissing native platforms or pretending that the web is always the better choice. It is more useful to think in terms of fit.

Situations where a **web‑first, browser‑native** approach fits well:

- Tools that are primarily about **content, knowledge, or workflows** rather than heavy <abbr title="Three-Dimensional">3D</abbr> graphics or high‑end games.
- Products where **reach, cost‑effectiveness, and easy updates** are central: documentation tools, personal organisers, small <abbr title="Customer Relationship Management">CRMs</abbr>, publishing platforms.[web:133][web:136][web:143]
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

[^businessinsider]: Business Insider, “Zuckerberg: This Is ‘The Biggest Strategic Mistake We’ve Ever Made’”, 2012, https://www.businessinsider.com/mark-zuckerberg-html5-mobile-2012-9

[^caniuse-push]: Can I Use, “Push API”, https://caniuse.com/push-api

[^mdn-container]: MDN, "Container Queries", https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Container_Queries

[^mdn-grid]: MDN, "CSS Grid Layout", https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout

[^mdn-indexeddb]: MDN, "IndexedDB API", https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API

[^mdn-offline]: MDN, "Offline and background operation", https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Offline_and_background_operation

[^mdn-push]: MDN, "Push API", https://developer.mozilla.org/en-US/docs/Web/API/Push_API

[^mdn-transitions]: MDN, "View Transitions API", https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API

[^mdn-webrtc]: MDN, "WebRTC API", https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API

[^mdn-workers]: MDN, "Service Workers API", https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API

[^tauri]: Tauri 2.0, https://v2.tauri.app/

[^venturebeat]: VentureBeat, “Why LinkedIn dumped HTML5 & went native for its mobile apps”, 2013, https://venturebeat.com/technology/linkedin-mobile-web-breakup/

[^wcag]: W3C, "WCAG 2 Overview", https://www.w3.org/WAI/standards-guidelines/wcag/

[^chrome]: Chrome for Developers, "Project Fugu", https://developer.chrome.com/docs/capabilities

[^lofi]: Local-First Software, https://lofi.so/

[^inkandswith]: Ink & Switch, "Local-first software", https://www.inkandswitch.com/essay/local-first/

## Notes
- consider example software such as excalidraw, obsidian, notion, figma, linear, trello, etc. and how they would fit into this vision