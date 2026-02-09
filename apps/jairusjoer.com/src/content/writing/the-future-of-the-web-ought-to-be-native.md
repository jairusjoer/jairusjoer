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

## Notes

- Avoid this post becoming primarily about personal software.
- Introduction might not be aligned with outlined content, consider reworking.
- Return to native capabilities, Vanilla CSS and static first with islands of interactivity.
- Cut Tauri a bit back in this article. It serves more of a catalyst into my exploration of native capabilities, rathher than the solution itself.
- Web first, desktop application second. The web is the platform, the desktop application is an optional "upgrade" for users who prefer it.
- Get a bit into Local- and offline-first, P2P, WebRTC, open source protocols, and the Fediverse as the "network layer" of this web-native future, eliminating a centralized backend and single point of failure.

## Rough Outline

### Contention

- **The Fragmentation Trap**: Analyzing the current state of "cross-platform" development. The limitations of native WebViews (versioning, vendor differences) versus the consistency of shipping a runtime.
- **The "Native Fallacy"**: Challenging the necessity of platform-specific code. Why "native" performance is often a premature optimization compared to "universal" accessibility.
- **Tauri as Enabler**: How tools like Tauri bridge the gap of user prefered installs without the bloat, serving as a transitional step towards a truly web-native future.
- **Secondary Installation**: Positioning "installation" not as a requirement for usage, but as an optional "upgrade" for the user, flipping the native app store model.

### Web-First vs. Native

- **Distribution Models**: App Stores (Gatekeepers) vs URLs (Open Access).
- **Interoperability**: Platform-specific APIs vs Cross-provider Standard Protocols.
- **Resilience**: Single Point of Failure (Native/SaaS) vs Distributed Mesh (Federated Web).
- **Updates**: Approval queues vs Instant deployment.

### The Web As An Operating System

- **Browser as Runtime**: Re-framing the browser not as an app viewer, but as the kernel of a decentralised OS.
- **Standardized Capabilities**: Leveraging PWA APIs (Service Workers, IndexedDB, Web Bluetooth/USB) as system calls.
- **The "One Codebase" Reality**: Moving beyond "write once, run anywhere" to "run everywhere, install optionally".

### Decentralisation Through Federation

- **The Missing Link**: Identifying the network layer as the crucial missing piece of the "Web OS" metaphor.
- **Federation Protocols**: Introduction to ActivityPub, Matrix, and SMTP as the "inter-process communication" of this OS.
- **The Universal Client**: The browser's role as a client that connects to _any_ compliant server, effectively decoupling the "App" (interface) from the "Service" (backend).
- **Resilience & Sovereignty**: How this architecture fundamentally prevents vendor lock-in and creates a robust, distributed network of independent nodes.

### The Technology Stack

- **Layer 1: Runtime**: The Browser / PWA Shell (Execution environment).
- **Layer 2: Transport**: HTTP/2, WebSockets, WebTransport (Data highways).
- **Layer 3: Network**: Federation Protocols (ActivityPub, Matrix) (Service logic).
- **Accessibility**: How standardization naturally enforces better accessibility (WCAG) compared to fragmented native implementations.

### Future & Roadmap

- **Practical Implementation**: Steps to build a Federated PWA (Shell -> Federation Client -> Self-hosted Backend).
- **The Ecosystem Shift**: Moving from "Platform Clients" to "Ecosystem Citizens".
- **Standardization Horizon**: W3C's role in formalizing the Fediverse and browser primitives.
