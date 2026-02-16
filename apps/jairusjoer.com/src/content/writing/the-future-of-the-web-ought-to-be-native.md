---
title: The Future Of The Web Ought To Be Native
date: 2026-01-30
status: 'Draft'
---

In the winter of 2025, I wrote _[About Personal Software](/writing/about-personal-software)_, exploring how **_taste_**, the trained instinct that elevates work from the merely functional to the exceptional, becomes the key differentiator as artificial intelligence commodifies software creation. That post laid the philosophical groundwork; this one extends it into the technical.

Since then, my advocacy for the web as a decentralised operating system has been reinforced through a side project in which I rediscovered [Tauri](https://v2.tauri.app/) and prototyped a cross-platform note-taking application — a single web-first codebase distributed to desktop and mobile through native shells. The experience clarified where the web's primitives already suffice and where they require augmentation.

Throughout January, I conducted iterative research and prototyping to gain a clearer perspective on this vision. The outcome is the thesis I wish to share in this post: that **_the future of the web ought to be native_**, that the browser, extended through local-first data ownership and federated protocols, is the kernel of a decentralised operating system for **_personal software_**.

---

## The Web As A Decentralised Operating System

The browser has matured from a document viewer into something closer to an operating system kernel. With [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) providing offline resilience, [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) enabling local data ownership, and federated protocols like [ActivityPub](https://www.w3.org/TR/activitypub/) and [Matrix](https://matrix.org/) connecting independent nodes, the web already supplies the primitives a decentralised operating system requires — without installation, without vendor lock-in, and accessible to anyone.

What makes this kernel uniquely suited to **_personal software_** is that its native capabilities are also the building blocks of tasteful interfaces. Elements like `<dialog>`, `<details>`, popovers, container queries, and [View Transitions](https://developer.chrome.com/docs/web-platform/view-transitions) allow creators to express identity through progressive enhancement rather than framework abstraction. A static-first approach that layers interactivity where it is needed respects both the user and the medium.

This foundation also provides an inherent accessibility baseline. Semantic HTML and browser-native controls carry [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/) conformance by default, ensuring that the tasteful experience extends to all users without additional effort. The caveat lies in vendor inconsistency — WebKit's dominance on iOS, for example, continues to gate capabilities behind a single implementation — but the trajectory is unmistakably towards convergence.

## Personal Software Demands Web Resilience

In _[About Personal Software](/writing/about-personal-software)_, I argued that **_taste_** is a context-aware attribute — a trained instinct, not a subjective preference — that elevates software from the merely competent to the exceptional. As artificial intelligence collapses the cost of producing functional code, this instinct becomes the primary differentiator. Yet taste alone is insufficient; it requires a medium resilient enough to preserve it across every context in which the software appears.

The conventional native assumption — separate codebases for each platform — undermines this preservation. Fragmentation dilutes **_identity_**; maintaining parity across iOS, Android, and desktop consumes resources that could otherwise be invested in the quality of the craft. Bundled runtimes like Electron solve reach at the expense of elegance, while SaaS models trade ownership for convenience, leaving users dependent on infrastructure they do not control.

A web-first approach inverts these trade-offs. A single codebase, rendered through the browser's native capabilities, ensures that the taste cultivated in a product is faithfully transmitted to every platform. Where the browser falls short — system-level integration, hardware access, offline guarantees beyond what Service Workers provide — a thin native shell like [Tauri](https://v2.tauri.app/) can bridge the gap without diluting the experience. This is the pattern my note-taking prototype validated: web-canonical, native-optional.

---

---

---

## Refined Outline

### Intro: From Taste to Technical Vision

My explorations since "About Personal Software" (Tauri rediscovery, cross-platform prototype) clarify the web-native path to craft exceptional, identity-reflecting apps in an AI-commoditized world.
Thesis: **The browser is the decentralized OS kernel for (local-first, federated) personal software**—tasteful, unified codebases extended optionally via native shells. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/46753802/eb451ddb-ea66-42bf-a544-9734eeaae5f5/about-personal-software.md)
Example thread: Note-taking app (offline CRDT edits → P2P federation).
Tease: Taste elevates commodity; web primitives enable it resiliently. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/46753802/1c46faad-e6f9-427d-99cd-1280b0101cd5/the-future-of-the-web-ought-to-be-native.md)

### Personal Software Demands Web Resilience

- Echo taste as contextual instinct (à la Graham/Kay): Needs ownership, interop amid AI scale. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/46753802/1c46faad-e6f9-427d-99cd-1280b0101cd5/the-future-of-the-web-ought-to-be-native.md)
- Why native assumption fails: Fragmentation (WebViews/Electron bloat); SaaS fragility. [tibicle](https://tibicle.com/blog/electron-vs-native-which-is-better-for-your-next-desktop-app)
- Web-first pros/cons table:

|                  | Pros                                                                                                                        | Cons                                                                                                                             |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Reach/Resilience | Universal, instant updates [tibicle](https://tibicle.com/blog/electron-vs-native-which-is-better-for-your-next-desktop-app) | iOS PWA limits (eviction/background) [vinova](https://vinova.sg/navigating-safari-ios-pwa-limitations/)                          |
| vs Native        | Taste-consistent UI                                                                                                         | Hardware/perf gaps (AR/sensors) [tibicle](https://tibicle.com/blog/electron-vs-native-which-is-better-for-your-next-desktop-app) |

Prototype hook: Tauri ships web taste to desktops without dilution. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/46753802/1c46faad-e6f9-427d-99cd-1280b0101cd5/the-future-of-the-web-ought-to-be-native.md)

### Web as Native Runtime (The Kernel)

Reframe browser: Document viewer → OS kernel with primitives for tasteful UIs.

- Static-first islands, vanilla CSS/HTML (popover/dialog/queries/transitions), progressive enhancement.
- Pros: WCAG accessibility baseline, no-JS resilience. [mozilla](https://www.mozilla.org/en-US/about/manifesto/)
- Cons: Vendor quirks (WebKit monopoly). [ionic](https://ionic.io/blog/limitations-with-ios-and-android-web-views)
  Example: Note app's <details> + view-transitions for fluid identity expression. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/46753802/eb451ddb-ea66-42bf-a544-9734eeaae5f5/about-personal-software.md)

### Local-First: Data as Identity Extension

Tasteful software owns data locally—primary copy, offline-first (Ink & Switch). [vinova](https://vinova.sg/navigating-safari-ios-pwa-limitations/)

- Stack: IndexedDB/CRDTs (Kleppmann), Service Workers.
- Pros: Low-latency privacy; no central lock-in.
- Cons: Mobile quotas, sync faults (Byzantine). [martin.kleppmann](https://martin.kleppmann.com/papers/bft-crdt-papoc22.pdf)
  Example: Prototype notes persist/edit offline; taste via custom themes. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/46753802/eb451ddb-ea66-42bf-a544-9734eeaae5f5/about-personal-software.md)

### Federated: Interop for Expressive Ecosystems

Scale demands federation—connect tasteful nodes without dilution (ActivityPub/Matrix/WebRTC). [mozilla](https://www.mozilla.org/en-US/about/manifesto/)

- Universal client (browser); Solid pods for ownership (Berners-Lee). [martin.kleppmann](https://martin.kleppmann.com/papers/bft-crdt-papoc22.pdf)
- Pros: Sovereignty, P2P highways.
- Cons: Moderation/NAT hurdles.
  Example: Notes sync across peers; express user workflows. [w3](https://www.w3.org/TR/activitypub/)

### The Web-Native Stack: Craft Your Workshop

Layered blueprint for tasteful unification (monorepo + web-first).

| Layer     | Tech              | Enables Taste                                                                          | Limits                                                                                                    |
| --------- | ----------------- | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Runtime   | Browser/PWA/Tauri | Unified UI [docs.powersync](https://docs.powersync.com/resources/local-first-software) | iOS sensors [magicbell](https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide) |
| Local     | IndexedDB/CRDTs   | Ownership                                                                              | Eviction [vinova](https://vinova.sg/navigating-safari-ios-pwa-limitations/)                               |
| Transport | WebRTC/HTTP       | P2P low-latency                                                                        | Battery                                                                                                   |
| Network   | ActivityPub       | Federation                                                                             | Abuse [socialhub.activitypub](https://socialhub.activitypub.rocks/c/standards/68)                         |

Accessibility/expressiveness: Standards + personalization (EAA-compliant). [w3](https://www.w3.org/TR/activitypub/)

### Vision: Tastemakers in the Decentralized OS

- Workspace: Unified monorepo/agentic flows (KMP/Wasm core).
- Platforms: One codebase rules all—web canonical, native optional.
- Humans win: AI grunt → taste refinement; exposure via prototypes. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/46753802/eb451ddb-ea66-42bf-a544-9734eeaae5f5/about-personal-software.md)

### Conclusion: Crafting Enduring Identity

This web-native stack realizes personal software: resilient, expressive extensions of mind.
By guarding taste amid abundance, we build distinct value—not commodity.
CTA: Prototype one layer (e.g., CRDT notes); join the OS.
Yours truly,
Jairus

**Footnotes**

This ~2000-word structure: narrative-driven, scannable (tables/footers), balanced—spiritual sequel perfected. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/46753802/1c46faad-e6f9-427d-99cd-1280b0101cd5/the-future-of-the-web-ought-to-be-native.md)
