import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';

import {
  ApiBody,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import {
  AgentRouterService,
} from './agent-router.service.js';

@ApiTags('routing')
@Controller('routing')
export class RoutingController {
  constructor(
    private readonly agentRouter:
      AgentRouterService,
  ) {}

  @Post('agent')
  @ApiOperation({
    summary:
      'Select an agent using the decision engine',
  })
  @ApiBody({
    schema: {
      properties: {
        message: {
          type: 'string',

          example:
            'There is water leaking from my bathroom ceiling.',
        },
      },

      required: ['message'],
    },
  })
  routeAgent(
    @Body('message') message: string,
  ) {
    return this.agentRouter.route(
      message,
    );
  }
}