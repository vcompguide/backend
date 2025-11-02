import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetSampleTextDto {
  @ApiProperty({
    description: 'Name to include in the sample text',
    example: 'NestJS',
  })
  @IsString()
  name: string;
}
