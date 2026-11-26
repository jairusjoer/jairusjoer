import { Schema } from 'effect';

export const Implementation = Schema.Struct({
  status: Schema.Literals(['done', 'blocked']),
  summary: Schema.String.annotate({ description: 'What was changed and how it was verified' }),
  question: Schema.optionalKey(
    Schema.String.annotate({ description: 'Only when blocked: what the human must clarify' }),
  ),
});
export type Implementation = typeof Implementation.Type;

export const Review = Schema.Struct({
  approved: Schema.Boolean,
  findings: Schema.String.annotate({ description: 'Markdown list of blocking issues; empty when approved' }),
  verification: Schema.String.annotate({
    description: 'Exact commands you ran yourself (tests, type check, lint, build) and their results',
  }),
});
export type Review = typeof Review.Type;
