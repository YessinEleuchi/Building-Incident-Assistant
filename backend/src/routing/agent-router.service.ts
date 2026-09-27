import { Injectable } from '@nestjs/common';

import {
  DecisionService,
} from '../decision/decision.service.js';

import {
  AgentRoute,
} from './routing.types.js';

@Injectable()
export class AgentRouterService {
  constructor(
    private readonly decisionService:
      DecisionService,
  ) {}

  async route(message: string) {
    return this.decisionService.choose({
      state: {
        userMessage: message,
      },

      questionId: 'agent',

      instructions:
        'Select the specialized building management agent that should handle the user request.',

      criteria: {
        [AgentRoute.MAINTENANCE]:
          'Building maintenance issues including plumbing, water leaks, elevators, windows, furniture, equipment, structural problems, or general maintenance.',

        [AgentRoute.ELECTRICAL]:
          'Electrical issues including lights, power outages, sockets, breakers, wiring, or electrical equipment.',

        [AgentRoute.ACCESS]:
          'Physical access issues including badges, access cards, locked entrances, doors, entry permissions, or building access.',

        [AgentRoute.GENERAL]:
          'General questions, unclear requests, greetings, or requests that cannot confidently be assigned to another specialized agent.',
      },
    });
  }
}