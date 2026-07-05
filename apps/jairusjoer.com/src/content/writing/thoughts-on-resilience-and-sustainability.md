---
title: 'Thoughts on Resilience, Sustainability and Sovereignty'
description: 'The uncertainty of digital supply chains and AI economics points to an upheaval in resilience and sustainability, requiring new and sovereign approaches.'
status: 'Draft'
date: 2026-07-01
---

As the strategic competition over AI continues, the future of software is increasingly being built on borrowed land through centralised providers and centralised dependencies, which can both be controlled or poisoned.

Just this June, the US government issued an export control directive suspending foreign nationals' access to Anthropic's Fable 5 and Mythos 5, while OpenAI voluntarily limited access to GPT-5.6 on a case-by-case basis.

In the same month, the software supply chain ecosystems around Python and JavaScript faced a series of at least four currently known critical attacks, driven by the Mini Shai-Hulud[^mini] worm and its variants.

[^mini]: Mini Shai-Hulud is a self-replicating worm that hijacks automated software build systems to steal credentials and automatically infect other packages.

## Resilience

In light of the aforementioned issues, it has become imperative to reconsider the resilience of software, trust and economics, and to explore options and alternatives that could foster a more resilient environment.

Although platforms such as PyPI and npm are moving towards enforcing <abbr title="Two Factor Authentication">2FA</abbr> and trusted publishing via <abbr title="OpenID Connect">OIDC</abbr>, the centralised nature of these platforms will continue to make them a potent target for malicious actors.

Similarly, as token prices fall and the amount spent on tokens rises, the ability of foreign allies and customers to access capable models becomes uncertain in light of growing security and advantage interests.

## Sustainability

Reliance on centralized software distribution in the areas of resilience and security may become increasingly difficult to sustain without governance processes that help preserve integrity in these areas over time.

There may be a need for a shift toward open, verifiable, and sovereignty-aware providers built on cryptographic trust, both for software packages and for models, to help address current issues and improve secure access to software in the future.

This may not be a question of missing software, but of incentives. Recent and future precedents may continue to reinforce this view and encourage a more independent approach to software.

## Sovereignty

---

## Outline

What package managers do to today to mitigate (example pnpm)

- Minimum Release Age
- Block Exotic Subdependencies
- Strict Build Script Control
- Trust Policy: The trustPolicy
- Version Pinning & Lockfile Security
- Environment Isolation

### The Third Pillar: Sovereign Infrastructure (The Local-First Ecosystem)

**The Core Premise:**
Right now, developers are building the future of software on borrowed land. We trust centralized package registries to not be poisoned, and we trust centralized AI providers to not spike API pricing, alter their models, or use our data for training.

- **Source Concept:** _Local-First Software: You own your data, in spite of the cloud_ (Ink & Switch, 2019)¹. Your article can take their foundational definition of local-first—that the primary copy of data should live on the user's device—and expand it. If users must own their data, developers must own their dependencies and intelligence engines.
- **Source Concept:** _Commons-Governed Artificial Intelligence_ (Sastry et al., arXiv, June 2026)². This paper argues the AI stack is a "layered commons" (compute, data, models). It perfectly highlights how relying on a few massive API providers enclosures the "commons" of software development.

---

### 1. Resilience (The Supply Chain)

**The Argument:** The centralized architecture of default public registries (like npm or PyPI) creates a single point of failure. Resilience requires a shift toward verifiable, sovereign registries and cryptographic trust—much like how federated protocols protect against single-server outages.

**Supporting Sources & Events:**

- **The May 2026 "Mini Shai-Hulud" Campaign:** In May 2026, an automated burst attack published over 300 malicious package versions to npm and PyPI (affecting major projects like Mistral AI, TanStack, and UiPath) in just 22 minutes via compromised maintainer accounts³.
- _How to use it:_ This proves that centralization causes massive blast radiuses. A single compromised account in a central registry infected packages generating ~16 million weekly downloads.

- **The XZ Utils Backdoor (CVE-2024-3094):** Discovered in 2024, a threat actor spent three years socially engineering a burned-out open-source maintainer to insert an SSH backdoor into a widely used compression library.
- _How to use it:_ Use this to highlight the "Tragedy of the Commons." Open-source infrastructure depends on unpaid labor; when maintainers burn out, supply chain attacks become easy. True resilience requires shifting from blind trust in humans to cryptographic, decentralized provenance (e.g., Sigstore, in-toto attestations)⁴.
- _Nuance:_ Snyk recently noted that attackers are now forging Sigstore provenance by compromising the build pipelines themselves³. You can argue this proves that _process_ alone isn't enough; we need architectural sovereignty (local, reproducible builds).

---

### 2. Sustainability (The AI Trust Model & Pricing)

**The Argument:** Relying entirely on closed-source APIs from mega-vendors for AI integration strips software of its "taste" and places the developer at the mercy of arbitrary pricing models and platform lock-in. Sustainable AI requires local, open-weights models running directly on the user's hardware.

**Supporting Sources & Events:**

- **The Cost and Platform Risk of Closed APIs:** If an independent developer's core workflow hangs on a single closed API, they carry massive platform risk. A recent analysis on _AI Sovereignty_ noted that shifting to local models reduces data egress costs, avoids API vendor lock-in, and provides a clear audit trail for data compliance⁵.
- **The Rise of High-Performance Open Weights (e.g., Qwen3.5, Llama 3):** By mid-2026, open-weights models like Alibaba's Qwen3.5-Coder are legitimately competing with closed models like Claude 3.5 on complex software engineering tasks, while being fundamentally cheaper to run locally or on-premise⁶.
- _How to use it:_ This supports your thesis from _About Personal Software_. You can argue that local, open-weights AI allows developers to tailor the model's "taste" and behavior without paying a rent-seeking API provider for every inference. It makes the economics of building AI-enhanced personal software actually viable for solo developers.

---

### The Synthesis: Federated Trust

To wrap up, you can tie the technical solutions back to the web-native thesis from your recent writing:

Just as WebAssembly and Local-First architecture (like CRDTs) are freeing web apps from reliance on cloud servers, the development ecosystem must adopt **Federated Trust**.

- **For code:** We must stop blindly pulling from `npm install` and move toward sovereign proxies and strictly verified local builds.
- **For AI:** We must stop hardcoding OpenAI API keys into our apps and start shipping software with embedded, local-first intelligence (via WebLLM or native desktop shells like Tauri).

By achieving sovereignty over our supply chain and our AI, we achieve both **Resilience** against attack and **Sustainability** for the future.

---

**References for your footnotes:**

1. Ink & Switch (2019). _Local-first software: You own your data, in spite of the cloud._
2. Sastry et al. (June 2026). _Commons-Governed Artificial Intelligence: A Taxonomy of Collective Governance._ (arXiv:2606.15466)
3. Snyk / NHS England Digital Cyber Alerts (May 2026). _Supply Chain Attack Affecting Numerous npm and PyPI Packages (Mini Shai-Hulud)._
4. SoftwareSeni / Security Reports (2024). _The XZ Utils Backdoor CVE-2024-3094 and the Multi-Year Social Engineering Campaign Behind It._
5. Joshua Thompson (2026). _Why It Matters for AI Sovereignty: Control, Compliance, and Cost._
6. Quasa AI / Alibaba Tongyi Lab (2026). _Qwen3.5 & Qwen3-Coder Open-Source Model Performance Reports._
