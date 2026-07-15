---
title: 'Working with local AI models'
description: 'To Do'
status: 'Draft'
date: 2026-08-01
---

Since May, I had the delight of exploring and working with AI models through local providers, as well as different coding agents; not without thanks to the 36 GB of unified RAM on the MacBook I am working on.

I’d like to share the progress I’ve made since then on my local setup, which partially motivated me also to share my [_Thoughts on Resilience, Sustainability and Sovereignty_](/writing/thoughts-on-resilience-sustainability-and-sovereignty) in a previous blog post.

Bear in mind that the progress I am sharing here is that of an amateur in the field of _artificial intelligence_, particularly in this particular context. With that in mind, let's delve into my progress.

## Provider

I opted for [LM Studio](https://lmstudio.ai/) because I enjoy the ease of use of the graphical user interface. The installation and onboarding processes were straightforward, and the hardware support was automatically configured and ready for use.

I experimented with [Ollama](https://ollama.com/) in a previous attempt, and while I had no issues in terms of user experience or performance, I found the built-in model discovery and configuration features of LM Studio more appealing.

From the onboarding process to running my first model locally, I only needed to click through the model discovery. At the time, I had no knowledge of different quantisation approaches, such as MLX and GGUF.

![View of the model discovery modal of LM Studio](./assets/2026_lm_studio.png)

## Models

After installing and trying out some models via the built-in chat interface with varying success, I sat down and started exploring model sizes, quantisation and hardware support in order to make more informed decisions.

As my endeavour coincided with Google’s release of its newest models, particularly [`google/gemma-4-26b-a4b-qat`](https://lmstudio.ai/models/google/gemma-4-26b-a4b-qat), I was intrigued to try them out, having previously had positive experiences with their Gemini models.

On the other hand, is a model completely unfamiliar to me. Enter Alibaba’s [`qwen/qwen3.6-35b-a3b`](https://lmstudio.ai/models/qwen/qwen3.6-35b-a3b). Similar to Google’s model, it is a [Mixture of Experts](https://www.ibm.com/think/topics/mixture-of-experts) model, but, contrary to that, it did not undergo [quantisation-aware training](https://www.ibm.com/think/topics/quantization-aware-training).

### Qwen 3.6 35B A3B

`qwen/qwen3.6-35b-a3b` has been my primary choice of model since this exploration began in May. It's running on **MLX** with **4bit** quantisation and averages above **85+ tok/sec** ouput, hitting high 90s on a good day.

I’ve mostly been using it for agentic engineering tasks, such as writing and debugging tests, maintaining and carrying out governance tasks, as well as simple to medium-complex, code-related menial work.

I’ve also used this model to adjust load parameters, deciding on a context length of **131,072** and a repeat penalty of **1.1** to solve repetition issues. In addition, I opted for **'thinking'** and **'preserved thinking'**.

### Gemma 4 26B A4B QAT

`google/gemma-4-26b-a4b-qat` is my second choice of model. Using the same quantisation and load parameters, its token outpout performance matches that of `qwen/qwen3.6-35b-a3b`.

I’ve been using it for work similar to that mentioned above, but primarily for research- and documentation-focused tasks. While this is purely subjective, I _felt_ that Gemma responded better to this type of work.

It has also proven useful for projects and workloads that require more RAM, as it is approximately 5 GB smaller than the Qwen model, providing some additional capacity before memory begins to overflow.

## Harnesses

To interact with my chosen models in an agentic manner, I use GitHub Copilot in Visual Studio Code and OpenCode via the terminal to provide me with capable Plan and Build agents.

Both harnesses established themselves in continued use cases against contenders such as Claude Code and Pi

### GitHub Copilot

Even before I switched to local modals, GitHub Copilot was already my primary agentic driver, thanks to its extensive and reliable integration capabilities and its ability to interact with extensions.

GitHub Copilot uses a [custom endpoint](https://code.visualstudio.com/docs/agent-customization/language-models#_add-a-custom-endpoint-model) to connect to LM Studio, with manual entries for each model. Language model extensions are also available for popular providers and handle local model discovery automatically.

The only issue I’ve had with GitHub Copilot so far is that it can't suggest code completions based on local models. I tried using the Continue extension to resolve this, but there were ongoing problems with tool calls.

```json
[
  {
    "name": "LM Studio",
    "vendor": "customendpoint",
    "models": [
      {
        "id": "qwen/qwen3.6-35b-a3b",
        "name": "Qwen 3.6 35B A3B",
        "url": "http://localhost:1234/v1/chat/completions",
        "toolCalling": true,
        "vision": true,
        "maxInputTokens": 65536,
        "maxOutputTokens": 65536
      },
      {
        "id": "google/gemma-4-26b-a4b-qat",
        "name": "Gemma 4 26B A4B QAT",
        "url": "http://localhost:1234/v1/chat/completions",
        "toolCalling": true,
        "vision": true,
        "maxInputTokens": 65536,
        "maxOutputTokens": 65536
      }
    ]
  }
]
```

### OpenCode

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": [],
  "lsp": true,
  "formatter": true,
  "provider": {
    "lmstudio": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "LM Studio",
      "options": {
        "baseURL": "http://localhost:1234/v1"
      },
      "models": {
        "qwen/qwen3.6-35b-a3b": {
          "name": "Qwen 3.6 35B A3B"
        },
        "google/gemma-4-26b-a4b-qat": {
          "name": "Gemma 4 26B A4B QAT"
        }
      }
    }
  },
  "shell": "fish"
}
```
