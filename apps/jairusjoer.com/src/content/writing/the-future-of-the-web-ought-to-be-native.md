---
title: The Future Of The Web Ought To Be Native
date: 2026-01-30
status: 'Draft'
---

At the end of 2025, I started writing _[About Personal Software](/writing/about-personal-software)_, exploring the concept of personal software, how human taste and identity dictate quality in an AI-driven landscape, and a personal vision for the future of software development.
That post laid the philosophical groundwork; this one extends it technically.

Since then, I rediscovered [Tauri](https://v2.tauri.app/) and created cross-platform application prototypes with a single web-first codebase, which is primarily distributed through the web and optionally through native shells. This process clarified the areas where the web’s primitives suffice and those where they require augmentation.

Throughout January, I conducted research, created prototypes and refined this personal vision to reflect my advocacy: **_the future of the web ought to be native_**. The browser, extended through local-first data and federated protocols, acts as a decentralised operating system for personal software.

---

## The Web As A Decentralised Operating System

The web already supplies the primitives a decentralised operating system might require to support personal, resilient, and federated software applications, with rich APIs such as [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) for offline resilience, [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) for local data ownership, and peer-to-peer communication via [WebRTC](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API).

What makes the web uniquely suited for software is that HTML and CSS — the most ubiquitous interface languages in existence — are also the building blocks of tasteful interfaces. Their growing expressiveness allows creators to articulate identity through progressive enhancement rather than framework abstraction.

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
| Logic     | WebAssembly       | Cross-language shared business logic (Rust/Go/C++ → browser + native)                  | Debugging tooling maturity; no direct DOM access                                                          |
| Local     | IndexedDB/CRDTs   | Ownership                                                                              | Eviction [vinova](https://vinova.sg/navigating-safari-ios-pwa-limitations/)                               |
| Transport | WebRTC/HTTP       | P2P low-latency                                                                        | Battery                                                                                                   |
| Network   | ActivityPub       | Federation                                                                             | Abuse [socialhub.activitypub](https://socialhub.activitypub.rocks/c/standards/68)                         |

Note on Wasm: [WebAssembly](https://webassembly.org/) enables a write-once logic core — validation, encryption, CRDT merge functions, and other performance-critical business logic compiled from Rust, Go, or C++ — that runs identically in the browser and inside a Tauri native shell. This eliminates the need to reimplement shared rules per platform and keeps the taste-carrying UI layer (HTML/CSS/JS) cleanly separated from deterministic computation. Tauri's Rust backend and Wasm modules can even share crates, collapsing the web ↔ native logic gap entirely.

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
