---
title: The Future Of The Web Ought To Be Native
date: 2026-01-30
status: 'Draft'
---

In the summer of 2025, I wrote why _[The Future Of The Web Might Be Native](/archive/aggregata/the-future-of-the-web-might-be-native)_, and shared my initial thoughts on existing and emerging native capabilities for user interfaces in web browsers, and how these capabilities provide a sane and accessible solution for complex features by default.

My advocacy for the web as a decentralised operating system continues through my most recent endeavours, and has recently been reinforced through an ongoing side project in which I explore the elusive scenario of **_one codebase to rule them all_** through web-first cross-platform applications.

Although I was already familiar with [Electron](https://www.electronjs.org/) and the native WebView capabilities of operating systems independently of each other, I had yet to discover how to leverage the latter through a unified interface like the former without shipping a self-contained browser runtime.

I was also aware of successful cross-platform projects like [BlueSky](https://github.com/bluesky-social/social-app), which uses [React Native](https://reactnative.dev/) paired with [Expo](https://expo.dev/) to create native applications. I explored this project over a weekend or two. While impressive in itself, it did not satisfy my search for a web-first paradigm.

Enter [Tauri](https://tauri.app/), which I rediscovered after first encountering it in Beta prior to its 2022 release. Unlike [Electron](https://www.electronjs.org/), Tauri leverages the native WebView capabilities of an operating system, eliminating the need to bundle a browser runtime while still allowing the web to drive the development experience.

Throughout January, I conducted iterative research and prototyping to gain a clearer perspective on my vision to date by exploring and experimenting. The outcome of this process is a vision that I wish to share in this post: that **_the future of the web ought to be native_**.

---

## The Web As A Decentralised Operating System

The concept of decentralised operating systems dates back to the Cold War era, when ARPANET was designed to survive the destruction of individual nodes. This foundational principle has since evolved through distributed file systems, peer-to-peer networks, and federated protocols like [ActivityPub](https://www.w3.org/TR/activitypub/) and [Matrix](https://matrix.org/).

What makes the modern web uniquely suited to this vision is the browser itself. With [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API), [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API), and emerging hardware APIs, it has matured from a document viewer into the kernel of a decentralised operating system — one that requires no installation, is vendor-neutral, and is accessible to anyone.

## Personal Software In The Context Of The Web

In my previous post _[About Personal Software](/writing/about-personal-software#user-content-fn-1)_, I discussed how my view of the web as a decentralised operating system influences my perception of personal software. By developing a vision for the latter, I have gained a clearer understanding of both concepts and their relationship with each other.

- Reference and check for inconsistencies [About Personal Software](/writing/about-personal-software)

---

---

## Key issues and questions to resolve upfront

1. **Central thesis clarity**
   - Right now there are several big ideas: “web as platform,” local‑first, federation, Tauri, PWAs, cross‑platform dev.
   - Suggest distilling to a single sentence you can repeat: e.g.
     **“Treat the browser as the primary runtime for local‑first, federated applications, with native shells as optional distribution layers.”**
   - Then ensure each section either:
     - Diagnoses why current practice falls short of this, or
     - Shows how your stack/architecture moves toward it.

2. **Audience and depth**
   - The outline assumes:
     - Comfort with things like CRDTs, WebRTC, ActivityPub.
   - If this is for “advanced web devs,” you can keep the current level, but consider:
     - Adding one motivating, concrete app type (e.g. a note‑taking / knowledge management app, or a group chat app) and carry it through as an example. That will help ground local‑first + federation + PWA trade‑offs.

3. **Avoiding the “native bad, web good” vibe**
   - Phrases like “Native Fallacy” and framing SaaS/native only as “single point of failure” risk straw‑manning. There are real benefits to native apps: hardware access, offline robustness in hostile mobile OSes, performance for specific workloads, and app‑store discoverability.
   - Suggest:
     - Reframing to “The Native Assumption” rather than “Fallacy.”
     - Explicitly calling out domains where native still wins (or at least is currently necessary).

4. **“Browser as kernel of a decentralised OS”**
   - This is a compelling metaphor, but fragile if you ignore:
     - Vendor power (Apple’s WebKit requirement and PWA limitations on iOS, Chrome’s de‑facto standard‑setting power). [vinova](https://vinova.sg/navigating-safari-ios-pwa-limitations/)
   - You can keep the metaphor if you:
     - Acknowledge that the “kernel” is controlled by a handful of vendors.
     - Bring in Mozilla/W3C as institutions arguing that open standards and interoperability are the way to mitigate that. [assets.publishing.service.gov](https://assets.publishing.service.gov.uk/media/63e22fa1d3bf7f172f6ce872/Mozilla.pdf)

5. **Ambition vs practicality of local‑first + federation**
   - Ink & Switch, Kleppmann, and others repeatedly stress that fully local‑first + fully decentralized is still research‑grade, and most production systems implement only a subset of these ideals. [inkandswitch](https://www.inkandswitch.com/essay/local-first/)
   - To keep the post honest:
     - Emphasize that you’re describing a direction and design sensibility, not a turnkey recipe.
     - Point to specific hard problems (Byzantine behavior, identity, abuse/misuse, key management, etc.).

With that groundwork, here’s a section‑by‑section critique.

---

## Contention

### “The Fragmentation Trap”

**Strengths:**

- Framing “WebView stacks vs shipping a runtime” is relatable: Cordova/Ionic, React Native, Electron, Tauri, etc.
- You can concretely show:
  - WebView inconsistency across Android OEMs, iOS versions, and platform quirks. [ionic](https://ionic.io/blog/limitations-with-ios-and-android-web-views)

**Add nuance:**

- Acknowledge that:
  - Electron‑style bundling does solve WebView fragmentation at the cost of large footprints and higher resource usage. [tibicle](https://tibicle.com/blog/electron-vs-native-which-is-better-for-your-next-desktop-app)
  - Native WebViews are used successfully at scale (Apple, Amazon, Netflix) when properly managed. [ionic](https://ionic.io/blog/limitations-with-ios-and-android-web-views)
- Suggest framing as:
  **“Each ‘cross‑platform’ strategy picks a failure mode: footprint and security (Electron), vendor fragmentation (raw WebViews), or feature gaps (PWAs on iOS).”**

### “The Native Fallacy”

**Strengths:**

- Good place to question cargo‑cult “native for everything” thinking.
- You can invoke “performance where it matters vs reach where it matters.”

**Risks and adjustments:**

- Avoid dismissing native performance as mere premature optimization.
- Instead:
  - List workloads where native is genuinely important (graphics‑heavy apps, AR, advanced background tasks, deep hardware integration).
  - Contrast with many business/productivity apps where Electron or PWA performance is “good enough” and cross‑platform reach dominates. [tibicle](https://tibicle.com/blog/electron-vs-native-which-is-better-for-your-next-desktop-app)

**Citation ideas:**

- Electron vs native trade‑off analysis (business vs performance). [tibicle](https://tibicle.com/blog/electron-vs-native-which-is-better-for-your-next-desktop-app)
- Mozilla’s arguments that open standards and interoperability reduce lock‑in but do not remove the need for native APIs in some cases. [assets.publishing.service.gov](https://assets.publishing.service.gov.uk/media/63e22fa1d3bf7f172f6ce872/Mozilla.pdf)

### “Tauri as Catalyst” / “Web First, Install Optionally”

**Strengths:**

- Tauri is a nice narrative hook: smaller binaries, security focus, browser‑like UI stack backed by Rust. [w3resource](https://www.w3resource.com/rust-tutorial/build-cross-platform-apps-tauri.php)
- “Web first, install optionally” is a crisp, memorable phrase.

**Nuance / suggestions:**

- Present Tauri as one viable manifestation of the philosophy, not the end‑state:
  - Show that it still embeds a web UI and ships its own runtime, but does so with security and footprint improvements over Electron. [chadura](https://chadura.com/blogs/building-cross-platform-desktop-apps-with-rust-and-tauri-a-step-by-step-guide/)
- Acknowledge places where installable apps still matter:
  - Offline‑critical workflows on mobile.
  - App‑store discovery and OS‑level trust signals (permissions, reviews).
- You can then cleanly pivot:
  - “The web is the canonical interface and data model; installed shells (Tauri, app stores, native wrappers) are distribution and integration options.”

---

## Native Web Capabilities

### “Static First, Interactive Second”

**Strengths:**

- Aligns with modern “islands architecture” and partial hydration trends.
- You can contrast this with full SPA shells that ship JSX for every pixel.

**Nuance:**

- Acknowledge trade‑offs:
  - Increased complexity of build/deployment pipelines.
  - Some app types (rich editors, canvas‑heavy apps) are essentially thick clients where “static first” is less meaningful.

### “Vanilla CSS & Native APIs”

**Strengths:**

- Good opportunity to mention:
  - Container queries, new layout primitives, modern color functions.
  - HTML dialog, popover, details/summary, etc.

**Nuance and citations:**

- Stress that relying on platform features increases dependence on browser vendors’ implementation quality.
  - Mozilla explicitly calls out web compatibility and deviation from standards by dominant vendors as a centralization risk. [assets.publishing.service.gov](https://assets.publishing.service.gov.uk/media/63e22fa1d3bf7f172f6ce872/Mozilla.pdf)
- This supports your later federation/interoperability argument: standards only help if vendors implement them faithfully. [mozilla](https://www.mozilla.org/en-US/about/manifesto/)

### “Progressive Enhancement”

**Strengths:**

- Perfect place to connect:
  - Local‑first responsiveness (work offline, low latency) with progressive enhancement ideals. [martin.kleppmann](https://martin.kleppmann.com/papers/local-first.pdf)

**Nuance:**

- Admit that:
  - Building robust “no‑JS” fallbacks is expensive and not always warranted (e.g. intranet tools, highly specialized B2B apps).
- Suggest framing as:
  - “Design for graceful degradation and partial failure (network, JS, storage) in proportion to the risk and scale of your product.”

### “Browser as Runtime / Kernel”

**Strengths:**

- This is your conceptual pivot to “Web OS.”

**Nuance and critical points:**

- Acknowledge:
  - PWAs are still significantly constrained on iOS: limited offline storage, aggressive eviction of service worker caches, restricted background execution, limited push, and EU‑specific PWA removal from the home screen with iOS 17.4. [tigren](https://www.tigren.com/blog/progressive-web-app-limitations/)
  - These constraints directly undercut the “browser as universal kernel” narrative on one of the most important platforms.

**How to frame it:**

- Rather than stating “the browser is the kernel,” say:
  - “The browser is _trying_ to be the kernel of a cross‑vendor OS, but regulatory, economic, and technical realities keep it partially hobbled. That’s why standards work (W3C, Mozilla’s advocacy, CMA actions) matters.” [w3](https://www.w3.org/TR/activitypub/)

---

## Web‑First vs Native

This section is clear and high‑impact; it just needs balanced trade‑offs.

### Distribution Models: App Stores vs URLs

- Add that:
  - App stores provide discovery, a payment rail, and perceived safety.
  - URLs provide open access, deep linking, and lower entry barriers.
- You can reference:
  - Mozilla’s comments to regulators about how choice architecture and API access restrictions limit browser competition and the capabilities of web apps on mobile. [assets.publishing.service.gov](https://assets.publishing.service.gov.uk/media/63e22fa1d3bf7f172f6ce872/Mozilla.pdf)

### Interoperability & Resilience

- Tie this to:
  - W3C’s ActivityPub Recommendation as an example of formalizing interoperable, federated protocols. [en.wikipedia](https://en.wikipedia.org/wiki/Fediverse)
  - The Fediverse Enhancement Proposals (FEP) ecosystem showing active community‑driven standardization around interoperability details. [socialhub.activitypub](https://socialhub.activitypub.rocks/c/standards/68)
- Nuance:
  - Federation moves the “single point of failure” but introduces coordination and moderation challenges (spam/abuse, governance, funding).

### Updates & “One Codebase Reality”

- Well‑chosen contrast (approval queues vs instant deploy).
- Add nuance:
  - Native stores sometimes act as quality gates and security review layers; web pushes can ship regressions instantly to everyone.
  - Electron/Tauri/React Native still need platform‑specific work for UX expectations, hardware quirks, and store guidelines; “one codebase” is more “one codebase plus targeted platform shims.” [stackoverflow](https://stackoverflow.com/questions/41341790/different-ui-for-android-ios-in-interpreted-js-cross-platform-tools)

---

## Local‑First & Offline‑First

This is one of the strongest, most differentiating parts of the outline.

### Data Ownership / Offline Resilience

- Anchor this section in Ink & Switch’s “Local‑first software: you own your data, in spite of the cloud” and subsequent work. [inkandswitch](https://www.inkandswitch.com/local-first-software/)
  - They define local‑first ideals: primary local copy, offline‑first interaction, background sync, strong privacy and long‑term preservation. [inkandswitch](https://www.inkandswitch.com/essay/local-first/)
- Add nuance:
  - PowerSync and others explicitly note that most real‑world “local‑first” implementations currently hit only a subset of these ideals (local DB + sync to a backend), not full decentralization. [docs.powersync](https://docs.powersync.com/resources/local-first-software)

### P2P & WebRTC; CRDTs & Sync

- For CRDTs:
  - Cite Kleppmann’s CRDT work: the JSON CRDT data type and later papers on interleaving anomalies and Byzantine behavior. [martin.kleppmann](https://martin.kleppmann.com/papers/bft-crdt-papoc22.pdf)
  - Note that:
    - CRDTs provide strong eventual consistency without central coordination.
    - But correctness and security in adversarial or partially trusted environments is an ongoing research problem, not “solved plumbing.” [pasksoftware](https://pasksoftware.com/crdts/)
- For WebRTC and P2P:
  - Point out:
    - NAT traversal, battery constraints, and privacy implications mean most “P2P” apps still depend on some form of relay or signaling infrastructure.
- Overall nuance:
  - “Local‑first + P2P + CRDTs” is not a free lunch; it trades operational central complexity for algorithmic complexity and non‑trivial threat models.

---

## Decentralisation Through Federation

This part nicely extends from local‑first (nodes) to network (federation).

### Network Layer & Open Protocols

- Ground “federation as missing piece” by:
  - Citing ActivityPub as a W3C Recommendation for decentralized social networking. [en.wikipedia](https://en.wikipedia.org/wiki/Fediverse)
  - Mentioning the Fediverse’s organic evolution and FEPs as evidence of a living standards ecosystem. [reb00ted](https://reb00ted.org/tech/20230325-w3c-activitypub-wishlist/)
- You can broaden to:
  - Matrix as an example of federated messaging with its own protocol and ecosystem.
  - SMTP as the original federated “universal messaging app.”

### Universal Client, Resilience & Sovereignty

- Connect this to:
  - Tim Berners‑Lee’s Solid project, which explicitly aims at user data pods and client choice over where and how data is stored. [verdict.co](https://www.verdict.co.uk/will-tim-berners-lee-inrup-work/)
- Nuance:
  - Solid’s limited adoption so far shows how hard it is to realign incentives and user habits, even when the tech is standards‑based and backed by Berners‑Lee. [engadget](https://www.engadget.com/2018-09-30-tim-berners-lee-solid-data-control.html?guccounter=1)
- That gives you a powerful “optimistic but realistic” tone:
  - “The tools and protocols exist; what’s missing are incentives, UX, and business models aligned with user sovereignty.”

---

## Technology Stack Section

The layered “Runtime → Local → Transport → Network” model is excellent and very teachable.

**Suggestions:**

- Consider naming it explicitly:
  - “A Web‑Native Stack for Local‑First, Federated Apps”
- For each layer, add one example of:
  - Capability: what it enables.
  - Limitation: what still requires native/centralized work.

Examples:

- **Layer 1 (Runtime):**
  - Capability: universal, sandboxed execution across OSes.
  - Limitation: access to sensors, background processing, platform APIs is still restricted, especially on iOS. [codewave](https://codewave.com/insights/progressive-web-apps-ios-limitations-status/)
- **Layer 2 (Local):**
  - Capability: IndexedDB + CRDTs for offline, low‑latency writes. [arxiv](https://arxiv.org/abs/1608.03960)
  - Limitation: storage quotas, eviction, and reliability issues on mobile Safari. [magicbell](https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide)
- **Layer 3/4 (Transport/Network):**
  - Capability: HTTP/2, WebSockets, WebRTC carrying ActivityPub/Matrix/etc. for federation. [socialhub.activitypub](https://socialhub.activitypub.rocks/c/standards/68)
  - Limitation: identity, abuse, and economic sustainability are human and institutional, not purely technical problems.

### Accessibility

- The claim that “standardisation and native capabilities naturally enforce better accessibility” needs softening.
  - HTML + ARIA + WCAG provide a solid baseline, and browsers implement many accessibility affordances. [mozilla](https://www.mozilla.org/en-US/about/manifesto/)
  - But:
    - Many web apps ignore them, and well‑built native apps can be extremely accessible.
- Suggest framing as:
  - “The standards stack (HTML semantics, ARIA, WCAG) _makes_ accessible experiences more reachable and consistent across devices, if developers choose to use them conscientiously.”

---

## Future & Roadmap

The bullets here are a bit abstract as written.

**To strengthen them:**

- **“Ecosystem Citizens” vs “Platform Clients”:**
  - Make this operational:
    - What does it mean for a product team to behave as an ecosystem citizen?
      - Implement open protocols.
      - Offer data export and import.
      - Provide self‑hosting / BYO‑backend options.
- **“Standardization Horizon / W3C’s role”:**
  - Cite:
    - ActivityPub as an example of how W3C can legitimize and stabilize a de‑facto ecosystem. [w3](https://www.w3.org/TR/activitypub/)
    - Ongoing Fediverse standardization conversations (FEPs) as community‑led work that may or may not become formal standards. [reb00ted](https://reb00ted.org/tech/20230325-w3c-activitypub-wishlist/)
  - This sets up a nice closing:
    - “The path forward lies in aligning browser vendors, standards bodies (W3C), and developers around interoperable, user‑centric primitives.”

Consider ending with a concrete call to action:

- For individual developers: pick one protocol or capability (ActivityPub, WebAuthn, Solid pods, or just robust offline support) to seriously integrate into your next project.
- For organizations: commit to at least one form of meaningful interoperability (standard export formats, federation endpoints, or self‑hosting options).

---

## How to tie it all neatly together

To keep the post cohesive and nuanced:

1. **Anchor it in a story**
   - Open with:
     - Fighting with WebViews and cross‑platform stacks.
     - Discovering Tauri as a better‑engineered version of “ship the browser.”
     - Realizing that the real win is: treat the web itself as primary, not just as a UI toolkit.

2. **Move from present pain → principles → architecture**
   - Contention: fragmentation and gatekeeping (stores, WebViews, SaaS).
   - Native Web Capabilities + Web‑First vs Native: “Here is what the web already offers, and where native still genuinely matters.”
   - Local‑First & Federation: “Here is how to align data ownership and resilience with that web‑first runtime.”
   - Technology Stack: “Here is a concrete mental model for building such systems.”

3. **Maintain a consistent “trade‑offs, not dogma” tone**
   - For each major claim, explicitly list:
     - Where this approach shines.
     - Where it is currently impractical or inferior to native/centralized alternatives (especially on iOS and in high‑performance domains). [tigren](https://www.tigren.com/blog/progressive-web-app-limitations/)
   - That will make the optimistic parts about federation, local‑first, and web‑first much more credible.

4. **Ground vision in real institutions and people**
   - Local‑first and CRDTs: Ink & Switch, Martin Kleppmann. [youtube](https://www.youtube.com/watch?v=PMVBuMK_pJY)
   - Decentralized data ownership: Tim Berners‑Lee and Solid / Inrupt. [en.wikipedia](<https://en.wikipedia.org/wiki/Solid_(web_decentralization_project)>)
   - Open web & interoperability: Mozilla Manifesto, Mozilla’s regulatory submissions, W3C ActivityPub. [en.wikipedia](https://en.wikipedia.org/wiki/Fediverse)
   - Cross‑platform runtimes: Electron vs native trade‑offs, Tauri’s security and footprint focus. [v1.tauri](https://v1.tauri.app)
