import { Module } from '@nestjs/common';

import { RoutingModule } from '../routing/routing.module.js';

import { ChatController } from './chat.controller.js';
import { ChatService } from './chat.service.js';

@Module({
  imports: [
    RoutingModule,
  ],

  controllers: [
    ChatController,
  ],

  providers: [
    ChatService,
  ],
})
export class ChatModule {}