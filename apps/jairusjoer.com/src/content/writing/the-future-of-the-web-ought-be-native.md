---
title: The Future Of The Web Ought Be Native
date: 2026-01-30
status: 'Draft'
---

## Discovery

In the summer of 2025, wrote an article on why _[The Future Of The Web Might Be Native](/archive/aggregata/the-future-of-the-web-might-be-native)_, and shared my thoughts on existing and emerging native capabilities for user interfaces in web browsers, and how these capabilities provide a sane and accessible solution for complex features by default.

My advocacy for the web as a decentralised operating system continues through my most recent endeavours, and has recently been reinforced through a side project in which I explore the elusive scenario of **_one codebase to rule them all_** through cross-platform applications.

Although I was already familiar with [Electron](https://www.electronjs.org/) and the native WebView capabilities of operating systems independently of each other, I had yet to discover how to leverage the latter through a cross-platform interface like the former without shipping a self-contained browser runtime.

I was also aware of successful cross-platform projects like [BlueSky](https://github.com/bluesky-social/social-app), which uses [React Native](https://reactnative.dev/) paired with [Expo](https://expo.dev/) to create native applications. I explored this project over the weekend. While the project is impressive, it did not satisfy my search for a web-first approach to applications.

Enter [Tauri](https://tauri.app/), which I had to rediscover for myself after encountering it in beta prior to its release in 2022. It offered the combination of features and techniques that I considered to be a sane approach to developing web-first, cross-platform applications.

What Tauri differentiates from contemporaries like Electron is its leverage of the aforementioned native WebView capabilities of an operating system. This eliminates the need to include a browser runtime in the application bundle, yet still allows for a web-first development approach.

~~On a cozy weekend afternoon I cobbled together an exemplary project in a [Turbo](https://turborepo.com/) monorepo that uses [Vite](https://vite.dev/) and [Vue](https://vuejs.org/) for the web application and Tauri for the cross-platform integration of said application – with great success.~~

## Contention

- **The Fragmentation Trap**: Analyzing the current state of "cross-platform" development. The limitations of native WebViews (versioning, vendor differences) versus the consistency of shipping a runtime (Electron/Tauri).
- **The "Native" Fallacy**: Challenging the necessity of platform-specific code. Why "native" performance is often a premature optimization compared to "universal" accessibility.
- **Tauri as Enabler**: How tools like Tauri bridge the gap without the bloat, serving as a transitional step towards a truly web-native future.
- **Secondary Installation**: Positioning "installation" not as a requirement for usage, but as an optional "upgrade" for the user, flipping the native app store model.

## Web-First vs. Native

- **Distribution Models**: App Stores (Gatekeepers) vs URLs (Open Access).
- **Interoperability**: Platform-specific APIs vs Cross-provider Standard Protocols.
- **Resilience**: Single Point of Failure (Native/SaaS) vs Distributed Mesh (Federated Web).
- **Updates**: Approval queues vs Instant deployment.

## The Web As An Operating System

- **Browser as Runtime**: Re-framing the browser not as an app viewer, but as the kernel of a decentralised OS.
- **Standardized Capabilities**: Leveraging PWA APIs (Service Workers, IndexedDB, Web Bluetooth/USB) as system calls.
- **The "One Codebase" Reality**: Moving beyond "write once, run anywhere" to "run everywhere, install optionally".

## Decentralisation Through Federation

- **The Missing Link**: Identifying the network layer as the crucial missing piece of the "Web OS" metaphor.
- **Federation Protocols**: Introduction to ActivityPub, Matrix, and SMTP as the "inter-process communication" of this OS.
- **The Universal Client**: The browser's role as a client that connects to _any_ compliant server, effectively decoupling the "App" (interface) from the "Service" (backend).
- **Resilience & Sovereignty**: How this architecture fundamentally prevents vendor lock-in and creates a robust, distributed network of independent nodes.

## The Technology Stack

- **Layer 1: Runtime**: The Browser / PWA Shell (Execution environment).
- **Layer 2: Transport**: HTTP/2, WebSockets, WebTransport (Data highways).
- **Layer 3: Network**: Federation Protocols (ActivityPub, Matrix) (Service logic).
- **Accessibility**: How standardization naturally enforces better accessibility (WCAG) compared to fragmented native implementations.

## Future & Roadmap

- **Practical Implementation**: Steps to build a Federated PWA (Shell -> Federation Client -> Self-hosted Backend).
- **The Ecosystem Shift**: Moving from "Platform Clients" to "Ecosystem Citizens".
- **Standardization Horizon**: W3C's role in formalizing the Fediverse and browser primitives.
