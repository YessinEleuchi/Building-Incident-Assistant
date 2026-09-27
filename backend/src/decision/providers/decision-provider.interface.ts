import type {
  ChoiceDecisionInput,
  ChoiceDecisionResult,
  DecisionProviderName,
} from '../decision.types.js';

export interface DecisionProvider {
  readonly name: DecisionProviderName;

  choose<T extends string>(
    input: ChoiceDecisionInput<T>,
  ): Promise<ChoiceDecisionResult<T>>;
}