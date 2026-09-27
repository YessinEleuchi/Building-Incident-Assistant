import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  DecisionType,
  MessageRole,
  Prisma,
} from '../generated/prisma/client.js';

import { PrismaService } from '../database/prisma.service.js';

import {
  AgentRouterService,
} from '../routing/agent-router.service.js';

import {
  SendMessageDto,
} from './dto/send-message.dto.js';

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,

    private readonly agentRouter:
      AgentRouterService,
  ) {}

  async sendMessage(
    dto: SendMessageDto,
  ) {
    const conversation =
      await this.resolveConversation(
        dto.conversationId,
      );

    const message =
      await this.prisma.message.create({
        data: {
          conversationId:
            conversation.id,

          role: MessageRole.USER,

          content: dto.message,
        },
      });

    const routing =
  await this.agentRouter.route(
    dto.message,
  );

const metadata: Prisma.InputJsonObject = {
  provider:
    routing.provider,

  model:
    routing.model,

  requestId:
    routing.requestId ?? null,

  latencyMs:
    routing.latencyMs,

  probabilities: {
    ...routing.probabilities,
  },

  usage: routing.usage
    ? {
        inputTokens:
          routing.usage.inputTokens ?? null,

        outputTokens:
          routing.usage.outputTokens ?? null,

        cost:
          routing.usage.cost ?? null,
      }
    : null,
};

const decision =
  await this.prisma.decision.create({
    data: {
      conversationId:
        conversation.id,

      sourceMessageId:
        message.id,

      type:
        DecisionType.AGENT_ROUTING,

      selectedAgent:
        routing.choice,

      confidence:
        routing.confidence,

      options: Object.keys(
        routing.probabilities,
      ),

      metadata,
    },
  });
    return {
      conversationId:
        conversation.id,

      message: {
        id: message.id,
        role: message.role,
        content: message.content,
      },

      decision: {
        id: decision.id,

        agent:
          routing.choice,

        confidence:
          routing.confidence,

        probabilities:
          routing.probabilities,

        provider:
          routing.provider,

        model:
          routing.model,

        latencyMs:
          routing.latencyMs,

        usage:
          routing.usage,
      },
    };
  }

  private async resolveConversation(
    conversationId?: string,
  ) {
    if (!conversationId) {
      return this.prisma.conversation.create({
        data: {},
      });
    }

    const conversation =
      await this.prisma.conversation.findUnique({
        where: {
          id: conversationId,
        },
      });

    if (!conversation) {
      throw new NotFoundException(
        'Conversation not found',
      );
    }

    return conversation;
  }
}