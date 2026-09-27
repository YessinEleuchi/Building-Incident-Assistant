export type DecisionProviderName =
  | 'jev-openrouter'
  | 'gpt-oss';

export interface ChoiceDecisionInput<T extends string> {
  state: unknown;

  instructions: string;

  criteria: Record<T, string>;

  questionId?: string;
}

export interface DecisionUsage {
  inputTokens?: number;
  outputTokens?: number;
  cost?: number;
}

export interface ChoiceDecisionResult<T extends string> {
  choice: T;

  confidence: number;

  probabilities: Record<T, number>;

  provider: DecisionProviderName;

  model: string;

  requestId?: string;

  latencyMs: number;

  usage?: DecisionUsage;
}