/**
 * Single configuration source for the orchestrator.
 *
 * Provider-agnostic by design (see research/webhook-coding-agent/03-04):
 * provider names appear only here — in adapter entries — never in core code.
 * Each entry selects an adapter module and its parameters.
 */

export type Mode = 'human_in_the_loop' | 'fully_autonomous';

export type TicketLane = 'fully_autonomous' | 'human_in_the_loop' | 'awaiting_approval';

export interface JjjuniorConfig {
  /** Default execution mode for tickets picked up. */
  mode: Mode;
  caps: {
    attempts: number;
    noProgress: boolean;
    roundTimeoutMin: number;
  };
  agent: {
    runtime: 'server' | 'cli' | 'embedded-sdk';
    serverUrl: string;
    agent: string;
    model?: string;
    permissions: string;
  };
  adapters: {
    ticketing: {
      /** Adapter key; selects an adapter module (never a core import). */
      provider: string;
      secretEnv: string;
      /** Board lanes per mode; resolved to provider state/label IDs at startup. */
      lanes: Record<TicketLane, string>;
      /** Allowlist: team/project ids + label the agent acts on. */
      allowlist: { teams: string[]; label: string };
    };
    scm: {
      provider: string;
      secretEnv: string;
      host: string;
      repos: string[];
      ci: { successStatus: string; fetchJobLogs: boolean };
    };
  };
  delivery: {
    webhooks: { port: number; tunnel?: 'cloudflared' | 'ngrok' };
    polling: { intervalSec: number };
  };
  approval: {
    comments: string[];
    uiButton: boolean;
  };
}

export const appConfig: JjjuniorConfig = {
  mode: 'human_in_the_loop',
  caps: { attempts: 3, noProgress: true, roundTimeoutMin: 15 },
  agent: {
    runtime: 'server',
    serverUrl: 'http://localhost:4096',
    agent: 'build',
    permissions: 'pipeline-strict',
  },
  adapters: {
    ticketing: {
      provider: 'linear',
      secretEnv: 'LINEAR_WEBHOOK_SECRET',
      lanes: {
        fully_autonomous: 'lane-id-autonomous',
        human_in_the_loop: 'lane-id-hitl',
        awaiting_approval: 'lane-id-awaiting',
      },
      allowlist: { teams: [], label: 'agent-todo' },
    },
    scm: {
      provider: 'gitlab',
      secretEnv: 'GITLAB_WEBHOOK_TOKEN',
      host: 'https://gitlab.com',
      repos: [],
      ci: { successStatus: 'success', fetchJobLogs: true },
    },
  },
  delivery: {
    webhooks: { port: 8899, tunnel: 'cloudflared' },
    polling: { intervalSec: 60 },
  },
  approval: {
    comments: ['@agent retry'],
    uiButton: true,
  },
};
