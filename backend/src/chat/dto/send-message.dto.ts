import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class SendMessageDto {
  @ApiProperty({
    example:
      'There is water leaking from my bathroom ceiling.',
  })
  @IsString()
  @MinLength(2)
  message: string;

  @ApiPropertyOptional({
    example:
      '059ecae1-fcb6-45dd-aef9-f82d78abfb0e',
  })
  @IsOptional()
  @IsUUID()
  conversationId?: string;
}