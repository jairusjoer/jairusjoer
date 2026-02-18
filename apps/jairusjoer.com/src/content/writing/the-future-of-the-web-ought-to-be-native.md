---
title: The Future Of The Web Ought To Be Native
description: How a web-native, local-first, federated stack can transform the concept of personal software into a practical reality for certain types of software.
date: 2026-01-30
status: Draft
---

At the end of 2025, I wrote _[About Personal Software](/writing/about-personal-software)_, in which I explored how human taste and identity dictate quality in an <abbr title="Artificial Intelligence">AI</abbr>-driven landscape and sketched a personal vision for the future of software development. This post builds on the philosophical groundwork laid in that one.

Since then, I have rediscovered Tauri[^tauri] and used it to iterate on cross-platform prototypes with a single web-native codebase. This process has clarified my vision: web primitives are now sufficient in many areas, making the browser a more democratic home for software than app stores.

Throughout January, I researched and refined this vision into a simple statement: **the future of the web ought to be native**. Not that every app should be a WebView, but that the browser, extended with local‑first data and federated protocols, can serve as a resilient platform for personal and productivity software.

---

## Software Demands Web Resilience

In _[About Personal Software](/writing/about-personal-software)_, I argued that as AI collapses the cost and complexity of writing functional code, taste (and, to a certain extent, identity) becomes the key differentiator. But taste cannot flourish on a brittle foundation. Software needs a resilient medium that:

- Preserves its identity across platforms and devices.
- Survives connectivity issues and platform changes.
- Avoids locking people and data into vendor silos.

A web-native codebase treats the browser as a resilient medium. It provides a consistent experience rather than becoming fragmented across native stacks. When deeper integration is required, a native shell such as Tauri or Electron can be used to wrap and offer access to native <abbr title="Application Programming Interfaces">APIs</abbr>, with the core remaining web-native.

This is not a new idea. A decade ago, both Facebook and LinkedIn attempted to develop web codebases for mobile platforms. Facebook labelled its <abbr title="HyperText Markup Language">HTML</abbr> mobile strategy a mistake[^businessinsider], while LinkedIn moved away from HTML clients due to performance issues[^venturebeat]. Their public reversals taught engineers that:

- A single web codebase did not magically erase differences in performance, release cadence, and API support across platforms.
- For animation-heavy, brand-critical consumer software, native code still had the edge when it came to performance and user experience.
- Many deep capabilities were exposed to native code first on mobile platforms, and some web APIs only arrived later or with tighter platform constraints.

Since those early experiments, the web itself has matured. (Progressive) web applications now offer installation[^mdn-workers], offline support[^mdn-offline], push notifications[^caniuse-push][^mdn-push] and deeper device integration across major browsers. The ecosystem of tools for building web-native software has also grown and improved significantly.

The difference today is not that the web has no drawbacks, but that the trade-offs increasingly favour a web-native approach for personal and productivity software. Native shells not only extend into the desktop, but also offer the chance to turn the web into a decentralised operating system by design.

---

## The Web As A Decentralised Operating System

For the browser to serve as the _"kernel"_ for software, designers and engineers need to leverage its native capabilities and build on them, rather than trying to work around them. The web offers a wealth of tools that can be used to develop resilient software:

- **Offline resilience** via Service Workers[^mdn-workers], which can cache content and handle requests even when the network might be unavailable.
- **Local data storage** through technologies like IndexedDB[^mdn-indexeddb], enabling software to keep data on the device instead of on a remote server.
- **Peer‑to‑peer communication** using WebRTC[^mdn-webrtc], allowing browsers to connect (directly) to each other where network conditions permit.

HTML and <abbr title="Cascading Style Sheets">CSS</abbr>, two of the most widely recognised interface languages, have become expressive enough to fulfil the demands of modern software design. Container queries[^mdn-container], modern layout systems[^mdn-grid] and view transitions[^mdn-transitions] enable designers to express complex identity and motion without heavy frameworks.

When combined with guidelines such as <abbr title="Web Content Accessibility Guidelines">WCAG</abbr>[^wcag], semantic HTML and native controls can encode accessibility best practices in the structure of the page. This provides a baseline of inclusion that many bespoke native stacks might struggle to match appropriately.

This combination makes it a plausible foundation for a decentralised operating system. The web's open standards and interoperability also align with the broader goals of digital sovereignty and user empowerment, which are becoming increasingly important in the current landscape.

Nevertheless, as with every approach, there are limitations to consider when using the web as a platform for software. In some cases, a native shell such as Tauri or Electron may be required to provide access to features that are not yet fully supported or performant in the browser. For example:

- Mobile browsers, especially on iOS, still limit what web applications can do in the background and how much data they can store.

- New capabilities such as Bluetooth, <abbr title="Near Field Communication">NFC</abbr>, and <abbr title="Universal Serial Bus">USB</abbr> are arriving through initiatives like Google’s “Project Fugu”[^chrome], but their support varies.

A realistic vision of the web as a decentralised operating system must acknowledge two truths: the browser is open and interoperable by design, yet many of its most powerful capabilities are subject to the policies, priorities and incentives of a small number of browser vendors.

---

## Local‑First As An Extension Of Mind

In the earlier essay, I described (personal) software as an extension of the mind — tools that fit so well that they become part of one’s thought process. For this to be the case, the software must be trustworthy. It must still be accessible when the network drops out. It should keep a person’s work close at hand.

Researchers at Ink & Switch defined that ideal under the term "local‑first software" in an elaboratice essay, where they outlined the critera of local-first[^inkandswith]. Since then, the local‑first movement[^lofi] has gained traction among developers and users who value:

- **Ownership**: Rather than being locked into a server owned by a third party or vendor, data is stored locally and under the user’s control.
- **Resilience**: The software remains functional without a network connection and data is not lost if the service is interrupted or discontinued.
- **Collaboration**: Multiple users can work on the same data independently, merging their changes without conflict even if they are offline at times.

Techniques such as conflict-free replicated data types (CRDTs) enable multiple copies of the same data to evolve independently and converge without conflict upon reconnection, even after extended periods offline, making this final point possible.

Although the mathematics behind this is subtle, the effect is simple: people can edit their notes, drawings or plans whenever inspiration strikes, without having to wait for a server to acknowledge each change. The system can then reconcile these changes to create a consistent shared state.

When viewing the web through the lens of a decentralised operating system, the concept of local-first thinking naturally aligns with the capabilities of the browser. This approach offers a resilient and trustworthy extension of the mind through proven technologies:

- IndexedDB and similar APIs keep data structured and close.
- Service Workers provide offline caching and background synchronisation.
- Web‑native UI retains the same appearance from desktop to tablet to phone.

Full local-first collaboration, particularly in partially trusted environments, requires careful design. However, for software such as notes, journals, knowledge bases and small team planners, local-first patterns combined with web technologies provide a robust and seamless experience.

---

## Federation, Interoperability, And Sovereignty

Having resilient software on a single device is only half the story. Software exists within a social and institutional context, sharing data, synchronising across services and contributing to wider discussions about who controls the digital infrastructure. In practice, these discussions have produced new blueprints for a federated web:

- **ActivityPub**, a <abbr title="World Wide Web Consortium">W3C</abbr> Recommendation, defines a protocol for decentralised social networking where independent servers exchange posts and actions.
- **Matrix** provides "an open network for secure, decentralised communication"[^matrix], used by both communities and public institutions.
- **Solid**, led by Tim Berners‑Lee, proposes personal data pods that individuals control and grant acces to for software to consume and interact with.

These efforts are based on a simple idea: separating the software from the service and the service from the storage. Rather than tying each software to a single provider's backend, federation allows the same data to flow across independently operated services while maintaining ownership with the user:

- A calendar, mail client, or task manager can operate across services instead of being tied to one provider.
- A note‑taking software can publish selected notes into a federated network without giving up ownership of the underlying data.
- A collaborative whiteboard can sync state between participants on different servers, with no single point of failure dictating availability.

Politically, Europe’s push for digital sovereignty is contributing to this vision. Regulations such as the Digital Markets Act and the Digital Services Act target anti-competitive behaviour and require systems to be interoperable. Meanwhile, broader policy efforts emphasise open standards, open-source software and portability.

The web's decentralised nature — URLs, open protocols and interoperability by design — aligns naturally with these goals. Software built on a web-native, federated stack is part of this movement. It is software that individuals own and organisations can self-host, which also interoperates without bilateral contracts.

This does not mean that every system should be federated or self-hosted. Moderation, cost and complexity are all valid concerns. However, when we adopt new infrastructure, opting for the web and open protocols preserves more options for individuals and regions that prioritise digital autonomy.

---

## Trade‑Offs and When Native Still Wins

Advocating for a web-native future for software does not mean dismissing native platforms or assuming that the web is always the better option. Every medium has its strengths, and the most honest approach is to recognise where each one excels. For web-native software, the sweet spot is often found in:

- Tools that are primarily about **content, knowledge, or workflows** rather than heavy utilization of (real-time) rendering or graphics.
- Products where **reach, cost‑effectiveness, and easy updates** are central: documentation tools, personal organisers, small <abbr title="Customer Relationship Management">CRMs</abbr>, publishing platforms.
- Scenarios where **data ownership and longevity** matter more than deep integration: note‑taking, journalling, long‑term knowledge management.

Conversely, there are situations in which a native user interface is the better starting point. In these cases, although shared business logic across platforms can reduce duplication, the presentation layer benefits from being built natively rather than being forced to adopt a web-native approach:

- Highly polished, mobile‑first consumer applications where scroll performance, gestures, and micro‑interactions are central to the identity.
- Software that depend on low‑level access to sensors, system services, or background execution that is not yet comfortable or consistent on the web.
- Cases where app‑store presence, deep integration, or platform‑specific design patterns are themselves part of the product’s promise.

Another option is to share business logic via technologies like Kotlin Multiplatform, while building separate native and web front-ends where appropriate. This approach maintains a coherent domain model across platforms without forcing everything into the same technical framework.

When it comes to personal and productivity software, the combination of a web-native UI, locally stored data and optional native shells might strike the right balance: a single, expressive interface that can be used on multiple devices, with the option of deeper integration where real-world constraints demand it.

---

## A Platform for Taste

Returning to the beginning, in _[About Personal Software](/writing/about-personal-software)_, I argued that, as AI reduces the cost and complexity of writing functional code, humans will increasingly act as tastemakers, setting direction, judging quality, and refining experiences. For this change to be significant, these tastemakers need a reslient platform.

- Open enough to avoid locking their work into one vendor or ecosystem.
- Resilient enough to survive connectivity issues and platform shifts.
- Expressive enough to carry identity, nuance, and taste.

For a particular class of software, my answer is a web-native, local-first, federated stack. It treats the browser as the default home for personal and productivity software, uses local databases and background sync for reliability, and relies on open protocols to maintain connectivity without restricting users.

Native platforms are not going away, nor should they, as they serve many purposes. However, when it comes to the tools that are closest to our way of thinking — the notebooks, dashboards and workspaces that quietly shape our days — the web already feels like their natural home, and this is likely to continue.

---

**See you all in the next issue**<br/>
_Yours truly, Jairus Joer_

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

[^matrix]: Matrix, https://matrix.org/
