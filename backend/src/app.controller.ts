import { Controller, Get } from '@nestjs/common';

import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { PrismaService } from './database/prisma.service.js';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Check API status',
  })
  @ApiOkResponse({
    example: {
      status: 'ok',
    },
  })
  getHealth() {
    return {
      status: 'ok',
    };
  }

  @Get('health/database')
  @ApiOperation({
    summary: 'Check PostgreSQL connection',
  })
  async databaseHealth() {
    await this.prisma.$queryRaw`SELECT 1`;

    return {
      status: 'ok',
      database: 'connected',
    };
  }
}