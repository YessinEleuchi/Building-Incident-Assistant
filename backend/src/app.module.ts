import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

import { PrismaModule } from './database/prisma.module.js';
import { DecisionModule } from './decision/decision.module.js';
import { RoutingModule } from './routing/routing.module.js';
import { ChatModule } from './chat/chat.module.js';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
    }),

    PrismaModule,
    DecisionModule,
    RoutingModule,
    ChatModule,
  ],

  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}