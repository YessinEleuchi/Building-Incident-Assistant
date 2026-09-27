import { Injectable } from '@nestjs/common';

import {
  OpenRouterJevProvider,
} from './providers/openrouter-jev.provider.js';

import type {
  ChoiceDecisionInput,
  ChoiceDecisionResult,
} from './decision.types.js';

@Injectable()
export class DecisionService {
  constructor(
    private readonly jevProvider:
      OpenRouterJevProvider,
  ) {}

  choose<T extends string>(
    input: ChoiceDecisionInput<T>,
  ): Promise<ChoiceDecisionResult<T>> {
    return this.jevProvider.choose(input);
  }
}