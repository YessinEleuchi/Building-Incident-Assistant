import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import {
  DecisionService,
} from './decision.service.js';

import {
  OpenRouterJevProvider,
} from './providers/openrouter-jev.provider.js';

@Module({
  imports: [
    HttpModule.register({
      timeout: 10_000,
    }),
  ],

  providers: [
    OpenRouterJevProvider,
    DecisionService,
  ],

  exports: [
    DecisionService,
  ],
})
export class DecisionModule {}