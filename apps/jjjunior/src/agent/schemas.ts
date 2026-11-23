export type Implementation = { status: 'done' | 'blocked'; summary: string; question?: string };
export type Review = { approved: boolean; findings: string; verification: string };

export const implementationSchema = {
  type: 'object',
  properties: {
    status: { type: 'string', enum: ['done', 'blocked'] },
    summary: { type: 'string', description: 'What was changed and how it was verified' },
    question: { type: 'string', description: 'Only when blocked: what the human must clarify' },
  },
  required: ['status', 'summary'],
};

export const reviewSchema = {
  type: 'object',
  properties: {
    approved: { type: 'boolean' },
    findings: { type: 'string', description: 'Markdown list of blocking issues; empty when approved' },
    verification: {
      type: 'string',
      description: 'Exact commands you ran yourself (tests, type check, lint, build) and their results',
    },
  },
  required: ['approved', 'findings', 'verification'],
};
