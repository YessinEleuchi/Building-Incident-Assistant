import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

import { firstValueFrom } from 'rxjs';

import type {
  ChoiceDecisionInput,
  ChoiceDecisionResult,
} from '../decision.types.js';

import type {
  DecisionProvider,
} from './decision-provider.interface.js';

interface OpenRouterChoiceAnswer {
  type: 'choice';

  choice: string;

  probabilities: Record<string, number>;

  confidence: number;
}

interface OpenRouterDecisionResponse {
  id: string;

  model: string;

  provider?: string;

  answers: Record<
    string,
    OpenRouterChoiceAnswer
  >;

  usage?: {
    input_tokens?: number;
    output_tokens?: number;
    cost?: number;
  };
}

@Injectable()
export class OpenRouterJevProvider
  implements DecisionProvider
{
  readonly name = 'jev-openrouter' as const;

  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly model: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey =
      this.configService.getOrThrow<string>(
        'OPENROUTER_API_KEY',
      );

    this.baseUrl =
      this.configService.get<string>(
        'OPENROUTER_BASE_URL',
      ) ?? 'https://openrouter.ai/api';

    this.model =
      this.configService.get<string>(
        'JEV_MODEL',
      ) ?? 'typesafe/jev-1.13';
  }

  async choose<T extends string>(
    input: ChoiceDecisionInput<T>,
  ): Promise<ChoiceDecisionResult<T>> {
    const questionId =
      input.questionId ?? 'decision';

    const startedAt = performance.now();

    try {
      const response = await firstValueFrom(
        this.httpService.post<OpenRouterDecisionResponse>(
          `${this.baseUrl}/alpha/decisions`,
          {
            model: this.model,

            state: input.state,

            questions: {
              [questionId]: {
                type: 'choice',

                instructions:
                  input.instructions,

                criteria:
                  input.criteria,
              },
            },
          },
          {
            headers: {
              Authorization:
                `Bearer ${this.apiKey}`,

              'Content-Type':
                'application/json',
            },
          },
        ),
      );

      const latencyMs =
        Math.round(
          performance.now() - startedAt,
        );

      const answer =
        response.data.answers[questionId];

      if (!answer) {
        throw new Error(
          `Missing Jev answer for ${questionId}`,
        );
      }

      if (
        !Object.prototype.hasOwnProperty.call(
          input.criteria,
          answer.choice,
        )
      ) {
        throw new Error(
          `Jev returned an invalid choice: ${answer.choice}`,
        );
      }

      return {
        choice: answer.choice as T,

        confidence:
          answer.confidence,

        probabilities:
          answer.probabilities as Record<
            T,
            number
          >,

        provider: this.name,

        model: response.data.model,

        requestId:
          response.data.id,

        latencyMs,

        usage: response.data.usage
          ? {
              inputTokens:
                response.data.usage.input_tokens,

              outputTokens:
                response.data.usage.output_tokens,

              cost:
                response.data.usage.cost,
            }
          : undefined,
      };
    } catch (error) {
      console.error(
        'OpenRouter Jev decision failed:',
        error,
      );

      throw new InternalServerErrorException(
        'Decision provider failed',
      );
    }
  }
}