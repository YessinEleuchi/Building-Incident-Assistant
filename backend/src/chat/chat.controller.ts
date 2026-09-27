import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';

import {
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ChatService } from './chat.service.js';
import { SendMessageDto } from './dto/send-message.dto.js';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
  ) {}

  @Post('messages')
  @ApiOperation({
    summary:
      'Send a message to the multi-agent system',
  })
  sendMessage(
    @Body() dto: SendMessageDto,
  ) {
    return this.chatService.sendMessage(dto);
  }
}