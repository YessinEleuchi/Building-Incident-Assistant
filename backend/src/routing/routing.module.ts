import { Module } from '@nestjs/common';

import {
  DecisionModule,
} from '../decision/decision.module.js';

import {
  AgentRouterService,
} from './agent-router.service.js';
import { RoutingController } from './routing.controller.js';

@Module({
  imports: [
    DecisionModule,
  ],

  providers: [
    AgentRouterService,
  ],

  exports: [
    AgentRouterService,
  ],

  controllers: [RoutingController],
})
export class RoutingModule {}